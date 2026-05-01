import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Colecao from './pages/Colecao';
import PrivateRoute from './components/PrivativeRoute';
import Perfil from './pages/Perfil';
import PublicColecao from './pages/PublicColecao';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/colecao" element={<PrivateRoute><Colecao /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/public/:id" element={<PublicColecao />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
