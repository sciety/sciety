import {
  closeBrowser, goto, into, openBrowser, textBox, write,
} from 'taiko';
import { getFirstListOwnedBy } from './get-first-list-owned-by.helper';
import { arbitraryWord } from '../test/helpers';

describe('edit-list-details', () => {
  beforeAll(async () => {
    const testUserId = '153571843';
    await openBrowser();
    await goto(`localhost:8080/log-in-as?userId=${testUserId}`);
    const listId = await getFirstListOwnedBy(testUserId);
    const editListDetailsPage = `localhost:8080/lists/${listId}/edit-details`;
    await goto(editListDetailsPage);
  });

  afterAll(async () => {
    await closeBrowser();
  });

  describe('providing a new value into the name field and clicking save', () => {
    // eslint-disable-next-line jest/expect-expect
    it('the list is renamed with the new value', async () => {
      await write(arbitraryWord(), into(textBox('List name')));
    });
  });
});
