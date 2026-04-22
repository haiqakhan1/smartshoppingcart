import React from 'react';
import { TrendingDown, Star, X } from 'lucide-react';
import { formatCurrency } from '../scanner/ScanInterface';

export default function RecommendationModule({
  showRecommendations,
  recommendations,
  onClose
}) {
  if (!showRecommendations || recommendations.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-2xl max-h-[50vh] overflow-hidden animate-slide-up">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">Save Money with Cheaper Alternatives!</h3>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto max-h-[calc(50vh-80px)]">
        <div className="grid gap-3">
          {recommendations.map((rec, idx) => (
            <div 
              key={idx} 
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 hover:border-green-400 transition-all"
            >
              <div className="flex gap-3 items-start mb-2">
                <img
                  src={rec.imageUrl}
                  alt={rec.name}
                  className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                  onError={e => { e.target.src = 'https://placehold.co/200x200?text=' + rec.name; }}
                />
                <p>{rec.imageUrl}</p>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">
                    Alternative for: <span className="font-semibold">{rec.originalItem}</span>
                  </p>
                  <h4 className="font-bold text-gray-800 text-lg">{rec.name}</h4>
                  <p className="text-sm text-gray-600">{rec.brand}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                  <span className="text-sm font-bold text-yellow-700">{rec.rating}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(rec.price)}</span>
                </div>
                <div className="text-right">
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Save {formatCurrency(rec.savings)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
  
