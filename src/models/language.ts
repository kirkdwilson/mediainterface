/**
 * A model of a language
 */
export class Language {

  constructor(
    public codes: Array<string>,
    public text: string,
    public isDefault = false,
  ) {}

}
