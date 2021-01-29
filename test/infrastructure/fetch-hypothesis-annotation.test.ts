import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import createFetchHypothesisAnnotation, { GetJson } from '../../src/infrastructure/fetch-hypothesis-annotation';
import { Review } from '../../src/infrastructure/review';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { HypothesisAnnotationId } from '../../src/types/hypothesis-annotation-id';
import dummyLogger from '../dummy-logger';

const date = '2019-09-12T09:55:46.146050+00:00';
const hypothesisAnnotationId = new HypothesisAnnotationId('fhAtGNVDEemkyCM-sRPpVQ');

describe('fetch-hypothesis-annotation', (): void => {
  it('returns the review', async () => {
    const getJson: GetJson = async () => ({
      created: date,
      text: '<p>Very good</p>',
      links: {
        incontext: 'https://www.example.com',
      },
    });
    const fetchHypothesisAnnotation = createFetchHypothesisAnnotation(getJson, dummyLogger);
    const review = await fetchHypothesisAnnotation(hypothesisAnnotationId)();

    const expected: Review = {
      fullText: pipe('<p>Very good</p>', toHtmlFragment, O.some),
      url: new URL('https://www.example.com'),
    };

    expect(review).toStrictEqual(expected);
  });

  it.each([
    ['basic Markdown', '# Very good', '<h1>Very good</h1>'],
    ['(linkify) GitHub Flavored Markdown', 'www.example.com', '<a href="http://www.example.com">www.example.com</a>'],
    ['bold italics', '***bold/italics** italics*', '<p><em><strong>bold/italics</strong> italics</em></p>'],
  ])('converts %s to HTML', async (_, input: string, expected: string) => {
    const getJson: GetJson = async () => ({
      created: date,
      text: input,
      links: {
        incontext: 'https://www.example.com',
      },
    });
    const fetchHypothesisAnnotation = createFetchHypothesisAnnotation(getJson, dummyLogger);
    const review = await fetchHypothesisAnnotation(hypothesisAnnotationId)();

    expect(review.fullText).toStrictEqual(O.some(expect.stringContaining(expected)));
  });

  it('leaves broken embedded HTML unchanged', async () => {
    const input = '<p><strong><em>bold italic</strong> italic</em></p>';
    const getJson: GetJson = async () => ({
      created: date,
      text: input,
      links: {
        incontext: 'https://www.example.com',
      },
    });
    const fetchHypothesisAnnotation = createFetchHypothesisAnnotation(getJson, dummyLogger);
    const review = await fetchHypothesisAnnotation(hypothesisAnnotationId)();

    expect(review.fullText).toStrictEqual(O.some(input));
  });
});
