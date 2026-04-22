import React, { useState } from 'react';

const API_URL = 'https://smartshop-api-c3g4gefbbrakcwhs.centralindia-01.azurewebsites.net';

export default function AdminLogin({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    if (!form.email.endsWith('@smartshoppingcart.com')) {
    setError('Email must be a @smartshoppingcart.com address');
    setLoading(false);
    return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }
    try {
      const endpoint = isSignup ? '/api/admin/signup' : '/api/admin/login';
      const body = isSignup ? form : { email: form.email, password: form.password };
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      if (!isSignup) onLogin(data);
      else { setIsSignup(false); setError('Account created! Please login.'); }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-white text-2xl">🛒</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="text-gray-500 mt-2">{isSignup ? 'Create admin account' : 'Sign in to dashboard'}</p>
        </div>

        {error && (
          <div className={`p-3 rounded-xl mb-4 text-sm text-center ${error.includes('created') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {error}
          </div>
        )}

        <div className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition"
          >
            {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => { setIsSignup(!isSignup); setError(''); }} className="text-purple-600 font-medium ml-1">
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
