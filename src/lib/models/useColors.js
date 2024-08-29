export const useColors = () => {
  const generateBackgroundColors = (baseColor) => {
    let baseRgb = hexToRgb(baseColor);
    let whiteRgb = hexToRgb('#ffffff');
    let colors = {};
    let steps = [0.05, 0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.78, 0.89, 1.0];
    let tailwindColorSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    for (let i = 0; i < steps.length; i++) {
      let factor = steps[i];
      let interpolatedColor = interpolateColor(whiteRgb, baseRgb, factor);
      colors[tailwindColorSteps[i]] = rgbToHex(interpolatedColor[0], interpolatedColor[1], interpolatedColor[2]);
    }

    return colors;
  };

  const generateColors = (baseColor, overlayColor, opacity) => {
    // The idea here is that we generate a valid set of colors based on the provided base color, overlay color, and opacity
    let colors = {};
    let backgroundColors = generateBackgroundColors(baseColor);
    let colorSteps = Object.keys(backgroundColors);

    for (let colorStep of colorSteps) {
      let baseRgb = hexToRgb(backgroundColors[colorStep]);
      let overlayRgb = hexToRgb(overlayColor);

      let r = Math.round((1 - opacity) * baseRgb[0] + opacity * overlayRgb[0]);
      let g = Math.round((1 - opacity) * baseRgb[1] + opacity * overlayRgb[1]);
      let b = Math.round((1 - opacity) * baseRgb[2] + opacity * overlayRgb[2]);

      let resultingColor = rgbToHex(r, g, b);
      colors[colorStep] = resultingColor;
    }

    return colors;
  };

  const interpolateColor = (color1, color2, factor) => {
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
    }
    return result;
  };

  const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, '');
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return [r, g, b];
  };

  const rgbToHex = (r, g, b) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  };

  return {
    generateBackgroundColors,
    generateColors,
  };
};
