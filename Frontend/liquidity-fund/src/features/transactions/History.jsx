
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../lib/api';
import { Loader } from 'lucide-react';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('access');
      
      // Fetch payment history (rentals/deposits)
      const paymentsResponse = await fetch(`${API_BASE_URL}/api/payments/history/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });


      // Fetch withdrawal history
      const withdrawalsResponse = await fetch(`${API_BASE_URL}/api/withdraw/history/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!paymentsResponse.ok) {
        throw new Error('Failed to fetch payment history');
      }

      if (!withdrawalsResponse.ok) {
        throw new Error('Failed to fetch withdrawal history');
      }

      const paymentsData = await paymentsResponse.json();
      const withdrawalsData = await withdrawalsResponse.json();


      // Process payments data (exclude failed transactions)
      const paymentTransactions = paymentsData.payments
        ?.filter(payment => payment.status !== 'failed') // Exclude failed transactions
        .map(payment => ({
          id: `payment-${payment.id}`,
          type: 'Rental',
          amount: payment.amount_deducted,
          date: new Date(payment.created_at).toLocaleDateString(),
          method: 'M-Pesa',
          status: payment.status,
          currency: payment.currency,
          details: `${payment.currency} rental`
        })) || [];

      // Process withdrawals data (exclude failed transactions)
      const withdrawalTransactions = withdrawalsData
        .filter(withdrawal => withdrawal.status !== 'failed') // Exclude failed transactions
        .map(withdrawal => ({
          id: `withdrawal-${withdrawal.id}`,
          type: 'Withdrawal',
          amount: -withdrawal.amount, // Negative for withdrawals
          date: new Date(withdrawal.created_at).toLocaleDateString(),
          method: 'M-Pesa',
          status: withdrawal.status,
          details: `Withdrawal request`
        })) || [];

      // Combine and sort by date (newest first)
      const allTransactions = [...paymentTransactions, ...withdrawalTransactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      setError('Failed to load transaction history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 text-gray-800 dark:text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Transaction History</h1>
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-[#0F5D4E] mr-3" />
            <span className="text-gray-600">Loading transaction history...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 text-gray-800 dark:text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Transaction History</h1>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchTransactionHistory}
              className="px-6 py-3 bg-[#0A3D32] text-white rounded-xl font-medium hover:bg-[#0F5D4E] transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <button 
            onClick={fetchTransactionHistory}
            className="px-4 py-2 bg-[#0F5D4E] text-white rounded-lg hover:bg-[#0A3D32] transition-all text-sm"
          >
            Refresh
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No Transactions Yet</h3>
            <p className="text-gray-600">Your transaction history will appear here once you start using the platform.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gradient-to-r from-[#0A3D32] to-[#0F5D4E] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Amount (KES)</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-gray-900">{tx.date}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        tx.type === 'Rental' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {tx.details}
                      {tx.currency && tx.currency !== 'KES' && (
                        <span className="text-sm text-gray-500 ml-1">({tx.currency})</span>
                      )}
                    </td>
                    <td className={`px-4 py-4 font-semibold ${
                      tx.amount > 0 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {tx.amount > 0 ? '+' : ''}{Math.abs(tx.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        tx.status === 'completed' || tx.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : tx.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
