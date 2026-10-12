import React from 'react';
import { X, Trash2, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { TickerItem } from '../types/market';
import { formatPrice } from '../utils/chartData';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistIds: string[];
  allTickers: TickerItem[];
  onSelectTicker: (ticker: TickerItem) => void;
  onRemoveFavorite: (tickerId: string) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistIds,
  allTickers,
  onSelectTicker,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  const favoriteTickers = allTickers.filter((t) => watchlistIds.includes(t.id));

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1e222d] border-l border-[#2a2e39] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-[#2a2e39] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h2 className="text-lg font-bold text-[#f0f3fa]">我的自选列表</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950/60 text-[#2962ff] border border-blue-800/40 font-bold">
                {favoriteTickers.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#868993] hover:text-[#f0f3fa] hover:bg-[#2a2e39] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/60 p-3 custom-scrollbar">
            {favoriteTickers.length === 0 ? (
              <div className="py-16 text-center text-[#868993] space-y-3">
                <Star className="w-12 h-12 text-[#363a45] mx-auto" />
                <p className="text-sm font-medium">暂无自选标的</p>
                <p className="text-xs text-[#60636f] max-w-xs mx-auto">
                  在行情列表或图表弹窗中点击星标按钮，即可将感兴趣的指数、股票或加密货币添加至此。
                </p>
              </div>
            ) : (
              favoriteTickers.map((item) => {
                const isUp = item.trend === 'up';
                return (
                  <div
                    key={item.id}
                    className="py-3 px-2 flex items-center justify-between hover:bg-[#2a2e39]/80 rounded-lg transition-colors cursor-pointer group"
                    onClick={() => {
                      onSelectTicker(item);
                      onClose();
                    }}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <span
                        style={{ backgroundColor: item.badgeColor || '#2962ff' }}
                        className="w-8 h-8 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
                      >
                        {item.avatarText || item.symbol.slice(0, 2)}
                      </span>
                      <div className="truncate">
                        <div className="font-bold text-sm text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-[#868993]">{item.exchange}</div>
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
                          onRemoveFavorite(item.id);
                        }}
                        className="p-1.5 rounded hover:bg-red-950/40 text-[#868993] hover:text-red-400 transition-colors"
                        title="移除自选"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="px-5 py-3 border-t border-[#2a2e39] bg-[#181b24] text-xs text-[#868993] flex items-center justify-between">
            <span>支持按快捷键快速管理</span>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-[#2962ff] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              完成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
