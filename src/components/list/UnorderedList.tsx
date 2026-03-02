export default function UnOrderedList() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] sm:w-fit">
      <ul className="flex flex-col">
        <li className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">
          <span className="ml-2 block h-[3px] w-[3px] rounded-full bg-gray-500 dark:bg-gray-400"></span>
          <span>Nema stavki.</span>
        </li>
      </ul>
    </div>
  );
}
