import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import VerifyEmail from './screens/VerifyEmail';
import ForgotPassword from './screens/ForgotPassword';
import Profile from './screens/Profile';
import ResetPassword from './screens/ResetPassword';
import { useEffect, useState } from 'react';

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
          <Route path='/blogs' element={<Home />} />
        ) : (
          <Route path='/sign-in' element={<SignIn />} />
        )}
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='*' element={<Navigate to={token ? "/blogs" : "/sign-in"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;