import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth token or user data
    localStorage.removeItem('token'); // or sessionStorage.removeItem('token')
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className=" p-4 text-white flex justify-end">
      <button 
        onClick={handleLogout} 
        className="bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
