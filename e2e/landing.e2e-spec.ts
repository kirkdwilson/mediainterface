import { Page } from './landing.po';

describe('Landing Page:', () => {
  let page: Page;

  beforeEach(() => {
    page = new Page();
  });

  describe('Default Screen:', () => {
    beforeEach(() => {
      page.navigateTo('/');
    });

    it('should have the correct title', () => {
      page.getTitle().then(title => {
        expect(title).toEqual('MM Interface');
      });
    });
  })
});
