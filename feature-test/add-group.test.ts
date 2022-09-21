import axios from 'axios';
import {
  $, closeBrowser, goto, openBrowser, text, within,
} from 'taiko';
import { arbitraryString, arbitraryWord } from '../test/helpers';

describe.skip('add-group', () => {
  const newGroup = {
    name: arbitraryWord(),
    shortDescription: arbitraryString(),
  };

  beforeAll(async () => {
    await openBrowser();
    await axios.post(
      'http://localhost:8080/add-group',
      JSON.stringify(newGroup),
      {
        headers: {
          Authorization: 'Bearer secret',
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      },
    );
  });

  afterAll(async () => {
    await closeBrowser();
  });

  describe('the list of groups on the groups page', () => {
    beforeAll(async () => {
      await goto('localhost:8080/groups');
    });

    it.each([
      [newGroup.name],
      [newGroup.shortDescription],
    ])('the new group appears', async (expectedString) => {
      const itemExists = await text(expectedString, within($('.group-list'))).exists();

      expect(itemExists).toBe(true);
    });
  });

  it.todo('the group now has its own page');

  it.todo('can be searched for');

  it.todo('creation of the group appears in the Sciety feed');
});
