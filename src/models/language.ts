/**
 * A model of a language
 */
export class Language {
  /**
   * A two letter code representing the language
   */
  twoLetterCode = '';

  constructor(
    public codes: Array<string>,
    public text: string,
    public isDefault = false,
  ) {
    this.codes = codes.map((code) => code.toLowerCase());
    const specific = codes.find((code) => code.length === 2);
    const dashed = codes.find((code) => code.indexOf('-') !== -1);
    if (specific) {
      this.twoLetterCode = specific;
    } else if (dashed) {
      this.twoLetterCode = dashed.split('-')[0];
    }
  }

}
