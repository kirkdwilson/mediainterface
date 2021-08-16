/**
 * Set environment specific values.  Duplicate this file to environment.ts for dev settings
 * and environment.prod.ts for production settings.
 *
 * @link https://stackoverflow.com/a/48709489/4638563
 */
export const environment = {
  // The path to the media assets. {LANG} is replaced with two letter ISO code
  // Add ending slash
  assetPath: 'assets/content/{LANG}/',
  // Path to the languages file
  languagePath: 'assets/content/languages.json',
  // Are we using a production version?
  isProduction: false,
};
