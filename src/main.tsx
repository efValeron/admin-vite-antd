import ReactDOM from 'react-dom/client'
import {App} from './App.tsx'
import './index.css'
import {theme} from "./theme.ts";
import {ConfigProvider} from "antd";
import {BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ConfigProvider theme={theme}>
      <App/>
    </ConfigProvider>
  </BrowserRouter>,
)
