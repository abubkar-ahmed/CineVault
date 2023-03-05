import React, { useContext, useEffect, useRef, useState } from 'react';
import HomeSvg from './svg/HomeSvg';
import Logo from './svg/Logo';
import MoveiesSvg from './svg/MoviesSvg';
import TvSvg from './svg/TvSvg';
import BookMarksSvg from './svg/BookMarksSvg';
import userImg from '../assets/user.png'
import { Link, NavLink, useLocation } from 'react-router-dom';
import 'animate.css';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const {user , isLoggedIn , logout} = useContext(AuthContext);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showAuthNav , setShowAuthNav] = useState(false);
  const currentLocation = useLocation();
  const authRef = useRef(null)
  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const authControlsHandler = () => {
    if(showAuthNav){
      if(screenWidth > 1024){
        authRef.current.classList.add('animate__backOutLeft')
      }else{
        authRef.current.classList.add('animate__backOutUp')
      }
      setTimeout(() => {
        setShowAuthNav(false)
      }, 500);
    }else{
      setShowAuthNav(true);
    }
  }

  useEffect(() => {
    if(showAuthNav){
      authControlsHandler();
    }
  },[currentLocation]);

  const logoutHandler = async () => {
    const logOut = await logout();
    if(logOut){
      setShowAuthNav(false);
    }
  }



  return (
    <header className='header'>
      <Link to='/'><Logo /></Link>
      <ul className='nav-ul'>
        <li>
          <NavLink to='/' title='Home'>
            <HomeSvg />
            {/* <span>Home</span> */}
          </NavLink>
        </li>
        <li>
          <NavLink to='/movies' title='Movies'>
            <MoveiesSvg/>
            {/* <span>Movies</span> */}
          </NavLink>
        </li>
        <li>
          <NavLink to='/tv' title='Tv Series'>
            <TvSvg/>
            {/* <span>Tv Series</span> */}
          </NavLink>
        </li>
        {isLoggedIn && (
        <li>
          <NavLink to='/bookmarks' title='Bookmarks'>
            <BookMarksSvg/>
          </NavLink>
        </li>
        )}
      </ul>
      <img src={user?.image ? user?.image : userImg}  alt="user-img" onClick={authControlsHandler}/>
      {showAuthNav && (
        <div className={screenWidth > 1024 ? 'animate__animated animate__backInLeft header-auth-controls' : 'animate__animated animate__backInDown header-auth-controls'} ref={authRef}>
            {isLoggedIn ? (
              <ul className='user-ul'>
                <li className='logout' onClick={logoutHandler}>Logout</li>
              </ul>
              ):(
              <ul>
                <li><Link to='/login' >Login</Link></li>
                <li><Link to='/register'>Sign Up</Link></li>
              </ul>
            )}
        </div>
      )}

    </header>
  )
}

export default Header