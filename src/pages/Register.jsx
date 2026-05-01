import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleCadastro(e) {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/register`, { email, nome, senha });
      setMessage('Cadastro realizado com sucesso!');
      setError('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro no cadastro');
      setMessage('');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">Cadastro</h2>
        
        <form onSubmit={handleCadastro} className="space-y-4">
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
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
            Cadastrar
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
          Já tem conta?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-purple-400 hover:underline"
          >
            Faça login
          </button>
        </p>
      </div>
    </div>
  );
}
