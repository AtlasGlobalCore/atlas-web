'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ChevronDown,
  Zap,
  Clock,
  Activity,
  Globe,
  Shield,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  usd: number;
  eur: number;
  usd_24h_change: number;
  usd_market_cap: number;
}

interface ChartPoint {
  time: number;
  price: number;
  timeLabel: string;
}

type TimeFrame = '1H' | '4H' | '1D' | '1W' | '1M';
type MarketPair = 'BTC/USDT' | 'ETH/USDT' | 'SOL/USDT' | 'BNB/USDT' | 'XRP/USDT' | 'ADA/USDT' | 'LTC/USDT';

const MARKET_PAIRS: MarketPair[] = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'ADA/USDT', 'LTC/USDT'];
const TIMEFRAMES: TimeFrame[] = ['1H', '4H', '1D', '1W', '1M'];

const COIN_IDS = 'bitcoin,ethereum,litecoin,tether,binancecoin,solana,ripple,cardano';

const COIN_SYMBOL_MAP: Record<string, string> = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  litecoin: 'LTC',
  tether: 'USDT',
  binancecoin: 'BNB',
  solana: 'SOL',
  ripple: 'XRP',
  cardano: 'ADA',
};

const COIN_COLOR_MAP: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  LTC: '#BFBBBB',
  USDT: '#26A17B',
  BNB: '#F3BA2F',
  SOL: '#9945FF',
  XRP: '#00AAE4',
  ADA: '#0033AD',
};

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  return price.toFixed(6);
}

function formatMarketCap(mc: number): string {
  if (mc >= 1e12) return `$${(mc / 1e12).toFixed(2)}T`;
  if (mc >= 1e9) return `$${(mc / 1e9).toFixed(2)}B`;
  if (mc >= 1e6) return `$${(mc / 1e6).toFixed(2)}M`;
  return `$${mc.toLocaleString()}`;
}

function generateMockChartData(basePrice: number, points: number, volatility: number): ChartPoint[] {
  const data: ChartPoint[] = [];
  let price = basePrice * (1 - volatility * 0.3);
  const now = Date.now();
  const interval = (30 * 24 * 60 * 60 * 1000) / points;

  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.45) * basePrice * (volatility * 0.008);
    price = Math.max(price * 0.85, price);
    const time = now - (points - i) * interval;
    const d = new Date(time);
    data.push({
      time,
      price: Math.round(price * 100) / 100,
      timeLabel: `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:00`,
    });
  }
  return data;
}

/* ═══════════════════════════════════════════════════════
   CUSTOM CHART TOOLTIP
   ═══════════════════════════════════════════════════════ */

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel px-3 py-2 text-xs" style={{ borderColor: 'rgba(0,240,255,0.2)' }}>
      <p className="nex-mono text-[#606060] mb-1">{label}</p>
      <p className="nex-mono text-[#00F0FF] font-bold">${formatPrice(payload[0].value)}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COIN ICON (SVG)
   ═══════════════════════════════════════════════════════ */

