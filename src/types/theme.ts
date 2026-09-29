export type ThemePalette = 'midnight' | 'sunset' | 'emerald' | 'royal' | 'daylight';

export interface ThemeConfig {
  id: ThemePalette;
  name: string;
  subtitle: string;
  isDark: boolean;
  accentName: string;
  accentGradient: string;
  accentText: string;
  primaryButton: string;
  activeNav: string;
  cardBorder: string;
  cardBg: string;
  badgeClass: string;
  ringGlow: string;
  swatchGradient: string;
}

export const THEME_CONFIGS: Record<ThemePalette, ThemeConfig> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Obsidian',
    subtitle: 'Obsidian navy with electric cobalt & cyan telemetry',
    isDark: true,
    accentName: 'Cobalt & Cyan',
    accentGradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    accentText: 'text-cyan-400',
    primaryButton: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-500/20',
    activeNav: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm',
    cardBorder: 'border-slate-800/80 hover:border-blue-500/40',
    cardBg: 'bg-slate-900/85',
    badgeClass: 'bg-blue-500/10 text-cyan-300 border-blue-500/25',
    ringGlow: 'ring-blue-500/30',
    swatchGradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Express',
    subtitle: 'Warm golden hour ember with sunset orange & rose crimson',
    isDark: true,
    accentName: 'Amber & Crimson',
    accentGradient: 'from-amber-500 via-orange-600 to-rose-600',
    accentText: 'text-amber-400',
    primaryButton: 'bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-orange-500/20',
    activeNav: 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white shadow-sm',
    cardBorder: 'border-amber-900/40 hover:border-amber-500/40',
    cardBg: 'bg-stone-900/85',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    ringGlow: 'ring-amber-500/30',
    swatchGradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Junction',
    subtitle: 'Alpine deep forest with luminous jade & mint brass',
    isDark: true,
    accentName: 'Jade & Mint',
    accentGradient: 'from-emerald-500 via-teal-600 to-cyan-600',
    accentText: 'text-emerald-400',
    primaryButton: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20',
    activeNav: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm',
    cardBorder: 'border-emerald-900/50 hover:border-emerald-500/40',
    cardBg: 'bg-emerald-950/40',
    badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
    ringGlow: 'ring-emerald-500/30',
    swatchGradient: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400'
  },
  royal: {
    id: 'royal',
    name: 'Royal Metro',
    subtitle: 'Twilight velvet with luminous amethyst & electric fuchsia',
    isDark: true,
    accentName: 'Amethyst & Fuchsia',
    accentGradient: 'from-violet-600 via-purple-600 to-pink-500',
    accentText: 'text-purple-400',
    primaryButton: 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white shadow-purple-500/20',
    activeNav: 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm',
    cardBorder: 'border-purple-900/40 hover:border-purple-500/40',
    cardBg: 'bg-purple-950/35',
    badgeClass: 'bg-purple-500/10 text-purple-300 border-purple-500/25',
    ringGlow: 'ring-purple-500/30',
    swatchGradient: 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500'
  },
  daylight: {
    id: 'daylight',
    name: 'Daylight Sapphire',
    subtitle: 'Clean porcelain daylight with vivid sapphire blue',
    isDark: false,
    accentName: 'Sapphire & Sky',
    accentGradient: 'from-blue-600 via-blue-500 to-indigo-600',
    accentText: 'text-blue-600',
    primaryButton: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/15',
    activeNav: 'bg-blue-600 text-white shadow-sm',
    cardBorder: 'border-slate-200 hover:border-blue-400',
    cardBg: 'bg-white',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    ringGlow: 'ring-blue-500/20',
    swatchGradient: 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600'
  }
};
