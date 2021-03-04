import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { renderDescription } from '../../src/group-page/render-description';
import { Group } from '../../src/types/group';

describe('render-description', () => {
  describe('when the editorial community exists', () => {
    it('renders the community description', async () => {
      const getDescription = () => TE.right('Something interesting');
      const rendered = await renderDescription(getDescription)({} as Group)();

      expect(rendered).toStrictEqual(E.right(expect.stringContaining('Something interesting')));
    });
  });
});
