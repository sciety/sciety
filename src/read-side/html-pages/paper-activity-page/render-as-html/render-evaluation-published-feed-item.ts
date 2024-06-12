import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { constant, flow, pipe } from 'fp-ts/function';
import clip from 'text-clipper';
import { missingDigestAndSourceLink } from './static-messages';
import * as EL from '../../../../types/evaluation-locator';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { templateDate } from '../../shared-components/date';
import { renderLangAttribute } from '../../shared-components/lang-attribute';
import { EvaluationPublishedFeedItem } from '../view-model';

const avatar = (feedItem: EvaluationPublishedFeedItem) => toHtmlFragment(`
  <img class="activity-feed__item__avatar" src="${feedItem.groupAvatarSrc}" alt="">
`);

const wrapInALinkToTheGroupHomePage = (groupName: string) => (groupHref: string) => `
<a href="${groupHref}">
  ${groupName}
</a>
`;

const foo = (feedItem: EvaluationPublishedFeedItem) => pipe(
  feedItem.groupHref,
  O.match(
    () => htmlEscape(feedItem.groupName),
    wrapInALinkToTheGroupHomePage(htmlEscape(feedItem.groupName)),
  ),
);

const eventMetadata = (feedItem: EvaluationPublishedFeedItem) => toHtmlFragment(`
  <div class="activity-feed__item__meta">
    <div class="activity-feed__item__title">
      ${foo(feedItem)}
    </div>
    ${templateDate(feedItem.publishedAt, 'activity-feed__item__date')}
  </div>
`);

const appendSourceLink = flow(
  (feedItem: EvaluationPublishedFeedItem) => feedItem.sourceHref,
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

const renderWhenDigestAvailable = (teaserChars: number, feedItem: EvaluationPublishedFeedItem, digest: string) => {
  const teaserText = clip(digest, teaserChars, { html: true });
  const digestAndSourceLink = `
    <div${renderLangAttribute(feedItem.digestLanguageCode)}>${digest}</div>
    ${pipe(feedItem, appendSourceLink, O.getOrElse(constant('')))}
  `;
  let feedItemBody = `
    <div class="activity-feed__item__body" data-behaviour="collapse_to_teaser">
      <div class="hidden" data-teaser${renderLangAttribute(feedItem.digestLanguageCode)}>
        ${teaserText}
      </div>
      <div data-full-text>
        ${digestAndSourceLink}
      </div>
    </div>
  `;

  if (teaserText === digest) {
    feedItemBody = `
      <div class="activity-feed__item__body">
        <div>
          ${digestAndSourceLink}
        </div>
      </div>
    `;
  }
  return `
    <article class="activity-feed__item__contents" id="${EL.evaluationLocatorCodec.encode(feedItem.id)}">
      <header class="activity-feed__item__header">
        ${avatar(feedItem)}
        ${eventMetadata(feedItem)}
      </header>
      ${feedItemBody}
    </article>
  `;
};

const renderSourceLinkWhenDigestMissing = (feedItem: EvaluationPublishedFeedItem) => pipe(
  feedItem,
  appendSourceLink,
  O.getOrElse(constant(missingDigestAndSourceLink)),
);

export const renderEvaluationPublishedFeedItem = (
  feedItem: EvaluationPublishedFeedItem,
  teaserChars: number,
): HtmlFragment => pipe(
  feedItem.digest,
  O.match(
    () => `
      <article class="activity-feed__item__contents" id="${EL.evaluationLocatorCodec.encode(feedItem.id)}">
        <header class="activity-feed__item__header">
          ${avatar(feedItem)}
          ${eventMetadata(feedItem)}
        </header>
        <div class="activity-feed__item__body">
          <div>
            ${renderSourceLinkWhenDigestMissing(feedItem)}
          </div>
        </div>
      </article>
    `,
    (digest) => renderWhenDigestAvailable(teaserChars, feedItem, digest),
  ),
  toHtmlFragment,
);
