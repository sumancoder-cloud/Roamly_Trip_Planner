import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const USER_STORE_KEY = 'roamly-users';
const CURRENT_USER_KEY = 'roamly-current-user';

function readStore(key) {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch {
    return null;
  }
}

function writeStore(key, value) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function readUsers() {
  return readStore(USER_STORE_KEY) || [];
}

function saveUsers(users) {
  writeStore(USER_STORE_KEY, users);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStore(CURRENT_USER_KEY));
  const [users, setUsers] = useState(() => readUsers());

  useEffect(() => {
    const storedUser = readStore(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (name, email) => {
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanName || !cleanEmail) return null;

    const allUsers = readUsers();
    const existing = allUsers.find((entry) => entry.email === cleanEmail);
    const nextUser = existing
      ? { ...existing, name: cleanName }
      : { id: `${Date.now()}`, name: cleanName, email: cleanEmail, trips: [] };

    const updatedUsers = existing
      ? allUsers.map((entry) => (entry.email === cleanEmail ? nextUser : entry))
      : [...allUsers, nextUser];

    saveUsers(updatedUsers);
    writeStore(CURRENT_USER_KEY, nextUser);
    setUsers(updatedUsers);
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(CURRENT_USER_KEY);
    }
    setUser(null);
  };

  const saveTrip = (trip) => {
    if (!user) return null;
    const allUsers = readUsers();
    const updatedUsers = allUsers.map((entry) => {
      if (entry.email !== user.email) return entry;
      const existingTrips = Array.isArray(entry.trips) ? entry.trips : [];
      return { ...entry, trips: [trip, ...existingTrips].slice(0, 8) };
    });
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
    const refreshedUser = updatedUsers.find((entry) => entry.email === user.email) || user;
    writeStore(CURRENT_USER_KEY, refreshedUser);
    setUser(refreshedUser);
    return refreshedUser;
  };

  const value = useMemo(() => ({
    user,
    users,
    isAuthenticated: Boolean(user),
    login,
    logout,
    saveTrip,
  }), [user, users]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
