import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, X, Search, ExternalLink, RefreshCw, Droplets, Wind, Thermometer, ArrowRightLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StockItem {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  currency: string;
  error?: boolean;
}

interface CryptoItem {
  symbol: string;
  ticker: string;
  price: string;
  changePercent: string;
  currency: string;
}

interface ForexItem {
  pair: string;
  rate: string;
  base: string;
  quote: string;
}

interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  unit: string;
}

interface MarketData {
  stocks: StockItem[];
  crypto: CryptoItem[];
  forex: ForexItem[];
  news: NewsItem[];
  weather: WeatherData | null;
}

const fetchMarketData = async (city: string): Promise<MarketData> => {
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  else {
    params.set("lat", "40.7128");
    params.set("lon", "-74.0060");
  }

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const url = `https://${projectId}.supabase.co/functions/v1/market-news-weather?${params.toString()}`;
  const res = await fetch(url, {
    headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
  });

  if (!res.ok) throw new Error("Failed to fetch market data");
  return res.json();
};

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const flagMap: Record<string, string> = {
  USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵', CAD: '🇨🇦', AUD: '🇦🇺', PKR: '🇵🇰', INR: '🇮🇳',
};

const PriceCard = ({ label, sublabel, price, change, changeLabel, index }: {
  label: string; sublabel: string; price: string; change?: string; changeLabel?: string; index: number;
}) => {
  const isPositive = change ? parseFloat(change) >= 0 : true;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
    >
      <div>
        <p className="font-semibold text-sm text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-sm text-foreground">{price}</p>
        {change !== undefined && (
          <p className={`text-xs font-medium ${isPositive ? "text-green-500" : "text-destructive"}`}>
            {isPositive ? "▲" : "▼"} {changeLabel || `${change}%`}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const MarketNewsWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [weatherCity, setWeatherCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [cryptoSearch, setCryptoSearch] = useState("");
  const [forexSearch, setForexSearch] = useState("");

  const { data, isLoading, refetch, isFetching } = useQuery<MarketData>({
    queryKey: ["market-news-weather", searchCity],
    queryFn: () => fetchMarketData(searchCity),
    staleTime: 5 * 60 * 1000,
    enabled: isOpen,
    refetchOnWindowFocus: false,
  });

  const handleCitySearch = () => {
    if (weatherCity.trim()) setSearchCity(weatherCity.trim());
  };

  const filteredCrypto = data?.crypto?.filter(c =>
    c.symbol.toLowerCase().includes(cryptoSearch.toLowerCase()) ||
    c.ticker.toLowerCase().includes(cryptoSearch.toLowerCase())
  ) ?? [];

  const filteredForex = data?.forex?.filter(fx =>
    fx.pair.toLowerCase().includes(forexSearch.toLowerCase()) ||
    fx.base.toLowerCase().includes(forexSearch.toLowerCase()) ||
    fx.quote.toLowerCase().includes(forexSearch.toLowerCase())
  ) ?? [];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-6 bottom-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Market & News"
      >
        {isOpen ? <X className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
      </motion.button>

      {/* Popup Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed left-6 bottom-24 z-50 w-[380px] max-w-[calc(100vw-48px)] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground text-sm tracking-tight">Live Market Hub</h3>
              </div>
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-muted-foreground ${isFetching ? "animate-spin" : ""}`} />
              </button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="stocks" className="w-full">
              <TabsList className="w-full rounded-none border-b border-border bg-transparent h-9 px-1 gap-0">
                <TabsTrigger value="stocks" className="flex-1 text-[11px] px-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
                  📈 Stocks
                </TabsTrigger>
                <TabsTrigger value="crypto" className="flex-1 text-[11px] px-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
                  🪙 Crypto
                </TabsTrigger>
                <TabsTrigger value="forex" className="flex-1 text-[11px] px-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
                  💱 Forex
                </TabsTrigger>
                <TabsTrigger value="news" className="flex-1 text-[11px] px-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
                  📰 News
                </TabsTrigger>
                <TabsTrigger value="weather" className="flex-1 text-[11px] px-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
                  🌤️ Weather
                </TabsTrigger>
              </TabsList>

              {/* Stocks Tab */}
              <TabsContent value="stocks" className="mt-0">
                <ScrollArea className="h-[320px]">
                  <div className="p-3 space-y-2">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
                      ))
                    ) : (
                      data?.stocks?.map((stock, i) => (
                        <PriceCard
                          key={stock.symbol}
                          label={stock.symbol}
                          sublabel={stock.currency}
                          price={stock.price}
                          change={stock.changePercent}
                          changeLabel={`${stock.change} (${stock.changePercent}%)`}
                          index={i}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Crypto Tab */}
              <TabsContent value="crypto" className="mt-0">
                <div className="p-3 pb-0">
                  <Input
                    placeholder="Search crypto (BTC, Ethereum...)"
                    value={cryptoSearch}
                    onChange={(e) => setCryptoSearch(e.target.value)}
                    className="h-8 text-xs bg-muted/50 border-border"
                  />
                </div>
                <ScrollArea className="h-[290px]">
                  <div className="p-3 pt-2 space-y-2">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
                      ))
                    ) : filteredCrypto.length ? (
                      filteredCrypto.map((coin, i) => (
                        <PriceCard
                          key={coin.symbol}
                          label={coin.symbol}
                          sublabel={coin.ticker}
                          price={`$${coin.price}`}
                          change={coin.changePercent}
                          changeLabel={`${coin.changePercent}% (24h)`}
                          index={i}
                        />
                      ))
                    ) : (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        {cryptoSearch ? "No matching crypto" : "No crypto data available"}
                      </p>
                    )}
                    <div className="pt-1 px-1">
                      <p className="text-[10px] text-muted-foreground">15 coins from CoinGecko • 24h change</p>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Forex Tab */}
              <TabsContent value="forex" className="mt-0">
                <div className="p-3 pb-0">
                  <Input
                    placeholder="Search pair (USD, EUR, PKR...)"
                    value={forexSearch}
                    onChange={(e) => setForexSearch(e.target.value)}
                    className="h-8 text-xs bg-muted/50 border-border"
                  />
                </div>
                <ScrollArea className="h-[290px]">
                  <div className="p-3 pt-2 space-y-2">
                    {isLoading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
                      ))
                    ) : filteredForex.length ? (
                      filteredForex.map((fx, i) => (
                        <motion.div
                          key={fx.pair}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{flagMap[fx.base] || '🏳️'}</span>
                            <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                            <span className="text-lg">{flagMap[fx.quote] || '🏳️'}</span>
                            <p className="font-semibold text-sm text-foreground ml-1">{fx.pair}</p>
                          </div>
                          <p className="font-bold text-sm text-foreground">{fx.rate}</p>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        {forexSearch ? "No matching pairs" : "No forex data available"}
                      </p>
                    )}
                    <div className="pt-1 px-1">
                      <p className="text-[10px] text-muted-foreground">Rates from Frankfurter API (ECB data)</p>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* News Tab */}
              <TabsContent value="news" className="mt-0">
                <ScrollArea className="h-[320px]">
                  <div className="p-3 space-y-2">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
                      ))
                    ) : data?.news?.length ? (
                      data.news.map((item, i) => (
                        <motion.a
                          key={i}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="block p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                        >
                          <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{item.source}</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span>{timeAgo(item.pubDate)}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </motion.a>
                      ))
                    ) : (
                      <p className="text-center text-sm text-muted-foreground py-8">No news available</p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Weather Tab */}
              <TabsContent value="weather" className="mt-0">
                <div className="p-4 space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search city..."
                      value={weatherCity}
                      onChange={(e) => setWeatherCity(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCitySearch()}
                      className="h-9 text-sm bg-muted/50 border-border"
                    />
                    <button
                      onClick={handleCitySearch}
                      className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>

                  {isLoading ? (
                    <div className="h-48 rounded-xl bg-muted animate-pulse" />
                  ) : data?.weather ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-center py-3">
                        <p className="text-sm text-muted-foreground mb-1">{data.weather.city}</p>
                        <span className="text-5xl">{data.weather.icon}</span>
                        <p className="text-4xl font-bold text-foreground mt-2">
                          {Math.round(data.weather.temperature)}{data.weather.unit}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{data.weather.description}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50">
                          <Thermometer className="w-4 h-4 text-muted-foreground mb-1" />
                          <span className="text-xs text-muted-foreground">Feels Like</span>
                          <span className="text-sm font-semibold text-foreground">{Math.round(data.weather.feelsLike)}°</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50">
                          <Droplets className="w-4 h-4 text-muted-foreground mb-1" />
                          <span className="text-xs text-muted-foreground">Humidity</span>
                          <span className="text-sm font-semibold text-foreground">{data.weather.humidity}%</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50">
                          <Wind className="w-4 h-4 text-muted-foreground mb-1" />
                          <span className="text-xs text-muted-foreground">Wind</span>
                          <span className="text-sm font-semibold text-foreground">{data.weather.windSpeed} km/h</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-8">Search a city to see weather</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-border bg-muted/30">
              <p className="text-[10px] text-muted-foreground text-center">
                Yahoo Finance • CoinGecko • Frankfurter • Google News • Open-Meteo
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MarketNewsWidget;
