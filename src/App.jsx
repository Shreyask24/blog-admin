import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import ForgotPassword from './screens/ForgotPassword';
import Profile from './screens/Profile';
import ResetPassword from './screens/ResetPassword';
import { useEffect, useState } from 'react';
import BlogList from './screens/BlogList';
import EditBlogs from './screens/EditBlogs';
import ChangePassword from './screens/ChangePassword';

function App() {
  const [token, setToken] = useState(!!localStorage.getItem('access_token'));

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setToken(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sign-up' element={<SignUp />} />
        {token ? (
          <Route path="/blogs" element={<BlogList />} />
        ) : (
          <Route path='/sign-in' element={<SignIn />} />
        )}
        <Route path="/blogs/:blogId" element={<EditBlogs />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='*' element={<Navigate to={token ? "/blogs" : "/sign-in"} />} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;
