import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Registrar os componentes necessários
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const response = await api.get('/me'); // backend deve retornar nome, email, vinis
        setUsuario(response.data);
      } catch (err) {
        setError('Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    }
    carregarPerfil();
  }, []);

  if (loading) return <p className="text-gray-400">Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const vinis = usuario?.vinis || [];
  const quantidadeVinis = vinis.length;
  const valorTotal = vinis.reduce((acc, v) => acc + Number(v.preco || 0), 0);

  // Distribuição por artista (quantidade)
  const artistas = vinis.reduce((acc, v) => {
    acc[v.artista] = (acc[v.artista] || 0) + 1;
    return acc;
  }, {});

  const coresArtistas = ['#a78bfa', '#34d399', '#f87171', '#60a5fa', '#fbbf24'];

  const dataArtistas = {
    labels: Object.keys(artistas),
    datasets: Object.entries(artistas).map(([artista, qtd], i) => ({
      label: artista,
      data: [qtd],
      backgroundColor: coresArtistas[i % coresArtistas.length]
    }))
  };

  // Distribuição de valor por artista
  const valores = vinis.reduce((acc, v) => {
    acc[v.artista] = (acc[v.artista] || 0) + Number(v.preco || 0);
    return acc;
  }, {});

  const coresValores = ['#f472b6', '#22d3ee', '#4ade80', '#facc15', '#c084fc'];

  const dataValores = {
    labels: Object.keys(valores),
    datasets: Object.entries(valores).map(([artista, valor], i) => ({
      label: artista,
      data: [valor],
      backgroundColor: coresValores[i % coresValores.length]
    }))
  };

  // Artista mais frequente
  const artistaMaisFrequente = quantidadeVinis
    ? Object.entries(artistas).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
    : 'Nenhum';

  // Disco mais caro
  const discoMaisCaro = quantidadeVinis
    ? vinis.reduce((max, v) => Number(v.preco) > Number(max.preco) ? v : max).nome
    : 'Nenhum';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => navigate('/colecao')}
      >
        Voltar para Coleção
      </button>

      <h1 className="text-3xl font-bold text-purple-400 mb-4">Perfil</h1>
      <div className="space-y-2 bg-gray-800 p-4 rounded-lg shadow-md">
        <p><strong>Nome:</strong> {usuario?.nome}</p>
        <p><strong>Email:</strong> {usuario?.email}</p>
        <p><strong>Quantidade de vinis:</strong> {quantidadeVinis}</p>
        <p><strong>Valor total da coleção:</strong> R${valorTotal.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-purple-600 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Quantidade de Vinis</h3>
          <p className="text-2xl">{quantidadeVinis}</p>
        </div>

        <div className="bg-green-600 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Valor Total</h3>
          <p className="text-2xl">R${valorTotal.toFixed(2)}</p>
        </div>

        <div className="bg-blue-600 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Artista mais frequente</h3>
          <p className="text-xl">{artistaMaisFrequente}</p>
        </div>

        <div className="bg-red-600 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Disco mais caro</h3>
          <p className="text-xl">{discoMaisCaro}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Distribuição por Artista</h3>
            <Bar data={dataArtistas} />
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Valor por Artista</h3>
            <Doughnut data={dataValores} />
          </div>
        </div>
      </div>

      <button
        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded mt-6"
        onClick={() => {
          const usuarioId = usuario?.id;
          if (usuarioId) {
            const linkPublico = `${window.location.origin}/public/${usuarioId}`;
            alert(`Link da coleção: ${linkPublico}`);
          }
        }}
      >
        Compartilhar coleção com amigos
      </button>
    </div>
  );
}
