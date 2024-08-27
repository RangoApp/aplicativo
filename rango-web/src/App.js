import './App.css';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import Home from './pages/Home';
import {  useEffect, useState } from 'react';
import { auth } from './config/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import SignInPhonePage from './pages/SignInPhonePage';
import SignInEmailPage from './pages/SignInEmailPage';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth,user=> {
      if(user != null && user.emailVerified && user.phoneNumber != null) {
        setUser(user);
        navigate('/home')
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  },[auth, navigate]);

  const Loading = () => <div>Loading...</div>;
  if(isLoading) return <Loading />

  const ProtectedRoute = ({component: Component}) => {
    if(user!=null) return Component;
    return <Navigate to="/"/>
  };


  return (
    <Routes>
      <Route path='/' element={<SignInPage/>}/>
      <Route path='/entrar/:status' element={<SignInPage/>}/>
      <Route path='/entrar/celular' element={<SignInPhonePage/>}/>
      <Route path='/entrar/email' element={ <SignInEmailPage/>}/>
      <Route path='/home' element={<ProtectedRoute component={<Home />} />}/>
    </Routes>
  );
}

export default App;
