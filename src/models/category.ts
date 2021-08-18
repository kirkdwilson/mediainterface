import { hashify } from '@helpers/utilities';

/**
 * A model for a single category
 */
export class Category {
  /**
   * The slug for this category
   */
  public hash: string = '';

  /**
   * Construct the category
   *
   * @param name The name of the category
   */
  constructor(
    public name: string
  ) {
    this.hash = hashify(this.name.toLowerCase());
  }

  /**
   * Checks if the given name matches this category. This compares using slugs to
   * remove issues with wrong capitalization.
   *
   * @param  compare The category name to compare to
   * @return         yes|no
   */
  sameAs(compare: string): boolean {
    return (this.hash === hashify(compare.toLowerCase()));
  }

}
