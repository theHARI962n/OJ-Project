import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProblemDetail from './pages/ProblemDetail';
import AdminDashboard from './components/admin/AdminDashboard';
import ProblemList from './components/admin/ProblemList';
import CreateProblem from './components/admin/CreateProblem';
import EditProblem from './components/admin/EditProblem';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import MySubmissions from './pages/MySubmissions';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/problems/:id" element={<ProblemDetail />} />
      <Route path="/mine" element={<MySubmissions />} />
      <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
      <Route path="/admin/problems" element={<ProtectedAdminRoute><ProblemList /></ProtectedAdminRoute>} />
      <Route path="/admin/problems/create" element={<ProtectedAdminRoute><CreateProblem /></ProtectedAdminRoute>} />
      <Route path="/admin/problems/edit/:id" element={<ProtectedAdminRoute><EditProblem /></ProtectedAdminRoute>} />
    </Routes>
  );
}

export default App;
