/**
 * 设计风格：Admissions Almanac（浅色纸感底，故 ThemeProvider 使用 light）
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
import { Redirect, Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";
import { ShortlistProvider } from "./contexts/ShortlistContext";
import { INTERNAL_ONLY, WACE_PUBLIC } from "./lib/curriculum";
import Choose from "./pages/Choose";
import Home from "./pages/Home";
import Forward from "./pages/Forward";
import Reverse from "./pages/Reverse";
import FieldPlan from "./pages/FieldPlan";
import Timeline from "./pages/Timeline";
import Subjects from "./pages/Subjects";
import TableView from "./pages/TableView";
import Brochure from "./pages/Brochure";
import Shortlist from "./pages/Shortlist";
import AlevelHome from "./pages/AlevelHome";
import AlevelForward from "./pages/AlevelForward";
import AlevelReverse from "./pages/AlevelReverse";
import AlevelFieldPlan from "./pages/AlevelFieldPlan";
import AlevelSubjects from "./pages/AlevelSubjects";
import AlevelTable from "./pages/AlevelTable";
import AlevelShortlist from "./pages/AlevelShortlist";

/**
 * 本站为 BCI 内部工具，默认为全站注入 noindex/nofollow，避免被搜索引擎收录。
 * 与 client/public/robots.txt 配合使用；对外发布时把 VITE_INTERNAL_ONLY 设为 false 即可解除。
 */
function SearchIndexPolicy() {
  const [location] = useLocation();
  useEffect(() => {
    const shouldBlock = INTERNAL_ONLY;
    const id = "manus-robots-policy";
    const existing = document.getElementById(id);
    if (!shouldBlock) {
      existing?.remove();
      return;
    }
    if (existing) return;
    const meta = document.createElement("meta");
    meta.id = id;
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
  }, [location]);
  return null;
}

/**
 * 路由基路径：由 Vite 的 BASE_URL 推导，去掉末尾斜杠。
 * 根路径部署时 BASE_URL 为 "/"，此处得到 ""，wouter 视为无 base。
 */
const ROUTER_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function Router() {
  return (
    <Switch>
      {/* WACE 未对外公开时，根路径直接进入 A-Level，不出现体系选择页 */}
      <Route path="/">{() => (WACE_PUBLIC ? <Choose /> : <Redirect to="/alevel" replace />)}</Route>
      <Route path="/wace" component={Home} />
      <Route path="/wace/forward" component={Forward} />
      <Route path="/wace/reverse" component={Reverse} />
      <Route path="/wace/field" component={FieldPlan} />
      <Route path="/wace/timeline" component={Timeline} />
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
      <Route path="/alevel/field" component={AlevelFieldPlan} />
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
              <SearchIndexPolicy />
              {/*
               * 默认使用浏览器路径路由。
               * 打成单文件、放在静态托管的子路径下预览时（VITE_HASH_ROUTER=true），
               * 路径路由拿不到服务端改写，改用哈希路由才能让深层链接可用。
               * 正式部署不设该变量，行为与此前完全一致。
               */}
              {import.meta.env.VITE_HASH_ROUTER === "true" ? (
                <WouterRouter hook={useHashLocation}>
                  <Router />
                </WouterRouter>
              ) : (
                /*
                 * 子路径部署时，路由必须知道自己挂在哪一层。
                 * Vite 的 base 只改资源 URL；wouter 仍拿完整 pathname 去匹配，
                 * 部署到 /planner/ 后 "/planner/wace" 匹配不上 "/wace"，
                 * 结果整站每一页都落到 404。base 取自同一个 BASE_URL，
                 * 根路径部署时为空字符串，行为与此前一致。
                 */
                <WouterRouter base={ROUTER_BASE}>
                  <Router />
                </WouterRouter>
              )}
            </TooltipProvider>
          </ShortlistProvider>
        </LangProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
