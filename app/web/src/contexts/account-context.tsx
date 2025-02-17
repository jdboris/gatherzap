"use client";

import { AccountUpdateSchema } from "@gatherzap/schemas/account-update-schema";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { createContext, ReactNode, useContext } from "react";

interface AccountContextValue {
  updateAccount: UseMutateFunction<Response, Error, AccountUpdateSchema>;
}

const AccountContext = createContext<AccountContextValue | undefined>(
  undefined
);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const updateAccountMutation = useMutation({
    mutationFn: (account: AccountUpdateSchema) =>
      fetch("/api/account/complete-setup", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
      }),
  });

  return (
    <AccountContext
      value={{
        updateAccount: updateAccountMutation.mutate,
      }}
    >
      {children}
    </AccountContext>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};
