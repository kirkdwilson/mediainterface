/**
 * An interface for all viewers that inherit from BaseViewerPage.
 */
export interface BaseViewerPageInterface {
  storageKey: string;
  loadFile: ()  =>  void;
}
