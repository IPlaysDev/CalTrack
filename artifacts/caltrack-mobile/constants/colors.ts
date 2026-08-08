/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#F7F8FA',
    tint: '#FF7A2F',
    background: '#0B0D11',
    foreground: '#F7F8FA',
    card: '#151922',
    cardForeground: '#F7F8FA',
    primary: '#FF7A2F',
    primaryForeground: '#160D08',
    secondary: '#202530',
    secondaryForeground: '#F7F8FA',
    muted: '#1B202A',
    mutedForeground: '#8E96A6',
    accent: '#FFB36E',
    accentForeground: '#1A100A',
    destructive: '#FF5C5C',
    destructiveForeground: '#FFFFFF',
    border: '#2B313D',
    input: '#242A35',
    glass: 'rgba(25, 30, 40, 0.72)',
    glassStrong: 'rgba(30, 36, 47, 0.92)',
    softOrange: 'rgba(255, 122, 47, 0.14)',
    orangeGlow: 'rgba(255, 122, 47, 0.28)',
    success: '#76D6A3',
  },
  dark: {
    text: '#F7F8FA',
    tint: '#FF7A2F',
    background: '#0B0D11',
    foreground: '#F7F8FA',
    card: '#151922',
    cardForeground: '#F7F8FA',
    primary: '#FF7A2F',
    primaryForeground: '#160D08',
    secondary: '#202530',
    secondaryForeground: '#F7F8FA',
    muted: '#1B202A',
    mutedForeground: '#8E96A6',
    accent: '#FFB36E',
    accentForeground: '#1A100A',
    destructive: '#FF5C5C',
    destructiveForeground: '#FFFFFF',
    border: '#2B313D',
    input: '#242A35',
    glass: 'rgba(25, 30, 40, 0.72)',
    glassStrong: 'rgba(30, 36, 47, 0.92)',
    softOrange: 'rgba(255, 122, 47, 0.14)',
    orangeGlow: 'rgba(255, 122, 47, 0.28)',
    success: '#76D6A3',
  },
  radius: 22,
};

export default colors;
