import { NavLink, Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { FiMenu, FiX, FiLogIn, FiUserPlus, FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../provider/AuthProvider';
import { FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);

  const handleLogout = () => {
    logOut().catch(() => {});
    setDropdownOpen(false);
  };

  const navLinks = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? 'text-red-600 font-semibold border-b-2 border-red-600' : 'hover:text-red-600'
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/donate-blood"
        className={({ isActive }) =>
          isActive ? 'text-red-600 font-semibold border-b-2 border-red-600' : 'hover:text-red-600'
        }
      >
        Donate Blood
      </NavLink>
      <NavLink
        to="/donation-requests"
        className={({ isActive }) =>
          isActive ? 'text-red-600 font-semibold border-b-2 border-red-600' : 'hover:text-red-600'
        }
      >
        Requests
      </NavLink>
      <NavLink
        to="/blogs"
        className={({ isActive }) =>
          isActive ? 'text-red-600 font-semibold border-b-2 border-red-600' : 'hover:text-red-600'
        }
      >
        Blog
      </NavLink>
      {user && (
        <NavLink
          to="/funding"
          className={({ isActive }) =>
            isActive ? 'text-red-600 font-semibold border-b-2 border-red-600' : 'hover:text-red-600'
          }
        >
          Funding
        </NavLink>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className='flex gap-3 items-center'>
          <Link to="/" className="text-2xl font-bold text-red-600">RedLife</Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks}
        </div>

        <div className="hidden md:flex items-center gap-4 relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2"
              >
                <img
                  src={user.photoURL || 'https://i.ibb.co/8d8hKt3/default-avatar.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <FaChevronDown className="text-gray-600" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-40 z-10">
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 text-red-600"
                  >
                    <FiLogOut className="inline-block mr-1" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="flex items-center text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 gap-1"
              >
                <FiLogIn />
                Login
              </Link>
              <Link
                to="/auth/register"
                className="flex items-center text-sm border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-50 gap-1"
              >
                <FiUserPlus />
                Register
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-white shadow">
          <div className="flex flex-col gap-2">{navLinks}</div>

          {user ? (
            <div className="flex flex-col gap-2 mt-3">
              <Link to="/dashboard" className="text-sm text-gray-700 hover:text-red-600">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 gap-1"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2 mt-3">
              <Link
                to="/auth/login"
                className="flex items-center text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 gap-1"
              >
                <FiLogIn />
                Login
              </Link>
              <Link
                to="/auth/register"
                className="flex items-center text-sm border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-50 gap-1"
              >
                <FiUserPlus />
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
