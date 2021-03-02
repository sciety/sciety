import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { renderFollowers } from '../../src/editorial-community-page/render-followers';
import { GroupId } from '../../src/types/group-id';

describe('render-followers', () => {
  it('renders the follower count', async () => {
    const rendered = await renderFollowers(
      () => T.of(['11111111', '22222222']),
    )(new GroupId('arbitrary id'))();

    expect(rendered).toStrictEqual(E.right(expect.stringContaining('2 users')));
  });
});
