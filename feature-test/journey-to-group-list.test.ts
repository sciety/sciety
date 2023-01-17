import {
  $, click, goto, openBrowser,
} from 'taiko';
import { arbitraryWord, arbitraryString } from '../test/helpers';
import { arbitraryDescriptionPath } from '../test/types/description-path.helper';
import { arbitraryGroupId } from '../test/types/group-id.helper';
import { callApi } from './call-api.helper';
import { screenshotTeardown } from './utilities';

describe('journey-to-group-list', () => {
  beforeEach(async () => {
    await openBrowser();
  });

  afterEach(screenshotTeardown);

  it('navigates to a group list page via that group\'s page', async () => {
    const groupSlug = arbitraryWord();
    const listName = 'Evaluated articles';
    await callApi('api/add-group', {
      groupId: arbitraryGroupId(),
      name: arbitraryString(),
      shortDescription: arbitraryString(),
      homepage: arbitraryString(),
      avatarPath: 'http://somethingthatproducesa404',
      descriptionPath: arbitraryDescriptionPath(),
      slug: groupSlug,
    });
    await goto(`localhost:8080/groups/${groupSlug}`);
    await click(listName);
    const pageTitle = await $('h1').text();

    expect(pageTitle).toContain(listName);
  });
});
