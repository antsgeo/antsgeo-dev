import { DeployCliPage } from './app.po';

describe('deploy-cli App', function() {
  let page: DeployCliPage;

  beforeEach(() => {
    page = new DeployCliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
