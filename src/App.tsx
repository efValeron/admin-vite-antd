import {Categories} from "./pages/Categories.tsx";
import {Navigate, Route, Routes} from "react-router-dom";

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/categories"/>}/>
        <Route path="/categories" element={<Categories/>}/>
      </Routes>
    </>
  )
}
