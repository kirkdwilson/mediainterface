/**
 * Various helpful utilities
 */
/**
 * Create a hash code for the given string
 *
 * @param  str  The string to hasify
 * @return      A unique hash based on the string
 * @link        https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
 */
export function hashify(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36);
}
