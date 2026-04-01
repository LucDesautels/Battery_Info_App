import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Chart from "@/pages/chart";
import NotFound from "@/pages/not-found";
import { cn } from "@/lib/utils";

function Header() {
  const [location] = useLocation();
  
  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Battery Voltage Information</h1>
        </div>
      </header>

      {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto px-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <Link
              href="/"
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm focus:outline-none",
                location === "/"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              data-testid="tab-tool"
            >
              Tool
            </Link>
            <Link
              href="/chart"
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm focus:outline-none",
                location === "/chart"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              data-testid="tab-chart"
            >
              Chart
            </Link>
          </nav>
        </div>
    </>
  );
}

function Router() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/chart" component={Chart} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
