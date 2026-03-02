import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { api } from "../../api/client";

/* ─────────────────────── Types ─────────────────────── */

interface TableInfo {
  name: string;
  row_count: number;
  column_count: number;
}

interface ColumnInfo {
  name: string;
  type: string;
  type_name: string;
  nullable: boolean;
  default: string | null;
  auto_increment: boolean;
}

interface ForeignKeyInfo {
  name: string;
  columns: string[];
  foreign_table: string;
  foreign_columns: string[];
}

interface SchemaData {
  table: string;
  columns: ColumnInfo[];
  indexes: {
    name: string;
    columns: string[];
    type: string;
    unique: boolean;
    primary: boolean;
  }[];
  foreign_keys: ForeignKeyInfo[];
  primary_key: string[] | null;
  row_count: number;
}

interface Relationship {
  from_table: string;
  from_columns: string[];
  to_table: string;
  to_columns: string[];
  name: string | null;
}

interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SchemaVisualizerProps {
  onSelectTable: (tableName: string) => void;
}

/* ─────────────────────── Constants ─────────────────────── */

const NODE_W = 240;
const HEADER_H = 42;
const COL_H = 26;
const MAX_COLS = 8;
const MORE_H = 28;
const BOTTOM_PAD = 4;
const GAP_X = 140;
const GAP_Y = 50;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2.5;

const TABLE_COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#F97316", "#6366F1", "#14B8A6",
  "#D946EF", "#0EA5E9",
];

/* ─────────────────────── Utilities ─────────────────────── */

function hashColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  return TABLE_COLORS[Math.abs(h) % TABLE_COLORS.length];
}

function nodeHeight(colCount: number): number {
  const visible = Math.min(colCount, MAX_COLS);
  const more = colCount > MAX_COLS ? MORE_H : 0;
  return HEADER_H + visible * COL_H + more + BOTTOM_PAD;
}

/* ─── Layout: layered graph with cycle handling ─── */

function computeLayout(
  tables: TableInfo[],
  relationships: Relationship[],
  schemas: Map<string, SchemaData>
): Map<string, NodePosition> {
  const tableSet = new Set(tables.map((t) => t.name));

  // parentOf[A] = tables that A references via FK (A has a FK pointing to them)
  // childOf[B] = tables that reference B via FK (they have FKs pointing to B)
  const parentOf = new Map<string, Set<string>>();
  const childOf = new Map<string, Set<string>>();

  tables.forEach((t) => {
    parentOf.set(t.name, new Set());
    childOf.set(t.name, new Set());
  });

  relationships.forEach((r) => {
    if (!tableSet.has(r.from_table) || !tableSet.has(r.to_table)) return;
    if (r.from_table === r.to_table) return;
    parentOf.get(r.from_table)?.add(r.to_table);
    childOf.get(r.to_table)?.add(r.from_table);
  });

  // ── Cycle-aware layering ──
  // Importance score: tables referenced by many others minus tables they reference
  // High score = "parent-like" (should be at the left / layer 0)
  const importance = new Map<string, number>();
  tables.forEach((t) => {
    const refdBy = childOf.get(t.name)?.size ?? 0;
    const refs = parentOf.get(t.name)?.size ?? 0;
    importance.set(t.name, refdBy - refs);
  });

  const visited = new Set<string>();
  const depth = new Map<string, number>();
  const queue: string[] = [];

  // Phase 1: Natural roots — tables that don't reference any other table
  tables.forEach((t) => {
    if (parentOf.get(t.name)?.size === 0) {
      depth.set(t.name, 0);
      queue.push(t.name);
      visited.add(t.name);
    }
  });

  // Phase 2: If no natural roots (circular FKs), pick pseudo-roots by importance
  if (queue.length === 0) {
    const sorted = [...tables].sort(
      (a, b) => (importance.get(b.name) ?? 0) - (importance.get(a.name) ?? 0)
    );
    const rootCount = Math.max(1, Math.min(6, Math.ceil(tables.length * 0.2)));
    for (let i = 0; i < rootCount && i < sorted.length; i++) {
      const name = sorted[i].name;
      depth.set(name, 0);
      queue.push(name);
      visited.add(name);
    }
  }

  // BFS with cycle protection (visited set prevents infinite loops)
  while (queue.length > 0) {
    const cur = queue.shift()!;
    const d = depth.get(cur)!;
    childOf.get(cur)?.forEach((ch) => {
      if (!visited.has(ch)) {
        visited.add(ch);
        depth.set(ch, d + 1);
        queue.push(ch);
      }
    });
  }

  // Phase 3: Handle disconnected components — tables still not visited
  const remaining = tables.filter((t) => !visited.has(t.name));
  if (remaining.length > 0) {
    remaining.sort(
      (a, b) => (importance.get(b.name) ?? 0) - (importance.get(a.name) ?? 0)
    );
    for (const t of remaining) {
      // Try to place relative to an already-placed parent
      let bestDepth = 0;
      parentOf.get(t.name)?.forEach((p) => {
        if (depth.has(p)) bestDepth = Math.max(bestDepth, (depth.get(p) ?? 0) + 1);
      });
      depth.set(t.name, bestDepth);
      visited.add(t.name);

      // BFS from this table to place its unvisited children
      const q2: string[] = [t.name];
      while (q2.length > 0) {
        const c = q2.shift()!;
        const cd = depth.get(c)!;
        childOf.get(c)?.forEach((ch) => {
          if (!visited.has(ch)) {
            visited.add(ch);
            depth.set(ch, cd + 1);
            q2.push(ch);
          }
        });
      }
    }
  }

  // Final fallback for any truly orphaned tables
  tables.forEach((t) => {
    if (!depth.has(t.name)) depth.set(t.name, 0);
  });

  // ── Group by layer ──
  const layers = new Map<number, string[]>();
  depth.forEach((d, t) => {
    if (!layers.has(d)) layers.set(d, []);
    layers.get(d)!.push(t);
  });

  const sortedLayers = Array.from(layers.entries()).sort((a, b) => a[0] - b[0]);

  // ── Position tables ──
  const positions = new Map<string, NodePosition>();
  let xOff = 60;

  // Limit columns to keep the layout readable (max ~7 tables per column)
  const MAX_PER_COL = 7;

  sortedLayers.forEach(([, layerTables]) => {
    layerTables.sort((a, b) => a.localeCompare(b));

    // Split large layers into sub-columns
    for (let chunk = 0; chunk < layerTables.length; chunk += MAX_PER_COL) {
      const slice = layerTables.slice(chunk, chunk + MAX_PER_COL);
      let yOff = 60;
      slice.forEach((name) => {
        const schema = schemas.get(name);
        const colCount = schema
          ? schema.columns.length
          : (tables.find((t) => t.name === name)?.column_count ?? 0);
        const h = nodeHeight(colCount);
        positions.set(name, { x: xOff, y: yOff, width: NODE_W, height: h });
        yOff += h + GAP_Y;
      });
      if (chunk + MAX_PER_COL < layerTables.length) {
        xOff += NODE_W + GAP_X;
      }
    }
    xOff += NODE_W + GAP_X;
  });

  return positions;
}

/* ─── Connection path between two column anchors ─── */

function getColumnY(schema: SchemaData | undefined, colName: string | undefined, fallbackCount: number): number {
  if (!schema || !colName) return HEADER_H + Math.min(fallbackCount, MAX_COLS) * COL_H * 0.5;
  const idx = schema.columns.findIndex((c) => c.name === colName);
  if (idx === -1 || idx >= MAX_COLS) {
    return HEADER_H + Math.min(schema.columns.length, MAX_COLS) * COL_H;
  }
  return HEADER_H + idx * COL_H + COL_H / 2;
}

/* ─────────────────────── Component ─────────────────────── */

