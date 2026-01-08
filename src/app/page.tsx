"use client";

import React, { useState, useEffect } from 'react';
import {
    Wallet,
    ShoppingBag,
    Gift,
    Search,
    TrendingUp,
    ChevronRight,
    ExternalLink,
    Loader2,
    Sparkles,
    Sun,
    Moon
} from 'lucide-react';
import { Product, fetchAllProducts, filterGifts } from '@/lib/prizeless-engine';
import { getBudgetOptimization, getGiftRecommendations } from '@/lib/actions';

export default function Dashboard() {
    const [showWelcome, setShowWelcome] = useState(true);
    const [aiName, setAiName] = useState('Nova My AI Shopping Assistant');
    const [tempName, setTempName] = useState('');
    const [activeTab, setActiveTab] = useState<'budget' | 'gift'>('budget');
    const [budget, setBudget] = useState('200000');
    const [shoppingList, setShoppingList] = useState('');
    const [interests, setInterests] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [giftResults, setGiftResults] = useState<any>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        const savedName = localStorage.getItem('prizeless_ai_name');
        if (savedName) {
            setAiName(savedName);
            setShowWelcome(false);
        }

        const savedTheme = localStorage.getItem('prizeless_theme') as 'light' | 'dark';
        if (savedTheme) {
            setTheme(savedTheme);
        }

        const loadProducts = async () => {
            const data = await fetchAllProducts();
            setProducts(data);
        };
        loadProducts();
    }, []);

    const handleOptimize = async () => {
        setLoading(true);
        const optimized = await getBudgetOptimization(Number(budget), shoppingList, products);
        setResults(optimized);
        setLoading(false);
    };

    const handleFindGifts = async () => {
        setLoading(true);
        const gifts = await getGiftRecommendations(interests, Number(budget), products);
        setGiftResults(gifts);
        setLoading(false);
    };

    const handleWelcomeComplete = () => {
        let finalName = '';
        const trimmed = tempName.trim();
        if (trimmed) {
            // Check if user already added the suffix to avoid duplication
            if (trimmed.toLowerCase().endsWith('my ai shopping assistant')) {
                finalName = trimmed;
            } else {
                finalName = `${trimmed} My AI Shopping Assistant`;
            }
        } else {
            finalName = 'Nova My AI Shopping Assistant';
        }

        setAiName(finalName);
        localStorage.setItem('prizeless_ai_name', finalName);
        setShowWelcome(false);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('prizeless_theme', newTheme);
    };

    if (showWelcome) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${theme === 'light' ? 'bg-gray-50' : 'bg-[#0a0a0a]'}`}>
                <div className={`${theme === 'light' ? 'bg-white shadow-2xl border border-gray-100' : 'glass'} p-12 rounded-[2.5rem] max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in duration-700`}>
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                        <Sparkles size={48} className="text-white animate-pulse" />
                    </div>

                    <div className="space-y-3">
                        <h1 className={`text-5xl font-extrabold pb-1 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent tracking-tight`}>
                            Prizeless AI
                        </h1>
                        <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-lg font-medium`}>Your Intelligent Nigerian Market Expert</p>
                    </div>

                    <div className="space-y-6 pt-6">
                        <div className="text-left space-y-3">
                            <label className={`text-sm font-semibold uppercase tracking-wider ml-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Name your Custom AI Assistant</label>
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className={`w-full rounded-2xl p-5 outline-none text-xl transition-all ${theme === 'light' ? 'bg-gray-100 border-gray-200 focus:ring-green-500' : 'bg-white/5 border-white/10 focus:ring-green-400 text-white hover:bg-white/10'} border`}
                                placeholder="Nova"
                            />
                        </div>

                        <button
                            onClick={handleWelcomeComplete}
                            className="w-full btn-primary py-5 rounded-2xl text-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3"
                        >
                            Get Started <ChevronRight size={24} />
                        </button>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className={`absolute top-8 right-8 p-3 rounded-2xl transition-all ${theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-white/5 text-white underline decoration-white/30 hover:bg-white/10'}`}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-4 md:p-8 transition-colors duration-500 ${theme === 'light' ? 'bg-gray-50 text-gray-900' : 'text-white bg-[#0a0a0a]'}`}>
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                                Prizeless.Ng
                            </h1>
                            <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} font-medium`}>{aiName}</p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-xl transition-all ${theme === 'light' ? 'bg-white shadow-md text-gray-700 border border-gray-100' : 'glass text-white'}`}
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                    </div>
                    <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${theme === 'light' ? 'bg-white shadow-md border border-gray-100' : 'glass'}`}>
                        <Wallet size={18} className="text-green-400" />
                        <span className="font-mono font-bold">₦{Number(budget).toLocaleString()}</span>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('budget')}
                        className={`px-6 py-2 rounded-xl transition-all font-medium ${activeTab === 'budget' ? 'btn-primary' : (theme === 'light' ? 'bg-white shadow-sm border border-gray-200 text-gray-600' : 'glass')}`}
                    >
                        Budget Mode
                    </button>
                    <button
                        onClick={() => setActiveTab('gift')}
                        className={`px-6 py-2 rounded-xl transition-all font-medium ${activeTab === 'gift' ? 'btn-primary' : (theme === 'light' ? 'bg-white shadow-sm border border-gray-200 text-gray-600' : 'glass')}`}
                    >
                        Gift Mode
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Input Section */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className={`p-6 rounded-3xl space-y-4 ${theme === 'light' ? 'bg-white shadow-xl border border-gray-100' : 'glass'}`}>
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <TrendingUp className="text-green-400" /> Plan Your Shopping
                            </h2>

                            <div className="space-y-2">
                                <label className={`text-sm ml-1 font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Total Budget (₦)</label>
                                <input
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className={`w-full rounded-2xl p-4 outline-none font-mono text-xl transition-all ${theme === 'light' ? 'bg-gray-50 border-gray-200 focus:ring-green-500' : 'bg-white/5 border-white/10 focus:ring-green-400 hover:bg-white/10'} border`}
                                    placeholder="Enter budget..."
                                />
                            </div>

                            {activeTab === 'budget' ? (
                                <div className="space-y-2">
                                    <label className={`text-sm ml-1 font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Shopping List</label>
                                    <textarea
                                        value={shoppingList}
                                        onChange={(e) => setShoppingList(e.target.value)}
                                        className={`w-full rounded-2xl p-4 h-40 outline-none transition-all ${theme === 'light' ? 'bg-gray-50 border-gray-200 focus:ring-green-500' : 'bg-white/5 border-white/10 focus:ring-green-400 hover:bg-white/10'} border`}
                                        placeholder="Rice, Tomatoes, Palm Oil, etc..."
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className={`text-sm ml-1 font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Occasion & Recipient Details</label>
                                    <input
                                        value={interests}
                                        onChange={(e) => setInterests(e.target.value)}
                                        className={`w-full rounded-2xl p-4 outline-none transition-all ${theme === 'light' ? 'bg-gray-50 border-gray-200 focus:ring-green-500' : 'bg-white/5 border-white/10 focus:ring-green-400 hover:bg-white/10'} border`}
                                        placeholder="E.g. Valentine gift for my friend..."
                                    />
                                </div>
                            )}

                            <button
                                onClick={activeTab === 'budget' ? handleOptimize : handleFindGifts}
                                disabled={loading}
                                className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Planning...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        <span>{activeTab === 'budget' ? 'Optimize Budget' : 'Find Perfect Gifts'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-7">
                        {results && activeTab === 'budget' && (
                            <div className="space-y-6">
                                <div className={`p-6 rounded-3xl border-l-4 border-green-500 shadow-lg ${theme === 'light' ? 'bg-white' : 'glass'}`}>
                                    <p className={`italic ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>"{results.summary}"</p>
                                    <div className="mt-4 flex gap-4 text-sm font-mono">
                                        <span className="text-green-500 font-bold">Total: ₦{results.total_cost?.toLocaleString()}</span>
                                        <span className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'}>Left: ₦{results.remaining_budget?.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {results.recommendations?.map((item: any, i: number) => (
                                        <div key={i} className={`p-4 rounded-2xl flex items-center justify-between group transition-all ${theme === 'light' ? 'bg-white shadow-md border border-gray-100 hover:border-green-200' : 'glass hover:bg-white/5'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-green-400/10 rounded-full flex items-center justify-center overflow-hidden">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ShoppingBag className="text-green-400" size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{item.name}</h3>
                                                    <p className="text-xs text-green-500 font-semibold">
                                                        Sold by: {item.shop}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono text-green-500 font-bold mb-2">₦{item.price?.toLocaleString()}</p>
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600' : 'glass hover:text-green-400'}`}
                                                >
                                                    Buy Now <ExternalLink size={12} />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'gift' && giftResults && (
                            <div className="space-y-6">
                                <div className={`p-6 rounded-3xl border-l-4 border-emerald-500 shadow-lg ${theme === 'light' ? 'bg-white' : 'glass'}`}>
                                    <p className={`italic ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>"{giftResults.summary}"</p>
                                    <div className="mt-4 flex gap-4 text-sm font-mono">
                                        <span className="text-emerald-500 font-bold">Total: ₦{giftResults.total_cost?.toLocaleString()}</span>
                                        <span className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'}>Left: ₦{giftResults.remaining_budget?.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {giftResults.recommendations?.map((item: any, i: number) => (
                                        <div key={i} className={`p-4 rounded-3xl space-y-4 group transition-all ${theme === 'light' ? 'bg-white shadow-xl border border-gray-100' : 'glass hover:bg-white/5'}`}>
                                            <div className={`aspect-square rounded-2xl flex items-center justify-center overflow-hidden ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'}`}>
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Gift className={`opacity-20 group-hover:opacity-40 transition-opacity ${theme === 'light' ? 'text-gray-400' : 'text-emerald-400'}`} size={48} />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold truncate">{item.name}</h3>
                                                <p className="text-xs text-emerald-500 font-bold mb-1">{item.shop}</p>
                                                <p className={`text-sm line-clamp-2 mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{item.reason}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-mono text-emerald-500 font-bold">₦{item.price?.toLocaleString()}</span>
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        className="btn-primary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold shadow-lg shadow-green-500/20"
                                                    >
                                                        Buy Now <ExternalLink size={12} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {loading && (
                            <div className={`h-full min-h-[400px] flex flex-col items-center justify-center rounded-3xl p-12 text-center space-y-4 shadow-xl ${theme === 'light' ? 'bg-white text-green-600 border border-gray-100' : 'glass text-green-400'}`}>
                                <div className="relative">
                                    <Loader2 size={48} className="animate-spin" />
                                    <div className={`absolute inset-0 blur-xl animate-pulse rounded-full ${theme === 'light' ? 'bg-green-500/10' : 'bg-green-400/20'}`} />
                                </div>
                                <p className="text-xl font-bold animate-pulse tracking-widest uppercase">Planning...</p>
                            </div>
                        )}

                        {!results && !giftResults && !loading && (
                            <div className={`h-full flex flex-col items-center justify-center rounded-3xl p-12 text-center shadow-inner ${theme === 'light' ? 'bg-white border border-gray-100 text-gray-400' : 'glass text-gray-500'}`}>
                                <Search size={48} className="mb-4 opacity-20" />
                                <p className="font-medium">Enter your details and let the Market Expert work their magic!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
