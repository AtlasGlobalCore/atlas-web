'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Zap,
  Clock,
  Activity,
  Globe,
  Shield,
  Loader2,
  RefreshCw,
  Volume2,
  Flame,
  Droplets,
  Layers,
  ArrowUpRight,
  Radio,
  Search,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  count: number;
}

interface BinanceKline {
  0: number;   // Open time
  1: string;   // Open
  2: string;   // High
  3: string;   // Low
  4: string;   // Close
  5: string;   // Volume
  6: number;   // Close time
  7: string;   // Quote volume
  8: number;   // Trades
}

interface ChartPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timeLabel: string;
}

type TimeFrame = '1H' | '4H' | '1D' | '1W' | '1M';
type MarketPair = 'BTCUSDT' | 'ETHUSDT' | 'SOLUSDT' | 'BNBUSDT' | 'XRPUSDT' | 'ADAUSDT' | 'LTCUSDT' | 'DOGEUSDT' | 'DOTUSDT' | 'AVAXUSDT';

const TRACKED_PAIRS: MarketPair[] = [
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT',
  'ADAUSDT', 'LTCUSDT', 'DOGEUSDT', 'DOTUSDT', 'AVAXUSDT',
];

const CHART_PAIRS: MarketPair[] = [
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'LTCUSDT',
];

const TIMEFRAMES: TimeFrame[] = ['1H', '4H', '1D', '1W', '1M'];

const INTERVAL_MAP: Record<TimeFrame, string> = {
  '1H': '1h',
  '4H': '4h',
  '1D': '1d',
  '1W': '1w',
  '1M': '1M',
};

const COIN_NAMES: Record<string, string> = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  SOL: 'Solana',
  BNB: 'BNB Chain',
  XRP: 'XRP',
  ADA: 'Cardano',
  LTC: 'Litecoin',
  DOGE: 'Dogecoin',
  DOT: 'Polkadot',
  AVAX: 'Avalanche',
};

const COIN_COLOR_MAP: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#9945FF',
  BNB: '#F3BA2F',
  XRP: '#00AAE4',
  ADA: '#0033AD',
  LTC: '#BFBBBB',
  DOGE: '#C3A634',
  DOT: '#E6007A',
  AVAX: '#E84142',
};

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return '$0.00';
  if (num >= 1000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (num >= 1) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  if (num >= 0.01) return num.toFixed(4);
  return num.toFixed(6);
}

function formatVolume(vol: number | string): string {
  const num = typeof vol === 'string' ? parseFloat(vol) : vol;
  if (isNaN(num)) return '$0';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
  return `$${num.toFixed(0)}`;
}

function formatPairDisplay(symbol: string): string {
  return symbol.replace('USDT', '/USDT');
}

