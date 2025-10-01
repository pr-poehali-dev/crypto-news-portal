import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

interface PortfolioItem {
  crypto: string;
  amount: number;
  avgPrice: number;
}

const Index = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 63420, change24h: 2.5, marketCap: 1240000000000, volume24h: 28000000000 },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3120, change24h: -1.2, marketCap: 375000000000, volume24h: 15000000000 },
    { id: 'bnb', name: 'BNB', symbol: 'BNB', price: 582, change24h: 0.8, marketCap: 84000000000, volume24h: 1200000000 },
    { id: 'sol', name: 'Solana', symbol: 'SOL', price: 145, change24h: 5.3, marketCap: 65000000000, volume24h: 3500000000 },
  ]);

  const [fromAmount, setFromAmount] = useState('1');
  const [fromCrypto, setFromCrypto] = useState('BTC');
  const [toCrypto, setToCrypto] = useState('ETH');
  const [convertedAmount, setConvertedAmount] = useState('0');

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { crypto: 'BTC', amount: 0.5, avgPrice: 60000 },
    { crypto: 'ETH', amount: 2, avgPrice: 3000 },
  ]);

  const [selectedCrypto, setSelectedCrypto] = useState('btc');
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCryptoData(prev => prev.map(crypto => ({
        ...crypto,
        price: crypto.price * (1 + (Math.random() - 0.5) * 0.002),
        change24h: crypto.change24h + (Math.random() - 0.5) * 0.5,
      })));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const selected = cryptoData.find(c => c.id === selectedCrypto);
    if (selected) {
      setPriceHistory(prev => {
        const newHistory = [...prev, selected.price];
        return newHistory.slice(-20);
      });
    }
  }, [cryptoData, selectedCrypto]);

  useEffect(() => {
    const fromPrice = cryptoData.find(c => c.symbol === fromCrypto)?.price || 0;
    const toPrice = cryptoData.find(c => c.symbol === toCrypto)?.price || 0;
    if (toPrice > 0) {
      const result = (parseFloat(fromAmount) * fromPrice) / toPrice;
      setConvertedAmount(result.toFixed(6));
    }
  }, [fromAmount, fromCrypto, toCrypto, cryptoData]);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, item) => {
      const currentPrice = cryptoData.find(c => c.symbol === item.crypto)?.price || 0;
      return total + (item.amount * currentPrice);
    }, 0);
  };

  const calculatePortfolioPnL = () => {
    return portfolio.reduce((total, item) => {
      const currentPrice = cryptoData.find(c => c.symbol === item.crypto)?.price || 0;
      const pnl = (currentPrice - item.avgPrice) * item.amount;
      return total + pnl;
    }, 0);
  };

  const news = [
    { id: 1, title: 'Bitcoin достиг нового максимума в 2024 году', category: 'Новости', time: '2 часа назад', image: '🚀' },
    { id: 2, title: 'Ethereum обновление: новые возможности для разработчиков', category: 'Аналитика', time: '4 часа назад', image: '⚡' },
    { id: 3, title: 'Регулирование криптовалют: последние изменения в законодательстве', category: 'Регуляции', time: '6 часов назад', image: '📋' },
    { id: 4, title: 'DeFi протоколы показывают рекордный рост TVL', category: 'DeFi', time: '8 часов назад', image: '💎' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" className="text-primary" size={32} />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CryptoNews</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-foreground hover:text-primary transition-colors">Главная</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Новости</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Аналитика</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Курсы</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Обзоры</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">О проекте</a>
              <Button variant="default" size="sm">
                <Icon name="Bell" size={16} className="mr-2" />
                Подписаться
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Icon name="Menu" size={24} />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fade-in">
            Крипто-мир в режиме реального времени
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Актуальные новости, аналитика и данные о криптовалютах
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {cryptoData.slice(0, 4).map(crypto => (
              <div key={crypto.id} className="flex items-center space-x-2 bg-card border border-border rounded-lg px-4 py-2">
                <span className="font-semibold">{crypto.symbol}</span>
                <span className="text-foreground">{formatNumber(crypto.price)}</span>
                <Badge variant={crypto.change24h >= 0 ? "default" : "destructive"} className="text-xs">
                  {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="markets" className="mb-12">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="markets">
              <Icon name="BarChart3" size={18} className="mr-2" />
              Рынки
            </TabsTrigger>
            <TabsTrigger value="calculator">
              <Icon name="Calculator" size={18} className="mr-2" />
              Калькулятор
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <Icon name="Wallet" size={18} className="mr-2" />
              Портфель
            </TabsTrigger>
            <TabsTrigger value="news">
              <Icon name="Newspaper" size={18} className="mr-2" />
              Новости
            </TabsTrigger>
          </TabsList>

          <TabsContent value="markets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>График курса</span>
                    <div className="flex gap-2">
                      {cryptoData.map(crypto => (
                        <Button
                          key={crypto.id}
                          variant={selectedCrypto === crypto.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCrypto(crypto.id)}
                        >
                          {crypto.symbol}
                        </Button>
                      ))}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-1">
                    {priceHistory.map((price, index) => {
                      const maxPrice = Math.max(...priceHistory);
                      const minPrice = Math.min(...priceHistory);
                      const height = ((price - minPrice) / (maxPrice - minPrice)) * 100;
                      return (
                        <div
                          key={index}
                          className="flex-1 bg-gradient-to-t from-primary to-secondary rounded-t transition-all duration-300"
                          style={{ height: `${height}%` }}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-3xl font-bold">
                      {formatNumber(cryptoData.find(c => c.id === selectedCrypto)?.price || 0)}
                    </p>
                    <p className="text-muted-foreground">{cryptoData.find(c => c.id === selectedCrypto)?.name}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Топ криптовалют</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cryptoData.map((crypto, index) => (
                      <div key={crypto.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-muted-foreground">#{index + 1}</span>
                          <div>
                            <p className="font-semibold">{crypto.symbol}</p>
                            <p className="text-xs text-muted-foreground">{crypto.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatNumber(crypto.price)}</p>
                          <Badge variant={crypto.change24h >= 0 ? "default" : "destructive"} className="text-xs">
                            {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Icon name="TrendingUp" className="mr-2 text-primary" size={20} />
                    Рыночная капитализация
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatNumber(cryptoData.reduce((sum, c) => sum + c.marketCap, 0))}</p>
                  <p className="text-muted-foreground text-sm mt-2">Общий объем рынка</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Icon name="Activity" className="mr-2 text-secondary" size={20} />
                    Объем торгов 24ч
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatNumber(cryptoData.reduce((sum, c) => sum + c.volume24h, 0))}</p>
                  <p className="text-muted-foreground text-sm mt-2">За последние 24 часа</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Icon name="Percent" className="mr-2 text-primary" size={20} />
                    Доминация BTC
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">52.3%</p>
                  <p className="text-muted-foreground text-sm mt-2">Доля Bitcoin на рынке</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calculator">
            <Card className="max-w-2xl mx-auto border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Calculator" className="mr-2 text-primary" size={24} />
                  Конвертер криптовалют
                </CardTitle>
                <CardDescription>Мгновенная конвертация по текущему курсу</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Отдаете</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="flex-1"
                      placeholder="0.00"
                    />
                    <select
                      value={fromCrypto}
                      onChange={(e) => setFromCrypto(e.target.value)}
                      className="bg-card border border-border rounded-md px-4 py-2 text-foreground"
                    >
                      {cryptoData.map(crypto => (
                        <option key={crypto.id} value={crypto.symbol}>{crypto.symbol}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ≈ {formatNumber(parseFloat(fromAmount) * (cryptoData.find(c => c.symbol === fromCrypto)?.price || 0))}
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const temp = fromCrypto;
                      setFromCrypto(toCrypto);
                      setToCrypto(temp);
                    }}
                  >
                    <Icon name="ArrowDownUp" size={20} />
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Получаете</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={convertedAmount}
                      readOnly
                      className="flex-1 bg-muted"
                    />
                    <select
                      value={toCrypto}
                      onChange={(e) => setToCrypto(e.target.value)}
                      className="bg-card border border-border rounded-md px-4 py-2 text-foreground"
                    >
                      {cryptoData.map(crypto => (
                        <option key={crypto.id} value={crypto.symbol}>{crypto.symbol}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ≈ {formatNumber(parseFloat(convertedAmount) * (cryptoData.find(c => c.symbol === toCrypto)?.price || 0))}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Курс</span>
                    <span className="font-medium">
                      1 {fromCrypto} = {((cryptoData.find(c => c.symbol === fromCrypto)?.price || 0) / (cryptoData.find(c => c.symbol === toCrypto)?.price || 1)).toFixed(6)} {toCrypto}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Обновлено</span>
                    <span className="font-medium">только что</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-border">
                <CardHeader>
                  <CardTitle>Мой портфель</CardTitle>
                  <CardDescription>Отслеживайте стоимость ваших криптоактивов</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {portfolio.map((item, index) => {
                    const currentPrice = cryptoData.find(c => c.symbol === item.crypto)?.price || 0;
                    const currentValue = item.amount * currentPrice;
                    const investedValue = item.amount * item.avgPrice;
                    const pnl = currentValue - investedValue;
                    const pnlPercent = (pnl / investedValue) * 100;

                    return (
                      <div key={index} className="p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="font-bold text-primary">{item.crypto[0]}</span>
                            </div>
                            <div>
                              <p className="font-semibold">{item.crypto}</p>
                              <p className="text-sm text-muted-foreground">{item.amount} {item.crypto}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">{formatNumber(currentValue)}</p>
                            <Badge variant={pnl >= 0 ? "default" : "destructive"}>
                              {pnl >= 0 ? '+' : ''}{formatNumber(pnl)} ({pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Текущая цена</p>
                            <p className="font-medium">{formatNumber(currentPrice)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Средняя цена</p>
                            <p className="font-medium">{formatNumber(item.avgPrice)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Вложено</p>
                            <p className="font-medium">{formatNumber(investedValue)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Итого</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Общая стоимость</p>
                      <p className="text-3xl font-bold">{formatNumber(calculatePortfolioValue())}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Прибыль/Убыток</p>
                      <div className="flex items-center space-x-2">
                        <p className={`text-2xl font-bold ${calculatePortfolioPnL() >= 0 ? 'text-primary' : 'text-destructive'}`}>
                          {calculatePortfolioPnL() >= 0 ? '+' : ''}{formatNumber(calculatePortfolioPnL())}
                        </p>
                        <Badge variant={calculatePortfolioPnL() >= 0 ? "default" : "destructive"}>
                          {calculatePortfolioPnL() >= 0 ? '+' : ''}{((calculatePortfolioPnL() / (calculatePortfolioValue() - calculatePortfolioPnL())) * 100).toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Распределение</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {portfolio.map((item, index) => {
                      const currentPrice = cryptoData.find(c => c.symbol === item.crypto)?.price || 0;
                      const currentValue = item.amount * currentPrice;
                      const percentage = (currentValue / calculatePortfolioValue()) * 100;

                      return (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.crypto}</span>
                            <span className="font-medium">{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="news">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map(article => (
                <Card key={article.id} className="border-border hover:border-primary transition-colors cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl">{article.image}</div>
                      <Badge variant="outline">{article.category}</Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{article.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Icon name="Clock" size={14} />
                      <span>{article.time}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full justify-between group-hover:text-primary">
                      Читать далее
                      <Icon name="ArrowRight" size={16} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="TrendingUp" className="text-primary" size={24} />
                <span className="text-xl font-bold">CryptoNews</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Ваш надежный источник информации о криптовалютах
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Разделы</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Новости</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Аналитика</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Курсы</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Обзоры</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Инструменты</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Калькулятор</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Портфель</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Контакты</h3>
              <div className="flex space-x-3">
                <Button variant="outline" size="icon">
                  <Icon name="Twitter" size={18} />
                </Button>
                <Button variant="outline" size="icon">
                  <Icon name="Send" size={18} />
                </Button>
                <Button variant="outline" size="icon">
                  <Icon name="Mail" size={18} />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 CryptoNews. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
