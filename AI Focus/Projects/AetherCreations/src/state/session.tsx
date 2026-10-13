import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * FRONT-END MOCK. There is no backend yet: signing in just remembers the
 * details in this browser and never checks a password. Swap `signIn` and
 * `signOut` for real calls to your auth provider when you add one.
 */
export type User = { name: string; email: string; address: string };

type SessionValue = {
  user: User | null;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  updateUser: (patch: Partial<Pick<User, "name" | "address">>) => void;
};

const STORAGE_KEY = "aether.session.v1";

function load(): User | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as Partial<User> | null) : null;
    if (data && typeof data.name === "string" && typeof data.email === "string") {
      return { name: data.name, email: data.email, address: typeof data.address === "string" ? data.address : "" };
    }
  } catch {
    /* Corrupted or unavailable storage: treat as signed out. */
  }
  return null;
}

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  return local ? local.charAt(0).toUpperCase() + local.slice(1) : "there";
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(load);

  useEffect(() => {
    try {
      if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Ignore storage failures. */
    }
  }, [user]);

  const signIn = useCallback((email: string, name?: string) => {
    setUser((previous) =>
      previous && previous.email === email
        ? { ...previous, name: name || previous.name }
        : { email, name: name || nameFromEmail(email), address: "" },
    );
  }, []);

  const signOut = useCallback(() => setUser(null), []);
  const updateUser = useCallback<SessionValue["updateUser"]>(
    (patch) => setUser((previous) => (previous ? { ...previous, ...patch } : previous)),
    [],
  );

  const value = useMemo(() => ({ user, signIn, signOut, updateUser }), [user, signIn, signOut, updateUser]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}
