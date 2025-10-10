import React, { useState, useCallback } from 'react';
import { ShoppingCart, Scan, Trash2, Sparkles } from 'lucide-react';

// Some sample products we will use for scanning
const SAMPLE_PRODUCTS = [
  { id: 'P1001', name: 'Milk 1L', price: 199, barcode: '012345' },
  { id: 'P1002', name: 'Whole Wheat Bread', price: 99, barcode: '012346' },
  { id: 'P1003', name: 'Eggs 12pc', price: 349, barcode: '012347' },
  { id: 'P1004', name: 'Apple (1kg)', price: 259, barcode: '012348' },
];

// Helper function to show price in rupees format
function formatCurrency(cents) {
  return 'Rs ' + (cents / 100).toFixed(2);
}

export default function ScanInterface() {
  // cart will hold all scanned items
  const [cart, setCart] = useState([]);

  // message will show status like "ready", "added", "removed"
  const [message, setMessage] = useState({ type: 'info', text: 'Ready to scan' });

  // scanPulse is just for the scan button animation
  const [scanPulse, setScanPulse] = useState(false);

  // alertDialog is used for confirmation popups (remove/clear cart)
  const [alertDialog, setAlertDialog] = useState({ show: false, title: '', message: '', onConfirm: null });

  // When a product is scanned, add it to the cart
  const addProductToCart = useCallback((product) => {
    setScanPulse(true); // trigger animation
    setTimeout(() => setScanPulse(false), 600); // stop animation after 0.6s
    
    setCart((prev) => {
      // check if product already exists
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        // if exists, increase quantity
        return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
      }
      // if not, add it with qty = 1
      return [...prev, { ...product, qty: 1 }];
    });

    // show success message for a short time
    setMessage({ type: 'success', text: `${product.name} added to cart` });
    setTimeout(() => setMessage({ type: 'info', text: 'Ready to scan' }), 1800);
  }, []);

  // This just randomly picks a product from SAMPLE_PRODUCTS
  function simulateScan() {
    const next = SAMPLE_PRODUCTS[Math.floor(Math.random() * SAMPLE_PRODUCTS.length)];
    addProductToCart(next);
  }

  // Remove one specific item from the cart (with confirmation dialog)
  function removeItem(id) {
    const item = cart.find((p) => p.id === id);
    setAlertDialog({
      show: true,
      title: 'Remove Item',
      message: `Are you sure you want to remove ${item.name} from your cart?`,
      onConfirm: () => {
        setCart((prev) => prev.filter((p) => p.id !== id));
        setMessage({ type: 'warning', text: 'Item removed' });
        setTimeout(() => setMessage({ type: 'info', text: 'Ready to scan' }), 1400);
        setAlertDialog({ show: false, title: '', message: '', onConfirm: null });
      }
    });
  }

  // Clear the whole cart (with confirmation dialog)
  function clearCart() {
    setAlertDialog({
      show: true,
      title: 'Clear Cart',
      message: 'Are you sure you want to clear all items from your cart?',
      onConfirm: () => {
        setCart([]);
        setMessage({ type: 'warning', text: 'Cart cleared' });
        setTimeout(() => setMessage({ type: 'info', text: 'Ready to scan' }), 1400);
        setAlertDialog({ show: false, title: '', message: '', onConfirm: null });
      }
    });
  }

  // Calculate totals
  const total = cart.reduce((s, p) => s + p.price * p.qty, 0);
  const itemCount = cart.reduce((s, p) => s + p.qty, 0);

  // Allow pressing Enter or Space to scan
  function handleKeyOnScan(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      simulateScan();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      
      {/* Confirmation dialog (for remove/clear) */}
      {alertDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setAlertDialog({ show: false, title: '', message: '', onConfirm: null })}
          ></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{alertDialog.title}</h3>
            <p className="text-gray-600 mb-6">{alertDialog.message}</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setAlertDialog({ show: false, title: '', message: '', onConfirm: null })}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={alertDialog.onConfirm}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-medium hover:from-rose-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Top header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm mb-4">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Smart Shopping Cart</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Scan & Go
          </h1>
          <p className="text-gray-600">Experience the future of shopping</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left side: Scan button */}
          <div>
            <div 
              className={`bg-white rounded-3xl shadow-xl overflow-hidden h-full flex flex-col transition-all duration-300 ${scanPulse ? 'scale-105 shadow-2xl' : ''}`}
            >
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 lg:p-12 flex-1 flex items-center justify-center">
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Simulate scan"
                  onClick={simulateScan}
                  onKeyDown={handleKeyOnScan}
                  className="relative group cursor-pointer focus:outline-none w-full"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:bg-white/30 transition-all"></div>
                  <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-12 lg:p-16 border-2 border-white/30 hover:border-white/50 transition-all">
                    <div className="flex flex-col items-center gap-4">
                      <div className={`p-6 bg-white/20 rounded-full ${scanPulse ? 'animate-ping' : ''}`}>
                        <Scan className="w-20 h-20 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">Tap to Scan</div>
                        <div className="text-sm text-white/80">or press Enter/Space</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status message after scanning */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
                <div
                  className={`rounded-xl p-4 text-center font-medium transition-all ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700 border-2 border-green-200'
                      : message.type === 'warning'
                      ? 'bg-amber-50 text-amber-700 border-2 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Cart */}
          <div>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-full flex flex-col">
              
              {/* Cart header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Your Cart</h2>
                      <p className="text-white/80 text-sm">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/80 mb-1">Total</div>
                    <div className="text-3xl font-bold text-white">{formatCurrency(total)}</div>
                  </div>
                </div>
              </div>

              {/* Cart items */}
              <div className="flex-1 overflow-auto p-6 min-h-[300px]">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="p-6 bg-gray-50 rounded-full mb-4">
                      <ShoppingCart className="w-12 h-12" />
                    </div>
                    <p className="text-lg font-medium">Your cart is empty</p>
                    <p className="text-sm">Start scanning items to add them</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-2xl hover:from-gray-100 hover:to-gray-100/50 transition-all group border border-gray-100"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 mb-1">{item.name}</div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="px-2 py-1 bg-white rounded-lg font-mono text-xs border border-gray-200">
                              {item.barcode}
                            </span>
                            <span>•</span>
                            <span>{formatCurrency(item.price)} × {item.qty}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-800">
                              {formatCurrency(item.price * item.qty)}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="p-2 rounded-xl hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart footer */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
                <div className="flex flex-col gap-3">
                  <button className="w-full px-6 py-4 bg-white border-2 border-indigo-200 rounded-2xl text-indigo-700 font-medium hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm">
                    View Details
                  </button>
                  <button 
                    onClick={clearCart}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-medium hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 bg-white/60 backdrop-blur-sm inline-block px-4 py-2 rounded-full">
            <strong>Dev Mode:</strong> UI-only demo. Replace simulateScan() with hardware integration.
          </p>
        </div>
      </div>
    </div>
  );
}