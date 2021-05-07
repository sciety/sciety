import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { renderGroup } from '../../src/groups-page/render-group';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { arbitraryGroupId } from '../types/group-id.helper';

describe('render-group', () => {
  it('renders the name of the group', async () => {
    const group = {
      id: arbitraryGroupId(),
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
