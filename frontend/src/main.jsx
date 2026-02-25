import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // <--- 1. ต้องมีบรรทัดนี้

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. ต้องเอา BrowserRouter มาคลุม App ไว้ */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)