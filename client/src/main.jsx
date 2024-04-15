import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import extend_theme from './utils/chakra-theme.js';
import App from './App.jsx';
import './index.css';

const theme = extendTheme(extend_theme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}></Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
