"use client";

import React, { useEffect } from "react";
import { useFilters, useSortBy, useTable } from "react-table";

import { UsersContext, UsersProps } from "@/services/users/users.context";
import CustomInputComponent from "./custom-input.component";
import clsx from "clsx";

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
  const { users, isLoading, updateUsers } = React.useContext(UsersContext);
  const [tempUsers, setTempUsers] = React.useState<UsersProps[]>([]);
  const [editField, setEditField] = React.useState<EditFieldProps>({});
  const [errorField, setErrorField] = React.useState<ErrorFieldProps>({});
  const [isOnEdit, setIsOnEdit] = React.useState<boolean>(false);
  const [isSubmitable, setIsSubmitable] = React.useState<boolean>(false);

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
        ...errorField[rowId],
        isUnique: newIsUnique,
      },
    });

    // don't remember from where i copied this code, but this works.
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(value) && columnId == "email") {
      console.log("keluar nih");
      setIsSubmitable(false);
      setErrorField({
        ...errorField,
        [rowId]: {
          ...errorField[rowId],
          message: "Please input the correct email",
        },
      });
    }

    setIsSubmitable(true);

    setIsOnEdit(true);

    return {
      isUnique: !!errorField[rowId]?.isUnique
        ? errorField[rowId].isUnique
        : newIsUnique,
      isEdited: isEditable,
    };
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        // @ts-ignore
        columns,
        data,
        // @ts-ignore
        defaultColumn,
        updateData,
        isLoading,
        editField,
        errorField,
      },
      useFilters,
      useSortBy
    );

  useEffect(() => {
    console.log("errorField: ", errorField);
    console.log("users: ", users);
  }, [errorField, users]);

  return (
    <>
      <div className="flex justify-end gap-4 py-4">
        <button
          disabled={isOnEdit}
          onClick={() => {
            setTempUsers([
              {
                id: "",
                firstname: "",
                email: "",
                lastname: "",
                phone: "",
                position: "",
              },
              ...users,
            ]);
            setIsOnEdit(true);
          }}
          className={clsx(
            "bg-gray-500 rounded-full w-48 h-12 text-white font-semibold",
            isOnEdit && "bg-gray-300"
          )}
        >
          <div className="flex gap-3 justify-center items-center">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path
                  fill="currentColor"
                  d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"
                />
              </svg>
            </span>
            <span className="text-base">Add</span>
          </div>
        </button>
        <button
          onClick={() => {
            const newErrorField = {};
            setErrorField({});
            setEditField({});
            setIsOnEdit(false);
            setTempUsers([...users]);
          }}
          className="bg-yellow-600 rounded-full w-48 h-12 text-white font-semibold"
        >
          <div className="flex gap-3 justify-center items-center">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                >
                  <path d="M12 3a9 9 0 1 1-5.657 2" />
                  <path d="M3 4.5h4v4" />
                </g>
              </svg>
            </span>
            <span className="text-base">Reset</span>
          </div>
        </button>
        <button
          disabled={!isOnEdit}
          onClick={() => {
            updateUsers([...tempUsers]);
            setTempUsers([...tempUsers]);
            setErrorField({});
            setEditField({});
            setIsOnEdit(false);
          }}
          className={clsx(
            "transition bg-blue-700 rounded-full w-48 h-12 text-white font-semibold disabled:bg-blue-400"
          )}
        >
          <div className="flex gap-3 justify-center items-center">
            <span>
              <svg
                xmlns="http://www.w4.org/2000/svg"
                width="1em"
                height="1em"
                className="w-6 h-6"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"
                />
              </svg>
            </span>
            <span className="text-base">Save</span>
          </div>
        </button>
      </div>

      <table className="w-full table-fixed">
        <thead className="">
          {headerGroups.map((headerGroup, i) => {
            return (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                key={`headerGroup-${i}`}
                className="text-left bg-gray-100"
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
                    <th
                      className={clsx(
                        extraClass,
                        "w-1/5 py-5 px-6 text-left text-gray-600 font-bold uppercase"
                      )}
                      key={`header-${i}`}
                    >
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
                      className={clsx(
                        cell.column.Header === "ID" ? "hidden" : ""
                      )}
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
