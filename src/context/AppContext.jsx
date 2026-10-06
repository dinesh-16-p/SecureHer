import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [safetyStatus, setSafetyStatus] = useState('NORMAL'); // 'NORMAL' | 'ALERT' | 'EMERGENCY'

  const value = {
    notifications,
    setNotifications,
    safetyStatus,
    setSafetyStatus
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
