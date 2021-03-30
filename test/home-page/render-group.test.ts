import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { renderGroup } from '../../src/home-page/render-group';
import { GroupId } from '../../src/types/group-id';
import { toHtmlFragment } from '../../src/types/html-fragment';

describe('render-group', () => {
  it('renders the name of the group', async () => {
    const group = {
      id: new GroupId('A'),
      name: 'Group A',
      avatarPath: '',
    };
    const render = renderGroup(
      () => () => toHtmlFragment(''),
      () => T.of(false),
    );
    const rendered = await render(O.none)(group)();

    expect(rendered).toContain('Group A');
  });
});
