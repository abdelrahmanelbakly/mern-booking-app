// Importing React library
import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

// Defining a TypeScript type for ToastMessage
type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

// Defining a TypeScript type for AppContext
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
};

// Creating a React context named AppContext
const AppContext = React.createContext<AppContext | undefined>(undefined);

// Exporting AppContextProvider component
export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const { isError, isLoading } = useQuery(
    "validateToken",
    apiClient.validateToken,
    {
      retry: false,
    }
  );
  console.log("isError:", isError);
  console.log("isLoading:", isLoading);

  // Rendering the AppContext.Provider component with children
  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isLoading && !isError,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};
export default function UseAppContext() {
  const context = useContext(AppContext);
  return context as AppContext;
}
