import * as fs from 'fs';
import path from 'path';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { activityPubNoteCodec, notesMentioningAnyOf } from '../../src/third-parties/fetch-bonfire-notes';
import { ActivityPubMention } from '../../src/types/activitypub-mention';
import * as EDOI from '../../src/types/expression-doi';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';

const savedObject = (filename: string): unknown => JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', '..', 'data', 'bonfire-activitypub-objects', filename), 'utf8'),
);

const arbitraryNote = (content: string): ActivityPubMention => ({
  id: arbitraryUri(),
  url: arbitraryUri(),
  attributedTo: arbitraryUri(),
  content,
  published: arbitraryDate(),
});

describe('fetch-bonfire-notes', () => {
  describe('activityPubNoteCodec', () => {
    describe('given an object saved from bonfire.cafe', () => {
      const note = pipe(
        savedObject('01M74PBFVRXXJ03A0QT56XFSWM.json'),
        activityPubNoteCodec.decode,
        E.getOrElseW(shouldNotBeCalled),
      );

      it('decodes the id of the original post', () => {
        expect(note.id).toBe('https://fediscience.org/users/rupdecat/statuses/117596504130124409');
      });

      it('decodes the published date', () => {
        expect(note.published).toStrictEqual(new Date('2026-11-11T06:57:31Z'));
      });
    });

    it('rejects an object that is not a Note', () => {
      const result = activityPubNoteCodec.decode({ ...arbitraryNote(arbitraryString()), type: 'Article' });

      expect(E.isLeft(result)).toBe(true);
    });
  });

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
