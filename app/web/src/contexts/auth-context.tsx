"use client";

import { ErrorSchema } from "@gatherzap/schemas/error-schema";
import { UserSchema } from "@gatherzap/schemas/user-schema";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { createContext, ReactNode, useContext } from "react";

interface AuthContextValue {
  user: UserSchema | undefined | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: UseQueryResult<UserSchema>["refetch"];
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UserSchema>({
    queryKey: ["current-user"],
    queryFn: async ({ signal }) => {
      const response = await fetch("/api/auth/current-user", {
        signal,
        credentials: "include",
      });

      if (!response.ok) {
        const data: ErrorSchema = await response.json();
        throw new Error(data.message);
      }

      return await response.json();
    },
  });

  return (
    <AuthContext
      value={{
        user,
        isLoading,
        isError,
        error,
        refetch,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
