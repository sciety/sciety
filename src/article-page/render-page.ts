import { Result } from 'true-myth';
import Doi from '../types/doi';

export type RenderPageError = {
  type: 'not-found',
  content: string,
};

type Component = (doi: Doi) => Promise<Result<string, 'not-found' | 'unavailable' | 'no-content'>>;
type RenderPage = (doi: Doi) => Promise<Result<string, RenderPageError>>;

export default (
  renderPageHeader: Component,
  renderEndorsements: Component,
  renderReviews: Component,
  renderAbstract: Component,
  renderFeed: Component,
): RenderPage => {
  const template = Result.ok(
    (abstract: string) => (pageHeader: string) => (feed: string) => (endorsements: string) => (reviewSummaries: string) => (reviews: string) => `
<article class="hive-grid hive-grid--article">
  ${pageHeader}

  <div class="main-content">
    ${abstract}
    ${feed}
    ${endorsements}
    ${reviewSummaries}
    ${reviews}
  </div>
</article>
    `,
  );

  const renderReviewSummaries: Component = async (doi) => {
    let reviewSummaries = '';

    if (doi.value === '10.1101/2020.06.19.160770') {
      reviewSummaries = `
        <section id="review-summaries">
          <ol role="list" class="ui very relaxed divided items list"> 
            <li class="item">  
              <article class="content">          
                <h2>
                  Summary of reviews by
                  <a href="/editorial-communities/b560187e-f2fb-4ff9-a861-a204f3fc0fb0">
                    eLife
                  </a>
                </h2>
                <div class="meta" data-test-id="reviewPublicationDate"><time datetime="2020-09-15">Sep 15, 2020</time></div>
                <p>
                  While we all considered the value of the dataset as a useful resource for the community, providing a
                  transcriptional landscape of prostatic monocytic cells, we all agreed that the study remains too
                  descriptive and primarily empirical correlations at this stage, with very limited mechanistic implications
                  and validation. In addition, the lack of healthy control, an incomplete bioinformatical analysis (batch
                  effects, other MPS cell clusters like cDCs), missing validation, and a limited number of cells/patients
                  dampened the enthusiasm of all the reviewers.
                </p>
                <p>
                  This review applies only to version 1 of the manuscript.
                </p>
              </article>
            </li>
          </ol>
        </section>
        <div class="ui hidden clearing section divider"></div>
      `;
    }

    return Result.ok(reviewSummaries);
  };

  return async (doi) => {
    const abstractResult = renderAbstract(doi);
    const pageHeaderResult = renderPageHeader(doi);
    const feedResult = renderFeed(doi)
      .then((feed) => (
        feed.orElse(() => Result.ok(''))
      ));
    const endorsementsResult = renderEndorsements(doi);
    const reviewSummaries = renderReviewSummaries(doi);
    const reviews = renderReviews(doi)
      .then((reviewsResult) => (
        reviewsResult.orElse(() => Result.ok(''))
      ));

    return template
      .ap(await abstractResult)
      .ap(await pageHeaderResult)
      .ap(await feedResult)
      .ap(await endorsementsResult)
      .ap(await reviewSummaries)
      .ap(await reviews)
      .mapErr(() => ({
        type: 'not-found',
        content: `${doi.value} not found`,
      }));
  };
};
