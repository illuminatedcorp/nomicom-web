import { fontFamily } from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

import { useColors } from './src/lib/models/useColors';
const { generateBackgroundColors, generateColors } = useColors();

const baseBackgroundColor = '#121212';
const basePrimaryColor = '#960005';
const baseSecondaryColor = '#E2DCD0';
const primaryOverlayOpacity = 0.6;
const secondaryOverlayOpacity = 0.3;
// 981c20 = red
/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		colors: {
			slate: colors.slate,
			red: generateColors(baseBackgroundColor, '#FF0000', 0.2),
			primary: generateColors(baseBackgroundColor, basePrimaryColor, primaryOverlayOpacity),
			secondary: generateColors(baseBackgroundColor, baseSecondaryColor, secondaryOverlayOpacity),
			background: generateBackgroundColors(baseBackgroundColor),
			zinc: colors.zinc,
			white: colors.white,
			black: colors.black,
			green: colors.green,
			orange: colors.orange,
			error: colors.red,
			blue: colors.blue,
			sky: colors.sky
		},
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				// ring: 'hsl(var(--ring) / <alpha-value>)',
				background: generateBackgroundColors(baseBackgroundColor),
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: generateColors(baseBackgroundColor, basePrimaryColor, primaryOverlayOpacity)[500],
					foreground: generateColors(baseBackgroundColor, basePrimaryColor, primaryOverlayOpacity),
					...generateColors(baseBackgroundColor, basePrimaryColor, primaryOverlayOpacity)
				},
				secondary: {
					DEFAULT: generateColors(baseBackgroundColor, baseSecondaryColor, secondaryOverlayOpacity)[500],
					foreground: generateColors(baseBackgroundColor, baseSecondaryColor, secondaryOverlayOpacity),
					...generateColors(baseBackgroundColor, baseSecondaryColor, secondaryOverlayOpacity)
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			}
		}
	},
	safelist: ['logo-button', 'dark', 'neutral', 'light', 'nav-button', 'tab-button'],
	plugins: [
		function ({ addBase, theme }) {
			function extractColorVars(colorObj, colorGroup = '') {
				return Object.keys(colorObj).reduce((vars, colorKey) => {
					const value = colorObj[colorKey];

					const newVars =
						typeof value === 'string' ? { [`--color${colorGroup}-${colorKey}`]: value } : extractColorVars(value, `-${colorKey}`);

					return { ...vars, ...newVars };
				}, {});
			}

			addBase({
				':root': extractColorVars(theme('colors'))
			});
		}
	]
};

export default config;
