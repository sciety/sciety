import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { renderEditorialCommunity } from '../../src/home-page/render-editorial-community';
import { GroupId } from '../../src/types/group-id';
import { toHtmlFragment } from '../../src/types/html-fragment';

describe('render-editorial-community', () => {
  it('renders the name of the community', async () => {
    const community = {
      id: new GroupId('A'),
      name: 'Editorial Community A',
      avatarPath: '',
    };
    const render = renderEditorialCommunity(
      () => T.of(toHtmlFragment('')),
    );
    const rendered = await render(O.none)(community)();

    expect(rendered).toContain('Editorial Community A');
  });
});
