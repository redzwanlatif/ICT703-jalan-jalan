import { useState, useEffect } from "react";
import { Calendar, TrendingDown, TrendingUp, Lightbulb, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DonutChart from "./DonutChart";
import MetricCard from "./MetricCard";
import WatchlistCard from "./WatchlistCard";

interface DashboardScreenProps {
  // No props needed - navigation handled by BottomNavigation
}

const insights = [
  {
    text: "You tend to overspend on food by 20%. We have adjusted your next budget recommendation.",
  },
  {
    text: "You missed typical local events during your last travel period. Consider checking local calendars next time.",
  },
  {
    text: "You travelled during the peak period. If you had travelled a week earlier, you could have saved around RM 50.00.",
  },
  {
    text: "Your accommodation costs have decreased by 15% compared to last year. Great job finding better deals!",
  },
  {
    text: "You typically book flights 3 weeks before departure. Booking 6 weeks early could save you up to 25%.",
  },
];

const currencyRates = [
  { currency: "EUR", rate: 4.72, change: 0.02, flag: "🇪🇺" },
  { currency: "GBP", rate: 5.58, change: -0.03, flag: "🇬🇧" },
  { currency: "CHF", rate: 4.89, change: 0.01, flag: "🇨🇭" },
];

const DashboardScreen = () => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
      setIsAnimating(false);
    }, 300);
    setIsPaused(true);
  };

  const goToPrevious = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentInsight((prev) => (prev - 1 + insights.length) % insights.length);
      setIsAnimating(false);
    }, 300);
    setIsPaused(true);
  };

  const goToInsight = (index: number) => {
    if (index === currentInsight) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentInsight(index);
      setIsAnimating(false);
    }, 300);
    setIsPaused(true);
  };

  useEffect(() => {
    if (isPaused) {
      // Reset pause after 10 seconds of inactivity
      const timeout = setTimeout(() => setIsPaused(false), 10000);
      return () => clearTimeout(timeout);
    }
  }, [isPaused, currentInsight]);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentInsight((prev) => (prev + 1) % insights.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <p className="text-muted-foreground text-sm">Welcome back, Traveler</p>
        <h1 className="font-display text-2xl font-bold text-foreground">
          My Profile
        </h1>
      </div>

      {/* Donut Chart Section */}
      <div className="px-6 mb-6 animate-slide-up">
        <div className="glass-card rounded-3xl p-6">
          <DonutChart percentage={65} label="Yearly Budget Used" total="RM 15,000" />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <MetricCard 
            label="Trips Taken" 
            value="4" 
            icon={<Calendar className="w-4 h-4" />}
            delay={0.1}
          />
          <MetricCard 
            label="Avg. Overspend" 
            value="12%" 
            icon={<TrendingUp className="w-4 h-4" />}
            variant="warning"
            delay={0.2}
          />
          <MetricCard 
            label="Savings Goal" 
            value="88%" 
            icon={<TrendingDown className="w-4 h-4" />}
            variant="success"
            delay={0.3}
          />
        </div>
      </div>

      {/* Watchlist */}
      <div className="px-6 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="font-display font-semibold text-foreground mb-3">
          Active Trip Watchlist
        </h2>
        <WatchlistCard 
          destination="London"
          country="United Kingdom"
          priceStatus="falling"
          change={-8}
          avgPrice="RM 3,200"
        />
        <WatchlistCard 
          destination="Tokyo"
          country="Japan"
          priceStatus="rising"
          change={5}
          avgPrice="RM 4,500"
        />
      </div>

      {/* Insight Box with Currency Exchange */}
      <div className="px-6 mb-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <div className="flex gap-3">
          {/* Insight Section */}
          <div className="flex-1 bg-primary/5 border border-primary/20 rounded-2xl p-4 overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-foreground text-sm">Insight</p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={goToPrevious}
                      disabled={insights.length <= 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={goToNext}
                      disabled={insights.length <= 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {insights[currentInsight].text}
                  </p>
                </div>
                {/* Progress dots - clickable */}
                <div className="flex gap-1 mt-3">
                  {insights.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToInsight(index)}
                      className={`h-1 rounded-full transition-all duration-300 hover:bg-primary/60 ${
                        index === currentInsight ? 'w-4 bg-primary' : 'w-1 bg-primary/30'
                      }`}
                      aria-label={`Go to insight ${index + 1}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  {currentInsight + 1} of {insights.length}
                </p>
              </div>
            </div>
          </div>

          {/* Currency Exchange Section */}
          <div className="w-32 bg-secondary/50 border border-border rounded-2xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-foreground">EUR/MYR</span>
              <RefreshCw className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              {currencyRates.map((rate) => (
                <div key={rate.currency} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{rate.flag}</span>
                    <span className="text-xs text-muted-foreground">{rate.currency}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-foreground">{rate.rate.toFixed(2)}</span>
                    <span className={`text-[10px] ml-1 ${rate.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {rate.change >= 0 ? '+' : ''}{rate.change.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-muted-foreground mt-2 text-center">Live rates</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardScreen;