import axios from 'axios';
import {
  $, click, closeBrowser, goto, openBrowser, text, within,
} from 'taiko';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../test/helpers';

describe('add-group', () => {
  const newGroup = {
    name: arbitraryWord(),
    shortDescription: arbitraryString(),
    homepage: arbitraryUri(),
    avatarPath: arbitraryUri(),
    descriptionPath: arbitraryString(),
    slug: arbitraryWord(),
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

  it('the group appears in the list on the groups page', async () => {
    await goto('localhost:8080/groups');
    const groupCardExists = await text(newGroup.name, within($('.group-list'))).exists();

    expect(groupCardExists).toBe(true);
  });

  it('the group now has its own page', async () => {
    await goto('localhost:8080/groups');
    const link = $(`[href="/groups/${newGroup.slug}"].group-card__link`);
    await click(link);
    const title = await $('h1').text();

    expect(title).toContain(newGroup.name);
  });

  it('the group can be searched for', async () => {
    const encodedGroupName = encodeURIComponent(newGroup.name);
    await goto(`localhost:8080/search?query=${encodedGroupName}&category=groups`);
    const groupWasFound = await text(newGroup.name, within($('.search-results-list'))).exists();

    expect(groupWasFound).toBe(true);
  });
});
