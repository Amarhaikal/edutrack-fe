import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { SnackBarType } from '../components/SnackBarLib/SnackBarLib';

export interface SnackBarState {
  show: boolean;
  type: SnackBarType;
  action?: 'save' | 'update' | 'delete' | 'custom';
  entityName?: string;
  message?: string;
}

interface SnackBarContextType {
  notification: SnackBarState;
  showSnackBar: (config: Omit<SnackBarState, 'show'>) => void;
  hideSnackBar: () => void;
}

const SnackBarContext = createContext<SnackBarContextType | undefined>(undefined);

export function SnackBarProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<SnackBarState>({
    show: false,
    type: 'success',
  });

  const showSnackBar = (config: Omit<SnackBarState, 'show'>) => {
    setNotification({
      ...config,
      show: true,
    });
  };

  const hideSnackBar = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  return (
    <SnackBarContext.Provider value={{ notification, showSnackBar, hideSnackBar }}>
      {children}
    </SnackBarContext.Provider>
  );
}

export function useSnackBar() {
  const context = useContext(SnackBarContext);
  if (context === undefined) {
    throw new Error('useSnackBar must be used within a SnackBarProvider');
  }
  return context;
}
