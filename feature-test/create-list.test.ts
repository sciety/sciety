import {
  $, goto, openBrowser,
} from 'taiko';
import { screenshotTeardown } from './utilities';

describe('create a list', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  describe('when creating a list using the API', () => {
    const listName = 'Bogus list name';
    const groupSlug = 'pci-paleontology';

    beforeEach(async () => {
      await goto(`localhost:8080/groups/${groupSlug}`);
    });

    it.skip('displays the list card on the lists tab of the owning group\'s page', async () => {
      const listCardTitle = await $('.list-card__title').text();

      expect(listCardTitle).toStrictEqual(listName);
    });
  });
});
