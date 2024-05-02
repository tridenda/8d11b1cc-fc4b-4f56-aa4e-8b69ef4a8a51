"use client";

import React from "react";
import { useTable } from "react-table";

import { UsersContext } from "@/services/users/users.context";
import CustomInputComponent from "./custom-input.component";

const UsersTable = () => {
  const { users } = React.useContext(UsersContext);
  const [editField, setEditField] = React.useState<{
    row: string;
    column: string;
  } | null>(null);

  const data = React.useMemo(() => users, [users]);

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "First Name", accessor: "firstname" },
      { Header: "Last Name", accessor: "lastname" },
      { Header: "Position", accessor: "position" },
      { Header: "Phone", accessor: "phone" },
      { Header: "Email", accessor: "email" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    // @ts-ignore
    useTable({ columns, data });

  const validateRowData = (rowData: any) => {
    const errors = {
      firstName: "",
    };
    if (!rowData.firstName) {
      errors.firstName = "First name is required";
    }
    // Add more validation checks as needed
    return errors;
  };

  return (
    <>
      {rows.map((row) => {
        prepareRow(row);

        return (
          <tr {...row.getRowProps()}>
            {row.cells.map((cell, i) => {
              const header = cell.column.Header?.toString();

              return (
                <td
                  {...cell.getCellProps()}
                  className={header === "ID" ? "hidden" : ""}
                >
                  {editField?.row === row.id &&
                  editField.column === cell.value ? (
                    /* Render custom input field for editing */
                    <CustomInputComponent
                      value={cell.value}
                      onChange={(value: string) => {
                        // Logic to update local state with the new value
                      }}
                    />
                  ) : (
                    /* Render static text */
                    <p
                      onClick={() => {
                        setEditField({ row: row.id, column: cell.value });
                      }}
                      className={header === "ID" ? "hidden" : ""}
                    >
                      {cell.value}
                    </p>
                  )}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
};

export default UsersTable;
