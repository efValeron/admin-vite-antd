import {Categories} from "./pages/categories/Categories.tsx";
import {Navigate, Route, Routes} from "react-router-dom";
import {CategoryEdit} from "./pages/categories/CategoryEdit.tsx";

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/categories"/>}/>
        <Route path="/categories" element={<Categories/>}/>
        <Route path="/categories/:id" element={<CategoryEdit/>}/>
        <Route path="/categories/add" element={<CategoryEdit add/>}/>
      </Routes>
    </>
  )
}
