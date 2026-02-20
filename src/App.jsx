/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, Filter, Star, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(game => game.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a2e]">
      {/* Header */}
      <header className="bg-[#2a2a4a] border-b-4 border-yellow-400 px-6 py-6 sticky top-0 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-yellow-400 p-3 rounded-2xl rotate-3 group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(250,204,21,0.4)]">
              <Gamepad2 className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-display font-black tracking-tighter poki-gradient-text uppercase italic">
              Unblocked Hub
            </h1>
          </div>

          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search for fun..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a2e] border-2 border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-yellow-400 transition-all text-lg font-medium placeholder:text-zinc-600"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {/* Categories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`poki-button whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-yellow-400 text-black shadow-[0_5px_0_#ca8a04]'
                  : 'bg-[#2a2a4a] text-zinc-300 hover:bg-[#3a3a5a] shadow-[0_5px_0_#1a1a2e]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredGames.map((game) => (
            <motion.div
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className="poki-card group"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="font-bold text-sm truncate">{game.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Game Player Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className={`relative bg-[#2a2a4a] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-yellow-400 flex flex-col ${
                isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl aspect-video'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-4 bg-[#1a1a2e]">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-400 p-2 rounded-xl">
                    <Gamepad2 className="w-5 h-5 text-black" />
                  </div>
                  <h2 className="font-display font-black text-2xl uppercase italic tracking-tighter">
                    {selectedGame.title}
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-3 bg-[#2a2a4a] hover:bg-yellow-400 hover:text-black rounded-2xl transition-all"
                  >
                    <Maximize2 className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-3 bg-red-500 hover:bg-red-600 rounded-2xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Iframe */}
              <div className="flex-1 bg-black">
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  allow="fullscreen; autoplay; encrypted-media"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
