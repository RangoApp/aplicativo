import './App.css';
import { Route, Routes } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import Home from './pages/Home';
import SignInPhonePage from './pages/SignInPhonePage';
import SignInEmailPage from './pages/SignInEmailPage';
import DadosDeContato from './pages/DadosDeContato';
import EditarCadastro from './pages/EditarCadastro';
import EditarInformacoesPessoais from './pages/InformacoesPessoais';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignInRoute from './components/SignInRoute';
import { UserProvider } from './components/UserProvider';
import ListaRestaurantes from './pages/ListaRestaurantes';
import Restaurante from './pages/Restaurante';
import Admin from './pages/Admin';
import FinalizarPedido from './pages/FinalizarPedido';
import Acompanhamento from './pages/Acompanhamento';
import CartaoCadastro from './pages/CartaoCadastro';

function App() {
  return (
    <>
    <AuthProvider>
      <UserProvider>
      <Routes>
        <Route path='/' element={<SignInRoute component={<SignInPage/>} restricted={true} />}/>
        <Route path='/entrar/:status' element={<SignInRoute component={<SignInPage/>} restricted={true} />}/>
        <Route path='/entrar/celular' element={<SignInRoute component={<SignInPhonePage/>} restricted={true} />}/>
        <Route path='/entrar/email' element={<SignInRoute component={<SignInEmailPage/>} restricted={true} />}/>
        <Route path='/restaurantes' element={<ProtectedRoute component={<ListaRestaurantes />} />} />
        <Route path='/minha-conta/dados-contato' element={<ProtectedRoute component={<DadosDeContato/>}/>}/>
        <Route path='/minha-conta/dados-cadastrais' element={<ProtectedRoute component={ <EditarCadastro/>}/>}/>
        <Route path='/minha-conta/informacao-pessoais' element={<ProtectedRoute component={ <EditarInformacoesPessoais/>}/>}/>
        <Route path='/home' element={<ProtectedRoute component={<ListaRestaurantes />} />}/>
        <Route path='/restaurante/:id' element={<ProtectedRoute component={<Restaurante />} />}/>
        <Route path='/admin' element={<Admin />}/>
        <Route path='/pedido/finalizar' element={<ProtectedRoute component={<FinalizarPedido />}/>} />
        <Route path='/pedido/acompanhamento/:pedido' element={<ProtectedRoute component={<Acompanhamento/>}/>} />
        <Route path='/cartao' element={<ProtectedRoute component={<CartaoCadastro />}/>}/>

      </Routes>
      </UserProvider>
    </AuthProvider>
    </>
  );
}

export default App;
