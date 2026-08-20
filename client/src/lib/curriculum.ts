/**
 * 设计风格：Admissions Almanac —— 本模块不含样式，仅声明站点定位与课程体系可见性。
 *
 * 本站为 BCI 招生与升学指导办公室的内部工具，不作为对外公开页面分发：
 *  - 站内同时呈现 WACE 与 Cambridge A-Level 两套体系，供顾问对照使用
 *  - 全站注入 noindex/nofollow 并配合 robots.txt，避免被搜索引擎收录
 *  - 若日后需要对外发布，将 INTERNAL_ONLY 设为 false 即可解除收录限制
 */

/** 站点是否仅供内部使用（决定搜索引擎收录策略与页面标识） */
export const INTERNAL_ONLY: boolean =
  String(import.meta.env.VITE_INTERNAL_ONLY ?? "true").toLowerCase() !== "false";

/** WACE 是否在站内可见。内部工具场景下与 A-Level 并列呈现。 */
export const WACE_PUBLIC: boolean =
  String(import.meta.env.VITE_WACE_PUBLIC ?? "true").toLowerCase() !== "false";
