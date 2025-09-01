
interface SliderProps {
  label?: string;
  optionOne: string;
  optionTwo: string;
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
  name?: string;
}

export default function Slider({ 
  label, 
  optionOne, 
  optionTwo, 
  value, 
  onChange, 
  className = "",
  size = "md",
  name = "slider-tabs"
}: SliderProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-32"; // 128px
      case "md":
        return "w-48"; // 192px
      case "lg":
        return "w-64"; // 256px
      case "full":
        return "w-full";
      default:
        return "w-48";
    }
  };

  return (
    <div className={className}>
      {label && <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>}
      <div className="tabs-container">
        <div className={`tabs-wrapper ${getSizeClasses()}`}>
          <input 
            type="radio" 
            id={`radio-${optionOne.toLowerCase().replace(/\s+/g, '-')}-${name}`}
            name={name} 
            checked={value}
            onChange={() => onChange(true)}
          />
          <label className="tab" htmlFor={`radio-${optionOne.toLowerCase().replace(/\s+/g, '-')}-${name}`}>
            {optionOne}
          </label>
          <input 
            type="radio" 
            id={`radio-${optionTwo.toLowerCase().replace(/\s+/g, '-')}-${name}`}
            name={name} 
            checked={!value}
            onChange={() => onChange(false)}
          />
          <label className="tab" htmlFor={`radio-${optionTwo.toLowerCase().replace(/\s+/g, '-')}-${name}`}>
            {optionTwo}
          </label>
          <span className="glider"></span>
        </div>
      </div>
    </div>
  );
} 