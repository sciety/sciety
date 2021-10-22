import { URL } from 'url';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type NcrcReview = {
  title: string,
  ourTake: string,
  studyDesign: string,
  studyPopulationSetting: string,
  mainFindings: string,
  studyStrength: string,
  limitations: string,
  valueAdded: string,
};

type FoundReview = {
  fullText: HtmlFragment,
  url: URL,
};

const slugify = (value: string) => value.toLowerCase().replace(/\s/g, '-');

// TODO: sanitise/escape the input
const constructFullText = (review: NcrcReview) => toHtmlFragment(`
  <h3>Our take</h3>
  <p>
    ${review.ourTake}
  </p>
  <h3>Study design</h3>
  <p>
    ${review.studyDesign}
  </p>
  <h3>Study population and setting</h3>
  <p>
    ${review.studyPopulationSetting}
  </p>
  <h3>Summary of main findings</h3>
  <p>
    ${review.mainFindings}
  </p>
  <h3>Study strengths</h3>
  <p>
    ${review.studyStrength}
  </p>
  <h3>Limitations</h3>
  <p>
    ${review.limitations}
  </p>
  <h3>Value added</h3>
  <p>
    ${review.valueAdded}
  </p>
`);

export const constructNcrcReview = (review: NcrcReview): FoundReview => ({
  url: new URL(`https://ncrc.jhsph.edu/research/${slugify(review.title)}/`),
  fullText: constructFullText(review),
});
