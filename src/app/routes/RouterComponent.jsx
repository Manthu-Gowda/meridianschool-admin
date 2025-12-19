import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../components/MainLayout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
const AppRoutes = () => (
  <Routes>
    <Route
      element={
        // <ProtectedRoute>
        <MainLayout />
        // </ProtectedRoute>
      }
    >
      <Route path="/home" element={<Home />} />
    </Route>
  </Routes>
);

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterComponent;
