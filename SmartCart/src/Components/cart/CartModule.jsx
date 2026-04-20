import React from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { formatCurrency } from '../scanner/ScanInterface';

export default function CartModule({
  cart,
  setCart,
  total,
  itemCount,
  onRemoveItem,
  onClearCart
}) {
  return (
    <div className="bg-white rounded-3xl shadow-xl flex flex-col min-h-[600px]">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-3xl">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <p className="text-white/80 text-sm">{itemCount} items</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/80">Total</div>
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
              <div className="flex items-center gap-3 flex-1">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover bg-gray-200 flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://placehold.co/200x200?text=No+Image'; }}
                />
                <div>
                  <div className="font-semibold text-gray-800">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(item.price)} × {item.qty} = {formatCurrency(item.price * item.qty)}
                  </div>
                </div>
              </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setCart((prev) => prev.map((p) => 
                        p.id === item.id ? { ...p, qty: Math.max(1, p.qty - 1) } : p
                      ));
                    }} 
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <span className="text-xl font-bold">−</span>
                  </button>
                  <span className="text-lg font-semibold text-gray-700 min-w-[2rem] text-center">{item.qty}</span>
                  <button 
                    onClick={() => {
                      setCart((prev) => prev.map((p) => 
                        p.id === item.id ? { ...p, qty: p.qty + 1 } : p
                      ));
                    }} 
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <span className="text-xl font-bold">+</span>
                  </button>
                  <button 
                    onClick={() => onRemoveItem(item.id)} 
                    className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={onClearCart}
          className="w-full px-6 py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-red-700 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          Clear Cart
        </button>
      </div>
    </div>
  );
}
  
