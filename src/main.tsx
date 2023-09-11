import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App.tsx'
import './index.css'
import {theme} from "./theme.ts";
import {ConfigProvider} from "antd";
import {BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={theme}>
        <App/>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
