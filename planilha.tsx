import React, { useState } from 'react';
import { PieChart, Wallet, ArrowUpCircle, ArrowDownCircle, Target, DollarSign, Plus, Pencil, Trash2, Save } from 'lucide-react';

type Transaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  paymentMethod: string;
  type: 'income' | 'expense';
};

type TransactionFormData = Omit<Transaction, 'id'>;

type FinancialGoals = {
  savingsGoal: number;
  totalIncome: number;
  totalExpenses: number;
};

const initialTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-03-01',
    description: 'Salário',
    category: 'Trabalho',
    amount: 5000,
    paymentMethod: 'Transferência Bancária',
    type: 'income'
  },
  {
    id: '2',
    date: '2024-03-02',
    description: 'Supermercado',
    category: 'Alimentação',
    amount: 350,
    paymentMethod: 'Cartão de Débito',
    type: 'expense'
  },
  {
    id: '3',
    date: '2024-03-03',
    description: 'Restaurante',
    category: 'Lazer',
    amount: 120,
    paymentMethod: 'Dinheiro',
    type: 'expense'
  }
];

const initialGoals: FinancialGoals = {
  savingsGoal: 2000,
  totalIncome: 0,
  totalExpenses: 0
};

const emptyFormData: TransactionFormData = {
  date: '',
  description: '',
  category: '',
  amount: 0,
  paymentMethod: '',
  type: 'expense'
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TransactionFormData>(emptyFormData);
  const [goals, setGoals] = useState<FinancialGoals>(initialGoals);
  const [editingGoals, setEditingGoals] = useState(false);
  const [editingIncome, setEditingIncome] = useState(false);
  const [editingExpenses, setEditingExpenses] = useState(false);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const progress = (balance / goals.savingsGoal) * 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleGoalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGoals(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setTransactions(prev =>
        prev.map(t => t.id === editingId ? { ...formData, id: editingId } : t)
      );
    } else {
      const newTransaction: Transaction = {
        ...formData,
        id: Date.now().toString()
      };
      setTransactions(prev => [...prev, newTransaction]);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyFormData);
  };

  const handleEdit = (transaction: Transaction) => {
    setFormData(transaction);
    setEditingId(transaction.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleManualUpdate = (type: 'income' | 'expenses', value: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description: type === 'income' ? 'Ajuste Manual de Receita' : 'Ajuste Manual de Despesa',
      category: 'Ajuste Manual',
      amount: Math.abs(value - (type === 'income' ? totalIncome : totalExpenses)),
      paymentMethod: 'Ajuste Manual',
      type: type === 'income' ? 'income' : 'expense'
    };
    setTransactions(prev => [...prev, newTransaction]);
    if (type === 'income') setEditingIncome(false);
    else setEditingExpenses(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 text-center">
            Controle Financeiro Pessoal
          </h1>
          <p className="text-center text-gray-600 italic mt-2">
            Organize suas finanças com estilo e precisão
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Receita Total</h2>
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="h-6 w-6 text-green-500" />
                <button
                  onClick={() => setEditingIncome(!editingIncome)}
                  className="text-green-500 hover:text-green-700"
                >
                  {editingIncome ? <Save className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {editingIncome ? (
              <div className="mt-2">
                <input
                  type="number"
                  value={goals.totalIncome}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setGoals(prev => ({ ...prev, totalIncome: value }));
                  }}
                  onBlur={() => handleManualUpdate('income', goals.totalIncome)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  min="0"
                  step="0.01"
                />
              </div>
            ) : (
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                R$ {totalIncome.toLocaleString()}
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Despesas Totais</h2>
              <div className="flex items-center gap-2">
                <ArrowDownCircle className="h-6 w-6 text-red-500" />
                <button
                  onClick={() => setEditingExpenses(!editingExpenses)}
                  className="text-red-500 hover:text-red-700"
                >
                  {editingExpenses ? <Save className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {editingExpenses ? (
              <div className="mt-2">
                <input
                  type="number"
                  value={goals.totalExpenses}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setGoals(prev => ({ ...prev, totalExpenses: value }));
                  }}
                  onBlur={() => handleManualUpdate('expenses', goals.totalExpenses)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                  min="0"
                  step="0.01"
                />
              </div>
            ) : (
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                R$ {totalExpenses.toLocaleString()}
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Saldo Atual</h2>
              <Wallet className="h-6 w-6 text-blue-500" />
            </div>
            <p className={`mt-2 text-3xl font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {balance.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Meta de Economia</h2>
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-purple-500" />
                <button
                  onClick={() => setEditingGoals(!editingGoals)}
                  className="text-purple-500 hover:text-purple-700"
                >
                  {editingGoals ? <Save className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {editingGoals ? (
              <div className="mt-2">
                <input
                  type="number"
                  name="savingsGoal"
                  value={goals.savingsGoal}
                  onChange={handleGoalsChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                  min="0"
                  step="100"
                />
              </div>
            ) : (
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                R$ {goals.savingsGoal.toLocaleString()}
              </p>
            )}
            <div className="mt-4 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-purple-500 rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Transaction Form */}
        <div className="mb-8">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Nova Transação
            </button>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                {editingId ? 'Editar Transação' : 'Nova Transação'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoria</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Método de Pagamento</label>
                  <input
                    type="text"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="expense">Despesa</option>
                    <option value="income">Receita</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingId ? 'Atualizar' : 'Adicionar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData(emptyFormData);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900">Transações Recentes</h2>
              <PieChart className="h-6 w-6 text-gray-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método de Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.category}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Tips */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-gray-900">Dicas Financeiras</h2>
            <DollarSign className="h-6 w-6 text-yellow-500" />
          </div>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Revise suas assinaturas regularmente para evitar gastos desnecessários
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Separe pelo menos 20% da sua renda para poupança e investimentos
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Acompanhe seus gastos diários para identificar áreas onde pode economizar
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
