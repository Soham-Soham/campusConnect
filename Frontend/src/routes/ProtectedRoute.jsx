import React from 'react';
import {useSelector} from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const user = useSelector((state)=> state.auth.user);
  // console.log(user);
  
  return user && (user.role == 'Student'||user.role == 'Teacher') ? <Outlet/> : <Navigate to="/login" />;
}

export default ProtectedRoute; 