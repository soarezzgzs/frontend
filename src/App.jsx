import { useEffect, useState } from 'react';
import api from './services/api';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [artista, setArtista] = useState('');
  const [preco, setPreco] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    const response = await api.get('/vinis?page=1&limit=5');
    setProdutos(response.data.data);
  }

  async function adicionarOuEditarProduto(e) {
    e.preventDefault();

    if (editandoId) {
      // EDITAR
      await api.put(`/vinis/${editandoId}`, { nome, artista, preco });
      setEditandoId(null);
    } else {
      // ADICIONAR
      await api.post('/vinis', { nome, artista, preco });
    }

    setNome('');
    setArtista('');
    setPreco('');
    carregarProdutos();
  }

  async function excluirProduto(id) {
    await api.delete(`/vinis/${id}`);
    carregarProdutos();
  }

  function iniciarEdicao(produto) {
    setEditandoId(produto.id);
    setNome(produto.nome);
    setArtista(produto.artista);
    setPreco(produto.preco);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
  <h1 className="text-4xl font-bold text-purple-500 mb-6">Meus Vinis 🎵</h1>

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

  <ul className="space-y-2">
    {produtos.map(produto => (
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

export default App;
