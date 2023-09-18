import * as O from 'fp-ts/Option';
import { sanitise } from '../../types/sanitised-html-fragment';
import { renderArticleCard } from '../../shared-components/article-card/render-article-card';
import { renderPaginationControlsForFeed } from '../../shared-components/pagination/render-pagination-controls-for-feed';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { Doi } from '../../types/doi';
import { renderArticleCardWithControlsAndAnnotation, renderArticleErrorCard } from '../../shared-components/article-card';
import * as LID from '../../types/list-id';
import * as DE from '../../types/data-error';

export const styleGuidePage: Page = {
  title: 'Style guide',
  content: toHtmlFragment(`
    <header class="page-header">
      <h1>Style guide</h1>
    </header>
    <h2>Pagination controls for feed</h2>
    <h3>With a link only to older content</h3>
    ${renderPaginationControlsForFeed({
    prevPageHref: O.none, nextPageHref: O.some('/foo'), page: 1, pageCount: 42,
  })}
    <h3>With a link only to newer content</h3>
    ${renderPaginationControlsForFeed({
    prevPageHref: O.some('/foo'), nextPageHref: O.none, page: 2, pageCount: 2,
  })}
    <h3>With links to newer and older content</h3>
    ${renderPaginationControlsForFeed({
    prevPageHref: O.some('/foo'), nextPageHref: O.some('/foo'), page: 2, pageCount: 42,
  })}
    <h2>Article summary</h2>
    <h3>With curation statement</h3>
    ${renderArticleCard({
    articleId: new Doi('10.1101/foo'),
    articleLink: '/articles/foo',
    title: sanitise(toHtmlFragment('Some title')),
    authors: O.some(['Doctor Smith']),
    latestVersionDate: O.some(new Date('2023-09-11')),
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

    <h3>With reviewing groups</h3>
    ${renderArticleCard({
    articleId: new Doi('10.1101/foo'),
    articleLink: '/articles/foo',
    title: sanitise(toHtmlFragment('Some title')),
    authors: O.some(['Doctor Smith']),
    latestVersionDate: O.some(new Date('2023-09-11')),
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
    
    <h3>With trashcan</h3>
    ${renderArticleCardWithControlsAndAnnotation({
    articleId: new Doi('10.1101/foo'),
    hasControls: true,
    annotationContent: O.none,
    annotationAuthor: 'AvasthiReading',
    listId: LID.fromValidatedString('ee7e738a-a1f1-465b-807c-132d273ca952'),
    articleCard: {
      articleId: new Doi('10.1101/foo'),
      articleLink: '/articles/foo',
      title: sanitise(toHtmlFragment('Some title')),
      authors: O.some(['Doctor Smith']),
      latestVersionDate: O.some(new Date('2023-09-11')),
      latestActivityAt: O.some(new Date('2023-09-10')),
      evaluationCount: O.some(1),
      listMembershipCount: O.some(1),
      curationStatementsTeasers: [],
      reviewingGroups: [],
    },
  },
  'AvasthiReading')}

    <h3>With error</h3>
    ${renderArticleErrorCard({
    evaluationCount: 1,
    href: '/articles/foo',
    latestActivityAt: O.some(new Date('2023-09-10')),
    error: DE.notFound,
    articleId: new Doi('10.1101/foo'),
  })}
  `),
};
