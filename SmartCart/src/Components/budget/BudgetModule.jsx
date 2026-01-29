import React from 'react';
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '../scanner/ScanInterface';

export default function BudgetModule({
  showBudgetDialog,
  budgetInput,
  setBudgetInput,
  onBudgetSubmit,
  setAlertDialog
}) {
  const handleBudgetSubmit = () => {
    const budgetValue = parseFloat(budgetInput);
    
    // Validation: check if input is empty
    if (!budgetInput.trim()) {
      setAlertDialog({
        show: true,
        title: 'Invalid Input',
        message: 'Please enter a budget amount.',
        onConfirm: () => setAlertDialog({ show: false, title: '', message: '', onConfirm: null, onCancel: null, type: 'confirm' }),
        type: 'info'
      });
      return;
    }

    // Validation: check if input is not a valid number or is zero
    if (isNaN(budgetValue) || budgetValue <= 0) {
      setAlertDialog({
        show: true,
        title: 'Invalid Budget',
        message: 'Please enter a valid amount greater than zero.',
        onConfirm: () => setAlertDialog({ show: false, title: '', message: '', onConfirm: null, onCancel: null, type: 'confirm' }),
        type: 'info'
      });
      return;
    }

    onBudgetSubmit(budgetValue);
  };

  if (!showBudgetDialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Set Your Budget</h3>
          <p className="text-gray-600">Enter your shopping budget to track your spending</p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget Amount (Rs)</label>
          <input
            type="text"
            inputMode="decimal"
            value={budgetInput}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setBudgetInput(value);
              }
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleBudgetSubmit()}
            placeholder="Enter amount"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            autoFocus
          />
        </div>

        <button
          onClick={handleBudgetSubmit}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
}
  