"use client";

import React, { createContext, ReactNode, useEffect, useState } from "react";
import { usersRequest } from "./users.service";

export const UsersContext = createContext({});

export type UsersProps = {
  firstname?: string;
  lastname?: string;
  position?: string;
  phone?: string;
  email?: string;
};

export const UsersContextProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<UsersProps[]>([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  const getUsers = () => {
    setIsloading(true);
    setUsers([]);

    usersRequest()
      .then((result: UsersProps[]) => {
        setIsloading(false);
        setUsers(result);
      })
      .catch((err) => {
        setIsloading(false);
        setError(err);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <UsersContext.Provider
      value={{
        users,
        isLoading,
        error,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
