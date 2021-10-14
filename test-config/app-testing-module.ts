import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
/**
 * A tool for configuring the testing module for this app
 */
export class AppTestingModule {
  /**
   * The mocked version of the httpTestingController.
   *
   * @type {HttpTestingController}
   */
  public httpMock: HttpTestingController;
  /**
   * Configure a testing module using the provided libraries.
   *
   * @param  {Array<any>} components An array of components to include in the module
   * @param  {Array<any>} providers  An array of providers to include in the test module
   * @param  {Boolean}    useHttp    Will you use the mock HTTP service?
   *
   * @access public
   */
  public configure(components: Array<any>, providers: Array<any>, useHttp: Boolean): void {
    let testImports = [];
    if (useHttp) {
      testImports = [HttpClientModule, HttpClientTestingModule];
    }
    TestBed.configureTestingModule({
      imports: testImports,
      declarations: components,
      providers: providers
    });
    if (useHttp) {
      this.httpMock = TestBed.get(HttpTestingController);
    }
  }

}
