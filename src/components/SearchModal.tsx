import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { TickerItem } from '../types/market';
import { formatPrice } from '../utils/chartData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickers: TickerItem[];
  onSelectTicker: (ticker: TickerItem) => void;
  watchlist: string[];
  onToggleFavorite: (tickerId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  tickers,
  onSelectTicker,
  watchlist,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger handled in parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter tickers based on query & category
  const filtered = tickers.filter((t) => {
    const matchesCategory =
      filterCategory === 'all' ||
      (filterCategory === 'stocks' && (t.category === 'cn_stocks' || t.category === 'world_stocks')) ||
      (filterCategory === 'indices' && t.category === 'indices') ||
      (filterCategory === 'crypto' && t.category === 'crypto') ||
      (filterCategory === 'futures' && (t.category === 'futures' || t.category === 'forex'));

    if (!matchesCategory) return false;

    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      t.symbol.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      (t.shortName && t.shortName.toLowerCase().includes(q)) ||
      t.exchange.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Search Dialog */}
      <div className="relative w-full max-w-xl bg-[#1e222d] rounded-2xl border border-[#2a2e39] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#2a2e39]">
          <Search className="w-5 h-5 text-[#868993] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索股票、代码、指数、加密货币 (如 NVDA, 茅台, 000001)..."
            className="w-full text-sm sm:text-base text-[#f0f3fa] placeholder-[#868993] focus:outline-hidden bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-[#868993] hover:text-[#f0f3fa] mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-[#868993] bg-[#131722] rounded border border-[#2a2e39]">
            ESC
          </kbd>
        </div>

        {/* Filter Category Chips */}
        <div className="flex items-center space-x-1.5 px-4 py-2 border-b border-[#2a2e39] bg-[#181b24] text-xs overflow-x-auto custom-scrollbar">
          {[
            { id: 'all', label: '全部标的' },
            { id: 'stocks', label: '股票 (A股/美股/港股)' },
            { id: 'indices', label: '主要指数' },
            { id: 'crypto', label: '加密货币' },
            { id: 'futures', label: '期货与外汇' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-[#2a2e39] text-white font-medium border border-[#363a45]'
                  : 'text-[#868993] hover:bg-[#2a2e39] hover:text-[#d1d4dc]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#2a2e39]/60 p-2 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#868993] text-sm">
              <p>未找到符合条件的行情代码或名称</p>
              <p className="text-xs mt-1 text-[#60636f]">试试搜索 "BTC", "苹果", "600519", "标普500"</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isUp = item.trend === 'up';
              const isFav = watchlist.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#2a2e39]/80 transition-colors cursor-pointer group"
                  onClick={() => {
                    onSelectTicker(item);
                    onClose();
                  }}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <span
                      style={{ backgroundColor: item.badgeColor || '#2962ff' }}
                      className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
                    >
                      {item.avatarText || item.symbol.slice(0, 2)}
                    </span>
                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#131722] text-[#868993] border border-[#2a2e39]">
                          {item.symbol}
                        </span>
                      </div>
                      <span className="text-xs text-[#868993] block truncate">{item.exchange}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-sm tabular-nums text-[#f0f3fa]">
                        {formatPrice(item.price, item.currency)}
                      </div>
                      <div
                        className={`text-xs font-semibold tabular-nums ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isUp ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className="p-1 rounded hover:bg-[#363a45] text-[#868993] hover:text-amber-400 transition-colors"
                      title={isFav ? '从自选移除' : '加入自选'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isFav ? 'text-amber-400 fill-amber-400' : 'text-[#60636f]'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2 border-t border-[#2a2e39] bg-[#181b24] flex items-center justify-between text-[11px] text-[#868993]">
          <span>按 ESC 关闭</span>
          <span>点击任意标的查看走势图表与深度分析</span>
        </div>
      </div>
    </div>
  );
};
