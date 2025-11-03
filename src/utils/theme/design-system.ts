import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base dimensions for design (iPhone 14 Pro as reference)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Design System - Centralized styling constants
 */
export const designSystem = {
  // Colors
  colors: {
    primary: "#D4AF37",
    primaryLight: "#EBDFBA",
    primaryDark: "#8A6F20",

    secondary: "#1F2937",
    secondaryLight: "#374151",
    secondaryDark: "#111827",

    accent: "#EF4444",
    accentLight: "#FCA5A5",
    accentDark: "#DC2626",

    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",

    background: {
      primary: "#FFFFFF",
      secondary: "#F9FAFB",
      dark: "#000000",
    },

    text: {
      primary: "#111827",
      secondary: "#6B7280",
      tertiary: "#9CA3AF",
      inverse: "#FFFFFF",
    },

    border: {
      light: "#E5E7EB",
      medium: "#D1D5DB",
      dark: "#9CA3AF",
    },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64,
  },

  // Border Radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // Typography
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 30,
      "4xl": 36,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    fontWeight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    } as const,
  },

  // Shadows
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },

  // Z-Index
  zIndex: {
    base: 1,
    dropdown: 10,
    modal: 100,
    popover: 200,
    tooltip: 300,
  },
};

/**
 * Responsive dimension helpers
 */
export const responsive = {
  /**
   * Width percentage
   * @param percentage - 0 to 100
   */
  wp: (percentage: number): number => {
    return (SCREEN_WIDTH * percentage) / 100;
  },

  /**
   * Height percentage
   * @param percentage - 0 to 100
   */
  hp: (percentage: number): number => {
    return (SCREEN_HEIGHT * percentage) / 100;
  },

  /**
   * Scale font size based on screen width
   */
  scaleFont: (size: number): number => {
    const scale = SCREEN_WIDTH / BASE_WIDTH;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  },

  /**
   * Scale dimension based on screen width
   */
  scale: (size: number): number => {
    const scale = SCREEN_WIDTH / BASE_WIDTH;
    return Math.round(size * scale);
  },

  /**
   * Vertical scale based on screen height
   */
  verticalScale: (size: number): number => {
    const scale = SCREEN_HEIGHT / BASE_HEIGHT;
    return Math.round(size * scale);
  },

  /**
   * Moderate scale - blend of horizontal and vertical scaling
   * @param size - base size
   * @param factor - scaling factor (default 0.5)
   */
  moderateScale: (size: number, factor: number = 0.5): number => {
    const scale = SCREEN_WIDTH / BASE_WIDTH;
    return Math.round(size + (scale - 1) * size * factor);
  },

  // Screen info
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    isSmallDevice: SCREEN_WIDTH < 375,
    isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
    isLargeDevice: SCREEN_WIDTH >= 414,
  },
};

/**
 * Quick access to common values
 */
export const { colors, spacing, radius, typography, shadows, zIndex } =
  designSystem;

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
