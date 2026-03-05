import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Problems from "./pages/Problems";
import AdminCreateProblem from "./pages/AdminCreateProblem";
import ProblemDetail from "./pages/ProblemDetail";
import MySubmissions from "./pages/MySubmissions";
import Home from "./pages/Home";
function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home></Home>} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <Problems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-submissions"
          element={
            <ProtectedRoute>
              <MySubmissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems/:id"
          element={
            <ProtectedRoute>
              <ProblemDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-problem"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminCreateProblem />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MainLayout>
  );
}

export default App;
