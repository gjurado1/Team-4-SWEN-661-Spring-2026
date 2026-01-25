import React from 'react';
import { RouterProvider } from 'react-router';
import { ThemeProvider } from './context/ThemeContext';
import { router } from './routes';

function App() {
  return (
    <ThemeProvider>
      <div id="app-root" style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'auto'
      }}>
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;