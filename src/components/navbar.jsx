import { NavLink, Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { FiMenu, FiX, FiLogIn, FiUserPlus, FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../provider/AuthProvider';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);

  const handleLogout = () => {
    logOut().catch(() => {});
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
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? 'text-red-600 font-semibold border-b-2 border-red-600' : 'hover:text-red-600'
        }
      >
        Dashboard
      </NavLink>
    </>
  );

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className='flex gap-3 items-center'>
          {/* <img src="" alt="RedLife" className="w-10 h-auto" /> */}
          <Link to="/" className="text-2xl font-bold text-red-600">RedLife</Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <img
                src={user.photoURL || 'https://i.ibb.co/8d8hKt3/default-avatar.png'}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <button
                onClick={handleLogout}
                className="flex items-center text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 gap-1"
              >
                <FiLogOut />
                Logout
              </button>
            </>
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
            <div className="flex items-center gap-2 mt-3">
              <img
                src={user.photoURL || 'https://i.ibb.co/8d8hKt3/default-avatar.png'}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
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
