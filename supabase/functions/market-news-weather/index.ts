import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function fetchYahooSymbol(symbol: string, name: string) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) { await res.text(); throw new Error(`HTTP ${res.status}`); }
    const data = await res.json();
    const meta = data.chart?.result?.[0]?.meta;
    if (!meta) throw new Error('No meta');
    const price = meta.regularMarketPrice ?? 0;
    const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = price - prevClose;
    const changePercent = prevClose ? (change / prevClose) * 100 : 0;
    return {
      symbol: name,
      price: price.toFixed(2),
      change: change.toFixed(2),
      changePercent: changePercent.toFixed(2),
      currency: meta.currency ?? 'USD',
    };
  } catch (e) {
    console.error(`Fetch error for ${name}:`, e);
    return { symbol: name, price: '0', change: '0', changePercent: '0', currency: 'USD', error: true };
  }
}

async function fetchStockData() {
  const symbols = [
    { symbol: '^GSPC', name: 'S&P 500' },
    { symbol: '^IXIC', name: 'NASDAQ' },
    { symbol: '^DJI', name: 'DOW JONES' },
    { symbol: '^FTSE', name: 'FTSE 100' },
    { symbol: '^N225', name: 'NIKKEI 225' },
  ];
  const results = await Promise.allSettled(symbols.map(s => fetchYahooSymbol(s.symbol, s.name)));
  return results.map(r => r.status === 'fulfilled' ? r.value : null).filter(Boolean);
}

async function fetchCryptoData() {
  try {
    const ids = 'bitcoin,ethereum,solana,binancecoin,ripple,cardano,dogecoin,polkadot,avalanche-2,chainlink,polygon,tron,litecoin,shiba-inu,uniswap';
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    if (!res.ok) { await res.text(); return []; }
    const data = await res.json();
    
    const map: Record<string, { name: string; ticker: string }> = {
      bitcoin: { name: 'Bitcoin', ticker: 'BTC' },
      ethereum: { name: 'Ethereum', ticker: 'ETH' },
      solana: { name: 'Solana', ticker: 'SOL' },
      binancecoin: { name: 'BNB', ticker: 'BNB' },
      ripple: { name: 'XRP', ticker: 'XRP' },
      cardano: { name: 'Cardano', ticker: 'ADA' },
      dogecoin: { name: 'Dogecoin', ticker: 'DOGE' },
      polkadot: { name: 'Polkadot', ticker: 'DOT' },
      'avalanche-2': { name: 'Avalanche', ticker: 'AVAX' },
      chainlink: { name: 'Chainlink', ticker: 'LINK' },
      polygon: { name: 'Polygon', ticker: 'MATIC' },
      tron: { name: 'TRON', ticker: 'TRX' },
      litecoin: { name: 'Litecoin', ticker: 'LTC' },
      'shiba-inu': { name: 'Shiba Inu', ticker: 'SHIB' },
      uniswap: { name: 'Uniswap', ticker: 'UNI' },
    };

    // Sort by market relevance (order of ids)
    const order = ids.split(',');
    return order
      .filter(key => data[key])
      .map((key) => {
        const val = data[key];
        const price = val.usd ?? 0;
        const change24h = val.usd_24h_change ?? 0;
        return {
          symbol: map[key]?.name ?? key,
          ticker: map[key]?.ticker ?? key.toUpperCase(),
          price: price < 1 
            ? price.toFixed(6) 
            : price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          changePercent: change24h.toFixed(2),
          currency: 'USD',
        };
      });
  } catch (e) {
    console.error('Crypto fetch error:', e);
    return [];
  }
}

async function fetchForexData() {
  // Using exchangerate.host (free, no key required) as primary
  // Fallback: frankfurter.app (free, no key)
  const pairs = [
    { from: 'USD', to: 'EUR' },
    { from: 'USD', to: 'GBP' },
    { from: 'USD', to: 'JPY' },
    { from: 'USD', to: 'CAD' },
    { from: 'USD', to: 'AUD' },
    { from: 'EUR', to: 'GBP' },
    { from: 'USD', to: 'PKR' },
    { from: 'USD', to: 'INR' },
  ];

  try {
    // Frankfurter API - completely free, no key
    const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY,CAD,AUD,PKR,INR');
    if (!res.ok) { await res.text(); return []; }
    const data = await res.json();
    
    const rates = data.rates || {};
    const result = [];

    for (const { from, to } of pairs) {
      if (from === 'USD' && rates[to] !== undefined) {
        result.push({
          pair: `${from}/${to}`,
          rate: rates[to].toFixed(to === 'JPY' || to === 'PKR' || to === 'INR' ? 2 : 4),
          base: from,
          quote: to,
        });
      } else if (from === 'EUR' && to === 'GBP' && rates['EUR'] && rates['GBP']) {
        // Cross rate
        const eurUsd = 1 / rates['EUR'];
        const gbpUsd = 1 / rates['GBP'];
        const eurGbp = gbpUsd / eurUsd;
        result.push({
          pair: 'EUR/GBP',
          rate: eurGbp.toFixed(4),
          base: 'EUR',
          quote: 'GBP',
        });
      }
    }

    return result;
  } catch (e) {
    console.error('Forex fetch error:', e);
    return [];
  }
}

