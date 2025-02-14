import { NavLink, useNavigate } from 'react-router-dom';
import { FaAirbnb, FaUser } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { useEffect, useRef, useState } from 'react';
import './Home.css';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from "../../store/session.js";
import { RiMenu3Line } from "react-icons/ri";
import ModalMenu from './ModalMenu.jsx';

const Home = ({ isUserRestored }) => {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const ulRef = useRef();
  
  const changeMenuBar = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  }
  
  const handleNewSpot = () => {
    navigate('/spots/new');
  }
  
  useEffect(() => {
    if (!showDropdown) return;

    const closeDropdown = () => {
      if (!ulRef.current.contains(event.target)) setShowDropdown(false);
    };

    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [showDropdown]);

  const closeDropdown = () => setShowDropdown(false);

  const signout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeDropdown();
    navigate('/');
  }

  const ulStyle = showDropdown ? "dropown-btn" : { display: 'none' };
  return (
    <IconContext.Provider value={{ className: 'react-wave-icon' }}>
      <div className='navigation-div'>
        <ul className='navigation-ul'>
          {/* Left side: Logo */}
          <li className='nav-logo'>
            <NavLink to='/' className='navigation-logo' style={{ color: '#ef4000' }}>
              <FaAirbnb size='1.2em' />airbnb
            </NavLink>
          </li>

          {/* Right side: Dropdown */}
          <div className='nav-button-div'>
          {sessionUser ? (
              <button 
                onClick={handleNewSpot}
                className='create-spot-button'
              >
                Create a New Spot
              </button>
            ) : (
              ''
            )}
            {isUserRestored && (
              <li>
                {/* <ProfileButton user={sessionUser} /> */}
                <button className="profile-button" onClick={changeMenuBar}>
                    <RiMenu3Line className="menu-button-icon" size={22} />
                    <FaUser className="profile-button-icon" size={22} />
                </button>
                <ul className={ulStyle} ref={ulRef}>
                    {sessionUser ? (
                    <>
                        <li className="dropdown-text">Hello, {sessionUser.firstName}</li>
                        <li className="dropdown-text">{sessionUser.email}</li>
                        <li className="manage-spot-button" onClick={() => navigate(`/spots/current`)}>
                            Manage Spots
                        </li>
                        <li>
                        <button className="logout-button" onClick={signout}>
                            Log Out
                        </button>
                        </li>
                    </>
                    ) : (
                    <>
                        <ModalMenu
                        itemText="Sign Up"
                        onItemClick={closeDropdown}
                        modalComponent={<SignupFormModal />}
                        />
                        <ModalMenu
                        itemText="Log In"
                        onItemClick={closeDropdown}
                        modalComponent={<LoginFormModal />}
                        />
                    </>
                    )}
                </ul>
              </li>
            )}
            {/* <div className='dropdown-container'>
              <button className='dropdown-button' onClick={() => setShowDropdown(!showDropdown)}>
                Menu
              </button>
              {showDropdown && (
                <ul className='dropdown-menu'>
                  {!sessionUser ? (
                    <>
                      <li>
                        <NavLink to='/login'>Login</NavLink>
                      </li>
                      <li>
                        <NavLink to='/signup'>Sign Up</NavLink>
                      </li>
                    </>
                  ) : (
                    <li>Welcome, {sessionUser.username}</li>
                  )}
                </ul>
              )}
            </div> */}
          </div>
        </ul>
      </div>
    </IconContext.Provider>
  );
};

export default Home;