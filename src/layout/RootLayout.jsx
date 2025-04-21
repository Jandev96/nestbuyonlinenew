import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/user/Header';
import Footer from '../components/user/Footer';
import UserHeader from '../components/user/UserHeader';
import { useSelector, useDispatch } from 'react-redux';
import { axiosInstance } from '../config/axiosInstance';
import { saveUser, clearUser } from '../redux/slices/userSlice';

export const RootLayout = () => {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();

  const checkUser = async () => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: '/user/checkuser',
        withCredentials: true,
      });

      console.log(response, '========checkUser response');

      if (response.status === 200) {
        dispatch(saveUser({ isUserAuth: true }));
      } else {
        dispatch(clearUser());
      }
    } catch (error) {
      console.log(error);
      dispatch(clearUser());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, [location.pathname]);
 

  return isLoading ? null : (
    <div>
      {user.isUserAuth ? <UserHeader />:<Header />}
      <div className="min-h-96">
       
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
