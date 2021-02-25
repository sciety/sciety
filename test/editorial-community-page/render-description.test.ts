import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { renderDescription } from '../../src/editorial-community-page/render-description';
import { EditorialCommunity } from '../../src/types/editorial-community';

describe('render-description', () => {
  describe('when the editorial community exists', () => {
    it('renders the community description', async () => {
      const getDescription = () => TE.right('Something interesting');
      const rendered = await renderDescription(getDescription)({} as EditorialCommunity)();

      expect(rendered).toStrictEqual(E.right(expect.stringContaining('Something interesting')));
    });
  });
});
