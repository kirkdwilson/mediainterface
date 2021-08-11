/**
 * A model for a single category
 */
export class Category {
  /**
   * The slug for this category
   */
  public slug: string = '';

  /**
   * Construct the category
   *
   * @param name The name of the category
   */
  constructor(
    public name: string
  ) {
    this.slug = this.getSlug();
  }

  /**
   * Create a slug from the category name
   *
   * @return The slug
   * @link https://mhagemann.medium.com/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
   */
  private getSlug(): string {
    const accents = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    const replace = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(accents.split('').join('|'), 'g');

    return this.name.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => replace.charAt(accents.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

}
