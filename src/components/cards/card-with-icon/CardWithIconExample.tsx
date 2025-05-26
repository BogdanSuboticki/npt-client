import ComponentCard from "../../common/ComponentCard";
import CardIconOne from "./CardIconOne";
import CardIconTwo from "./CardIconTwo";
export default function CardWithIconExample() {
  return (
    <ComponentCard title="Card with Icon">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div>
          <CardIconOne />
        </div>

        <div>
          <CardIconTwo title="Card with Icon" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." link="/" />
        </div>
      </div>
    </ComponentCard>
  );
}
