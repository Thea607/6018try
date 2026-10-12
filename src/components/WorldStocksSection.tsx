import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { TickerItem } from '../types/market';
import { formatPrice } from '../utils/chartData';

interface WorldStocksSectionProps {
  stocks: TickerItem[];
  onSelectTicker: (ticker: TickerItem) => void;
}

export const WorldStocksSection: React.FC<WorldStocksSectionProps> = ({
  stocks,
  onSelectTicker,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'market_cap' | 'us_indices' | 'tech_giants'>('market_cap');

  return (
    <section className="mb-10">
      {/* Section Title Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <button
          onClick={() => stocks[0] && onSelectTicker(stocks[0])}
          className="inline-flex items-center group space-x-1.5 text-2xl font-bold text-[#f0f3fa] hover:text-[#2962ff] transition-colors cursor-pointer"
        >
          <span>世界股票</span>
          <ChevronRight className="w-5 h-5 text-[#868993] group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all mt-0.5" />
        </button>

        <div className="flex items-center space-x-3 text-sm">
          <button
            onClick={() => setActiveSubTab('market_cap')}
            className={`cursor-pointer transition-colors ${
              activeSubTab === 'market_cap'
                ? 'text-[#f0f3fa] font-semibold'
                : 'text-[#868993] hover:text-[#d1d4dc]'
            }`}
          >
            全球最高市值
          </button>
          <span className="text-[#363a45]">·</span>
          <button
            onClick={() => setActiveSubTab('us_indices')}
            className={`cursor-pointer transition-colors ${
              activeSubTab === 'us_indices'
                ? 'text-[#f0f3fa] font-semibold'
                : 'text-[#868993] hover:text-[#d1d4dc]'
            }`}
          >
            美股主要股指
          </button>
          <span className="text-[#363a45]">·</span>
          <button
            onClick={() => setActiveSubTab('tech_giants')}
            className={`cursor-pointer transition-colors ${
              activeSubTab === 'tech_giants'
                ? 'text-[#f0f3fa] font-semibold'
                : 'text-[#868993] hover:text-[#d1d4dc]'
            }`}
          >
            全球科技巨头
          </button>
        </div>
      </div>

      {/* Data Table for World Titans */}
      <div className="border border-[#2a2e39] rounded-xl bg-[#1e222d] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#2a2e39] bg-[#181b24] text-xs font-semibold text-[#868993] uppercase tracking-wider">
                <th className="py-3 px-4">代码 / 公司</th>
                <th className="py-3 px-4 text-right">最新价</th>
                <th className="py-3 px-4 text-right">涨跌额</th>
                <th className="py-3 px-4 text-right">涨跌幅 %</th>
                <th className="py-3 px-4 text-right">总市值</th>
                <th className="py-3 px-4 text-center w-28">走势</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60 font-medium">
              {stocks.map((stock) => {
                const isUp = stock.trend === 'up';
                const strokeColor = isUp ? '#089981' : '#f23645';

                // Sparkline
                const minVal = Math.min(...stock.sparkline);
                const maxVal = Math.max(...stock.sparkline);
                const range = maxVal - minVal || 1;
                const svgW = 80;
                const svgH = 24;
                const stepX = svgW / (stock.sparkline.length - 1);

                let pathD = '';
                stock.sparkline.forEach((val, idx) => {
                  const x = idx * stepX;
                  const y = svgH - 3 - ((val - minVal) / range) * (svgH - 6);
                  if (idx === 0) pathD += `M ${x},${y}`;
                  else pathD += ` L ${x},${y}`;
                });

                return (
                  <tr
                    key={stock.id}
                    onClick={() => onSelectTicker(stock)}
                    className="hover:bg-[#2a2e39]/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <div
                        style={{ backgroundColor: stock.badgeColor || '#000000' }}
                        className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                      >
                        {stock.symbol === 'AAPL' ? (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.64 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.02-.49 2.64-1.24z" />
                          </svg>
                        ) : (
                          <span className="text-[10px]">{stock.avatarText || stock.symbol}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors">
                          {stock.name}
                        </div>
                        <div className="text-xs text-[#868993]">{stock.exchange}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums font-bold text-[#f0f3fa]">
                      {formatPrice(stock.price, stock.currency)}
                    </td>

                    <td
                      className={`py-3.5 px-4 text-right tabular-nums font-semibold ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {formatPrice(stock.change, stock.currency)}
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-xs inline-block ${
                          isUp
                            ? 'bg-emerald-950/60 text-[#089981] border border-emerald-800/30'
                            : 'bg-red-950/60 text-[#f23645] border border-red-800/30'
                        }`}
                      >
                        {isUp ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums text-[#868993]">
                      {stock.marketCap || '--'}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <svg
                        className="w-20 h-6 mx-auto"
                        viewBox={`0 0 ${svgW} ${svgH}`}
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={pathD} stroke={strokeColor} />
                      </svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
