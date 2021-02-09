import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, pipe } from 'fp-ts/function';
import {
  biorxivArticleVersionErrorFeedItem,
  medrxivArticleVersionErrorFeedItem,
} from './render-article-version-error-feed-item';
import { ArticleVersionFeedItem, RenderArticleVersionFeedItem } from './render-article-version-feed-item';
import { RenderReviewFeedItem, ReviewFeedItem } from './render-review-feed-item';
import { templateListItems } from '../shared-components/list-items';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderFeed = (doi: Doi, server: ArticleServer, userId: O.Option<UserId>) => TE.TaskEither<'no-content', HtmlFragment>;

type ArticleVersionErrorFeedItem = { type: 'article-version-error', server: ArticleServer };

export type FeedItem = ReviewFeedItem | ArticleVersionFeedItem | ArticleVersionErrorFeedItem;

export type GetFeedItems = (doi: Doi, server: ArticleServer) => T.Task<ReadonlyArray<FeedItem>>;

export const createRenderFeed = (
  getFeedItems: GetFeedItems,
  renderReviewFeedItem: RenderReviewFeedItem,
  renderArticleVersionFeedItem: RenderArticleVersionFeedItem,
): RenderFeed => {
  const renderFeedItem = (feedItem: FeedItem, userId: O.Option<UserId>): T.Task<HtmlFragment> => {
    switch (feedItem.type) {
      case 'article-version':
        return T.of(renderArticleVersionFeedItem(feedItem));
      case 'article-version-error':
        return T.of(feedItem.server === 'medrxiv' ? medrxivArticleVersionErrorFeedItem : biorxivArticleVersionErrorFeedItem);
      case 'review':
        return renderReviewFeedItem(feedItem, userId);
    }
  };

  return (doi, server, userId) => pipe(
    getFeedItems(doi, server),
    T.chain(T.traverseArray((feedItem) => renderFeedItem(feedItem, userId))),
    T.map(RNEA.fromReadonlyArray),
    T.map(E.fromOption(constant('no-content' as const))),
    TE.map((items) => {
      if (process.env.EXPERIMENT_ENABLED === 'true' && doi.value === '10.1101/2021.01.29.21250653') {
        return RNEA.cons(toHtmlFragment(`
          <div class="article-feed__item_contents">
            <img class="article-feed__item__avatar" src="/static/editorial-communities/ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg" alt="">
            <div class="article-feed__item_body" data-behaviour="collapse_to_teaser">
              <time datetime="2021-02-04" class="article-feed__item__date">Feb 4, 2021</time>
              <div class="article-feed__item__title">
                Reviewed by
                <a href="/editorial-communities/62f9b0d0-8d43-4766-a52a-ce02af61bc6a">
                  NCRC
                </a>
              </div>

              <div class="hidden" data-teaser>
                <h3>Our take</h3>
                <p>
                  This study provides convincing rationale to explore administering only one dose of mRNA vaccine to individuals who possess pre-existing …
                </p>
              </div>

              <div data-full-text>
                <h3>Our take</h3>
                <p>
                  This study provides convincing rationale to explore administering only one dose of mRNA vaccine to individuals who possess pre-existing SARS-CoV-2 immunity from previous infection. Antibody testing could be performed prior to vaccination for individuals whose infection history is unknown. This strategy could free up a vast number of vaccine doses, as well as limit discomfort from reactogenicity in those who have pre-existing immunity.
                </p>
                <h3>Study design</h3>
                <p>
                  Other
                </p>
                <h3>Study population and setting</h3>
                <p>
                  This study investigated individuals who had been vaccinated with either Pfizer or Moderna’s mRNA vaccine in 2020. Antibody responses were studied in 109 participants with and without documented pre-existing SARS-CoV-2 antibody responses (68 seronegative, 41 seropositive). The frequency of local, injection site-related and systemic reactions after first dose of vaccination in 231 participants (149 seronegative, 83 seropositive) was also investigated.
                </p>
                <h3>Summary of main findings</h3>
                <p>
                  While seronegative participants mounted low SARS-CoV-2 IgG antibody responses 9-12 days after their first vaccination, seropositive individuals developed antibody titers 10-12 times higher within only days of their first vaccination. Futher, seropositive participants’ antibody titers following their first vaccination were over 10-fold higher than titers measured in seronegative individuals after their second vaccine. Next, mild, local reactions did not differ based on serostatus. However, seropositive individuals had a significantly higher frequency of systemic side effects (ex. fever, chills, fatigue, muscle and joint pains, headache) compared to seronegative individuals. Reactogenicity for seropositive individuals after first dose seemed to resemble reactions of seronegative individuals after their second dose, as reported in phase 3 trials.
                </p>
                <h3>Study strengths</h3>
                <p>
                  This study employed a mixture of participants who received either the Pfizer or Moderna mRNA vaccines, which are the two vaccines that have been approved for use by the FDA in the US. Also, they were able to obtain a decent sample size for a first look into this question.
                </p>
                <h3>Limitations</h3>
                <p>
                  More seronegative participants were included in this study than seropositive individuals and the groups were not paired in a case-control format.
                </p>
                <h3>Value added</h3>
                <p>
                  First concrete rationale for administering only one vaccine dose to those who already have some level of pre-existing SARS-CoV-2 immunity from previous infection.
                </p>
              </div>
            </div>
          </div>
        `), items);
      }
      return items;
    }),
    TE.map((items) => `
      <section class="article-feed">
        <h2>Feed</h2>

        <ol role="list" class="article-feed__list">
          ${templateListItems(items, 'article-feed__item')}
        </ol>
      </section>
    `),
    TE.map(toHtmlFragment),
  );
};