export default function SchemaVisualizer({ onSelectTable }: SchemaVisualizerProps) {
  /* ── Data state ── */
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [schemas, setSchemas] = useState<Map<string, SchemaData>>(new Map());
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [positions, setPositions] = useState<Map<string, NodePosition>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── View state ── */
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Refs ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    isPan: false,
    nodeId: null as string | null,
    startMouseX: 0,
    startMouseY: 0,
    startValX: 0,
    startValY: 0,
    distance: 0,
  });

  /* ── Fetch all data ── */
  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [tablesRes, relsRes] = await Promise.all([
          api.get<{ data: TableInfo[] }>("admin/database/tables"),
          api.get<{ data: Relationship[] }>("admin/database/relationships"),
        ]);

        if (cancelled) return;

        const tableList = tablesRes.data;
        const rels = relsRes.data;
        setTables(tableList);
        setRelationships(rels);

        // Fetch schemas in parallel
        const schemaResults = await Promise.allSettled(
          tableList.map((t) =>
            api
              .get<{ data: SchemaData }>(`admin/database/tables/${t.name}/schema`)
              .then((r) => ({ name: t.name, schema: r.data }))
          )
        );

        if (cancelled) return;

        const schemaMap = new Map<string, SchemaData>();
        schemaResults.forEach((r) => {
          if (r.status === "fulfilled") {
            schemaMap.set(r.value.name, r.value.schema);
          }
        });
        setSchemas(schemaMap);

        // Compute layout
        const layout = computeLayout(tableList, rels, schemaMap);
        setPositions(layout);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load schema data.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  /* ── Auto-fit on initial load ── */
  const hasAutoFit = useRef(false);
  useEffect(() => {
    if (positions.size > 0 && !hasAutoFit.current) {
      hasAutoFit.current = true;
      requestAnimationFrame(() => fitToScreen());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions]);

  /* ── Derived: edges for rendering ── */
  const edges = useMemo(() => {
    if (positions.size === 0 || relationships.length === 0) return [];

    return relationships
      .filter((r) => {
        const hasFrom = positions.has(r.from_table);
        const hasTo = positions.has(r.to_table);
        return hasFrom && hasTo;
      })
      .map((r) => {
        const fromPos = positions.get(r.from_table)!;
        const toPos = positions.get(r.to_table)!;
        const fromSchema = schemas.get(r.from_table);
        const toSchema = schemas.get(r.to_table);
        const fromTable = tables.find((t) => t.name === r.from_table);
        const toTable = tables.find((t) => t.name === r.to_table);

        const fromColY = getColumnY(fromSchema, r.from_columns?.[0], fromTable?.column_count ?? 4);
        const toColY = getColumnY(toSchema, r.to_columns?.[0], toTable?.column_count ?? 4);

        // Determine which sides to connect
        const fromCenterX = fromPos.x + fromPos.width / 2;
        const toCenterX = toPos.x + toPos.width / 2;
        const sameColumn = Math.abs(fromCenterX - toCenterX) < 10;
        const goesRight = fromCenterX <= toCenterX;

        let fx: number, tx: number;
        if (sameColumn) {
          // Same column: both connect from right edge (loop outward)
          fx = fromPos.x + fromPos.width;
          tx = toPos.x + toPos.width;
        } else {
          fx = goesRight ? fromPos.x + fromPos.width : fromPos.x;
          tx = goesRight ? toPos.x : toPos.x + toPos.width;
        }
        const fy = fromPos.y + fromColY;
        const ty = toPos.y + toColY;

        return {
          key: `${r.from_table}.${(r.from_columns || []).join(",")}->${r.to_table}.${(r.to_columns || []).join(",")}`,
          from: r.from_table,
          to: r.to_table,
          fx, fy, tx, ty,
        };
      });
  }, [relationships, positions, schemas, tables]);

  /* ── Connected tables for hover highlighting ── */
  const connectedTables = useMemo(() => {
    if (!hoveredTable) return new Set<string>();
    const set = new Set<string>();
    relationships.forEach((r) => {
      if (r.from_table === hoveredTable) set.add(r.to_table);
      if (r.to_table === hoveredTable) set.add(r.from_table);
    });
    return set;
  }, [hoveredTable, relationships]);

  /* ── SVG viewport size ── */
  const svgSize = useMemo(() => {
    let maxX = 800;
    let maxY = 600;
    positions.forEach((p) => {
      maxX = Math.max(maxX, p.x + p.width + 400);
      maxY = Math.max(maxY, p.y + p.height + 300);
    });
    return { width: Math.min(maxX, 8000), height: Math.min(maxY, 8000) };
  }, [positions]);

  /* ── Fit to screen ── */
  const fitToScreen = useCallback(() => {
    if (!containerRef.current || positions.size === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const pad = 80;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    positions.forEach((p) => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x + p.width);
      maxY = Math.max(maxY, p.y + p.height);
    });

    const contentW = maxX - minX + pad * 2;
    const contentH = maxY - minY + pad * 2;
    const availH = rect.height - 52; // subtract toolbar height

    const newZoom = Math.min(rect.width / contentW, availH / contentH, 1.2);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setZoom(newZoom);
    setPanX(rect.width / 2 - centerX * newZoom);
    setPanY(availH / 2 + 52 - centerY * newZoom);
  }, [positions]);

  /* ── Wheel zoom (native listener to avoid passive event issue) ── */
  const zoomRef = useRef(zoom);
  const panXRef = useRef(panX);
  const panYRef = useRef(panY);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { panXRef.current = panX; }, [panX]);
  useEffect(() => { panYRef.current = panY; }, [panY]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const z = zoomRef.current;
      const px = panXRef.current;
      const py = panYRef.current;
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      const nz = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z * factor));
      const ratio = nz / z;

      setPanX(mx - ratio * (mx - px));
      setPanY(my - ratio * (my - py));
      setZoom(nz);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  /* ── Pointer handlers for pan + drag ── */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only primary button
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      const card = target.closest("[data-table-node]");

      dragRef.current = {
        active: true,
        isPan: !card,
        nodeId: card ? card.getAttribute("data-table-node") : null,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startValX: card
          ? positions.get(card.getAttribute("data-table-node")!)?.x ?? 0
          : panX,
        startValY: card
          ? positions.get(card.getAttribute("data-table-node")!)?.y ?? 0
          : panY,
        distance: 0,
      };

      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [panX, panY, positions]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d.active) return;

      const dx = e.clientX - d.startMouseX;
      const dy = e.clientY - d.startMouseY;
      d.distance += Math.abs(dx) + Math.abs(dy);

      if (d.isPan) {
        setPanX(d.startValX + dx);
        setPanY(d.startValY + dy);
      } else if (d.nodeId) {
        setPositions((prev) => {
          const next = new Map(prev);
          const old = next.get(d.nodeId!);
          if (old) {
            next.set(d.nodeId!, {
              ...old,
              x: d.startValX + dx / zoom,
              y: d.startValY + dy / zoom,
            });
          }
          return next;
        });
      }
    },
    [zoom]
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  /* ── Handle node click (only if not dragged) ── */
  const handleNodeClick = useCallback(
    (tableName: string) => {
      if (dragRef.current.distance > 8) return;
      onSelectTable(tableName);
    },
    [onSelectTable]
  );

  /* ── Zoom buttons ── */
  const zoomIn = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const nz = Math.min(MAX_ZOOM, zoom * 1.25);
    const r = nz / zoom;
    setPanX(cx - r * (cx - panX));
    setPanY(cy - r * (cy - panY));
    setZoom(nz);
  };

  const zoomOut = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const nz = Math.max(MIN_ZOOM, zoom * 0.8);
    const r = nz / zoom;
    setPanX(cx - r * (cx - panX));
    setPanY(cy - r * (cy - panY));
    setZoom(nz);
  };

  /* ── Search filtering ── */
  const matchesSearch = useCallback(
    (name: string) => {
      if (!searchQuery) return null; // null = no filter active
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    },
    [searchQuery]
  );

  /* ── Loading / Error states ── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading schema data...
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Fetching {tables.length > 0 ? `${tables.length} tables` : "tables"}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50 dark:bg-gray-900 select-none">
      {/* ── Toolbar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-[52px] border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-brand-50 dark:bg-brand-500/10">
              <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Schema Visualizer
              </span>
              <span className="ml-2 text-[10px] text-gray-400 dark:text-gray-500">
                {tables.length} tables &middot; {relationships.length} relations &middot; {edges.length} edges
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500 w-44"
            />
          </div>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
            <button onClick={zoomOut} className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-600 transition-colors" title="Zoom out">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 w-10 text-center tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={zoomIn} className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-600 transition-colors" title="Zoom in">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Fit to screen */}
          <button
            onClick={fitToScreen}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Fit to screen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Canvas ── */}
      <div
        ref={containerRef}
        className="absolute inset-0 pt-[52px]"
        style={{
          cursor: dragRef.current.active && dragRef.current.isPan ? "grabbing" : "grab",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Dot grid background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(128,128,128,0.15) 1px, transparent 1px)",
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${panX % (20 * zoom)}px ${panY % (20 * zoom)}px`,
          }}
        />

        {/* Transform wrapper */}
        <div
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: "0 0",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {/* SVG for relationship edges */}
          <svg
            width={svgSize.width}
            height={svgSize.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              overflow: "visible",
            }}
          >
            {edges.map((edge) => {
              const isHL = hoveredTable === edge.from || hoveredTable === edge.to;
              const isSearchDim =
                !!searchQuery &&
                !edge.from.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !edge.to.toLowerCase().includes(searchQuery.toLowerCase());

              const dx = Math.abs(edge.tx - edge.fx);
              const dy = Math.abs(edge.ty - edge.fy);
              const sameColumn = dx < 10;

              let pathD: string;
              if (sameColumn) {
                const loopOffset = Math.max(80, dy * 0.3);
                pathD = `M ${edge.fx},${edge.fy} C ${edge.fx + loopOffset},${edge.fy} ${edge.tx + loopOffset},${edge.ty} ${edge.tx},${edge.ty}`;
              } else {
                const goesRight = edge.fx < edge.tx;
                const cp = Math.max(dx * 0.45, 60);
                const cpf = goesRight ? cp : -cp;
                const cpt = goesRight ? -cp : cp;
                pathD = `M ${edge.fx},${edge.fy} C ${edge.fx + cpf},${edge.fy} ${edge.tx + cpt},${edge.ty} ${edge.tx},${edge.ty}`;
              }

              const strokeColor = isHL ? "#465fff" : "#6b7280";
              const strokeWidth = isHL ? 2.5 : 1.5;
              const opacity = isSearchDim ? 0.12 : 1;
              const dotR = isHL ? 4 : 3;

              // Arrow at target end
              const arrowSize = 8;
              let arrowAngle: number;
              if (sameColumn) {
                arrowAngle = edge.ty > edge.fy ? -Math.PI / 2 : Math.PI / 2;
              } else {
                arrowAngle = edge.fx < edge.tx ? 0 : Math.PI;
              }
              const a1x = edge.tx - arrowSize * Math.cos(arrowAngle - Math.PI / 6);
              const a1y = edge.ty - arrowSize * Math.sin(arrowAngle - Math.PI / 6);
              const a2x = edge.tx - arrowSize * Math.cos(arrowAngle + Math.PI / 6);
              const a2y = edge.ty - arrowSize * Math.sin(arrowAngle + Math.PI / 6);

              return (
                <g key={edge.key} opacity={opacity}>
                  {/* Bezier curve */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                  />
                  {/* Arrow at target */}
                  <polygon
                    points={`${edge.tx},${edge.ty} ${a1x},${a1y} ${a2x},${a2y}`}
                    fill={strokeColor}
                  />
                  {/* Dots at connection points */}
                  <circle cx={edge.fx} cy={edge.fy} r={dotR} fill={strokeColor} />
                  <circle cx={edge.tx} cy={edge.ty} r={dotR} fill={strokeColor} />
                </g>
              );
            })}
          </svg>

          {/* Table cards */}
          {Array.from(positions.entries()).map(([name, pos]) => {
            const schema = schemas.get(name);
            const tableInfo = tables.find((t) => t.name === name);
            const color = hashColor(name);
            const isHovered = hoveredTable === name;
            const isConnected = connectedTables.has(name);
            const searchMatch = matchesSearch(name);
            const isDimmed = searchMatch === false;
            const isSearchHighlighted = searchMatch === true;

            const visibleCols = schema
              ? schema.columns.slice(0, MAX_COLS)
              : [];
            const moreCount = schema
              ? Math.max(0, schema.columns.length - MAX_COLS)
              : Math.max(0, (tableInfo?.column_count ?? 0) - MAX_COLS);
            const pk = schema?.primary_key ?? [];
            const fkCols = new Set(
              schema?.foreign_keys.flatMap((fk) => fk.columns) ?? []
            );

            return (
              <div
                key={name}
                data-table-node={name}
                onMouseEnter={() => setHoveredTable(name)}
                onMouseLeave={() => setHoveredTable(null)}
                onClick={() => handleNodeClick(name)}
                style={{
                  position: "absolute",
                  left: pos.x,
                  top: pos.y,
                  width: NODE_W,
                  zIndex: 1,
                  opacity: isDimmed ? 0.25 : 1,
                  transition: "box-shadow 0.15s, border-color 0.15s, opacity 0.2s",
                  cursor: "pointer",
                }}
                className={`rounded-xl border bg-white dark:bg-gray-800 overflow-hidden ${
                  isHovered || isSearchHighlighted
                    ? "border-brand-400 dark:border-brand-500 shadow-lg shadow-brand-500/10 ring-1 ring-brand-400/30"
                    : isConnected
                    ? "border-brand-200 dark:border-brand-500/30 shadow-md"
                    : "border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Header */}
                <div
                  className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 dark:border-gray-700/60"
                  style={{
                    background: `linear-gradient(135deg, ${color}08, ${color}03)`,
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-bold font-mono text-gray-900 dark:text-white truncate flex-1">
                    {name}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums flex-shrink-0">
                    {tableInfo?.row_count.toLocaleString() ?? "—"}
                  </span>
                </div>

                {/* Columns */}
                {schema ? (
                  <div className="py-0.5">
                    {visibleCols.map((col) => {
                      const isPK = pk.includes(col.name);
                      const isFK = fkCols.has(col.name);
                      const fkRef = schema.foreign_keys.find((fk) =>
                        fk.columns.includes(col.name)
                      );

                      return (
                        <div
                          key={col.name}
                          className="flex items-center gap-1.5 px-3 py-[3px] hover:bg-gray-50 dark:hover:bg-gray-700/40 group/col"
                        >
                          {/* Key indicators */}
                          <div className="w-4 flex-shrink-0 flex items-center justify-center">
                            {isPK ? (
                              <span className="w-3.5 h-3.5 flex items-center justify-center bg-yellow-100 dark:bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 rounded text-[7px] font-black leading-none">
                                PK
                              </span>
                            ) : isFK ? (
                              <span className="w-3.5 h-3.5 flex items-center justify-center bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded text-[7px] font-black leading-none">
                                FK
                              </span>
                            ) : (
                              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                            )}
                          </div>

                          {/* Column name */}
                          <span
                            className={`text-[11px] font-mono truncate flex-1 ${
                              isPK
                                ? "font-semibold text-gray-900 dark:text-white"
                                : isFK
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {col.name}
                          </span>

                          {/* Type */}
                          <span className="text-[9px] font-mono text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-1 py-0.5 rounded flex-shrink-0 opacity-70 group-hover/col:opacity-100">
                            {col.type_name || col.type}
                          </span>

                          {/* FK reference tooltip indicator */}
                          {fkRef && (
                            <span className="text-[8px] text-blue-400 dark:text-blue-500 flex-shrink-0" title={`→ ${fkRef.foreign_table}.${fkRef.foreign_columns.join(",")}`}>
                              →
                            </span>
                          )}
                        </div>
                      );
                    })}

                    {moreCount > 0 && (
                      <div className="px-3 py-1.5 text-[10px] text-gray-400 dark:text-gray-500 text-center border-t border-dashed border-gray-100 dark:border-gray-700/50 mt-0.5">
                        +{moreCount} more column{moreCount > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-3 py-3 text-[10px] text-gray-400 dark:text-gray-500 text-center">
                    {tableInfo?.column_count ?? "?"} columns
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Legend overlay ── */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 flex items-center justify-center bg-yellow-100 dark:bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 rounded text-[6px] font-black">
            PK
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">Primary Key</span>
        </div>
        <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 flex items-center justify-center bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded text-[6px] font-black">
            FK
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">Foreign Key</span>
        </div>
        <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-[2px]" viewBox="0 0 20 2">
            <line x1="0" y1="1" x2="20" y2="1" strokeWidth="2" className="stroke-gray-400 dark:stroke-gray-500" />
          </svg>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">Relationship</span>
        </div>
        <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 italic">
            Drag to move &middot; Scroll to zoom
          </span>
        </div>
      </div>

      {/* ── Empty state ── */}
      {tables.length === 0 && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No tables found in the database.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
