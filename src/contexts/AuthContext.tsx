import React, { useState, useEffect, createContext } from "react";
import { useVerifyTokenLazyQuery } from "../graphql/generated";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  storeToken: (token: string) => void;
  removeToken: () => void;
  loginUser: (user: User, token: string) => void;
  logOutUser: () => void;
  verifyUserToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  user: null,
  storeToken: () => {},
  removeToken: () => {},
  loginUser: () => {},
  logOutUser: () => {},
  verifyUserToken: () => Promise.resolve(),
});

export function AuthProviderWrapper(props: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [verifyToken, { data, loading, error }] = useVerifyTokenLazyQuery();

  const storeToken = (token: string) => {
    localStorage.setItem("authToken", token);
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const loginUser = (user: User, token: string) => {
    storeToken(token);
    setUser(user);
    setIsLoggedIn(true);
  };

  const logOutUser = () => {
    removeToken();
    setIsLoggedIn(false);
    setUser(null);
  };

  const verifyUserToken = async () => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      try {
        const response = await verifyToken({
          context: {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          },
        });

        if (response.data && response.data.verifyToken) {
          const user: User = response.data.verifyToken;
          setIsLoggedIn(true);
          setUser(user);
        } else {
          throw new Error("Failed to verify token");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        removeToken();
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyUserToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        removeToken,
        loginUser,
        logOutUser,
        verifyUserToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };