import * as T from 'fp-ts/Task';
import { createRenderDescription, GetEditorialCommunityDescription } from '../../src/editorial-community-page/render-description';
import { EditorialCommunity } from '../../src/types/editorial-community';

describe('create render page', () => {
  describe('when the editorial community exists', () => {
    it('renders the community description', async () => {
      const getDescription: GetEditorialCommunityDescription = () => T.of('Something interesting');
      const renderDescription = createRenderDescription(getDescription);
      const rendered = await renderDescription({} as EditorialCommunity)();

      expect(rendered).toStrictEqual(expect.stringContaining('Something interesting'));
    });
  });
});
