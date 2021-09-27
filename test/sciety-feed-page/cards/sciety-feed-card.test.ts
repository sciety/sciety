import { scietyFeedCard } from '../../../src/sciety-feed-page/cards/sciety-feed-card';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../../helpers';

describe('sciety-feed-card', () => {
  describe('when the view model doesn\'t contain details', () => {
    it('doesn\'t contain a details section', () => {
      const rendered = scietyFeedCard({
        titleText: arbitraryString(),
        avatarUrl: arbitraryUri(),
        date: arbitraryDate(),
        linkUrl: arbitraryUri(),
      });

      expect(rendered).not.toContain('sciety-feed-card__details');
    });
  });

  describe('when the view model contains details', () => {
    it.todo('contains a details section');
  });
});
