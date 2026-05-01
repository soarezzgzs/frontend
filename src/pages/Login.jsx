import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        { email, senha }
      );

      // salva token no localStorage
      localStorage.setItem('token', response.data.token);

      setMessage('Login realizado com sucesso!');
      setError('');
      // redireciona para coleção
      setTimeout(() => navigate('/colecao'), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro no login');
      setMessage('');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white font-semibold transition-colors"
          >
            Entrar
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 rounded bg-green-700 text-white text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 rounded bg-red-700 text-white text-center">
            {error}
          </div>
        )}

        <p className="mt-6 text-gray-400 text-center">
          Não tem conta?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-purple-400 hover:underline"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
}
