import { describe, it, expect } from 'vitest';
import { useColors } from './useColors';

describe('useColors', () => {
	const { generateColors, generateBackgroundColors, interpolateColor, hexToRgb, rgbToHex } =
		useColors();

	it('generateBackgroundColors should generate correct background colors for a given base color', () => {
		const baseColor = '#121212'; // normal background color
		const expectedColors = {
			'50': '#F3F3F3',
			'100': '#E5E5E5',
			'200': '#CBCBCB',
			'300': '#B1B1B1',
			'400': '#979797',
			'500': '#7D7D7D',
			'600': '#636363',
			'700': '#464646',
			'800': '#2C2C2C',
			'900': '#121212'
		};

		const result = generateBackgroundColors(baseColor);
		expect(result).toEqual(expectedColors);
	});

	it('generateBackgroundColors should treat invalid hex as black', () => {
		const baseColor = '#ZZZZZZ'; // Invalid hex color

		const expectedColors = {
			'50': '#F2F2F2',
			'100': '#E3E3E3',
			'200': '#C7C7C7',
			'300': '#ABABAB',
			'400': '#8F8F8F',
			'500': '#737373',
			'600': '#575757',
			'700': '#383838',
			'800': '#1C1C1C',
			'900': '#000000'
		};

		const result = generateBackgroundColors(baseColor);
		expect(result).toEqual(expectedColors);
	});

	it('generateColors should generate correct colors based on base color, overlay color, and opacity', () => {
		const baseBackgroundColor = '#121212'; // normal background color
		const overlayColor = '#FF0000'; // red
		const opacity = 0.5; // 50% overlay

		const expectedColors = {
			'50': '#F97A7A',
			'100': '#F27373',
			'200': '#E56666',
			'300': '#D85959',
			'400': '#CB4C4C',
			'500': '#BE3F3F',
			'600': '#B13232',
			'700': '#A32323',
			'800': '#961616',
			'900': '#890909'
		};

		const result = generateColors(baseBackgroundColor, overlayColor, opacity);
		expect(result).toEqual(expectedColors);
	});

	it('generateColors should return background colors when opacity is 0', () => {
		const baseBackgroundColor = '#121212'; // normal background color
		const overlayColor = '#FF0000'; // Red
		const opacity = 0; // No overlay

		const expectedColors = {
			'50': '#F3F3F3',
			'100': '#E5E5E5',
			'200': '#CBCBCB',
			'300': '#B1B1B1',
			'400': '#979797',
			'500': '#7D7D7D',
			'600': '#636363',
			'700': '#464646',
			'800': '#2C2C2C',
			'900': '#121212'
		};

		const result = generateColors(baseBackgroundColor, overlayColor, opacity);
		expect(result).toEqual(expectedColors); // Should return base colors without overlay
	});

	it('generateColors should return full overlay color for every entry when opacity is 1', () => {
		const baseBackgroundColor = '#121212'; // normal background color
		const overlayColor = '#FF0000'; // Red
		const opacity = 1; // 100% overlay

		const expectedColors = {
			'50': '#FF0000',
			'100': '#FF0000',
			'200': '#FF0000',
			'300': '#FF0000',
			'400': '#FF0000',
			'500': '#FF0000',
			'600': '#FF0000',
			'700': '#FF0000',
			'800': '#FF0000',
			'900': '#FF0000'
		};

		const result = generateColors(baseBackgroundColor, overlayColor, opacity);
		expect(result).toEqual(expectedColors); // Should return base colors without overlay
	});

	it('interpolateColor should correctly interpolate between two colors', () => {
		const color1 = [255, 0, 0]; // Red
		const color2 = [0, 0, 255]; // Blue
		const factor = 0.5; // Halfway interpolation

		const expectedColor = [128, 0, 128]; // Should result in purple (midway between red and blue)

		const result = interpolateColor(color1, color2, factor);
		expect(result).toEqual(expectedColor);
	});

	it('hexToRgb should correctly convert a hex color to RGB', () => {
		const hexColor = '#FF5733'; // A shade of orange
		const expectedRgb = [255, 87, 51]; // Corresponding RGB values

		const result = hexToRgb(hexColor);
		expect(result).toEqual(expectedRgb);
	});

	it('rgbToHex should correctly convert RGB values to hex color', () => {
		const r = 255;
		const g = 87;
		const b = 51;
		const expectedHex = '#FF5733'; // Corresponding hex value

		const result = rgbToHex(r, g, b);
		expect(result).toBe(expectedHex);
	});
});
