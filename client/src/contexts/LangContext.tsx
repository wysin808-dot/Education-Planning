/**
 * 设计风格：Admissions Almanac
 * 语言上下文：全站中英双语切换。默认中文（面向中国学生与家长），
 * 英文版用于国际生与英语环境家长。语言选择持久化到 localStorage。
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "zh" | "en";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** 便捷取值：t(中文, 英文) */
  t: (zh: string, en: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: "zh",
  setLang: () => {},
  t: (zh) => zh,
});

const STORAGE_KEY = "bci-wace-lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    /** 首屏即读取偏好，避免中英界面闪烁 */
    if (typeof window === "undefined") return "zh";
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "en" ? "en" : "zh";
  });

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
