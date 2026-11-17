import { notesMentioningAnyOf } from '../../src/third-parties/fetch-bonfire-notes';
import { ActivityPubMention } from '../../src/types/activitypub-mention';
import * as EDOI from '../../src/types/expression-doi';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../helpers';

const arbitraryNote = (content: string): ActivityPubMention => ({
  id: arbitraryUri(),
  bonfireUrl: arbitraryUri(),
  url: arbitraryUri(),
  attributedTo: arbitraryUri(),
  content,
  published: arbitraryDate(),
});

describe('fetch-bonfire-notes', () => {
  describe('notesMentioningAnyOf', () => {
    const doi = EDOI.fromValidatedString('10.1101/2025.07.11.664448');

    it.each([
      ['a doi.org link', '<a href="https://doi.org/10.1101/2025.07.11.664448">'],
      ['a versioned bioRxiv link', '<a href="https://www.biorxiv.org/content/10.1101/2025.07.11.664448v1">'],
      ['an uppercase DOI', '10.1101/2025.07.11.664448'.toUpperCase()],
    ])('keeps a note that mentions the DOI in %s', (_, content) => {
      const note = arbitraryNote(content);

      expect(notesMentioningAnyOf([doi])([note])).toStrictEqual([note]);
    });

    it('drops a note that mentions a longer DOI starting with the same digits', () => {
      const note = arbitraryNote('https://doi.org/10.1101/2025.07.11.6644481');

      expect(notesMentioningAnyOf([doi])([note])).toStrictEqual([]);
    });

    it('drops a note that does not mention the DOI', () => {
      const note = arbitraryNote(arbitraryString());

      expect(notesMentioningAnyOf([doi])([note])).toStrictEqual([]);
    });
  });
});
