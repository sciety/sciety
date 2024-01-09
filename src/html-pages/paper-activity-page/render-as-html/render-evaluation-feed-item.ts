import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { constant, flow, pipe } from 'fp-ts/function';
import clip from 'text-clipper';
import { missingFullTextAndSourceLink } from './static-messages';
import { templateDate } from '../../../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import * as EL from '../../../types/evaluation-locator';
import { EvaluationPublishedFeedItem } from '../view-model';
import { renderLangAttribute } from '../../../shared-components/lang-attribute';

const avatar = (review: EvaluationPublishedFeedItem) => toHtmlFragment(`
  <img class="activity-feed__item__avatar" src="${review.groupAvatar}" alt="">
`);

const eventMetadata = (review: EvaluationPublishedFeedItem) => toHtmlFragment(`
  <div class="activity-feed__item__meta">
    <div class="activity-feed__item__title">
      <a href="${review.groupHref}">
        ${htmlEscape(review.groupName)}
      </a>
    </div>
    ${templateDate(review.publishedAt, 'activity-feed__item__date')}
  </div>
`);

const appendSourceLink = flow(
  (review: EvaluationPublishedFeedItem) => review.sourceHref,
  O.map(flow(
    (source) => `
      <div data-read-original-source>
        <a href="${source.toString()}" class="activity-feed__item__read_original_source">
          Read the original source
        </a>
      </div>
    `,
    toHtmlFragment,
  )),
);

const renderWithText = (teaserChars: number, review: EvaluationPublishedFeedItem, fullText: string) => {
  const teaserText = clip(fullText, teaserChars, { html: true });
  const fulltextAndSourceLink = `
    <div${renderLangAttribute(review.fullTextLanguageCode)}>${fullText}</div>
    ${pipe(review, appendSourceLink, O.getOrElse(constant('')))}
  `;
  let feedItemBody = `
    <div class="activity-feed__item__body" data-behaviour="collapse_to_teaser">
      <div class="hidden" data-teaser${renderLangAttribute(review.fullTextLanguageCode)}>
        ${teaserText}
      </div>
      <div data-full-text>
        ${fulltextAndSourceLink}
      </div>
    </div>
  `;

  if (teaserText === fullText) {
    feedItemBody = `
      <div class="activity-feed__item__body">
        <div>
          ${fulltextAndSourceLink}
        </div>
      </div>
    `;
  }
  return `
    <article class="activity-feed__item__contents" id="${EL.evaluationLocatorCodec.encode(review.id)}">
      <header class="activity-feed__item__header">
        ${avatar(review)}
        ${eventMetadata(review)}
      </header>
      ${feedItemBody}
    </article>
  `;
};

const renderSourceLinkWhenFulltextMissing = (review: EvaluationPublishedFeedItem) => pipe(
  review,
  appendSourceLink,
  O.getOrElse(constant(missingFullTextAndSourceLink)),
);

export const renderEvaluationFeedItem = (
  feedItem: EvaluationPublishedFeedItem,
  teaserChars: number,
): HtmlFragment => pipe(
  feedItem.fullText,
  O.fold(
    () => `
      <article class="activity-feed__item__contents" id="${EL.evaluationLocatorCodec.encode(feedItem.id)}">
        <header class="activity-feed__item__header">
          ${avatar(feedItem)}
          ${eventMetadata(feedItem)}
        </header>
        <div class="activity-feed__item__body">
          <div>
            ${renderSourceLinkWhenFulltextMissing(feedItem)}
          </div>
        </div>
      </article>
    `,
    (fullText) => renderWithText(teaserChars, feedItem, fullText),
  ),
  toHtmlFragment,
);
