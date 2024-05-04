import clsx from "clsx";
import React, { FormEvent } from "react";
import { FC } from "react";
import { EditFieldProps, ErrorFieldProps } from "./users-table.component";

export type CustomInputComponentProps = {
  value: string;
  row: { index: string };
  column: { id: string };
  editField: EditFieldProps;
  errorField: ErrorFieldProps;
  isLoading: boolean;
  updateData: (
    index: string,
    id: string,
    value: string
  ) => { isEdited: boolean; isUnique: boolean };
};

const CustomInputComponent: FC<CustomInputComponentProps> = ({
  value: initialValue,
  row: { index },
  column: { id },
  editField,
  errorField,
  isLoading,
  updateData,
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);
  const types: {
    [key: string]: string;
  } = {
    fullname: "text",
    lastname: "text",
    position: "text",
    phone: "text",
    email: "email",
  };

  const isEdited =
    // @ts-ignore
    !!editField[index] && !!editField[index].find((item) => item === id);

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      type={types[id]}
      className={clsx(
        "focus:outline-none focus:ring-b focus:border-blue-600 focus:bg-blue-50",
        isEdited ? "bg-green-200" : "",
        !!errorField[index] && !errorField[index].isUnique && id === "email"
          ? "bg-red-200"
          : "",
        isLoading && "bg-green-300",
        "w-full py-4 px-6 border-b border-gray-200",
        !!errorField[index] && !!errorField[index].message && id === "email"
          ? "bg-red-200"
          : ""
      )}
      value={value}
      title={!!errorField[index] && errorField[index].message}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

export default CustomInputComponent;
