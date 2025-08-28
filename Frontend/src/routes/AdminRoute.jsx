import React,{useState,useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const admin = useSelector((state)=>state.adminAuth.admin);
  // console.log(admin);
  
  return admin ? <Outlet/> : <Navigate to="/admin/login" />;
}

export default AdminRoute; 