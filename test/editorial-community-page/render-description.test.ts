import * as T from 'fp-ts/Task';
import { GetEditorialCommunityDescription, renderDescription } from '../../src/editorial-community-page/render-description';
import { EditorialCommunity } from '../../src/types/editorial-community';

describe('render-description', () => {
  describe('when the editorial community exists', () => {
    it('renders the community description', async () => {
      const getDescription: GetEditorialCommunityDescription = () => T.of('Something interesting');
      const rendered = await renderDescription(getDescription)({} as EditorialCommunity)();

      expect(rendered).toStrictEqual(expect.stringContaining('Something interesting'));
    });
  });
});