async function fetchNewsData() {
  try {
    const rssUrl = 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en';
    const res = await fetch(rssUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) { await res.text(); return []; }
    const xml = await res.text();

    const items: Array<{ title: string; link: string; source: string; pubDate: string }> = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let count = 0;

    while ((match = itemRegex.exec(xml)) !== null && count < 10) {
      const itemXml = match[1];
      const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
        || itemXml.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1]
        || itemXml.match(/<link\/>\s*(https?:\/\/[^\s<]+)/)?.[1] || '';
      const source = itemXml.match(/<source[^>]*>(.*?)<\/source>/)?.[1] || 'Unknown';
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';

      if (title) {
        items.push({ title: title.replace(/<[^>]+>/g, ''), link, source, pubDate });
        count++;
      }
    }
    return items;
  } catch (e) {
    console.error('News fetch error:', e);
    return [];
  }
}

async function fetchWeatherData(lat: number, lon: number, city?: string) {
  try {
    let actualLat = lat;
    let actualLon = lon;
    let cityName = city || 'Your Location';

    if (city) {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en`
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.results?.[0]) {
          actualLat = geoData.results[0].latitude;
          actualLon = geoData.results[0].longitude;
          cityName = `${geoData.results[0].name}, ${geoData.results[0].country}`;
        }
      } else { await geoRes.text(); }
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${actualLat}&longitude=${actualLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
    const res = await fetch(weatherUrl);
    if (!res.ok) { await res.text(); return null; }
    const data = await res.json();

    const weatherCodes: Record<number, { description: string; icon: string }> = {
      0: { description: 'Clear sky', icon: '☀️' },
      1: { description: 'Mainly clear', icon: '🌤️' },
      2: { description: 'Partly cloudy', icon: '⛅' },
      3: { description: 'Overcast', icon: '☁️' },
      45: { description: 'Foggy', icon: '🌫️' },
      48: { description: 'Rime fog', icon: '🌫️' },
      51: { description: 'Light drizzle', icon: '🌦️' },
      53: { description: 'Moderate drizzle', icon: '🌦️' },
      55: { description: 'Dense drizzle', icon: '🌧️' },
      61: { description: 'Slight rain', icon: '🌧️' },
      63: { description: 'Moderate rain', icon: '🌧️' },
      65: { description: 'Heavy rain', icon: '🌧️' },
      71: { description: 'Slight snow', icon: '❄️' },
      73: { description: 'Moderate snow', icon: '❄️' },
      75: { description: 'Heavy snow', icon: '❄️' },
      80: { description: 'Rain showers', icon: '🌦️' },
      81: { description: 'Moderate showers', icon: '🌧️' },
      82: { description: 'Violent showers', icon: '⛈️' },
      95: { description: 'Thunderstorm', icon: '⛈️' },
      96: { description: 'Thunderstorm with hail', icon: '⛈️' },
      99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
    };

    const current = data.current;
    const code = current.weather_code;
    const weather = weatherCodes[code] || { description: 'Unknown', icon: '🌡️' };

    return {
      city: cityName,
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      description: weather.description,
      icon: weather.icon,
      unit: '°C',
    };
  } catch (e) {
    console.error('Weather fetch error:', e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const lat = parseFloat(url.searchParams.get('lat') || '40.7128');
    const lon = parseFloat(url.searchParams.get('lon') || '-74.0060');
    const city = url.searchParams.get('city') || '';

    const [stocks, crypto, forex, news, weather] = await Promise.all([
      fetchStockData(),
      fetchCryptoData(),
      fetchForexData(),
      fetchNewsData(),
      fetchWeatherData(lat, lon, city || undefined),
    ]);

    return new Response(JSON.stringify({ stocks, crypto, forex, news, weather }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
