import React, { useEffect } from 'react';
import { Scan } from 'lucide-react';
import { formatCurrency } from './ScanInterface';

export default function CameraScanner({
  useCamera,
  budget,
  total,
  budgetPercentage,
  budgetStatus,
  message,
  scanPulse,
  itemCount,
  cartLength,
  onBudgetChange,
  onProductScanned,
  beepSound
}) {
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
        console.error("Unable to access camera:", err);
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

  async function fetchProductByBarcode(barcode) {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/barcode/${barcode}`);
      if (!res.ok) throw new Error('Product not found');
      const product = await res.json();
      onProductScanned(product);
    } catch (err) {
      console.error('Product not found:', err);
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl flex flex-col min-h-[600px]">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-t-3xl">
        <h2 className="text-2xl font-bold text-white mb-2">Transaction Summary</h2>
        <p className="text-white/80 text-sm">Live scanning active</p>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-4">
        {/* Budget Indicator */}
        {budget !== null && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Budget Status</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${
                  budgetStatus === 'exceeded' ? 'text-red-600' :
                  budgetStatus === 'reached' ? 'text-orange-600' :
                  budgetStatus === 'warning' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {formatCurrency(total)} / {formatCurrency(budget)}
                </span>
                <button
                  onClick={onBudgetChange}
                  className="px-2 py-1 text-xs bg-white hover:bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-200 transition-colors font-medium"
                >
                  Change
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  budgetStatus === 'exceeded' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  budgetStatus === 'reached' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                  budgetStatus === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                  'bg-gradient-to-r from-green-500 to-green-600'
                }`}
                style={{ width: `${budgetPercentage}%` }}
              ></div>
            </div>
            {budgetStatus === 'exceeded' && (
              <p className="text-xs text-red-600 mt-2 font-medium">⚠️ Budget exceeded by {formatCurrency(total - budget)}</p>
            )}
            {budgetStatus === 'reached' && (
              <p className="text-xs text-orange-600 mt-2 font-medium">⚠️ Budget limit reached!</p>
            )}
          </div>
        )}

        {/* Camera Preview */}
        {useCamera && (
          <div className="relative flex justify-center mb-4">
            <video
              id="camera-preview"
              className="w-full max-w-md rounded-2xl shadow-lg border-4 border-indigo-500"
              autoPlay
              muted
            ></video>
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
            <div className="text-3xl font-bold text-purple-600">{cartLength}</div>
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
  );
}
