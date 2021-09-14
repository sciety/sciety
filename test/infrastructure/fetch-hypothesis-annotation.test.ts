import { URL } from 'url';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { Json } from 'io-ts-types';
import { fetchHypothesisAnnotation } from '../../src/infrastructure/fetch-hypothesis-annotation';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { dummyLogger } from '../dummy-logger';
import { arbitraryWord } from '../helpers';

const date = '2019-09-12T09:55:46.146050+00:00';
const key = arbitraryWord();

describe('fetch-hypothesis-annotation', () => {
  it('returns the evaluation', async () => {
    const getJson = async (): Promise<Json> => ({
      created: date,
      text: '<p>Very good</p>',
      links: {
        incontext: 'https://www.example.com',
      },
    });
    const evaluation = await fetchHypothesisAnnotation(getJson, dummyLogger)(key)();

    const expected = {
      fullText: pipe('<p>Very good</p>', toHtmlFragment),
      url: new URL('https://www.example.com'),
    };

    expect(evaluation).toStrictEqual(E.right(expected));
  });

  it.each([
    ['basic Markdown', '# Very good', '<h1>Very good</h1>'],
    ['(linkify) GitHub Flavored Markdown', 'www.example.com', '<a href="http://www.example.com">www.example.com</a>'],
    ['bold italics', '***bold/italics** italics*', '<p><em><strong>bold/italics</strong> italics</em></p>'],
  ])('converts %s to HTML', async (_, input: string, expected: string) => {
    const getJson = async (): Promise<Json> => ({
      created: date,
      text: input,
      links: {
        incontext: 'https://www.example.com',
      },
    });
    const evaluation = await fetchHypothesisAnnotation(getJson, dummyLogger)(key)();

    expect(evaluation).toStrictEqual(E.right(expect.objectContaining({
      fullText: expect.stringContaining(expected),
    })));
  });

  it('leaves broken embedded HTML unchanged', async () => {
    const input = '<p><strong><em>bold italic</strong> italic</em></p>';
    const getJson = async (): Promise<Json> => ({
      created: date,
      text: input,
      links: {
        incontext: 'https://www.example.com',
      },
    });
    const evaluation = await fetchHypothesisAnnotation(getJson, dummyLogger)(key)();

    expect(evaluation).toStrictEqual(E.right(expect.objectContaining({
      fullText: expect.stringContaining(input),
    })));
  });

  it.todo('test the 404 response when hypothesis group has removed an annotation');

  it.todo('test the 500 response when hypothesis is unreachable');
});
