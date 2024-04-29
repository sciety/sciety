import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderListItems } from '../../../shared-components/render-list-items';
import { successBanner } from '../../../shared-components/success-banner/success-banner';
import * as DE from '../../../types/data-error';
import * as EDOI from '../../../types/expression-doi';
import { toHtmlFragment } from '../../../types/html-fragment';
import * as LID from '../../../types/list-id';
import { sanitise } from '../../../types/sanitised-html-fragment';
import { rawUserInput } from '../../raw-user-input';
import { HtmlPage, toHtmlPage } from '../html-page';
import {
  renderArticleCardWithControlsAndAnnotation,
} from '../shared-components/article-card-with-controls-and-annotation';
import { renderListCard } from '../shared-components/list-card';
import { renderListOfCards } from '../shared-components/list-of-cards';
import { renderPaginationControls } from '../shared-components/pagination';
import { renderPaperActivityErrorCard } from '../shared-components/paper-activity-summary-card';
import { renderAsHtml } from '../shared-components/paper-activity-summary-card/render-as-html';

export const sharedComponentsPage: HtmlPage = toHtmlPage({
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
    paperActivityPageHref: '/articles/foo',
    title: sanitise(toHtmlFragment('Some title')),
    authors: O.some(['Doctor Smith']),
    latestPublishedAt: new Date('2023-09-11'),
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
    paperActivityPageHref: '/articles/foo',
    title: sanitise(toHtmlFragment('Some title')),
    authors: O.some(['Doctor Smith']),
    latestPublishedAt: new Date('2023-09-11'),
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
      paperActivityPageHref: '/articles/foo',
      title: sanitise(toHtmlFragment('Some title')),
      authors: O.some(['Doctor Smith']),
      latestPublishedAt: new Date('2023-09-11'),
      latestActivityAt: O.some(new Date('2023-09-10')),
      evaluationCount: O.some(1),
      listMembershipCount: O.some(1),
      curationStatementsTeasers: [],
      reviewingGroups: [],
    },
    controls: O.some({
      listId: LID.fromValidatedString('ee7e738a-a1f1-465b-807c-132d273ca952'),
      expressionDoi: EDOI.fromValidatedString('10.1101/foo'),
      createAnnotationFormHref: O.some('#'),
    }),
  })}

      <h3 class="_style-guide-heading">With annotation</h3>
      ${renderArticleCardWithControlsAndAnnotation({
    annotation: O.some({
      content: rawUserInput('There are few things I enjoy more than a comparative analysis of actin probes. Another of my all time favorites is this: https://www.tandfonline.com/doi/full/10.1080/19490992.2014.1047714'),
      author: 'AvasthiReading',
      authorAvatarSrc: '/static/images/profile-dark.svg',
    }),
    articleCard: {
      paperActivityPageHref: '/articles/foo',
      title: sanitise(toHtmlFragment('Some title')),
      authors: O.some(['Doctor Smith']),
      latestPublishedAt: new Date('2023-09-11'),
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
      authorAvatarSrc: '/static/images/profile-dark.svg',
    }),
    articleCard: {
      paperActivityPageHref: '/articles/foo',
      title: sanitise(toHtmlFragment('Some title')),
      authors: O.some(['Doctor Smith']),
      latestPublishedAt: new Date('2023-09-11'),
      latestActivityAt: O.some(new Date('2023-09-10')),
      evaluationCount: O.some(1),
      listMembershipCount: O.some(1),
      curationStatementsTeasers: [],
      reviewingGroups: [],
    },
    controls: O.some({
      expressionDoi: EDOI.fromValidatedString('10.1101/foo'),
      listId: LID.fromValidatedString('ee7e738a-a1f1-465b-807c-132d273ca952'),
      createAnnotationFormHref: O.none,
    }),
  })}

      <h3 class="_style-guide-heading">With error</h3>
      ${renderPaperActivityErrorCard({
    href: '/articles/foo',
    error: DE.notFound,
    inputExpressionDoi: EDOI.fromValidatedString('10.1101/foo'),
  })}

    <h2 class="_style-guide-heading">List card</h2>
    <h3 class="_style-guide-heading">as a featured list card</h3>
        ${pipe({
    listId: LID.fromValidatedString('ee7e738a-a1f1-465b-807c-132d273ca952'),
    articleCount: 3,
    updatedAt: new Date('2024-04-04'),
    title: 'Endorsed by GigaByte',
    description: rawUserInput('Preprints that have undergone Editor’s Assessment by GigaByte.'),
    imageUrl: O.some('/static/images/lists/endorsed-by-gigabyte.png'),
    curator: O.some({
      avatarSrc: '/static/images/profile-dark.svg',
      name: 'Scott C Edmunds',
    }),
  },
  (viewmodel) => [renderListCard(viewmodel)],
  renderListItems,
  renderListOfCards)}

    <h3 class="_style-guide-heading">without curator and without an image</h3>
        ${pipe({
    listId: LID.fromValidatedString('ee7e738a-a1f1-465b-807c-132d273ca952'),
    articleCount: 3,
    updatedAt: new Date('2024-04-04'),
    title: 'Endorsed by GigaByte',
    description: rawUserInput('Preprints that have undergone Editor’s Assessment by GigaByte.'),
    imageUrl: O.none,
    curator: O.none,
  },
  (viewmodel) => [renderListCard(viewmodel)],
  renderListItems,
  renderListOfCards)}

    <h3 class="_style-guide-heading">Success banner</h3>
      ${successBanner('You done good.')}
    </div>
  `),
});
