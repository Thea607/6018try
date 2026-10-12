import React, { useState } from 'react';
import { CalendarEvent } from '../types/market';

interface CalendarSectionProps {
  events: CalendarEvent[];
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({ events }) => {
  const [activePeriod, setActivePeriod] = useState<'today' | 'week'>('today');

  const filteredEvents = events.filter((ev) => ev.period === activePeriod);

  return (
    <section className="border border-[#2a2e39] rounded-xl p-6 bg-[#181b24] mb-12 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
        <div>
          <h3 className="text-xl font-bold text-[#f0f3fa]">财经与财报日历</h3>
          <p className="text-sm text-[#868993] mt-0.5">
            关注全球主要宏观指标与即将公布季度财报的重点企业
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setActivePeriod('today')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
              activePeriod === 'today'
                ? 'bg-[#2a2e39] text-[#f0f3fa] border-[#2962ff] shadow-xs font-bold'
                : 'border-[#2a2e39] bg-[#1e222d] text-[#868993] hover:bg-[#2a2e39]'
            }`}
          >
            今日发布
          </button>
          <button
            onClick={() => setActivePeriod('week')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
              activePeriod === 'week'
                ? 'bg-[#2a2e39] text-[#f0f3fa] border-[#2962ff] shadow-xs font-bold'
                : 'border-[#2a2e39] bg-[#1e222d] text-[#868993] hover:bg-[#2a2e39]'
            }`}
          >
            本周焦点
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredEvents.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-[#1e222d] border border-[#2a2e39] rounded-xl shadow-xs hover:border-[#363a45] transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-[#868993] mb-1.5">
              <span>{item.time}</span>
              <span
                className={`font-semibold ${
                  item.importance === 3
                    ? 'text-amber-400'
                    : 'text-[#2962ff]'
                }`}
              >
                {item.tag}
              </span>
            </div>

            <div className="font-bold text-sm text-[#f0f3fa] mb-3">
              {item.title}
            </div>

            <div className="flex items-center justify-between text-xs text-[#868993] font-mono border-t border-[#2a2e39] pt-2.5">
              <span>{item.previous}</span>
              <span>{item.forecast}</span>
              <span className="font-bold text-[#f0f3fa]">{item.statusText}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
