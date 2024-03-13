import {
  $, click, closeBrowser, goto, openBrowser, text, within,
} from 'taiko';
import { AddGroupCommand } from '../../src/write-side/commands';
import { arbitraryGroup } from '../../test/types/group.helper';
import { callApi } from '../helpers/call-api.helper';

describe('add-group', () => {
  const newGroup = arbitraryGroup();
  const addGroupCommand: AddGroupCommand = {
    groupId: newGroup.id,
    name: newGroup.name,
    shortDescription: newGroup.shortDescription,
    homepage: newGroup.homepage,
    avatarPath: newGroup.avatarPath,
    descriptionPath: newGroup.descriptionPath,
    slug: newGroup.slug,
  };

  beforeAll(async () => {
    await openBrowser();
    await callApi('api/add-group', addGroupCommand);
  });

  afterAll(async () => {
    await closeBrowser();
  });

  it('the group appears in the list on the groups page', async () => {
    await goto('localhost:8080/groups');
    const groupCardExists = await text(newGroup.name, within($('.card-list'))).exists();

    expect(groupCardExists).toBe(true);
  });

  it.failing('the group now has its own page', async () => {
    await goto('localhost:8080/groups');
    const link = $(`[href="/groups/${newGroup.slug}"].group-card__link`);
    await click(link);
    const groupName = await $('h1 img').attribute('alt');

    expect(groupName).toBe(newGroup.name);
  });
});
