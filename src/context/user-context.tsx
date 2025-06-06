import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

interface UserType {
  full_name: string;
  id: string;
  is_verified: boolean;
}

interface UserContextType {
  user: UserType | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isError: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  isError: false,
});

const fetchUser = async () => {

};

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const user = data ?? null;
  const isLoggedIn = !!data && !isError;

  return (
    <UserContext.Provider value={{ user, isLoggedIn, isLoading, isError }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
