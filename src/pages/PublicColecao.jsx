import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';

export default function PublicColecao() {
  const { id } = useParams(); // pega o id da URL
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function carregarColecao() {
      try {
        const response = await api.get(`/public/${id}`);
        setUsuario(response.data);
      } catch (err) {
        setError('Erro ao carregar coleção pública');
      } finally {
        setLoading(false);
      }
    }
    carregarColecao();
  }, [id]);

  if (loading) return <p className="text-gray-400">Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-4">
        Coleção de {usuario?.nome}
      </h1>
      <p className="text-gray-400 mb-6">
        Email de contato: {usuario?.email}
      </p>

      <ul className="space-y-2">
        {usuario?.produtos?.map(produto => (
          <li key={produto.id} className="flex justify-between items-center bg-gray-800 p-3 rounded">
            <span>{produto.nome} - {produto.artista} - R${produto.preco}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
