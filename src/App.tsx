import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Switch, ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import DataTable from './components/dataGrid';
import { darkTheme, lightTheme } from './themes';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={createTheme(darkMode ? darkTheme : lightTheme)}>
    <CssBaseline />
    <div className=''>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Material-UI DataTable
          </Typography>
          <Typography variant="body2" sx={{ marginRight: 2 }}>
            Dark Mode
          </Typography>
          <Switch checked={darkMode} onChange={toggleDarkMode} />
        </Toolbar>
      </AppBar>
      <div className=''>
        <DataTable darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>
    
    </div>
    </ThemeProvider>
  );
}

export default App;
