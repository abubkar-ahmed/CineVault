import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'

function ProtectedRoutesAuth() {
    const {isLoggedIn} = useContext(AuthContext);
  return (
    <>
        {!isLoggedIn ? (<Outlet/>) : (<Navigate to='/'/>)}
    </>
  )
}

export default ProtectedRoutesAuth