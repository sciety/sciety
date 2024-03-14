import {
  $, click, closeBrowser, goto, openBrowser, text, within,
} from 'taiko';
import { callApi } from '../helpers/call-api.helper';
import { arbitraryAddGroupCommand } from '../../test/write-side/commands/add-group-command.helper';

describe('add-group', () => {
  const addGroupCommand = arbitraryAddGroupCommand();

  beforeAll(async () => {
    await openBrowser();
    await callApi('api/add-group', addGroupCommand);
  });

  afterAll(async () => {
    await closeBrowser();
  });

  it('the group appears in the list on the groups page', async () => {
    await goto('localhost:8080/groups');
    const groupCardExists = await text(addGroupCommand.name, within($('.card-list'))).exists();

    expect(groupCardExists).toBe(true);
  });

  it.failing('the group now has its own page', async () => {
    await goto('localhost:8080/groups');
    const link = $(`[href="/groups/${addGroupCommand.slug}"].group-card__link`);
    await click(link);
    const groupName = await $('h1 img').attribute('alt');

    expect(groupName).toBe(addGroupCommand.name);
  });
});
