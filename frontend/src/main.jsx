import React from 'react'
import { createRoot } from 'react-dom/client' // Importación corregida
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' 
import { CartProvider } from './context/CartContext'

// En lugar de ReactDOM.createRoot, usamos createRoot directamente
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
