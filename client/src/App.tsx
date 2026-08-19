/**
 * 设计风格：Admissions Almanac（浅色纸感底，故 ThemeProvider 使用 light）
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";
import { ShortlistProvider } from "./contexts/ShortlistContext";
import Home from "./pages/Home";
import Forward from "./pages/Forward";
import Reverse from "./pages/Reverse";
import Subjects from "./pages/Subjects";
import TableView from "./pages/TableView";
import Brochure from "./pages/Brochure";
import Shortlist from "./pages/Shortlist";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/forward" component={Forward} />
      <Route path="/reverse" component={Reverse} />
      <Route path="/subjects" component={Subjects} />
      <Route path="/table" component={TableView} />
      <Route path="/shortlist" component={Shortlist} />
      <Route path="/brochure" component={Brochure} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LangProvider>
          <ShortlistProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ShortlistProvider>
        </LangProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
