import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingCart, Scan, Trash2, Sparkles } from 'lucide-react';

// Format the currency in Rs format
function formatCurrency(amount) {
  return 'Rs ' + amount.toFixed(2);
}

export default function ScanInterface() {

  const [useCamera, setUseCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState({ type: 'info', text: 'Ready to scan' });
  const [scanPulse, setScanPulse] = useState(false);
  const [alertDialog, setAlertDialog] = useState({ show: false, title: '', message: '', onConfirm: null });

   // Ref for hidden input where scanner types barcode
  const barcodeInputRef = useRef(null);
  // Ref for beep sound
  const beepSound = useRef(null);

  useEffect(() => {
    beepSound.current = new Audio('/sounds/beep.wav');
  }, []);

  // Auto-focus on hidden input so barcode scanner works without clicking
  useEffect(() => {
    const input = barcodeInputRef.current;
    if (input) input.focus();

    const handleFocus = () => input && input.focus();
    window.addEventListener('click', handleFocus);
    return () => window.removeEventListener('click', handleFocus);
  }, []);

  useEffect(() => {
    if (!useCamera) return;  

    async function startCamera() {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/library');
        const codeReader = new BrowserMultiFormatReader();
  
        const videoEl = document.getElementById('camera-preview');
  
        codeReader.decodeFromVideoDevice(null, videoEl, (result, err) => {
          if (result) {
            const barcode = result.getText();
            fetchProductByBarcode(barcode);
        
            // Play beep when barcode is successfully scanned
            if (beepSound.current) {
              beepSound.current.currentTime = 0;
              beepSound.current.play();
            }
          }
        });
        
      } catch (err) {
        setCameraError("Unable to access camera. Please allow permissions.");
      }
    }
  
    startCamera();
  
    return () => {
      try {
        const video = document.getElementById('camera-preview');
        if (video?.srcObject) {
          const tracks = video.srcObject.getTracks();
          tracks.forEach(t => t.stop());
        }
      } catch {}
    };
  }, [useCamera]);

   // Add a scanned product to cart
  const addProductToCart = useCallback((product) => {
    setScanPulse(true);
    setTimeout(() => setScanPulse(false), 600);

  // Update cart: increase quantity if exists else add new product
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { ...product, qty: 1 }];
    });

    setMessage({ type: 'success', text: `${product.name} added to cart` });
    setTimeout(() => setMessage({ type: 'info', text: 'Ready to scan' }), 1800);
  }, []);

  //Fetch product by barcode from backend
  async function fetchProductByBarcode(barcode) {
    try {
      const res = await fetch(`http://localhost:7005/api/products/barcode/${barcode}`);
      if (!res.ok) throw new Error('Product not found');
      const product = await res.json();
      addProductToCart(product);
    } catch (err) {
      // Unknown barcode error
      setMessage({ type: 'warning', text: `Unknown barcode: ${barcode}` });
      setTimeout(() => setMessage({ type: 'info', text: 'Ready to scan' }), 1800);
    }
  }

   // When Enter key is pressed, process barcode
  const handleBarcodeInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const barcode = e.target.value.trim();
      if (barcode) fetchProductByBarcode(barcode);
      e.target.value = '';
    }
  };

  // Remove selected item after confirmation
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
        setAlertDialog({ show: false, title: '', message: '', onConfirm: null });
      }
    });
  }

     // Clear all items in cart
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

  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const itemCount = cart.reduce((sum, p) => sum + p.qty, 0);

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


      {/* Alert Dialog */}
      {alertDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{alertDialog.title}</h3>
            <p className="text-gray-600 mb-6">{alertDialog.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setAlertDialog({ show: false, title: '', message: '', onConfirm: null })}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={alertDialog.onConfirm}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

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
        {/* Live Feed / Stats Area */}
        <div className="bg-white rounded-3xl shadow-xl flex flex-col min-h-[600px]">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-t-3xl">
            <h2 className="text-2xl font-bold text-white mb-2">Transaction Summary</h2>
            <p className="text-white/80 text-sm">Live scanning active</p>
          </div>
          
          <div className="flex-1 p-6 flex flex-col gap-4">
            {/* Camera Mode Preview */}
            {useCamera && (
              <div className="relative flex justify-center mb-4">
                <video
                  id="camera-preview"
                  className="w-full max-w-md rounded-2xl shadow-lg border-4 border-indigo-500"
                  autoPlay
                  muted
                ></video>

                {/* Scanning line animation */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                  <div className="w-full h-1 bg-indigo-500 animate-scan"></div>
                </div>
             </div>
            )}

            {/* Status Message */}
            <div className={`p-4 rounded-xl text-center font-medium transition-all ${
              message.type === 'success' ? 'bg-green-50 text-green-700' :
              message.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
              'bg-indigo-50 text-indigo-700'
            }`}>
              {scanPulse && <Scan className="w-5 h-5 inline-block mr-2 animate-pulse" />}
              {message.text}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-indigo-600">{itemCount}</div>
                <div className="text-sm text-indigo-600/70 mt-1">Items</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-purple-600">{cart.length}</div>
                <div className="text-sm text-purple-600/70 mt-1">Types</div>
              </div>
            </div>

            {/* Recent Scan Animation */}
            {scanPulse && (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-xl animate-pulse">
                <div className="flex items-center gap-3">
                  <Scan className="w-6 h-6" />
                  <span className="font-medium">Processing scan...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white rounded-3xl shadow-xl flex flex-col min-h-[600px]">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-3xl">
            <div className="flex justify-between items-center">
              <div className="text-white">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <p className="text-white/80 text-sm">{itemCount} items</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/80">Total</div> {/*  Total heading */}
                <div className="text-3xl font-bold text-white">{formatCurrency(total)}</div>
              </div>
            </div>
          </div>
          <div className="p-6 flex-1 overflow-auto">
            {cart.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">Scan items to begin</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-500">{formatCurrency(item.price)} × {item.qty} = {formatCurrency(item.price * item.qty)}</div>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Clear Cart Button */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={clearCart}
              className="w-full px-6 py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-red-700 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}