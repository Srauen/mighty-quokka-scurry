import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom colors for StockOS theme
        'electric-blue': '#00AEFF', // A vibrant blue for accents
        'teal': '#00E676', // A vibrant green for positive indicators
        'soft-white': '#E5E7EB', // Light text for headings
        'body-label': '#9CA3AF', // Slightly darker light text for body labels (updated from #BFC7D6)

        // Charts App specific colors
        'charts-bg': '#0B0B0B',
        'charts-panel-bg': 'rgba(11, 11, 11, 0.6)', // Glassmorphic background
        'charts-border': 'rgba(229, 229, 229, 0.1)', // Light border for glassmorphism
        'charts-accent': '#00AEEF', // Stock-OS blue accent
        'charts-text-primary': '#E5E7EB',
        'charts-text-secondary': '#9CA3AF',
        'charts-toolbar-bg': 'rgba(11, 11, 11, 0.8)', // Slightly more opaque for toolbar

        // Heatmap Colors
        'heatmap-strong-up': '#00E676',
        'heatmap-moderate-up': '#00C853',
        'heatmap-neutral': '#808080',
        'heatmap-moderate-down': '#FFD166',
        'heatmap-strong-down': '#FF3B30',
        'heatmap-extreme-down': '#D50000',

        // Colorblind-friendly palette
        'heatmap-cb-up': '#3B82F6',
        'heatmap-cb-neutral': '#9CA3AF',
        'heatmap-cb-down': '#FB923C',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'mac-window': '0.75rem', // macOS-style rounded corners
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-orb": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 174, 239, 0.7)" },
          "70%": { boxShadow: "0 0 0 10px rgba(0, 174, 239, 0)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0, 174, 239, 0.3)" },
          "50%": { boxShadow: "0 0 15px rgba(0, 174, 239, 0.6)" },
        },
        "glow-charts": { // New animation for charts
          "0%, 100%": { boxShadow: "0 0 10px rgba(0, 174, 239, 0.3), inset 0 0 10px rgba(0, 174, 239, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 174, 239, 0.6), inset 0 0 20px rgba(0, 174, 239, 0.6)" },
        },
        "marquee-horizontal": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "marquee-horizontal-slow": { // New slower marquee animation
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "tile-pulse": {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0px rgba(0,0,0,0)" },
          "50%": { transform: "scale(1.02)", boxShadow: "0 0 10px rgba(0, 174, 239, 0.5)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-orb": "pulse-orb 2s infinite",
        "glow": "glow 2s ease-in-out infinite",
        "glow-subtle": "glow 4s ease-in-out infinite",
        "glow-charts": "glow-charts 2s ease-in-out infinite", // New animation
        "marquee-horizontal": "marquee-horizontal 30s linear infinite",
        "marquee-horizontal-slow": "marquee-horizontal-slow 60s linear infinite", // Slower duration
        "tile-pulse": "tile-pulse 2s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-out-left": "slide-out-left 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;