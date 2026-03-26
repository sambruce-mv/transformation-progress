export { colors, gradients } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';

export const theme = {
  colors: require('./colors').colors,
  gradients: require('./colors').gradients,
  typography: require('./typography').typography,
  spacing: require('./spacing').spacing,
};

export default theme;
