import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types/user';
import { getUser, saveUser, removeUser, getAllUsers } from '../services/asyncStorage';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  register: async () => {},
  login: async () => false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await getUser();
      setUser(savedUser);
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    // Check if user already exists
    const users = await getAllUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const newUser = { name, email, password };
    await saveUser(newUser);
    // Don't set the user here - require login after registration
  };

  const login = async (email: string, password: string) => {
    // Get all users and find the matching one
    const users = await getAllUsers();
    const foundUser = users.find(u => 
      u.email === email && u.password === password
    );
    
    if (foundUser) {
      // Save as current user and update state
      await saveUser(foundUser);
      setUser(foundUser);
      return true;
    }
    
    return false;
  };

  const logout = async () => {
    await removeUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);