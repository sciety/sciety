import { JSDOM } from 'jsdom';
import { userListCard } from '../../../src/user-page/user-list-card';
import { arbitraryWord } from '../../helpers';

describe('user-list-card', () => {
  it('displays the title of the list', async () => {
    const rendered = JSDOM.fragment(await userListCard(arbitraryWord())());

    expect(rendered?.textContent).toContain('Saved articles');
  });

  it.todo('links to the user list page');

  it.todo('displays the list owner\'s handle in the description');
});
