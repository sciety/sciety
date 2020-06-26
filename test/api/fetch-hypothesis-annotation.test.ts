import createFetchHypothesisAnnotation, { GetJson } from '../../src/api/fetch-hypothesis-annotation';
import HypothesisAnnotationId from '../../src/data/hypothesis-annotation-id';
import { Review } from '../../src/types/review';

const date = '2019-09-12T09:55:46.146050+00:00';
const hypothesisAnnotationId = new HypothesisAnnotationId('fhAtGNVDEemkyCM-sRPpVQ');

describe('fetch-hypothesis-annotation', (): void => {
  it('returns the review', async () => {
    const getJson: GetJson = async () => ({
      created: date,
      text: 'Very good',
      links: {
        incontext: 'https://www.example.com',
      },
    });
    const fetchHypothesisAnnotation = createFetchHypothesisAnnotation(getJson);
    const review = await fetchHypothesisAnnotation(hypothesisAnnotationId);

    const expected: Review = {
      publicationDate: new Date(date),
      summary: 'Very good',
      url: new URL('https://www.example.com'),
    };

    expect(review).toStrictEqual(expected);
  });

  it('converts markdown to HTML', async () => {
    const getJson: GetJson = async () => ({
      created: date,
      text: '# Very good',
      links: {
        incontext: 'https://www.example.com',
      },
    });
    const fetchHypothesisAnnotation = createFetchHypothesisAnnotation(getJson);
    const review = await fetchHypothesisAnnotation(hypothesisAnnotationId);

    expect(review.summary).toStrictEqual('<h1>Very good</h1>');
  });
});
