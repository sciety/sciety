import dotenv from 'dotenv';
import {
  $, click, goto, openBrowser,
} from 'taiko';
import { screenshotTeardown } from './utilities';

describe('journey-to-group-list', () => {
  beforeEach(async () => {
    dotenv.config();
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  it('navigates to a group list page via that group\'s page', async () => {
    await goto('localhost:8080/groups/ncrc');
    await click('High interest articles');
    const pageTitle = await $('h1').text();

    expect(pageTitle).toContain('High interest articles');
  });
});
