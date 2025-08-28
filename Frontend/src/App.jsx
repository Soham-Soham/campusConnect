import {BrowserRouter,Routes,Route} from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import ForgotPasswordPage from './Pages/ForgotPasswordPage';
import ResetPasswordPage from './Pages/ResetPasswordPage';
import UserDashboard from './layout/UserDashboard';
import AdminDashboard from './layout/AdminDashboard';
import AdminLoginPage from './Pages/AdminLoginPage';
import VerifyEmailPage from './Pages/VerifyEmailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/forgot-password' element={<ForgotPasswordPage/>} />
        <Route path='/reset-password/:token' element={<ResetPasswordPage/>} />
        <Route path='/admin/login' element={<AdminLoginPage/>} />

        <Route element={<ProtectedRoute/>}>
          <Route path='/dashboard' element={<UserDashboard/>} />
        </Route>
        <Route element={<AdminRoute/>} >
          <Route path='/admin/dashboard' element={<AdminDashboard/>} />
        </Route>

        <Route path='/verify-email/:token' element={<VerifyEmailPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
