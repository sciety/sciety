import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { constant, flow, pipe } from 'fp-ts/function';
import clip from 'text-clipper';
import { missingFullTextAndSourceLink } from './static-messages';
import { templateDate } from '../../../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import * as EL from '../../../types/evaluation-locator';
import { EvaluationFeedItem } from '../view-model';
import { renderLangAttribute } from '../../../shared-components/lang-attribute';

const avatar = (review: EvaluationFeedItem) => toHtmlFragment(`
  <img class="activity-feed__item__avatar" src="${review.groupAvatar}" alt="">
`);

const eventMetadata = (review: EvaluationFeedItem) => toHtmlFragment(`
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
  (review: EvaluationFeedItem) => review.sourceHref,
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

const initMoreLessToggle = `
  init
    show <div[data-teaser]/> in me
    hide <div[data-full-text]/> in me
    show <button/> in me
  end
`;

const moreLessToggleBehaviour = `
  on click
    toggle *display of previous <div[data-teaser]/>
    toggle *display of previous <div[data-full-text]/>
    if my innerText is 'More'
      put 'Less' into me
    else if my innerText is 'Less'
      put 'More' into me
  end
`;

const renderWithText = (teaserChars: number, review: EvaluationFeedItem, fullText: string) => {
  const teaserText = clip(fullText, teaserChars, { html: true });
  const fulltextAndSourceLink = `
    <div${renderLangAttribute(review.fullTextLanguageCode)}>${fullText}</div>
    ${pipe(review, appendSourceLink, O.getOrElse(constant('')))}
  `;
  let feedItemBody = `
    <div class="activity-feed__item__body" _="${initMoreLessToggle}">
      <div data-teaser style="display: none" ${renderLangAttribute(review.fullTextLanguageCode)}>${teaserText}</div>
      <div data-full-text>${fulltextAndSourceLink}</div>
      <button style="display: none" class="activity-feed__item__toggle" _="${moreLessToggleBehaviour}">More</button>
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

const renderSourceLinkWhenFulltextMissing = (review: EvaluationFeedItem) => pipe(
  review,
  appendSourceLink,
  O.getOrElse(constant(missingFullTextAndSourceLink)),
);

export const renderEvaluationFeedItem = (feedItem: EvaluationFeedItem, teaserChars: number): HtmlFragment => pipe(
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
