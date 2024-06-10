// Importing React library
import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe, Stripe } from "@stripe/stripe-js";

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

// Defining a TypeScript type for ToastMessage
type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

// Defining a TypeScript type for AppContext
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  stripePromise: Promise<Stripe | null>;
};
const stripePromise = loadStripe(STRIPE_PUB_KEY);

// Creating a React context named AppContext
const AppContext = React.createContext<AppContext | undefined>(undefined);

// Exporting AppContextProvider component
export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });
  // Rendering the AppContext.Provider component with children
  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
        stripePromise,
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
