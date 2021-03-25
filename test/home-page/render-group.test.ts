import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { renderGroup } from '../../src/home-page/render-group';
import { GroupId } from '../../src/types/group-id';
import { toHtmlFragment } from '../../src/types/html-fragment';

describe('render-editorial-community', () => {
  it('renders the name of the community', async () => {
    const community = {
      id: new GroupId('A'),
      name: 'Group A',
      avatarPath: '',
    };
    const render = renderGroup(
      () => T.of(toHtmlFragment('')),
    );
    const rendered = await render(O.none)(community)();

    expect(rendered).toContain('Group A');
  });
});
