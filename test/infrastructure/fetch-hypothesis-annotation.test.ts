import { URL } from 'url';
import { Maybe } from 'true-myth';
import createFetchHypothesisAnnotation, { GetJson } from '../../src/infrastructure/fetch-hypothesis-annotation';
import { Review } from '../../src/infrastructure/review';
import HypothesisAnnotationId from '../../src/types/hypothesis-annotation-id';
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
    const review = await fetchHypothesisAnnotation(hypothesisAnnotationId);

    const expected: Review = {
      publicationDate: Maybe.just(new Date(date)),
      fullText: Maybe.just('<p>Very good</p>'),
      url: new URL('https://www.example.com'),
    };

    expect(review).toStrictEqual(expected);
  });

  it.each([
    ['basic Markdown', '# Very good', '<h1>Very good</h1>'],
    ['(linkify) GitHub Flavored Markdown', 'www.example.com', '<a href="http://www.example.com">www.example.com</a>'],
    // ['bold italics', '***bold/italics** italics*', '<p><em><strong>bold/italics</strong> italics</em></p>'],
  ])('converts %s to HTML', async (_, input: string, expected: string) => {
    const getJson: GetJson = async () => ({
      created: date,
      text: input,
      links: {
        incontext: 'https://www.example.com',
      },
    });
    const fetchHypothesisAnnotation = createFetchHypothesisAnnotation(getJson, dummyLogger);
    const review = await fetchHypothesisAnnotation(hypothesisAnnotationId);

    expect(review.fullText.unsafelyUnwrap()).toContain(expected);
  });

  it.todo('blockquotes');

  // References:**\n\nBezaire, M. J., Raikov, I., Burk, K., Vyas, D., & Soltesz, I. (2016). Interneuronal mechanisms of hippocampal theta oscillation in a full-scale model of the rodent CA1 circuit. ELife, 5, e18566. https://doi.org/10.7554/eLife.18566\n\n');
  it.todo('linkify references');

  it.todo('rendering 1)\n2) to a list, Hypothesis doesn\'t while Github does: Reviewer 1 on https://staging.sciety.org/articles/10.1101/2020.07.28.225557');

  it.todo('cases specifically supported by Hypothesis at https://web.hypothes.is/help/formatting-annotations-with-markdown/ as opposed to all features of Github flavored markdown');

  it.todo('possible intended sublist or broken markdown: http://localhost:8080/articles/10.1101/2020.07.27.222893');

  it.todo('Review Commons using h2 and h3: http://localhost:8080/articles/10.1101/2020.07.08.193938');
});