function getBaseSymbol(symbol: string): string {
  return symbol.replace('USDT', '');
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOM CHART TOOLTIP
   ═══════════════════════════════════════════════════════════════ */

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: ChartPoint }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const isUp = d.close >= d.open;
  const color = isUp ? '#00FF41' : '#FF5252';

  return (
    <div
      className="glass-panel px-4 py-3 text-xs"
      style={{ borderColor: `${color}30` }}
    >
      <p className="nex-mono text-[#606060] mb-2">{label}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span className="nex-mono text-[#808080]">Open</span>
        <span className="nex-mono text-[#C0C0C0] text-right">${formatPrice(d.open)}</span>
        <span className="nex-mono text-[#808080]">High</span>
        <span className="nex-mono text-[#00FF41] text-right">${formatPrice(d.high)}</span>
        <span className="nex-mono text-[#808080]">Low</span>
        <span className="nex-mono text-[#FF5252] text-right">${formatPrice(d.low)}</span>
        <span className="nex-mono text-[#808080]">Close</span>
        <span className="nex-mono font-bold text-right" style={{ color }}>${formatPrice(d.close)}</span>
        <span className="nex-mono text-[#808080]">Vol</span>
        <span className="nex-mono text-[#A0A0A0] text-right">{formatVolume(d.volume)}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COIN ICON
   ═══════════════════════════════════════════════════════════════ */

function CoinIcon({ symbol, size = 24 }: { symbol: string; size?: number }) {
  const color = COIN_COLOR_MAP[symbol] || '#00FF41';
  return (
    <div
      className="rounded-full flex items-center justify-center font-mono-data font-bold shrink-0"
      style={{
        width: size,
        height: size,
        background: `${color}18`,
        border: `1.5px solid ${color}35`,
        color,
        fontSize: size * 0.36,
      }}
    >
      {symbol.slice(0, 2)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LIVE INDICATOR (pulsing dot)
   ═══════════════════════════════════════════════════════════════ */

function LiveIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <span className="status-dot active" />
        <motion.span
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          style={{ background: '#39FF14' }}
        />
      </div>
      <span className="nex-mono text-[10px] text-[#39FF14] tracking-wider font-semibold">LIVE</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TICKER TAPE (scrolling banner)
   ═══════════════════════════════════════════════════════════════ */

function TickerTape({ tickers }: { tickers: BinanceTicker[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const tracked = useMemo(() => {
    return TRACKED_PAIRS.map(pair => {
      const t = tickers.find(t => t.symbol === pair);
      if (!t) return null;
      const base = getBaseSymbol(pair);
      const change = parseFloat(t.priceChangePercent);
      return { symbol: pair, base, price: parseFloat(t.lastPrice), change, color: COIN_COLOR_MAP[base] || '#00FF41' };
    }).filter(Boolean) as Array<{ symbol: string; base: string; price: number; change: number; color: string }>;
  }, [tickers]);

  if (tracked.length === 0) return null;

  return (
    <div className="w-full overflow-hidden relative" style={{ height: 36 }}>
      <div className="absolute inset-y-0 left-0 w-16 z-10" style={{ background: 'linear-gradient(to right, #0A0A0A, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-16 z-10" style={{ background: 'linear-gradient(to left, #0A0A0A, transparent)' }} />
      <div className="absolute inset-y-0 left-0 right-0" style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }} />

      <motion.div
        ref={scrollRef}
        className="flex items-center h-full gap-8 whitespace-nowrap"
        animate={{ x: [0, -(tracked.length * 200)] }}
        transition={{ duration: tracked.length * 4, repeat: Infinity, ease: 'linear' }}
      >
        {[...tracked, ...tracked, ...tracked].map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center gap-2 px-3">
            <CoinIcon symbol={item.base} size={18} />
            <span className="nex-mono text-[11px] text-[#A0A0A0] font-semibold">{item.base}</span>
            <span className="nex-mono text-[11px] text-[#E0E0E0]">${formatPrice(item.price)}</span>
            <span
              className="nex-mono text-[10px] font-semibold"
              style={{ color: item.change >= 0 ? '#00FF41' : '#FF5252' }}
            >
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STAT BANNER
   ═══════════════════════════════════════════════════════════════ */

function StatBanner({ tickers }: { tickers: BinanceTicker[] }) {
  const stats = useMemo(() => {
    const tracked = TRACKED_PAIRS
      .map(pair => tickers.find(t => t.symbol === pair))
      .filter(Boolean) as BinanceTicker[];

    if (tracked.length === 0) return [];

    const totalVolume = tracked.reduce((sum, t) => sum + parseFloat(t.quoteVolume), 0);
    const sorted = [...tracked].sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent));
    const topGainer = sorted[0];
    const topLoser = sorted[sorted.length - 1];

    return [
      {
        label: '24H Volume (Tracked)',
        value: formatVolume(totalVolume),
        color: '#00F0FF',
        icon: <Volume2 className="w-4 h-4" />,
      },
      {
        label: 'Top Gainer',
        value: `${getBaseSymbol(topGainer.symbol)} +${parseFloat(topGainer.priceChangePercent).toFixed(2)}%`,
        color: '#00FF41',
        icon: <Flame className="w-4 h-4" />,
      },
      {
        label: 'Top Loser',
        value: `${getBaseSymbol(topLoser.symbol)} ${parseFloat(topLoser.priceChangePercent).toFixed(2)}%`,
        color: '#FF5252',
        icon: <Droplets className="w-4 h-4" />,
      },
      {
        label: 'Active Pairs',
        value: tracked.length.toString(),
        color: '#A855F7',
        icon: <Layers className="w-4 h-4" />,
      },
    ];
  }, [tickers]);

  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="p-4 rounded-xl hover-lift cursor-default"
          style={{
            background: 'rgba(14, 17, 23, 0.55)',
            border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `${stat.color}12`, border: `1px solid ${stat.color}25` }}
            >
              <span style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <p className="nex-mono text-[9px] text-[#606060] tracking-wider uppercase">{stat.label}</p>
          </div>
          <p className="nex-mono text-sm md:text-base font-bold truncate" style={{ color: stat.color }}>
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRADING CHART SECTION (REAL Binance Klines)
   ═══════════════════════════════════════════════════════════════ */

function TradingChartSection({
  selectedPair,
  selectedTimeframe,
}: {
  selectedPair: MarketPair;
  selectedTimeframe: TimeFrame;
}) {
  const base = getBaseSymbol(selectedPair);
  const color = COIN_COLOR_MAP[base] || '#00F0FF';
  const binanceInterval = INTERVAL_MAP[selectedTimeframe];

  const { data: klines, isLoading, isError } = useQuery({
    queryKey: ['klines', selectedPair, selectedTimeframe],
    queryFn: async () => {
      const res = await fetch(
        `/api/exchange?type=klines&symbol=${selectedPair}&interval=${binanceInterval}&limit=60`
      );
      if (!res.ok) throw new Error('Failed to fetch klines');
      return res.json() as Promise<BinanceKline[]>;
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const chartData: ChartPoint[] = useMemo(() => {
    if (!klines || !Array.isArray(klines)) return [];
    return klines.map((k) => {
      const d = new Date(k[0]);
      let timeLabel: string;
      if (selectedTimeframe === '1H' || selectedTimeframe === '4H') {
        timeLabel = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:00`;
      } else if (selectedTimeframe === '1D') {
        timeLabel = `${d.getMonth() + 1}/${d.getDate()}`;
      } else if (selectedTimeframe === '1W') {
        timeLabel = `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      } else {
        timeLabel = `${d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}`;
      }
      return {
        time: k[0],
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
        timeLabel,
      };
    });
  }, [klines, selectedTimeframe]);

  const firstClose = chartData[0]?.open;
  const lastClose = chartData[chartData.length - 1]?.close;
  const changePercent = firstClose && lastClose ? ((lastClose - firstClose) / firstClose) * 100 : 0;
  const isUp = changePercent >= 0;
  const gradientColor = isUp ? '#00FF41' : '#FF5252';
  const gradientRgb = isUp ? '0,255,65' : '255,82,82';

  const minPrice = chartData.length > 0 ? Math.min(...chartData.map(d => d.low)) : 0;
  const maxPrice = chartData.length > 0 ? Math.max(...chartData.map(d => d.high)) : 0;
  const padding = (maxPrice - minPrice) * 0.08 || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-xl overflow-hidden"
      style={{
        background: 'rgba(14, 17, 23, 0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Chart header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <CoinIcon symbol={base} size={32} />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <p className="nex-mono text-lg font-bold text-[#FFFFFF]">{formatPairDisplay(selectedPair)}</p>
              <span
                className="nex-mono text-[10px] px-2 py-0.5 rounded-md font-semibold"
                style={{
                  background: isUp ? 'rgba(0,255,65,0.1)' : 'rgba(255,82,82,0.1)',
                  border: `1px solid ${isUp ? 'rgba(0,255,65,0.2)' : 'rgba(255,82,82,0.2)'}`,
                  color: gradientColor,
                }}
              >
                {isUp ? '+' : ''}{changePercent.toFixed(2)}%
              </span>
              <span className="nex-mono text-[10px] text-[#505050]">
                {COIN_NAMES[base]} · Binance
              </span>
            </div>
            {lastClose && (
              <p className="nex-mono text-xl font-bold mt-0.5" style={{ color: gradientColor }}>
                ${formatPrice(lastClose)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" style={{ color: gradientColor }} />
          <LiveIndicator />
        </div>
      </div>

      {/* Chart area */}
      <div className="px-2 pb-2" style={{ height: 340 }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#00F0FF] mx-auto mb-3" />
              <p className="nex-mono text-xs text-[#606060]">Loading chart data...</p>
            </div>
          </div>
        ) : isError || chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Radio className="w-6 h-6 text-[#FF5252] mx-auto mb-3" />
              <p className="nex-mono text-xs text-[#606060]">Unable to load chart. Retrying...</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`chartGradient-${base}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gradientColor} stopOpacity={0.18} />
                  <stop offset="60%" stopColor={gradientColor} stopOpacity={0.05} />
                  <stop offset="100%" stopColor={gradientColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id={`lineGradient-${base}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={gradientColor} stopOpacity={0.6} />
                  <stop offset="50%" stopColor={gradientColor} stopOpacity={1} />
                  <stop offset="100%" stopColor={gradientColor} stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis
                dataKey="timeLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#505050', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[minPrice - padding, maxPrice + padding]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#505050', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(v) => `$${formatPrice(v)}`}
                width={80}
              />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={firstClose} stroke={gradientColor} strokeOpacity={0.15} strokeDasharray="4 4" />
              <Area
                type="monotone"
                dataKey="close"
                stroke={`url(#lineGradient-${base})`}
                strokeWidth={2}
                fill={`url(#chartGradient-${base})`}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: gradientColor,
                  stroke: '#0A0A0A',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Volume bars mini */}
      {chartData.length > 0 && (
        <div className="px-5 pb-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="nex-mono text-[9px] text-[#404040] mb-1">24H Volume</p>
            <p className="nex-mono text-[11px] text-[#A0A0A0]">{formatVolume(chartData.reduce((s, d) => s + d.volume, 0))}</p>
          </div>
          <div className="flex items-center gap-3 text-[9px] nex-mono text-[#505050]">
            <span>H: <span className="text-[#00FF41]">${formatPrice(Math.max(...chartData.map(d => d.high)))}</span></span>
            <span>L: <span className="text-[#FF5252]">${formatPrice(Math.min(...chartData.map(d => d.low)))}</span></span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MARKET TICKER TABLE
   ═══════════════════════════════════════════════════════════════ */

function MarketTicker({
  tickers,
  onSelect,
  selectedPair,
  searchQuery,
  onSearchChange,
}: {
  tickers: BinanceTicker[];
  onSelect: (pair: MarketPair) => void;
  selectedPair: MarketPair;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  const filtered = useMemo(() => {
    const tracked = TRACKED_PAIRS
      .map(pair => {
        const t = tickers.find(t => t.symbol === pair);
        if (!t) return null;
        const base = getBaseSymbol(pair);
        return { ...t, base };
      })
      .filter(Boolean) as Array<BinanceTicker & { base: string }>;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return tracked.filter(
        t => t.base.toLowerCase().includes(q) || (COIN_NAMES[t.base] || '').toLowerCase().includes(q)
      );
    }
    return tracked;
  }, [tickers, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-xl overflow-hidden"
      style={{
        background: 'rgba(14, 17, 23, 0.55)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span className="nex-mono text-[10px] text-[#A0A0A0] tracking-widest uppercase">Market Pairs</span>
        </div>
        <span className="nex-mono text-[9px] text-[#505050]">{filtered.length} pairs</span>
      </div>

      {/* Search */}
      <div className="px-4 py-2.5 border-b border-[rgba(255,255,255,0.03)]">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Search className="w-3 h-3 text-[#505050]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search pairs..."
            className="bg-transparent outline-none nex-mono text-[11px] text-[#C0C0C0] placeholder-[#404040] w-full"
          />
        </div>
      </div>

      {/* Table header */}
      <div className="px-4 py-2 flex items-center text-[9px] nex-mono text-[#505050] tracking-wider uppercase border-b border-[rgba(255,255,255,0.03)]">
        <span className="flex-1">Pair</span>
        <span className="w-24 text-right">Price</span>
        <span className="w-20 text-right">24H %</span>
      </div>

      {/* Pairs list */}
      <div className="max-h-[420px] overflow-y-auto cyber-scrollbar">
        {filtered.map((ticker, i) => {
          const base = ticker.base;
          const price = parseFloat(ticker.lastPrice);
          const change = parseFloat(ticker.priceChangePercent);
          const isPositive = change >= 0;
          const isSelected = ticker.symbol === selectedPair;
          const coinColor = COIN_COLOR_MAP[base] || '#00FF41';

          return (
            <motion.button
              key={ticker.symbol}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              onClick={() => onSelect(ticker.symbol as MarketPair)}
              className="w-full flex items-center px-4 py-2.5 text-left transition-all"
              style={{
                background: isSelected ? 'rgba(0,240,255,0.05)' : 'transparent',
                borderBottom: '1px solid rgba(255,255,255,0.02)',
              }}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Pair info */}
              <div className="flex-1 flex items-center gap-2.5 min-w-0">
                <CoinIcon symbol={base} size={26} />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#E0E0E0] truncate">{base}</p>
                  <p className="nex-mono text-[9px] text-[#505050] truncate">{COIN_NAMES[base]}</p>
                </div>
              </div>

              {/* Price */}
              <div className="w-24 text-right">
                <p className="nex-mono text-[11px] text-[#E0E0E0]">${formatPrice(price)}</p>
                <p className="nex-mono text-[8px] text-[#404050]">{formatVolume(parseFloat(ticker.quoteVolume))}</p>
              </div>

              {/* Change badge */}
              <div className="w-20 text-right">
                <span
                  className="nex-mono text-[10px] font-bold inline-flex items-center gap-0.5"
                  style={{ color: isPositive ? '#00FF41' : '#FF5252' }}
                >
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isPositive ? '+' : ''}{change.toFixed(2)}%
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ONRAMP PLACEHOLDER
   ═══════════════════════════════════════════════════════════════ */

function OnrampPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(14,17,23,0.7), rgba(0,240,255,0.03))',
        border: '1px solid rgba(0,240,255,0.12)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Animated glow border */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 30px rgba(0,240,255,0.04), inset 0 0 30px rgba(0,240,255,0.01)',
            '0 0 60px rgba(0,240,255,0.08), inset 0 0 40px rgba(0,240,255,0.03)',
            '0 0 30px rgba(0,240,255,0.04), inset 0 0 30px rgba(0,240,255,0.01)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative p-6 md:p-8 text-center">
        {/* Icon with pulse */}
        <motion.div
          className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(0,240,255,0.08)',
            border: '1.5px solid rgba(0,240,255,0.2)',
          }}
          animate={{
            scale: [1, 1.06, 1],
            boxShadow: [
              '0 0 15px rgba(0,240,255,0.1)',
              '0 0 35px rgba(0,240,255,0.25)',
              '0 0 15px rgba(0,240,255,0.1)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Zap className="w-7 h-7 text-[#00F0FF]" />
        </motion.div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-[#FFFFFF] mb-1.5">
          Buy Crypto Instantly
        </h3>
        <p className="nex-mono text-sm text-[#00F0FF] mb-3 glow-blue">
          Compre Cripto em Direto
        </p>

        {/* Coming Soon badge */}
        <motion.div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5"
          style={{
            background: 'rgba(0,240,255,0.06)',
            border: '1px solid rgba(0,240,255,0.15)',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Clock className="w-3 h-3 text-[#00F0FF]" />
          <span className="nex-mono text-[10px] text-[#00F0FF] tracking-widest">COMING SOON</span>
        </motion.div>

        <p className="nex-mono text-xs text-[#A0A0A0] mb-6 max-w-xs mx-auto leading-relaxed">
          Buy USDT, BTC, ETH, LTC and more directly with your preferred payment method
        </p>

        {/* Payment Methods */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
          {/* Google Pay */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ background: 'rgba(66,133,244,0.08)', border: '1px solid rgba(66,133,244,0.15)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="nex-mono text-[11px] font-bold text-[#4285F4]">G Pay</span>
          </div>

          {/* Apple Pay */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
              <path d="M11.18 8.56c-.02-2.13 1.74-3.15 1.82-3.2-0.99-1.44-2.53-1.64-3.08-1.66-1.31-.13-2.56.78-3.23.78s-1.69-.76-2.78-.74A4.11 4.11 0 0 0 .75 6.19c-1.5 2.59-.38 6.43 1.07 8.53.71 1.04 1.56 2.21 2.67 2.17 1.08-.04 1.49-.7 2.79-.7s1.67.7 2.81.68c1.15-.02 1.88-1.06 2.58-2.11.81-1.2 1.15-2.36 1.17-2.42-.03-.01-2.24-.86-2.26-3.42v-.36zM9.52 1.85A3.95 3.95 0 0 0 10.34.14a4.02 4.02 0 0 0-2.66 1.36 3.76 3.76 0 0 0-.82 1.68 3.29 3.29 0 0 0 2.66-1.33z" fill="#FFFFFF"/>
            </svg>
            <span className="nex-mono text-[11px] font-bold text-[#FFFFFF]">Pay</span>
          </div>

          {/* SEPA */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ background: 'rgba(0,51,153,0.08)', border: '1px solid rgba(0,51,153,0.2)' }}>
            <div className="w-4 h-4 rounded-full bg-[#003399] flex items-center justify-center">
              <span className="nex-mono text-[7px] font-bold text-white">EU</span>
            </div>
            <span className="nex-mono text-[11px] font-bold text-[#4477CC]">SEPA</span>
          </div>

          {/* PIX */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ background: 'rgba(0,166,81,0.08)', border: '1px solid rgba(0,166,81,0.2)' }}>
            <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00A651, #00D474)' }}>
              <span className="nex-mono text-[6px] font-bold text-white">◆</span>
            </div>
            <span className="nex-mono text-[11px] font-bold text-[#00D474]">PIX</span>
          </div>
        </div>

        {/* Bottom */}
        <p className="nex-mono text-[10px] text-[#404040]">
          Atlas Core Onramp · Regulated · Licensed · Secure
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECURITY NOTICE
   ═══════════════════════════════════════════════════════════════ */

function SecurityNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="p-4 rounded-xl"
      style={{
        background: 'rgba(14, 17, 23, 0.5)',
        border: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-[#00FF41]" />
        <span className="nex-mono text-[10px] text-[#00FF41] tracking-widest uppercase">Security Notice</span>
      </div>
      <p className="nex-mono text-[10px] text-[#707070] leading-relaxed">
        All data sourced from Binance Public API. Atlas Core is a Technical Service Provider — not a financial institution.
        Trading involves risk. Always do your own research (DYOR). Past performance does not guarantee future results.
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXCHANGE PAGE
   ═══════════════════════════════════════════════════════════════ */

export function ExchangePage() {
  const [selectedPair, setSelectedPair] = useState<MarketPair>('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('1D');
  const [pairDropdownOpen, setPairDropdownOpen] = useState(false);
  const [tfDropdownOpen, setTfDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPairDropdownOpen(false);
        setTfDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Fetch Binance 24hr tickers
  const {
    data: tickersData,
    isLoading: tickersLoading,
    isError: tickersError,
    dataUpdatedAt,
    refetch,
  } = useQuery({
    queryKey: ['binance-tickers'],
    queryFn: async () => {
      const res = await fetch('/api/exchange?type=tickers');
      if (!res.ok) throw new Error('Failed to fetch tickers');
      return res.json() as Promise<BinanceTicker[]>;
    },
    refetchInterval: 15000,
    staleTime: 10000,
  });

  const tickers: BinanceTicker[] = useMemo(() => {
    if (!tickersData || !Array.isArray(tickersData)) return [];
    return tickersData;
  }, [tickersData]);

  const handlePairSelect = useCallback((pair: MarketPair) => {
    setSelectedPair(pair);
    setPairDropdownOpen(false);
  }, []);

  const handleTfSelect = useCallback((tf: TimeFrame) => {
    setSelectedTimeframe(tf);
    setTfDropdownOpen(false);
  }, []);

  const currentTicker = useMemo(() => {
    return tickers.find(t => t.symbol === selectedPair);
  }, [tickers, selectedPair]);

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Animated grid background */}
      <div className="fixed inset-0 grid-bg-animated pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 py-4 md:py-6 space-y-5">
        {/* ═══ TICKER TAPE ═══ */}
        {!tickersLoading && tickers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-lg overflow-hidden -mx-4 md:-mx-6 px-0"
          >
            <TickerTape tickers={tickers} />
          </motion.div>
        )}

        {/* ═══ HEADER ═══ */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(0,240,255,0.08)',
                border: '1px solid rgba(0,240,255,0.15)',
                boxShadow: '0 0 20px rgba(0,240,255,0.06)',
              }}
            >
              <BarChart3 className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] tracking-tight">EXCHANGE</h1>
                {!tickersLoading && !tickersError && <LiveIndicator />}
              </div>
              <p className="nex-mono text-[10px] text-[#505050] tracking-widest uppercase">
                Global Crypto Markets · Real-time Data · Binance API
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {dataUpdatedAt > 0 && (
              <span className="nex-mono text-[9px] text-[#353535] hidden sm:block">
                Updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{
                background: 'rgba(0,240,255,0.06)',
                border: '1px solid rgba(0,240,255,0.15)',
                color: '#00F0FF',
              }}
            >
              <RefreshCw className={`w-3 h-3 ${tickersLoading ? 'animate-spin' : ''}`} />
              <span className="nex-mono text-[10px] tracking-wider font-semibold">REFRESH</span>
            </button>
          </div>
        </motion.header>

        {/* ═══ STAT BANNER ═══ */}
        {!tickersLoading && tickers.length > 0 && <StatBanner tickers={tickers} />}

        {/* ═══ MAIN GRID ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-8 space-y-5" ref={dropdownRef}>
            {/* Controls: Pair + Timeframe */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Pair Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setPairDropdownOpen(!pairDropdownOpen); setTfDropdownOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
                  style={{
                    background: pairDropdownOpen ? 'rgba(0,240,255,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${pairDropdownOpen ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
                    color: '#E0E0E0',
                  }}
                >
                  <CoinIcon symbol={getBaseSymbol(selectedPair)} size={18} />
                  <span className="nex-mono text-xs font-bold">{formatPairDisplay(selectedPair)}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#808080] transition-transform ${pairDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {pairDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1.5 z-30 rounded-xl overflow-hidden min-w-[180px] cyber-scrollbar max-h-72 overflow-y-auto"
                      style={{
                        background: '#0F1117',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                      }}
                    >
                      {CHART_PAIRS.map((pair) => {
                        const sym = getBaseSymbol(pair);
                        return (
                          <button
                            key={pair}
                            onClick={() => handlePairSelect(pair)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                              selectedPair === pair ? 'bg-[rgba(0,240,255,0.06)]' : 'hover:bg-[rgba(255,255,255,0.03)]'
                            }`}
                          >
                            <CoinIcon symbol={sym} size={20} />
                            <div>
                              <span
                                className="nex-mono text-xs block"
                                style={{ color: selectedPair === pair ? '#00F0FF' : '#C0C0C0' }}
                              >
                                {formatPairDisplay(pair)}
                              </span>
                              <span className="nex-mono text-[9px] text-[#505050]">{COIN_NAMES[sym]}</span>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Timeframe Selector (inline pills) */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => handleTfSelect(tf)}
                    className="nex-mono text-[10px] font-semibold px-3 py-1.5 rounded-md transition-all"
                    style={{
                      background: selectedTimeframe === tf ? 'rgba(0,240,255,0.1)' : 'transparent',
                      color: selectedTimeframe === tf ? '#00F0FF' : '#606060',
                      border: selectedTimeframe === tf ? '1px solid rgba(0,240,255,0.2)' : '1px solid transparent',
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Current price quick look */}
              {currentTicker && (
                <div className="hidden md:flex items-center gap-2 ml-auto">
                  <span className="nex-mono text-[11px] text-[#A0A0A0]">Price:</span>
                  <span className="nex-mono text-sm font-bold text-[#FFFFFF]">
                    ${formatPrice(parseFloat(currentTicker.lastPrice))}
                  </span>
                  <span
                    className="nex-mono text-[10px] font-semibold"
                    style={{ color: parseFloat(currentTicker.priceChangePercent) >= 0 ? '#00FF41' : '#FF5252' }}
                  >
                    {parseFloat(currentTicker.priceChangePercent) >= 0 ? '+' : ''}
                    {parseFloat(currentTicker.priceChangePercent).toFixed(2)}%
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#505050]" />
                </div>
              )}
            </div>

            {/* Chart */}
            {tickersLoading ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#00F0FF] mx-auto mb-4" />
                  <p className="nex-mono text-sm text-[#606060]">Connecting to Binance...</p>
                </div>
              </div>
            ) : tickersError ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <Radio className="w-8 h-8 text-[#FF5252] mx-auto mb-4" />
                  <p className="nex-mono text-sm text-[#808080] mb-2">Connection Error</p>
                  <p className="nex-mono text-xs text-[#505050]">Unable to reach Binance API. Retrying automatically...</p>
                </div>
              </div>
            ) : (
              <>
                <TradingChartSection
                  selectedPair={selectedPair}
                  selectedTimeframe={selectedTimeframe}
                />

                {/* Onramp */}
                <OnrampPlaceholder />
              </>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-4 space-y-5">
            {tickersLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-[#39FF14]" />
              </div>
            ) : (
              <>
                <MarketTicker
                  tickers={tickers}
                  onSelect={handlePairSelect}
                  selectedPair={selectedPair}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
                <SecurityNotice />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