function CoinIcon({ symbol, size = 24 }: { symbol: string; size?: number }) {
  const color = COIN_COLOR_MAP[symbol] || '#00FF41';
  return (
    <div
      className="rounded-full flex items-center justify-center font-mono-data font-bold shrink-0"
      style={{
        width: size,
        height: size,
        background: `${color}20`,
        border: `1.5px solid ${color}40`,
        color,
        fontSize: size * 0.38,
      }}
    >
      {symbol.slice(0, 2)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MARKET OVERVIEW CARDS
   ═══════════════════════════════════════════════════════ */

function MarketCard({
  coin,
  index,
  onClick,
}: {
  coin: CoinData;
  index: number;
  onClick: (pair: MarketPair) => void;
}) {
  const symbol = COIN_SYMBOL_MAP[coin.id] || coin.symbol.toUpperCase();
  const isPositive = coin.usd_24h_change >= 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(`${symbol}/USDT` as MarketPair)}
      className="w-full p-4 rounded-lg text-left transition-all hover-lift"
      style={{
        background: 'rgba(14, 17, 23, 0.65)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <CoinIcon symbol={symbol} size={32} />
          <div>
            <p className="text-sm font-semibold text-[#E0E0E0]">{coin.name}</p>
            <p className="nex-mono text-[10px] text-[#808080]">{symbol}/USDT</p>
          </div>
        </div>
        <div
          className="neon-badge"
          style={{
            background: isPositive ? 'rgba(0,255,65,0.08)' : 'rgba(255,82,82,0.08)',
            border: `1px solid ${isPositive ? 'rgba(0,255,65,0.2)' : 'rgba(255,82,82,0.2)'}`,
            color: isPositive ? '#00FF41' : '#FF5252',
          }}
        >
          {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {Math.abs(coin.usd_24h_change).toFixed(2)}%
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="nex-mono text-lg font-bold text-[#FFFFFF]">${formatPrice(coin.usd)}</p>
        <div className="text-right">
          <p className="nex-mono text-[10px] text-[#606060]">MCap</p>
          <p className="nex-mono text-[11px] text-[#A0A0A0]">{formatMarketCap(coin.usd_market_cap)}</p>
        </div>
      </div>
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════
   TRADING CHART SECTION
   ═══════════════════════════════════════════════════════ */

function TradingChartSection({
  selectedPair,
  selectedTimeframe,
  coinsData,
}: {
  selectedPair: MarketPair;
  selectedTimeframe: TimeFrame;
  coinsData: CoinData[];
}) {
  const symbol = selectedPair.split('/')[0];
  const coin = coinsData.find((c) => COIN_SYMBOL_MAP[c.id] === symbol);

  const chartData = useMemo(() => {
    const basePrice = coin?.usd || (symbol === 'BTC' ? 65000 : symbol === 'ETH' ? 3200 : 150);
    const vol = selectedTimeframe === '1H' ? 0.003 : selectedTimeframe === '4H' ? 0.008 : selectedTimeframe === '1D' ? 0.02 : selectedTimeframe === '1W' ? 0.05 : 0.1;
    const points = selectedTimeframe === '1H' ? 30 : selectedTimeframe === '4H' ? 40 : selectedTimeframe === '1D' ? 50 : selectedTimeframe === '1W' ? 60 : 80;
    return generateMockChartData(basePrice, points, vol);
  }, [coin?.usd, symbol, selectedTimeframe]);

  const isUp = chartData.length > 1 && chartData[chartData.length - 1].price >= chartData[0].price;
  const color = isUp ? '#00FF41' : '#FF5252';
  const colorRgb = isUp ? '0,255,65' : '255,82,82';

  const minPrice = Math.min(...chartData.map((d) => d.price));
  const maxPrice = Math.max(...chartData.map((d) => d.price));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full rounded-lg overflow-hidden"
      style={{
        background: 'rgba(14, 17, 23, 0.65)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Chart header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <CoinIcon symbol={symbol} size={28} />
          <div>
            <div className="flex items-center gap-2">
              <p className="nex-mono text-base font-bold text-[#FFFFFF]">{selectedPair}</p>
              <span
                className="nex-mono text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  background: isUp ? 'rgba(0,255,65,0.1)' : 'rgba(255,82,82,0.1)',
                  color,
                }}
              >
                {isUp ? '+' : ''}
                {((chartData[chartData.length - 1]?.price ?? 0) - (chartData[0]?.price ?? 0)) > 0 ? '+' : ''}
                {chartData.length > 1
                  ? (((chartData[chartData.length - 1].price - chartData[0].price) / chartData[0].price) * 100).toFixed(2)
                  : '0.00'}
                %
              </span>
            </div>
            <p className="nex-mono text-[10px] text-[#606060]">
              {coin?.name || symbol} · Binance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" style={{ color }} />
          <span className="nex-mono text-xs" style={{ color }}>LIVE</span>
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 pb-4" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timeLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#606060', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice * 0.998, maxPrice * 1.002]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#606060', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              tickFormatter={(v) => `$${formatPrice(v)}`}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={chartData[0]?.price} stroke={color} strokeOpacity={0.2} strokeDasharray="4 4" />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#gradient-${symbol})`}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: '#0A0A0A', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   ONRAMP PLACEHOLDER
   ═══════════════════════════════════════════════════════ */

function OnrampPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full rounded-xl overflow-hidden"
      style={{
        background: 'rgba(14, 17, 23, 0.65)',
        border: '1px solid rgba(0,240,255,0.15)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Breathing glow border */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 20px rgba(0,240,255,0.05), inset 0 0 20px rgba(0,240,255,0.02)',
            '0 0 40px rgba(0,240,255,0.1), inset 0 0 30px rgba(0,240,255,0.04)',
            '0 0 20px rgba(0,240,255,0.05), inset 0 0 20px rgba(0,240,255,0.02)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative p-6 md:p-8 text-center">
        {/* Icon */}
        <motion.div
          className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(0,240,255,0.08)',
            border: '1.5px solid rgba(0,240,255,0.2)',
          }}
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 10px rgba(0,240,255,0.1)',
              '0 0 25px rgba(0,240,255,0.2)',
              '0 0 10px rgba(0,240,255,0.1)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Zap className="w-7 h-7 text-[#00F0FF]" />
        </motion.div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-[#FFFFFF] mb-1.5">
          Compre Crypto em Direto
        </h3>
        <p className="nex-mono text-sm text-[#00F0FF] mb-2 glow-blue">
          Buy Crypto Instantly
        </p>

        {/* Coming Soon badge */}
        <motion.div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5"
          style={{
            background: 'rgba(0,240,255,0.06)',
            border: '1px solid rgba(0,240,255,0.15)',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Clock className="w-3 h-3 text-[#00F0FF]" />
          <span className="nex-mono text-[10px] text-[#00F0FF] tracking-widest">EM BREVE DISPONÍVEL</span>
        </motion.div>

        {/* Description */}
        <p className="nex-mono text-xs text-[#A0A0A0] mb-6 max-w-xs mx-auto leading-relaxed">
          Compre USDT, BTC, LTC e muito mais com
        </p>

        {/* Payment Methods */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
          {/* Google Pay */}
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
            style={{
              background: 'rgba(66,133,244,0.08)',
              border: '1px solid rgba(66,133,244,0.15)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="nex-mono text-[11px] font-bold text-[#4285F4]">G Pay</span>
          </div>

          {/* Apple Pay */}
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
              <path d="M11.18 8.56c-.02-2.13 1.74-3.15 1.82-3.2-0.99-1.44-2.53-1.64-3.08-1.66-1.31-.13-2.56.78-3.23.78s-1.69-.76-2.78-.74A4.11 4.11 0 0 0 .75 6.19c-1.5 2.59-.38 6.43 1.07 8.53.71 1.04 1.56 2.21 2.67 2.17 1.08-.04 1.49-.7 2.79-.7s1.67.7 2.81.68c1.15-.02 1.88-1.06 2.58-2.11.81-1.2 1.15-2.36 1.17-2.42-.03-.01-2.24-.86-2.26-3.42v-.36zM9.52 1.85A3.95 3.95 0 0 0 10.34.14a4.02 4.02 0 0 0-2.66 1.36 3.76 3.76 0 0 0-.82 1.68 3.29 3.29 0 0 0 2.66-1.33z" fill="#FFFFFF"/>
            </svg>
            <span className="nex-mono text-[11px] font-bold text-[#FFFFFF]"> Pay</span>
          </div>

          {/* SEPA */}
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
            style={{
              background: 'rgba(0,51,153,0.08)',
              border: '1px solid rgba(0,51,153,0.2)',
            }}
          >
            <div className="w-4 h-4 rounded-full bg-[#003399] flex items-center justify-center">
              <span className="nex-mono text-[7px] font-bold text-white">EU</span>
            </div>
            <span className="nex-mono text-[11px] font-bold text-[#4477CC]">SEPA</span>
          </div>

          {/* PIX */}
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
            style={{
              background: 'rgba(0,166,81,0.08)',
              border: '1px solid rgba(0,166,81,0.2)',
            }}
          >
            <div
              className="w-4 h-4 rounded flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00A651, #00D474)' }}
            >
              <span className="nex-mono text-[6px] font-bold text-white">◆</span>
            </div>
            <span className="nex-mono text-[11px] font-bold text-[#00D474]">PIX</span>
          </div>
        </div>

        {/* Bottom notice */}
        <p className="nex-mono text-[10px] text-[#505050]">
          Atlas Core Onramp · Regulated &middot; Licensed &middot; Secure
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   ORDER BOOK / TICKER (Side panel)
   ═══════════════════════════════════════════════════════ */

function TickerStrip({ coinsData }: { coinsData: CoinData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full rounded-lg overflow-hidden"
      style={{
        background: 'rgba(14, 17, 23, 0.65)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span className="nex-mono text-[10px] text-[#A0A0A0] tracking-widest uppercase">Market Ticker</span>
        </div>
        <span className="nex-mono text-[9px] text-[#505050]">24H</span>
      </div>
      <div className="divide-y divide-[rgba(255,255,255,0.03)]">
        {coinsData
          .filter((c) => c.id !== 'tether')
          .map((coin) => {
            const symbol = COIN_SYMBOL_MAP[coin.id] || coin.symbol.toUpperCase();
            const isPositive = coin.usd_24h_change >= 0;
            return (
              <div key={coin.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <div className="flex items-center gap-2.5">
                  <CoinIcon symbol={symbol} size={24} />
                  <div>
                    <p className="text-xs font-medium text-[#D0D0D0]">{symbol}</p>
                    <p className="nex-mono text-[9px] text-[#606060]">{coin.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="nex-mono text-xs text-[#E0E0E0]">${formatPrice(coin.usd)}</p>
                  <p
                    className="nex-mono text-[10px]"
                    style={{ color: isPositive ? '#00FF41' : '#FF5252' }}
                  >
                    {isPositive ? '+' : ''}{coin.usd_24h_change.toFixed(2)}%
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   STAT BANNER
   ═══════════════════════════════════════════════════════ */

function StatBanner({ coinsData }: { coinsData: CoinData[] }) {
  const totalMcap = coinsData.reduce((acc, c) => acc + c.usd_market_cap, 0);
  const btc = coinsData.find((c) => c.id === 'bitcoin');
  const btcDom = btc ? ((btc.usd_market_cap / totalMcap) * 100).toFixed(1) : '0';
  const avgChange = coinsData.filter((c) => c.id !== 'tether').reduce((acc, c) => acc + c.usd_24h_change, 0) / (coinsData.length - 1);

  const stats = [
    { label: 'Total Market Cap', value: formatMarketCap(totalMcap), color: '#00F0FF' },
    { label: 'BTC Dominance', value: `${btcDom}%`, color: '#F7931A' },
    { label: '24H Avg Change', value: `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%`, color: avgChange >= 0 ? '#00FF41' : '#FF5252' },
    { label: 'Active Markets', value: coinsData.filter((c) => c.id !== 'tether').length.toString(), color: '#A855F7' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="p-3 rounded-lg"
          style={{
            background: 'rgba(14, 17, 23, 0.5)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <p className="nex-mono text-[9px] text-[#606060] tracking-wider uppercase mb-1">{stat.label}</p>
          <p className="nex-mono text-sm md:text-base font-bold" style={{ color: stat.color }}>
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXCHANGE PAGE
   ═══════════════════════════════════════════════════════ */

export function ExchangePage() {
  const [selectedPair, setSelectedPair] = useState<MarketPair>('BTC/USDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('1D');
  const [pairDropdownOpen, setPairDropdownOpen] = useState(false);
  const [tfDropdownOpen, setTfDropdownOpen] = useState(false);

  // Fetch CoinGecko data
  const { data, isLoading, isError, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['coingecko-markets'],
    queryFn: async () => {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_IDS}&vs_currencies=usd,eur&include_24hr_change=true&include_market_cap=true`
      );
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json() as Promise<Record<string, CoinData>>;
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const coinsData: CoinData[] = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).map(([id, coin]) => ({
      ...coin,
      id,
      symbol: COIN_SYMBOL_MAP[id] || id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      image: '',
    }));
  }, [data]);

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-bg-animated pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* ═══ HEADER ═══ */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'rgba(0,240,255,0.08)',
                border: '1px solid rgba(0,240,255,0.15)',
              }}
            >
              <BarChart3 className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] tracking-tight">Exchange</h1>
              <p className="nex-mono text-[10px] text-[#606060] tracking-widest uppercase">
                Global Crypto Markets &middot; Real-time Data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {dataUpdatedAt > 0 && (
              <span className="nex-mono text-[9px] text-[#404040] hidden sm:block">
                Updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all"
              style={{
                background: 'rgba(0,240,255,0.06)',
                border: '1px solid rgba(0,240,255,0.15)',
                color: '#00F0FF',
              }}
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="nex-mono text-[10px] tracking-wider">REFRESH</span>
            </button>
          </div>
        </motion.header>

        {/* ═══ STAT BANNER ═══ */}
        {coinsData.length > 0 && <StatBanner coinsData={coinsData} />}

        {/* ═══ MAIN GRID ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── LEFT COLUMN: Chart + Onramp ── */}
          <div className="lg:col-span-8 space-y-6">
            {/* Controls: Pair + Timeframe */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Pair Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setPairDropdownOpen(!pairDropdownOpen); setTfDropdownOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#E0E0E0',
                  }}
                >
                  <CoinIcon symbol={selectedPair.split('/')[0]} size={18} />
                  <span className="nex-mono text-xs font-bold">{selectedPair}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#808080]" />
                </button>
                <AnimatePresence>
                  {pairDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full left-0 mt-1 z-20 rounded-lg overflow-hidden min-w-[160px] cyber-scrollbar max-h-64 overflow-y-auto"
                      style={{
                        background: '#111111',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {MARKET_PAIRS.map((pair) => {
                        const sym = pair.split('/')[0];
                        return (
                          <button
                            key={pair}
                            onClick={() => { setSelectedPair(pair); setPairDropdownOpen(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                              selectedPair === pair ? 'bg-[rgba(0,240,255,0.06)]' : 'hover:bg-[rgba(255,255,255,0.03)]'
                            }`}
                          >
                            <CoinIcon symbol={sym} size={18} />
                            <span
                              className="nex-mono text-xs"
                              style={{ color: selectedPair === pair ? '#00F0FF' : '#C0C0C0' }}
                            >
                              {pair}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Timeframe Selector */}
              <div className="relative">
                <button
                  onClick={() => { setTfDropdownOpen(!tfDropdownOpen); setPairDropdownOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#E0E0E0',
                  }}
                >
                  <Clock className="w-3.5 h-3.5 text-[#808080]" />
                  <span className="nex-mono text-xs font-bold">{selectedTimeframe}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#808080]" />
                </button>
                <AnimatePresence>
                  {tfDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full left-0 mt-1 z-20 rounded-lg overflow-hidden"
                      style={{
                        background: '#111111',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {TIMEFRAMES.map((tf) => (
                        <button
                          key={tf}
                          onClick={() => { setSelectedTimeframe(tf); setTfDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 nex-mono text-xs transition-colors ${
                            selectedTimeframe === tf ? 'bg-[rgba(0,255,65,0.06)] text-[#00FF41]' : 'text-[#C0C0C0] hover:bg-[rgba(255,255,255,0.03)]'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Chart Section */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-[#00F0FF] mx-auto mb-3" />
                  <p className="nex-mono text-xs text-[#606060]">Loading market data...</p>
                </div>
              </div>
            ) : isError || coinsData.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Activity className="w-6 h-6 text-[#FF5252] mx-auto mb-3" />
                  <p className="nex-mono text-xs text-[#606060]">Unable to fetch market data. Retrying...</p>
                </div>
              </div>
            ) : (
              <>
                <TradingChartSection
                  selectedPair={selectedPair}
                  selectedTimeframe={selectedTimeframe}
                  coinsData={coinsData}
                />

                {/* Onramp */}
                <OnrampPlaceholder />
              </>
            )}
          </div>

          {/* ── RIGHT COLUMN: Market Ticker ── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Top coins cards */}
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-[#00FF41]" />
              </div>
            ) : coinsData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 max-h-[520px] overflow-y-auto cyber-scrollbar pr-1">
                {coinsData
                  .filter((c) => c.id !== 'tether')
                  .map((coin, i) => (
                    <MarketCard
                      key={coin.id}
                      coin={coin}
                      index={i}
                      onClick={(pair) => setSelectedPair(pair)}
                    />
                  ))}
              </div>
            ) : null}

            {/* Ticker strip */}
            {coinsData.length > 0 && <TickerStrip coinsData={coinsData} />}

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-4 rounded-lg"
              style={{
                background: 'rgba(14, 17, 23, 0.5)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#00FF41]" />
                <span className="nex-mono text-[10px] text-[#00FF41] tracking-widest uppercase">Security</span>
              </div>
              <p className="nex-mono text-[10px] text-[#808080] leading-relaxed">
                All data sourced from CoinGecko API. Atlas Core is a Technical Service Provider — not a financial institution.
                Trading involves risk. Always do your own research.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
