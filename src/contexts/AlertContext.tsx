import React, { createContext, useContext, useState, ReactNode } from 'react';

type AlertType = 'success' | 'error' | 'info';

type AlertData = {
  isShow: boolean;
  severity: AlertType;
  message?: string;
};

type AlertContextType = {
  alertData: AlertData;
  setAlertData: (data: AlertData) => void;
  hideAlert: () => void;
};

const AlertContext = createContext<AlertContextType>({
  alertData: { isShow: false, severity: 'info' },
  setAlertData: () => {},
  hideAlert: () => {},
});

export const useAlert = () => useContext(AlertContext);

type AlertProviderProps = {
  children: ReactNode;
};

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alertData, setAlertData] = useState<AlertData>({
    isShow: false,
    severity: 'info',
  });

  const hideAlert = () => {
    setAlertData({ ...alertData, isShow: false });
  };

  return (
    <AlertContext.Provider value={{ alertData, setAlertData, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
