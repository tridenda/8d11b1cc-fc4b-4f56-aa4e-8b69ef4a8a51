import React from "react";
import { FC } from "react";

export type CustomInputComponentProps = {
  value: string;
  onChange: (value: string) => void;
};

const CustomInputComponent: FC<CustomInputComponentProps> = ({
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = React.useState(value);

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
    onChange(e.currentTarget.value);
  };

  return (
    <input
      className="border-b border-blue-900"
      value={inputValue}
      onChange={handleInputChange}
      // Additional props and styling
    />
  );
};

export default CustomInputComponent;
