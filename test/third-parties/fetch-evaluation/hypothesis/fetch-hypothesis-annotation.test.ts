import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { HypothesisAnnotation } from '../../../../src/third-parties/fetch-evaluation/hypothesis/HypothesisAnnotation';
import { fetchHypothesisAnnotation, insertSelectedText } from '../../../../src/third-parties/fetch-evaluation/hypothesis/fetch-hypothesis-annotation';
import { dummyLogger } from '../../../dummy-logger';
import { arbitraryWord } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryDataError } from '../../../types/data-error.helper';

const date = '2019-09-12T09:55:46.146050+00:00';
const key = arbitraryWord();

describe('fetch-hypothesis-annotation', () => {
  it('returns the evaluation', async () => {
    const queryExternalService = () => () => TE.right({
      created: date,
      text: '<p>Very good</p>',
      target: [],
      links: {
        incontext: 'https://www.example.com',
      },
    });
    const digest = await fetchHypothesisAnnotation(queryExternalService, dummyLogger)(key)();

    expect(digest).toStrictEqual(E.right('<p>Very good</p>'));
  });

  it.each([
    ['basic Markdown', '# Very good', '<h1>Very good</h1>'],
    ['(linkify) GitHub Flavored Markdown', 'www.example.com', '<a href="http://www.example.com">www.example.com</a>'],
    ['bold italics', '***bold/italics** italics*', '<p><em><strong>bold/italics</strong> italics</em></p>'],
  ])('converts %s to HTML', async (_, input: string, expected: string) => {
    const queryExternalService = () => () => TE.right({
      created: date,
      text: input,
      tags: [],
      target: [],
      links: {
        incontext: 'https://www.example.com',
      },
    });
    const digest = await pipe(
      key,
      fetchHypothesisAnnotation(queryExternalService, dummyLogger),
      TE.getOrElse(shouldNotBeCalled),
    )();

    expect(digest).toContain(expected);
  });

  describe('when queryExternalService fails', () => {
    let result: unknown;
    const originalError = arbitraryDataError();
    const queryExternalService = () => () => TE.left(originalError);

    beforeEach(async () => {
      result = await fetchHypothesisAnnotation(queryExternalService, dummyLogger)(key)();
    });

    it('returns the unmodified error', () => {
      expect(result).toStrictEqual(E.left(originalError));
    });
  });
});

describe('insertSelectedText', () => {
  describe('when there is a text quote selector', () => {
    it('returns the text quote in markdown format in addition to the response text', () => {
      const input: HypothesisAnnotation = {
        text: 'some text',
        links: {
          incontext: '',
        },
        target: [{
          selector: [{
            type: 'TextQuoteSelector',
            exact: 'lorem ipsum',
          }],
        }],
      };
      const result = insertSelectedText(input);

      const expectedResult = `> lorem ipsum

some text`;

      expect(result).toBe(expectedResult);
    });
  });

  describe('when there is no selector', () => {
    it('returns the response text', () => {
      const input: HypothesisAnnotation = {
        text: 'some text',
        links: {
          incontext: '',
        },
        target: [{
          selector: [{
            type: 'TextPositionSelector',
          }],
        }],
      };
      const result = insertSelectedText(input);

      expect(result).toBe('some text');
    });
  });
});
