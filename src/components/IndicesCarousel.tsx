import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { TickerItem } from '../types/market';
import { formatPrice } from '../utils/chartData';

interface IndicesCarouselProps {
  indices: TickerItem[];
  onSelectTicker: (ticker: TickerItem) => void;
}

export const IndicesCarousel: React.FC<IndicesCarouselProps> = ({
  indices,
  onSelectTicker,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="mb-10">
      {/* Section Title Link & Carousel Controls */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onSelectTicker(indices[0])}
          className="inline-flex items-center group space-x-1.5 text-2xl font-bold text-[#f0f3fa] hover:text-[#2962ff] transition-colors cursor-pointer"
        >
          <span>指数</span>
          <ChevronRight className="w-5 h-5 text-[#868993] group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all mt-0.5" />
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            aria-label="向前滑动"
            className="w-8 h-8 rounded-full border border-[#2a2e39] flex items-center justify-center hover:bg-[#1e222d] transition text-[#868993] hover:text-[#f0f3fa] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="向后滑动"
            className="w-8 h-8 rounded-full border border-[#2a2e39] flex items-center justify-center hover:bg-[#1e222d] transition text-[#868993] hover:text-[#f0f3fa] cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Index Cards Grid / Horizontal Scroll */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-3.5 overflow-x-auto custom-scrollbar pb-3 snap-x"
      >
        {indices.map((item) => {
          const isUp = item.trend === 'up';
          const strokeColor = isUp ? '#089981' : '#f23645';

          // Generate sparkline path
          const minVal = Math.min(...item.sparkline);
          const maxVal = Math.max(...item.sparkline);
          const range = maxVal - minVal || 1;
          const svgW = 160;
          const svgH = 40;
          const stepX = svgW / (item.sparkline.length - 1);

          let pathD = '';
          item.sparkline.forEach((val, idx) => {
            const x = idx * stepX;
            const y = svgH - 4 - ((val - minVal) / range) * (svgH - 8);
            if (idx === 0) pathD += `M ${x},${y}`;
            else pathD += ` L ${x},${y}`;
          });

          return (
            <div
              key={item.id}
              onClick={() => onSelectTicker(item)}
              className="min-w-[240px] sm:min-w-[260px] flex-1 border border-[#2a2e39] hover:border-[#363a45] rounded-xl p-4 bg-[#1e222d] hover:bg-[#222632] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group snap-start"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <span
                      style={{ backgroundColor: item.badgeColor || '#003884' }}
                      className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                    >
                      {item.avatarText || item.name.slice(0, 1)}
                    </span>
                    <div className="overflow-hidden">
                      <h3 className="text-sm font-semibold text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors truncate">
                        {item.name}
                      </h3>
                      <span className="text-xs text-[#868993] block truncate">
                        {item.exchange}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded shrink-0 tabular-nums ${
                      isUp
                        ? 'bg-emerald-950/60 text-[#089981] border border-emerald-800/30'
                        : 'bg-red-950/60 text-[#f23645] border border-red-800/30'
                    }`}
                  >
                    {isUp ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-1 mb-2">
                  <span className="text-xl font-bold tabular-nums text-[#f0f3fa]">
                    {formatPrice(item.price)}
                  </span>
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isUp ? '+' : ''}
                    {item.change.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Sparkline */}
              <div className="h-10 w-full pt-1">
                <svg
                  className="w-full h-full"
                  viewBox={`0 0 ${svgW} ${svgH}`}
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={pathD} stroke={strokeColor} />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
