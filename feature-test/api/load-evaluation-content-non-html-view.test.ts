import { goto, openBrowser } from 'taiko';
import { screenshotTeardown } from '../utilities';

describe('load-evaluation-content-non-html-view', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  it('evaluation paths containing evaluation locators resolve correctly', async () => {
    const response = await goto('http://localhost:8080/evaluations/doi:10.1101/123/content');

    expect(response.status.code).toBe(200);
  });
});
