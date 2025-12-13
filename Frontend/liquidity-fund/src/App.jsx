import React from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  const location = useLocation();

  return (
    <>
      <AppRoutes />
    </>
  );
};

export default App;
