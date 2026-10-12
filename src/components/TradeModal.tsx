import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { TickerItem } from '../types/market';
import { formatPrice } from '../utils/chartData';

interface TradeModalProps {
  ticker: TickerItem | null;
  onClose: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({ ticker, onClose }) => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [quantity, setQuantity] = useState<number>(100);
  const [limitPrice, setLimitPrice] = useState<number>(ticker?.price || 100);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderSummary, setOrderSummary] = useState<string>('');

  if (!ticker) return null;

  const effectivePrice = orderType === 'market' ? ticker.price : limitPrice;
  const estimatedTotal = effectivePrice * quantity;
  const simulatedBalance = 500000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSummary(
      `成功提交${side === 'buy' ? '买入' : '卖出'} ${ticker.name} (${ticker.symbol}) ${quantity} 单位，委托价 ${formatPrice(effectivePrice, ticker.currency)}，总金额约 ${formatPrice(estimatedTotal, ticker.currency)}`
    );
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#1e222d] rounded-2xl border border-[#2a2e39] shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2a2e39]">
          <div>
            <h3 className="text-lg font-bold text-[#f0f3fa] flex items-center space-x-2">
              <span>模拟交易下单</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-950/60 text-[#2962ff] border border-blue-800/40 font-semibold">
                模拟实盘
              </span>
            </h3>
            <p className="text-xs text-[#868993] mt-0.5">
              {ticker.name} ({ticker.symbol}) · 现价: {formatPrice(ticker.price, ticker.currency)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#868993] hover:text-[#f0f3fa] hover:bg-[#2a2e39] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-[#089981] mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-[#f0f3fa]">订单委托成功！</h4>
            <p className="text-xs text-[#868993] px-4">{orderSummary}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-[#131722] p-1 rounded-lg border border-[#2a2e39]">
              <button
                type="button"
                onClick={() => setSide('buy')}
                className={`py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  side === 'buy'
                    ? 'bg-[#089981] text-white shadow-xs'
                    : 'text-[#868993] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
                }`}
              >
                买入 / 做多
              </button>
              <button
                type="button"
                onClick={() => setSide('sell')}
                className={`py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  side === 'sell'
                    ? 'bg-[#f23645] text-white shadow-xs'
                    : 'text-[#868993] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
                }`}
              >
                卖出 / 做空
              </button>
            </div>

            {/* Order Type */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#868993] font-medium">订单类型</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setOrderType('market')}
                  className={`px-3 py-1 rounded border transition-colors cursor-pointer ${
                    orderType === 'market'
                      ? 'border-[#2962ff] bg-blue-950/60 text-[#2962ff] font-bold'
                      : 'border-[#2a2e39] text-[#868993] hover:bg-[#2a2e39]'
                  }`}
                >
                  市价单
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('limit')}
                  className={`px-3 py-1 rounded border transition-colors cursor-pointer ${
                    orderType === 'limit'
                      ? 'border-[#2962ff] bg-blue-950/60 text-[#2962ff] font-bold'
                      : 'border-[#2a2e39] text-[#868993] hover:bg-[#2a2e39]'
                  }`}
                >
                  限价单
                </button>
              </div>
            </div>

            {/* Limit Price Input */}
            {orderType === 'limit' && (
              <div>
                <label className="block text-xs font-semibold text-[#d1d4dc] mb-1">
                  委托限价 ({ticker.currency || 'CNY'})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-[#131722] text-[#f0f3fa] border border-[#2a2e39] rounded-lg focus:outline-hidden focus:border-[#2962ff]"
                  required
                />
              </div>
            )}

            {/* Quantity Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#d1d4dc]">交易数量 (股/手/张)</label>
                <span className="text-[11px] text-[#868993]">
                  可用模拟资金: ¥{simulatedBalance.toLocaleString()}
                </span>
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm bg-[#131722] text-[#f0f3fa] border border-[#2a2e39] rounded-lg focus:outline-hidden focus:border-[#2962ff]"
                required
              />
            </div>

            {/* Quick Quantity Buttons */}
            <div className="flex items-center space-x-2 text-xs">
              {[10, 50, 100, 500, 1000].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuantity(q)}
                  className="flex-1 py-1 rounded bg-[#131722] hover:bg-[#2a2e39] text-[#d1d4dc] border border-[#2a2e39] font-medium transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Calculation summary */}
            <div className="p-3 bg-[#131722] border border-[#2a2e39] rounded-lg space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#868993]">
                <span>预估成交金额</span>
                <span className="font-bold tabular-nums text-[#f0f3fa]">
                  {formatPrice(estimatedTotal, ticker.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#868993]">
                <span>预估交易佣金</span>
                <span className="font-bold tabular-nums text-[#089981]">免佣金 (模拟)</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2.5 rounded-lg text-white font-bold text-sm shadow-md transition-colors cursor-pointer ${
                side === 'buy'
                  ? 'bg-[#089981] hover:bg-emerald-600 shadow-emerald-900/30'
                  : 'bg-[#f23645] hover:bg-red-600 shadow-red-900/30'
              }`}
            >
              确认{side === 'buy' ? '买入' : '卖出'} ({formatPrice(estimatedTotal, ticker.currency)})
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
