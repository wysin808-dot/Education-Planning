/**
 * 设计风格：Admissions Almanac
 * 收藏上下文：学生把候选专业加入「我的目标清单」，用于面谈前自查与家长复核。
 * 仅存 universityId + programmeId，展示时再回数据层取最新门槛，避免数据更新后清单过期。
 * 持久化到 localStorage，无需登录即可跨页面与跨会话保留。
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { UNIVERSITIES, type Programme, type University } from "@/data/universities";

export interface ShortlistItem {
  universityId: string;
  programmeId: string;
  /** 加入时间戳，用于清单排序 */
  addedAt: number;
}

/** 回数据层解析后的完整条目 */
export interface ResolvedShortlistItem extends ShortlistItem {
  university: University;
  programme: Programme;
}

interface ShortlistContextValue {
  items: ShortlistItem[];
  resolved: ResolvedShortlistItem[];
  has: (universityId: string, programmeId: string) => boolean;
  toggle: (universityId: string, programmeId: string) => void;
  remove: (universityId: string, programmeId: string) => void;
  clear: () => void;
  count: number;
}

const ShortlistContext = createContext<ShortlistContextValue>({
  items: [],
  resolved: [],
  has: () => false,
  toggle: () => {},
  remove: () => {},
  clear: () => {},
  count: 0,
});

const STORAGE_KEY = "bci-wace-shortlist";

function readStored(): ShortlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // 过滤掉结构不完整的旧数据，避免渲染时崩溃
    return parsed.filter(
      (x): x is ShortlistItem =>
        typeof x?.universityId === "string" && typeof x?.programmeId === "string",
    );
  } catch {
    return [];
  }
}

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ShortlistItem[]>(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // 隐私模式下写入可能失败，静默降级为仅当前会话有效
    }
  }, [items]);

  const has = useCallback(
    (universityId: string, programmeId: string) =>
      items.some((x) => x.universityId === universityId && x.programmeId === programmeId),
    [items],
  );

  const toggle = useCallback((universityId: string, programmeId: string) => {
    setItems((prev) => {
      const exists = prev.some(
        (x) => x.universityId === universityId && x.programmeId === programmeId,
      );
      if (exists) {
        return prev.filter(
          (x) => !(x.universityId === universityId && x.programmeId === programmeId),
        );
      }
      return [...prev, { universityId, programmeId, addedAt: Date.now() }];
    });
  }, []);

  const remove = useCallback((universityId: string, programmeId: string) => {
    setItems((prev) =>
      prev.filter((x) => !(x.universityId === universityId && x.programmeId === programmeId)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  /** 回数据层解析：忽略已不存在的条目（数据更新后专业可能被重命名或移除） */
  const resolved = useMemo(() => {
    const out: ResolvedShortlistItem[] = [];
    for (const item of items) {
      const university = UNIVERSITIES.find((u) => u.id === item.universityId);
      if (!university) continue;
      const programme = university.programmes.find((p) => p.id === item.programmeId);
      if (!programme) continue;
      out.push({ ...item, university, programme });
    }
    return out;
  }, [items]);

  const value = useMemo(
    () => ({ items, resolved, has, toggle, remove, clear, count: resolved.length }),
    [items, resolved, has, toggle, remove, clear],
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist() {
  return useContext(ShortlistContext);
}
