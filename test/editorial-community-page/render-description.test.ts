import createRenderDescription, { GetEditorialCommunityDescription } from '../../src/editorial-community-page/render-description';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('create render page', (): void => {
  describe('when the editorial community exists', (): void => {
    it('renders the community description', async (): Promise<void> => {
      const getDescription: GetEditorialCommunityDescription = async () => 'Something interesting';
      const renderDescription = createRenderDescription(getDescription);
      const rendered = await renderDescription(new EditorialCommunityId('arbitrary-id'));

      expect(rendered).toStrictEqual(expect.stringContaining('Something interesting'));
    });
  });
});
