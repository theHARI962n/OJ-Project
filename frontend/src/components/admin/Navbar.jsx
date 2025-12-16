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
    <nav className=" p-4 text-white flex justify-end w-full max-w-5xl mx-auto">
      <button 
        onClick={handleLogout} 
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
