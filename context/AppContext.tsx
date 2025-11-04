
import React, { createContext, useContext, useState, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Profile } from '../types';

interface AppContextType {
  isAuthenticated: boolean;
  pin: string | null;
  profiles: Profile[];
  activeProfileId: string | null;
  login: (enteredPin: string) => boolean;
  setPin: (newPin: string) => void;
  addProfile: (profile: Omit<Profile, 'id'>) => void;
  switchProfile: (profileId: string) => void;
  getActiveProfile: () => Profile | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pin, setPinState] = useLocalStorage<string | null>('mark-app-pin', null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profiles, setProfiles] = useLocalStorage<Profile[]>('mark-app-profiles', []);
  const [activeProfileId, setActiveProfileId] = useLocalStorage<string | null>('mark-app-active-profile', null);

  const setPin = (newPin: string) => {
    setPinState(newPin);
    setIsAuthenticated(true);
  };

  const login = (enteredPin: string): boolean => {
    if (pin && enteredPin === pin) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const addProfile = (profileData: Omit<Profile, 'id'>) => {
    if (profiles.length < 3) {
      const newProfile: Profile = { ...profileData, id: new Date().toISOString() };
      const updatedProfiles = [...profiles, newProfile];
      setProfiles(updatedProfiles);
      if (!activeProfileId) {
        setActiveProfileId(newProfile.id);
      }
    }
  };

  const switchProfile = (profileId: string) => {
    setActiveProfileId(profileId);
  };

  const getActiveProfile = (): Profile | undefined => {
    return profiles.find(p => p.id === activeProfileId);
  }

  return (
    <AppContext.Provider value={{ isAuthenticated, pin, profiles, activeProfileId, login, setPin, addProfile, switchProfile, getActiveProfile }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
