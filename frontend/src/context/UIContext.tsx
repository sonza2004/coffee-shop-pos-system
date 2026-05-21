import { createContext, useContext, useState } from "react";

type UIState = {
  loading: boolean;
  error: string | null;
  setLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
};

const UIContext = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <UIContext.Provider value={{ loading, error, setLoading, setError }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
