import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom'; // <-- importar aqui
import { Bar, Doughnut } from 'react-chartjs-2'
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
    const navigate = useNavigate(); // <-- inicializar aqui

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

    const quantidadeVinis = usuario?.vinis?.length || 0;
    const valorTotal = usuario?.vinis?.reduce((acc, v) => acc + (v.preco || 0), 0) || 0;
    // Distribuição por artista
    const artistas = usuario?.vinis?.reduce((acc, v) => {
        acc[v.artista] = (acc[v.artista] || 0) + 1;
        return acc;
    }, {});

    const dataArtistas = {
        labels: Object.keys(artistas || {}),
        datasets: [{
            label: 'Quantidade por artista',
            data: Object.values(artistas || {}),
            backgroundColor: ['#a78bfa', '#34d399', '#f87171', '#60a5fa', '#fbbf24']
        }]
    };

    // Distribuição de valor por artista
    const valores = usuario?.vinis?.reduce((acc, v) => {
        acc[v.artista] = (acc[v.artista] || 0) + v.preco;
        return acc;
    }, {});

    const dataValores = {
        labels: Object.keys(valores || {}),
        datasets: [{
            label: 'Valor por artista',
            data: Object.values(valores || {}),
            backgroundColor: ['#f472b6', '#22d3ee', '#4ade80', '#facc15', '#c084fc']
        }]
    };


    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            {/* Botão de voltar */}
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
                <p><strong>Valor total da coleção:</strong> R${valorTotal}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-purple-600 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Quantidade de Vinis</h3>
                    <p className="text-2xl">{quantidadeVinis}</p>
                </div>

                <div className="bg-green-600 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Valor Total</h3>
                    <p className="text-2xl">R${valorTotal}</p>
                </div>

                <div className="bg-blue-600 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Artista mais frequente</h3>
                    <p className="text-xl">
                        {usuario?.vinis?.length
                            ? (() => {
                                const contagem = usuario.vinis.reduce((acc, v) => {
                                    acc[v.artista] = (acc[v.artista] || 0) + 1;
                                    return acc;
                                }, {});
                                const [artistaMaisFrequente] = Object.entries(contagem)
                                    .reduce((a, b) => (a[1] > b[1] ? a : b));
                                return artistaMaisFrequente;
                            })()
                            : 'Nenhum'}


                    </p>
                </div>

                <div className="bg-red-600 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Disco mais caro</h3>
                    <p className="text-xl">
                        {usuario?.vinis?.length
                            ? usuario.vinis.reduce((max, v) => v.preco > max.preco ? v : max).nome
                            : 'Nenhum'}
                    </p>
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
                onClick={async () => {
                    const usuarioId = usuario?.id
                    if (usuarioId) {
                        const linkPublico = `${window.location.origin}/public/${usuarioId}`
                        alert(`Link da coleção: ${linkPublico}`)
                    }
                }}
            >
                Compartilhar coleção com amigos
            </button>



        </div>
    );
}
