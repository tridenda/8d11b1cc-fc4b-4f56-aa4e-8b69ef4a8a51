"use client";

import React, { useEffect } from "react";
import { useFilters, useSortBy, useTable } from "react-table";

import { UsersContext, UsersProps } from "@/services/users/users.context";
import CustomInputComponent from "./custom-input.component";

export type EditFieldProps = {
  [row: string]: string[];
};

export type ErrorFieldProps = {
  [row: string]: {
    isUnique?: boolean;
    message?: string;
  };
};

const UsersTable = () => {
  const { users } = React.useContext(UsersContext);
  const [tempUsers, setTempUsers] = React.useState<UsersProps[]>([]);
  const [editField, setEditField] = React.useState<EditFieldProps>({});
  const [errorField, setErrorField] = React.useState<ErrorFieldProps>({});

  useEffect(() => {
    setTempUsers([...users]);
  }, [users]);

  const data = React.useMemo(() => tempUsers, [tempUsers]);

  const columns = React.useMemo(
    () => [
      { Header: "First Name", accessor: "firstname" },
      { Header: "Last Name", accessor: "lastname" },
      { Header: "Position", accessor: "position" },
      { Header: "Phone", accessor: "phone" },
      { Header: "Email", accessor: "email" },
    ],
    []
  );

  const defaultColumn = {
    Cell: CustomInputComponent,
  };

  const updateData = (rowId: string, columnId: string, value: string) => {
    let newTempUsers: UsersProps[] = tempUsers;
    let newEditField: EditFieldProps = editField;

    // @ts-ignore
    const isEditable = tempUsers[rowId][columnId] !== value;

    if (isEditable) {
      newTempUsers[Number(rowId)] = {
        ...newTempUsers[Number(rowId)],
        [columnId]: value,
      };

      setTempUsers([...newTempUsers]);
    }

    if (isEditable) {
      newEditField = {
        ...editField,
        [rowId]: !!editField[rowId]
          ? Array.from(new Set([...editField[rowId], columnId]))
          : [columnId],
      };

      setEditField({ ...newEditField });
    }

    const newIsUnique =
      newTempUsers.filter((item) => {
        return item.email === value;
      }).length <= 1;

    setErrorField({
      ...errorField,
      [rowId]: {
        isUnique: newIsUnique,
      },
    });

    return {
      isUnique: !!errorField[rowId]?.isUnique
        ? errorField[rowId].isUnique
        : newIsUnique,
      isEdited: isEditable,
    };
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      // @ts-ignore
      { columns, data, defaultColumn, updateData, editField, errorField },
      useFilters,
      useSortBy
    );

  const validateRowData = (rowData: any) => {
    const errors = {
      firstName: "",
    };
    if (!rowData.firstName) {
      errors.firstName = "First name is required";
    }
    return errors;
  };

  useEffect(() => {
    console.log("errorField: ", errorField);
    console.log("users: ", users);
  }, [errorField, users]);

  return (
    <>
      <button
        onClick={() => {
          const newErrorField = {};
          setErrorField({});
          setEditField({});
          setTempUsers([...users]);
        }}
      >
        reset
      </button>
      <table>
        <thead>
          {headerGroups.map((headerGroup, i) => {
            return (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                key={`headerGroup-${i}`}
                className="text-left"
              >
                {headerGroup.headers.map((column, i) => {
                  // @ts-ignore
                  const {
                    getHeaderProps,
                    render,
                    // @ts-ignore
                    getSortByToggleProps,
                    // @ts-ignore
                    isSortedDesc,
                    // @ts-ignore
                    isSorted,
                  } = column;

                  const extraClass = isSorted
                    ? isSortedDesc
                      ? "desc"
                      : "asc"
                    : "";
                  return (
                    <th className={extraClass} key={`header-${i}`}>
                      <div
                        {...getHeaderProps(getSortByToggleProps())}
                        key={`subHeader-${i}`}
                      >
                        {render("Header")}
                      </div>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>

        <tbody>
          {rows.map((row, i) => {
            prepareRow(row);

            return (
              <tr {...row.getRowProps()} key={`row-${i}`}>
                {row.cells.map((cell, i) => {
                  const isEdited = !!editField[row.id]?.find(
                    (item) => item == cell.column.id
                  );

                  return (
                    <td
                      {...cell.getCellProps()}
                      key={`column${i}`}
                      className={cell.column.Header === "ID" ? "hidden" : ""}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default UsersTable;
