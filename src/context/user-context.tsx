import React, { createContext, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {getCookie} from 'typescript-cookie'
import axiosInstance from "../axios";

interface UserType {
  full_name: string;
  id: string;
  is_verified: boolean;
  email : string
}

interface UserContextType {
  user: UserType | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isError: boolean;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  isError: false,
});

const fetchUser = async (): Promise<UserType> => {
  const response = await axiosInstance.get("/api/auth/me");
  return response.data;

};

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const isloggedin = getCookie('loggedin')
  useEffect(() => {
   console.log(isloggedin)
  }, [isloggedin])
  
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
