import * as O from 'fp-ts/Option';
import * as EDOI from '../../types/expression-doi';
import { sanitise } from '../../types/sanitised-html-fragment';
import { renderAsHtml } from '../../shared-components/paper-activity-summary-card/render-as-html';
import { renderPaginationControls } from '../../shared-components/pagination/render-pagination-controls';
import { toHtmlFragment } from '../../types/html-fragment';
import { HtmlPage } from '../html-page';
import { ArticleId } from '../../types/article-id';
import { renderPaperActivityErrorCard } from '../../shared-components/paper-activity-summary-card';
import * as LID from '../../types/list-id';
import * as DE from '../../types/data-error';
import {
  renderArticleCardWithControlsAndAnnotation,
} from '../../shared-components/article-card-with-controls-and-annotation';
import { successBanner } from '../../shared-components/success-banner/success-banner';
import { rawUserInput } from '../../read-models/annotations/handle-event';

export const sharedComponentsPage: HtmlPage = {
  title: 'Shared components',
  content: toHtmlFragment(`
<style>
  ._style-guide-heading {
    font-family: monospace;
    margin-top: 3rem;
    margin-bottom: 3rem;
    margin-left: -3rem;
    background-color: wheat;
    color: teal;
    padding: 1.5rem 3rem;
  }
</style>
    <header class="page-header">
      <h1>Shared components</h1>
    </header>
    <div>
      <h2 class="_style-guide-heading">Pagination controls for feed</h2>
      <h3 class="_style-guide-heading">With a link only to older content</h3>
      ${renderPaginationControls({
    backwardPageHref: O.none,
    forwardPageHref: O.some('/foo'),
    page: 1,
    pageCount: 42,
    forwardPageLabel: 'Older',
    backwardPageLabel: 'Newer',
  })}
      <h3 class="_style-guide-heading">With a link only to newer content</h3>
      ${renderPaginationControls({
    backwardPageHref: O.some('/foo'),
    forwardPageHref: O.none,
    page: 2,
    pageCount: 2,
    forwardPageLabel: 'Older',
    backwardPageLabel: 'Newer',
  })}
      <h3 class="_style-guide-heading">With links to newer and older content</h3>
      ${renderPaginationControls({
    backwardPageHref: O.some('/foo'),
    forwardPageHref: O.some('/foo'),
    page: 2,
    pageCount: 42,
    forwardPageLabel: 'Older',
    backwardPageLabel: 'Newer',
  })}
      <h2 class="_style-guide-heading">Pagination controls [default]</h2>
      <h3 class="_style-guide-heading">With a link only to the next page</h3>
      ${renderPaginationControls({
    backwardPageHref: O.none, forwardPageHref: O.some('/foo'), page: 1, pageCount: 42,
  })}
      <h3 class="_style-guide-heading">With a link only to the previous page</h3>
      ${renderPaginationControls({
    backwardPageHref: O.some('/foo'), forwardPageHref: O.none, page: 2, pageCount: 2,
  })}
      <h3 class="_style-guide-heading">With links to the next and to the previous pages</h3>
      ${renderPaginationControls({
    backwardPageHref: O.some('/foo'), forwardPageHref: O.some('/foo'), page: 2, pageCount: 42,
  })}
      <h2 class="_style-guide-heading">Article summary</h2>
      <h3 class="_style-guide-heading">With curation statement</h3>
      ${renderAsHtml({
    inputExpressionDoi: EDOI.fromValidatedString('10.1101/foo'),
    paperActivityPageHref: '/articles/foo',
    title: sanitise(toHtmlFragment('Some title')),
    authors: O.some(['Doctor Smith']),
    latestPublishedAt: O.some(new Date('2023-09-11')),
    latestActivityAt: O.some(new Date('2023-09-10')),
    evaluationCount: O.some(1),
    listMembershipCount: O.some(1),
    curationStatementsTeasers: [{
      groupPageHref: '/foo',
      groupName: 'Awesome group',
      quote: sanitise(toHtmlFragment(`<p><strong>elife assessment:</strong></p>
          <p>This small-sized clinical trial comparing nebulized dornase-alfa to best available care in patients hospitalized with COVID-19 pneumonia is valuable, but in its present form the paper is incomplete: the number of randomized participants is small, investigators describe also a contemporary cohort of controls and the study concludes about decrease of inflammation (reflected by CRP levels) after 7 days of treatment but no other statistically significant clinical benefit.</p>`)),
      quoteLanguageCode: O.some('en'),
    }],
    reviewingGroups: [],
  })}

      <h3 class="_style-guide-heading">With reviewing groups</h3>
      ${renderAsHtml({
    inputExpressionDoi: EDOI.fromValidatedString('10.1101/foo'),
    paperActivityPageHref: '/articles/foo',
    title: sanitise(toHtmlFragment('Some title')),
    authors: O.some(['Doctor Smith']),
    latestPublishedAt: O.some(new Date('2023-09-11')),
    latestActivityAt: O.some(new Date('2023-09-10')),
    evaluationCount: O.some(1),
    listMembershipCount: O.some(1),
    curationStatementsTeasers: [],
    reviewingGroups: [
      {
        href: '/anything',
        groupName: 'Awesome group',
      },
      {
        href: '/anything',
        groupName: 'Awesome society',
      },
    ],
  })}

      <h3 class="_style-guide-heading">With trashcan</h3>
      ${renderArticleCardWithControlsAndAnnotation({
    annotation: O.none,
    articleCard: {
      inputExpressionDoi: EDOI.fromValidatedString('10.1101/foo'),
      paperActivityPageHref: '/articles/foo',
      title: sanitise(toHtmlFragment('Some title')),
      authors: O.some(['Doctor Smith']),
      latestPublishedAt: O.some(new Date('2023-09-11')),
      latestActivityAt: O.some(new Date('2023-09-10')),
      evaluationCount: O.some(1),
      listMembershipCount: O.some(1),
      curationStatementsTeasers: [],
      reviewingGroups: [],
    },
    controls: O.some({
      listId: LID.fromValidatedString('ee7e738a-a1f1-465b-807c-132d273ca952'),
      articleId: new ArticleId('10.1101/foo'),
      createAnnotationFormHref: O.some('#'),
    }),
  })}

      <h3 class="_style-guide-heading">With annotation</h3>
      ${renderArticleCardWithControlsAndAnnotation({
    annotation: O.some({
      content: rawUserInput('There are few things I enjoy more than a comparative analysis of actin probes. Another of my all time favorites is this: https://www.tandfonline.com/doi/full/10.1080/19490992.2014.1047714'),
      author: 'AvasthiReading',
      authorAvatarPath: '/static/images/profile-dark.svg',
    }),
    articleCard: {
      inputExpressionDoi: EDOI.fromValidatedString('10.1101/foo'),
      paperActivityPageHref: '/articles/foo',
      title: sanitise(toHtmlFragment('Some title')),
      authors: O.some(['Doctor Smith']),
      latestPublishedAt: O.some(new Date('2023-09-11')),
      latestActivityAt: O.some(new Date('2023-09-10')),
      evaluationCount: O.some(1),
      listMembershipCount: O.some(1),
      curationStatementsTeasers: [],
      reviewingGroups: [],
    },
    controls: O.none,
  })}

      <h3 class="_style-guide-heading">With annotation and controls</h3>
      ${renderArticleCardWithControlsAndAnnotation({
    annotation: O.some({
      content: rawUserInput('There are few things I enjoy more than a comparative analysis of actin probes. Another of my all time favorites is this: https://www.tandfonline.com/doi/full/10.1080/19490992.2014.1047714'),
      author: 'AvasthiReading',
      authorAvatarPath: '/static/images/profile-dark.svg',
    }),
    articleCard: {
      inputExpressionDoi: EDOI.fromValidatedString('10.1101/foo'),
      paperActivityPageHref: '/articles/foo',
      title: sanitise(toHtmlFragment('Some title')),
      authors: O.some(['Doctor Smith']),
      latestPublishedAt: O.some(new Date('2023-09-11')),
      latestActivityAt: O.some(new Date('2023-09-10')),
      evaluationCount: O.some(1),
      listMembershipCount: O.some(1),
      curationStatementsTeasers: [],
      reviewingGroups: [],
    },
    controls: O.some({
      articleId: new ArticleId('10.1101/foo'),
      listId: LID.fromValidatedString('ee7e738a-a1f1-465b-807c-132d273ca952'),
      createAnnotationFormHref: O.none,
    }),
  })}

      <h3 class="_style-guide-heading">With error</h3>
      ${renderPaperActivityErrorCard({
    evaluationCount: 1,
    href: '/articles/foo',
    latestActivityAt: O.some(new Date('2023-09-10')),
    error: DE.notFound,
    inputExpressionDoi: EDOI.fromValidatedString('10.1101/foo'),
  })}

    <h3 class="_style-guide-heading">Success banner</h3>
      ${successBanner('You done good.')}
    </div>
  `),
};
