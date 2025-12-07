import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DatabaseContextType {
  currentDatabasePath: string | null;
  setCurrentDatabasePath: (path: string | null) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [currentDatabasePath, setCurrentDatabasePath] = useState<string | null>(null);

  return (
    <DatabaseContext.Provider value={{ currentDatabasePath, setCurrentDatabasePath }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
