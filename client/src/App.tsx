/**
 * 设计风格：Admissions Almanac（浅色纸感底，故 ThemeProvider 使用 light）
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";
import { ShortlistProvider } from "./contexts/ShortlistContext";
import Choose from "./pages/Choose";
import Home from "./pages/Home";
import Forward from "./pages/Forward";
import Reverse from "./pages/Reverse";
import Subjects from "./pages/Subjects";
import TableView from "./pages/TableView";
import Brochure from "./pages/Brochure";
import Shortlist from "./pages/Shortlist";
import AlevelHome from "./pages/AlevelHome";
import AlevelForward from "./pages/AlevelForward";
import AlevelReverse from "./pages/AlevelReverse";
import AlevelSubjects from "./pages/AlevelSubjects";
import AlevelTable from "./pages/AlevelTable";
import AlevelShortlist from "./pages/AlevelShortlist";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Choose} />
      <Route path="/wace" component={Home} />
      <Route path="/wace/forward" component={Forward} />
      <Route path="/wace/reverse" component={Reverse} />
      <Route path="/wace/subjects" component={Subjects} />
      <Route path="/wace/table" component={TableView} />
      <Route path="/wace/shortlist" component={Shortlist} />
      <Route path="/brochure" component={Brochure} />
      {/* 旧版根级 WACE 路径保持可用，统一重定向到 /wace/* */}
      <Route path="/forward">{() => <Redirect to="/wace/forward" replace />}</Route>
      <Route path="/reverse">{() => <Redirect to="/wace/reverse" replace />}</Route>
      <Route path="/subjects">{() => <Redirect to="/wace/subjects" replace />}</Route>
      <Route path="/table">{() => <Redirect to="/wace/table" replace />}</Route>
      <Route path="/shortlist">{() => <Redirect to="/wace/shortlist" replace />}</Route>
      <Route path="/alevel" component={AlevelHome} />
      <Route path="/alevel/forward" component={AlevelForward} />
      <Route path="/alevel/reverse" component={AlevelReverse} />
      <Route path="/alevel/subjects" component={AlevelSubjects} />
      <Route path="/alevel/table" component={AlevelTable} />
      <Route path="/alevel/shortlist" component={AlevelShortlist} />
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
