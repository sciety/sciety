import * as T from 'fp-ts/Task';
import createRenderDescription, { GetEditorialCommunityDescription } from '../../src/editorial-community-page/render-description';
import { EditorialCommunity } from '../../src/types/editorial-community';

describe('create render page', (): void => {
  describe('when the editorial community exists', (): void => {
    it('renders the community description', async (): Promise<void> => {
      const getDescription: GetEditorialCommunityDescription = () => T.of('Something interesting');
      const renderDescription = createRenderDescription(getDescription);
      const rendered = await renderDescription({} as EditorialCommunity)();

      expect(rendered).toStrictEqual(expect.stringContaining('Something interesting'));
    });
  });
});
