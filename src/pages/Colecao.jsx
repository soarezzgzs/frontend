import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom';

function Colecao() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [artista, setArtista] = useState('');
  const [preco, setPreco] = useState('');
  const [message, setMessage] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('nome');

  const navigate = useNavigate();

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const response = await api.get('/vinis?page=1&limit=20');
      setProdutos(response.data.data);
    } catch (err) {
      setMessage('Erro ao carregar vinis');
    }
  }

  async function adicionarOuEditarProduto(e) {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/vinis/${editandoId}`, { nome, artista, preco });
        setMessage('Vinil atualizado com sucesso!');
        setEditandoId(null);
      } else {
        await api.post('/vinis', { nome, artista, preco });
        setMessage('Vinil adicionado com sucesso!');
      }

      setNome('');
      setArtista('');
      setPreco('');
      carregarProdutos();
    } catch (error) {
      setMessage('Erro ao salvar vinil');
    }
  }

  async function excluirProduto(id) {
    try {
      await api.delete(`/vinis/${id}`);
      setMessage('Disco excluído com sucesso!');
      carregarProdutos();
    } catch {
      setMessage('Erro ao excluir vinil');
    }
  }

  function iniciarEdicao(produto) {
    setEditandoId(produto.id);
    setNome(produto.nome);
    setArtista(produto.artista);
    setPreco(produto.preco);
  }

  // 🔎 Busca
  const vinisFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.artista.toLowerCase().includes(busca.toLowerCase())
  );

  // 📑 Ordenação
  const vinisOrdenados = [...vinisFiltrados].sort((a, b) => {
    if (ordenacao === 'preco') return a.preco - b.preco;
    if (ordenacao === 'artista') return a.artista.localeCompare(b.artista);
    return a.nome.localeCompare(b.nome);
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <span>
        <button
          className="bg-red-500 text-white p-1 w-12 rounded cursor-pointer"
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          Sair
        </button>
      </span>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white p-1 ml-4 rounded mr-2"
        onClick={() => navigate('/perfil')}
      >
        Ver Perfil
      </button>


      <h1 className="text-4xl font-bold text-purple-500 mb-6">Meus Vinis 🎵</h1>
      <p className="text-gray-400 mb-4">Gerencie sua coleção de discos favoritos</p>

      {/* 🔎 Campo de busca */}
      <input
        type="text"
        placeholder="Buscar vinil..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-4"
      />

      {/* 📑 Ordenação */}
      <select
        value={ordenacao}
        onChange={(e) => setOrdenacao(e.target.value)}
        className="p-2 rounded bg-gray-800 border border-gray-700 mb-6"
      >
        <option value="nome">Ordenar por Nome</option>
        <option value="artista">Ordenar por Artista</option>
        <option value="preco">Ordenar por Preço</option>
      </select>

      {/* Formulário */}
      <form onSubmit={adicionarOuEditarProduto} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Nome do disco"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        <input
          type="text"
          placeholder="Artista"
          value={artista}
          onChange={e => setArtista(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        <input
          type="number"
          placeholder="Preço"
          value={preco}
          onChange={e => setPreco(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white font-semibold"
        >
          {editandoId ? 'Salvar edição' : 'Adicionar'}
        </button>
      </form>

      {message && (
        <p className={`mb-4 ${message.includes('sucesso') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}

      {/* Lista */}
      <ul className="space-y-2">
        {vinisOrdenados.map(produto => (
          <li key={produto.id} className="flex justify-between items-center bg-gray-800 p-3 rounded">
            <span>{produto.nome} - {produto.artista} - R${produto.preco}</span>
            <div className="space-x-2">
              <button
                onClick={() => iniciarEdicao(produto)}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => excluirProduto(produto.id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Colecao;
