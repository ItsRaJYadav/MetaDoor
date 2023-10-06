import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiMenu } from 'react-icons/fi';
import { HiHome, HiUserCircle } from 'react-icons/hi';
import { SiAboutdotme } from 'react-icons/si';
import { PiTextTThin } from 'react-icons/pi';
import { GiFamilyHouse } from 'react-icons/gi';
import { FaSignInAlt, FaSearch } from 'react-icons/fa';
import { MdLogin, MdOutlineAddCircle } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserFailure, deleteUserSuccess, signOutUserStart } from '../redux/user/userSlice';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const userId = currentUser?._id;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="bg-gray-200 text-gray-900">
      <nav className="container mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-between">
          <Link to="/">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
              <span className="text-slate-500">MetaDoor:</span>
              <span className="text-slate-700">Real Estate</span>
            </h1>
          </Link>
          <div className="flex items-center flex-grow justify-center md:justify-start md:ml-2 lg:ml-72">
            <form
              onSubmit={handleSubmit}
              className="bg-slate-100 p-3 rounded-lg flex items-center w-full md:w-64"
            >
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent focus:outline-none w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button>
                <FaSearch className="text-slate-600" />
              </button>
            </form>
          </div>
          <div className="md:hidden ml-4">
            <button
              className="text-gray-900 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
            </button>
          </div>
        </div>
        <ul className="flex gap-4 md:ml-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          {currentUser ? (
            <>
              <Link
                to="/profile"
                className="hidden sm:inline text-slate-700 hover:underline"
              >
                Profile
              </Link>
              <Link
                to={`/mylistings/${userId}`}
                className="hidden sm:inline text-slate-700 hover:underline"
              >
                My Listings
              </Link>
            </>
          ) : (
            <Link to="/sign-in">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Sign in
              </li>
            </Link>
          )}
        </ul>
        {isMobileMenuOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black z-40 backdrop-filter backdrop-blur-lg bg-opacity-70" />
        )}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-gray-200 transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } z-50`}
        >
          <button
            className="text-gray-900 absolute top-4 right-4 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <FiX size={35} />
          </button>
          <ul className="flex flex-col items-start space-y-4 mt-8 p-4">

            <li className="flex items-center">
              <HiHome size={18} className="mr-5" />
              <Link to="/" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <SiAboutdotme size={18} className="mr-5" />
              <Link to="/about" onClick={closeMobileMenu}>
                About
              </Link>
            </li>
            {currentUser && (
              <>
                <li className="flex items-center">
                  <HiUserCircle size={18} className="mr-5" />
                  <Link to="/profile" onClick={closeMobileMenu}>
                    Profile
                  </Link>
                </li>
                <li className="flex items-center">
                  <GiFamilyHouse size={18} className="mr-5" />
                  <Link to={`/mylistings/${userId}`} onClick={closeMobileMenu}>
                    My Listings
                  </Link>
                </li>

                <li className="flex items-center">
                  <MdOutlineAddCircle size={18} className="mr-5" />
                  <Link to={`/create-listing`} onClick={closeMobileMenu}>
                    Add Property
                  </Link>
                </li>
                <li className="flex items-center">
                  <MdLogin size={18} className="mr-5" />
                  <button onClick={handleSignOut}>Logout</button>
                </li>
              </>
            )}
            {!currentUser && (
              <li className="flex items-center">
                <FaSignInAlt size={18} className="mr-5" />
                <Link to="/sign-in" onClick={closeMobileMenu}>
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
