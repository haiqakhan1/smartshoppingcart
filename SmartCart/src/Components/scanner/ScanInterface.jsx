import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import CameraScanner from './CameraScanner';
import BudgetModule from '../budget/BudgetModule';
import CartModule from '../cart/CartModule';
import RecommendationModule from '../ai/RecommendationModule';

// Format the currency in Rs format
export function formatCurrency(amount) {
  return 'Rs ' + amount.toFixed(2);
}

export default function ScanInterface() {
  const [useCamera, setUseCamera] = useState(false);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState({ type: 'info', text: 'Ready to scan' });
  const [scanPulse, setScanPulse] = useState(false);
  const [alertDialog, setAlertDialog] = useState({ show: false, title: '', message: '', onConfirm: null, onCancel: null, type: 'confirm' });
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Budget states
  const [budget, setBudget] = useState(null);
  const [budgetInput, setBudgetInput] = useState('');
  const [showBudgetDialog, setShowBudgetDialog] = useState(true);
  const [budgetExceededWarningShown, setBudgetExceededWarningShown] = useState(false);
  const [scanningLocked, setScanningLocked] = useState(false);

  // Ref for hidden input where scanner types barcode
  const barcodeInputRef = useRef(null);
  // Ref for beep sound
  const beepSound = useRef(null);

  useEffect(() => {
    beepSound.current = new Audio('/sounds/beep.wav');
  }, []);
  
  // Auto-focus on hidden input so barcode scanner works without clicking
  useEffect(() => {
    if (showBudgetDialog || alertDialog.show) return;
  
    const input = barcodeInputRef.current;
    if (input) input.focus();
  
    const handleFocus = () => {
      if (showBudgetDialog || alertDialog.show) return;
      input && input.focus();
    };
    window.addEventListener('click', handleFocus);
    return () => window.removeEventListener('click', handleFocus);
  }, [showBudgetDialog, alertDialog.show]);

  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const itemCount = cart.reduce((sum, p) => sum + p.qty, 0);

  // Fetch recommendations
  const fetchRecommendations = async () => {
    const allRecommendations = [];
    
    for (const item of cart) {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/recommend/${item.category}/${item.subcategory}/${item.price}`);
        if (res.ok) {
          const data = await res.json();
          allRecommendations.push(...data.map(rec => ({
            ...rec,
            originalItem: item.name,
            savings: item.price - rec.price
          })));
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      }
    }
    
    setRecommendations(allRecommendations);
    if (allRecommendations.length > 0) {
      setShowRecommendations(true);
    }
  };

  // Check budget status and show appropriate warnings
  useEffect(() => {
  // Unlock scanning if cart is cleared
  if (total === 0) {
    if (scanningLocked) {
      setScanningLocked(false);
      setBudgetExceededWarningShown(false);
      setShowRecommendations(false);
      setRecommendations([]);
      setMessage({ type: 'info', text: 'Ready to scan' });
    }
    return;
  }

  if (budget === null) return;

  if (total === budget && !budgetExceededWarningShown) {
    setMessage({ type: 'warning', text: 'Budget limit reached!' });
    setAlertDialog({
      show: true,
      title: 'Budget Reached',
      message: 'You have reached your budget limit exactly. Please proceed carefully with any additional items.',
      onConfirm: () => {
        setAlertDialog({ show: false, title: '', message: '', onConfirm: null, onCancel: null, type: 'confirm' });
      },
      type: 'info'
    });
  }
  else if (total > budget && !budgetExceededWarningShown) {
    setBudgetExceededWarningShown(true);
    setMessage({ type: 'warning', text: 'Budget exceeded!' });

    fetchRecommendations();

    setAlertDialog({
      show: true,
      title: 'Budget Exceeded',
      message: `Your current total (${formatCurrency(total)}) has exceeded your budget (${formatCurrency(budget)}). Would you like to continue shopping?`,
      onConfirm: () => {
        setAlertDialog({ show: false, title: '', message: '', onConfirm: null, onCancel: null, type: 'confirm' });
        setMessage({ type: 'info', text: 'Continue shopping' });
      },
      onCancel: () => {
        setAlertDialog({ show: false, title: '', message: '', onConfirm: null, onCancel: null, type: 'confirm' });
        setScanningLocked(true);
        setMessage({ type: 'warning', text: 'Scanning locked - Budget exceeded' });
      },
      type: 'confirm'
    });
  }
  else if (total < budget) {
    // Unlock scanning whenever total drops back below budget (item removed / budget increased)
    if (budgetExceededWarningShown) {
      setBudgetExceededWarningShown(false);
      setShowRecommendations(false);
      setRecommendations([]);
    }
    if (scanningLocked) {
      setScanningLocked(false);
      setMessage({ type: 'success', text: 'Scanning unlocked' });
      setTimeout(() => setMessage({ type: 'info', text: 'Ready to scan' }), 1500);
    }
  }
}, [total, budget, budgetExceededWarningShown, scanningLocked, cart]);
  const addProductToCart = useCallback((product) => {
    if (scanningLocked) {
      setMessage({ type: 'warning', text: 'Scanning locked - Remove items or change budget' });
      setTimeout(() => setMessage({ type: 'warning', text: 'Scanning locked - Budget exceeded' }), 2000);
      return;
    }
    
    setScanPulse(true);
    setTimeout(() => setScanPulse(false), 600);

    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { ...product, qty: 1 }];
    });

    setMessage({ type: 'success', text: `${product.name} added to cart` });
    setTimeout(() => setMessage({ type: 'info', text: 'Ready to scan' }), 1800);
  }, [scanningLocked]);

  async function fetchProductByBarcode(barcode) {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/barcode/${barcode}`);
      if (!res.ok) throw new Error('Product not found');
      const product = await res.json();
      addProductToCart(product);
    } catch (err) {
      setMessage({ type: 'warning', text: `Unknown barcode: ${barcode}` });
      setTimeout(() => setMessage({ type: 'info', text: 'Ready to scan' }), 1800);
    }
  }

  const handleBarcodeInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const barcode = e.target.value.trim();
      if (barcode) fetchProductByBarcode(barcode);
      e.target.value = '';
    }
  };

  function removeItem(id) {
    const item = cart.find((p) => p.id === id);
    setAlertDialog({
      show: true,
      title: 'Remove Item',
      message: `Are you sure you want to remove ${item.name}?`,
      onConfirm: () => {
        setCart((prev) => prev.filter((p) => p.id !== id));
        setMessage({ type: 'warning', text: 'Item removed' });
        setTimeout(() => setMessage({ type: 'info', text: 'Ready to scan' }), 1400);
        setAlertDialog({ show: false, title: '', message: '', onConfirm: null, onCancel: null, type: 'confirm' });
      },
      onCancel: () => setAlertDialog({ show: false, title: '', message: '', onConfirm: null, onCancel: null, type: 'confirm' }),
      type: 'confirm'
    });
  }

  function clearCart() {
    setAlertDialog({
      show: true,
      title: 'Clear Cart',
      message: 'Are you sure you want to clear all items from your cart?',
      onConfirm: () => {
        setCart([]);
        setScanningLocked(false);
        setBudgetExceededWarningShown(false);
        setShowRecommendations(false);
        setRecommendations([]);
        setMessage({ type: 'warning', text: 'Cart cleared' });
        setTimeout(() => setMessage({ type: 'info', text: 'Ready to scan' }), 1400);
        setAlertDialog({ show: false, title: '', message: '', onConfirm: null, onCancel: null, type: 'confirm' });
      },
      onCancel: () => setAlertDialog({ show: false, title: '', message: '', onConfirm: null, onCancel: null, type: 'confirm' }),
      type: 'confirm'
    });
  }

  const budgetPercentage = budget ? Math.min((total / budget) * 100, 100) : 0;
  const budgetStatus = budget ? (total > budget ? 'exceeded' : total === budget ? 'reached' : total >= budget * 0.9 ? 'warning' : 'safe') : 'none';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      {/* Hidden input for scanner */}
      {!useCamera && (
        <input
          ref={barcodeInputRef}
          type="text"
          onKeyDown={handleBarcodeInput}
          className="opacity-0 absolute pointer-events-none"
          autoFocus
        />
      )}

      {/* Budget Setup Dialog */}
      <BudgetModule
        showBudgetDialog={showBudgetDialog}
        budgetInput={budgetInput}
        setBudgetInput={setBudgetInput}
        onBudgetSubmit={(budgetValue) => {
          setBudget(budgetValue);
          setScanningLocked(false);
          setBudgetExceededWarningShown(false); 
          setShowRecommendations(false);          
          setRecommendations([]); 
          setShowBudgetDialog(false);
          setMessage({ type: 'success', text: `Budget set to ${formatCurrency(budgetValue)}` });
          setTimeout(() => setMessage({ type: 'info', text: 'Ready to scan' }), 2000);
        }}
        setAlertDialog={setAlertDialog}
      />

      {/* Alert Dialog */}
      {alertDialog.show && !showBudgetDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">{alertDialog.title}</h3>
            <p className="text-gray-600 mb-6 text-center">{alertDialog.message}</p>
            <div className="flex gap-3">
              {alertDialog.type === 'confirm' && alertDialog.onCancel && (
                <button
                  onClick={alertDialog.onCancel}
                  className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
                >
                  {budgetStatus === 'exceeded' ? 'No' : 'Cancel'}
                </button>
              )}
              <button
                onClick={alertDialog.onConfirm}
                className={`${alertDialog.type === 'info' ? 'w-full' : 'flex-1'} px-6 py-3 ${
                  budgetStatus === 'exceeded' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                } text-white rounded-xl font-semibold`}
              >
                {alertDialog.type === 'info' ? 'OK' : budgetStatus === 'exceeded' ? 'Yes, Continue' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Panel */}
      <RecommendationModule
        showRecommendations={showRecommendations}
        recommendations={recommendations}
        onClose={() => setShowRecommendations(false)}
      />

      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm mb-4">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">Smart Shopping Cart</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Scan & Go
        </h1>
      </div>

      {/* Mode Switch */}
      <div className="max-w-6xl mx-auto mb-6 flex justify-center">
        <div className="flex bg-white rounded-full shadow p-1 gap-1">
          <button
            onClick={() => setUseCamera(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              !useCamera ? "bg-indigo-600 text-white" : "text-gray-600"
            }`}
          >
            Barcode Scanner
          </button>
          <button
            onClick={() => setUseCamera(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              useCamera ? "bg-indigo-600 text-white" : "text-gray-600"
            }`}
          >
            Camera Scanner
          </button>
        </div>
      </div>

      {/* Cart & Scanner UI */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Camera Scanner Module */}
        <CameraScanner
          useCamera={useCamera}
          budget={budget}
          total={total}
          budgetPercentage={budgetPercentage}
          budgetStatus={budgetStatus}
          message={message}
          scanPulse={scanPulse}
          itemCount={itemCount}
          cartLength={cart.length}
          onBudgetChange={() => {
            setBudgetInput(budget.toString());
            setShowBudgetDialog(true);
          }}
          onProductScanned={addProductToCart}
          beepSound={beepSound}
        />

        {/* Cart Module */}
        <CartModule
          cart={cart}
          setCart={setCart}
          total={total}
          itemCount={itemCount}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
        />
      </div>
    </div>
  );
}
