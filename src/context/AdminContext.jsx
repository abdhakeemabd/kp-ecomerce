import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if admin is already logged in
  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdminUser(parsedAdmin);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored admin:', error);
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Admin credentials
    if (username === 'admin_nisam' && password === 'Nizam@5001#') {
      const admin = {
        username: 'admin_nisam',
        role: 'admin',
        loginTime: new Date().toISOString()
      };
      setAdminUser(admin);
      setIsAuthenticated(true);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setAdminUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminUser');
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, adminUser, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
