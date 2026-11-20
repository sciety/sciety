import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../types/data-error';
import * as EL from '../../../types/evaluation-locator';
import * as EDOI from '../../../types/expression-doi';
import { toHtmlFragment } from '../../../types/html-fragment';
import * as LID from '../../../types/list-id';
import { sanitise } from '../../../types/sanitised-html-fragment';
import { rawUserInput } from '../../raw-user-input';
import { HtmlPage, toHtmlPage } from '../html-page';
import { renderFeed } from '../paper-activity-page/render-as-html/render-feed';
import { renderArticleErrorCard } from '../shared-components/article-card';
import { renderAsHtml } from '../shared-components/article-card/render-as-html';
import { renderArticleCardStack } from '../shared-components/article-card-stack';
import {
  renderArticleCardWithControlsAndAnnotation,
} from '../shared-components/article-card-with-controls-and-annotation';
import { renderListCard } from '../shared-components/list-card';
import { renderListItems } from '../shared-components/list-items';
import { renderListOfCards } from '../shared-components/list-of-cards';
import { renderPaginationControls } from '../shared-components/pagination';

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
      ${renderArticleErrorCard({
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

    <h2 class="_style-guide-heading">Article card stack</h2>
    <h3 class="_style-guide-heading">with one article error card and one article card</h3>
    ${renderArticleCardStack(
    [
      E.left({
        href: '/articles/foo',
        error: DE.notFound,
        inputExpressionDoi: EDOI.fromValidatedString('10.1101/foo'),
      }),
      E.right({
        paperActivityPageHref: '/articles/foo',
        title: sanitise(toHtmlFragment('Some title')),
        authors: O.some(['Doctor Smith']),
        latestPublishedAt: new Date('2023-09-11'),
        latestActivityAt: O.some(new Date('2023-09-10')),
        evaluationCount: O.some(1),
        listMembershipCount: O.some(1),
        curationStatementsTeasers: [],
        reviewingGroups: [],
      }),
    ],
  )}

    <h2 class="_style-guide-heading">Activity feed item</h2>
    <h3 class="_style-guide-heading">Expression published</h3>
    ${renderFeed([{
    type: 'expression-published',
    source: new URL('https://www.biorxiv.org/content/10.1101/foo.1'),
    publishedAt: new Date('2024-05-01'),
    server: O.some('biorxiv'),
    doi: EDOI.fromValidatedString('10.1101/foo'),
    publishedTo: '10.1101/foov1',
  }])}

    <h3 class="_style-guide-heading">Evaluation published</h3>
    ${renderFeed([{
    type: 'evaluation-published',
    id: EL.toEvaluationLocator('doi:10.1101/foo'),
    sourceHref: O.some(new URL('https://example.com/review')),
    publishedAt: new Date('2024-05-12'),
    groupDetails: O.some({
      name: 'Awesome group',
      href: '/foo',
      avatarSrc: '/static/images/profile-dark.svg',
    }),
    digest: O.some(sanitise(toHtmlFragment(`<p><strong>Summary:</strong></p>
      <p>The authors show that functional peroxisomes are required for heat-induced hormesis in <i>C. elegans</i>. The lifespan data are convincing, although the mechanism linking peroxisomal import to the antioxidant response remains incompletely explored.</p>`))),
    digestLanguageCode: O.some('en'),
  }])}

    <h3 class="_style-guide-heading">Bluesky mention</h3>
    ${renderFeed([{
    type: 'atproto-mention-published',
    publishedAt: new Date('2024-05-10'),
    source: 'Bluesky',
    authorHandle: 'jane-researcher.bsky.example.com',
    authorName: O.some('Jane Researcher'),
    authorAvatarUrl: O.some('/static/images/profile-dark.svg'),
    text: 'Really enjoyed this preprint on heat shock and peroxisomes. The lifespan data in the second figure are striking.',
    href: 'https://bsky.example.com/profile/jane-researcher.bsky.example.com/post/foo',
  }])}

    <h3 class="_style-guide-heading">Semble mention</h3>
    ${renderFeed([{
    type: 'atproto-mention-published',
    publishedAt: new Date('2024-05-08'),
    source: 'Semble',
    authorHandle: 'sam-curator.example.com',
    authorName: O.some('Sam Curator'),
    authorAvatarUrl: O.some('/static/images/profile-dark.svg'),
    text: 'Added to my collection of papers on organelle communication during cellular stress.',
    href: 'https://semble.example.com/cards/foo',
  }])}

    <h3 class="_style-guide-heading">Mastodon mention</h3>
    ${renderFeed([{
    type: 'activitypub-mention-published',
    publishedAt: new Date('2024-05-06'),
    source: 'Mastodon',
    authorName: O.some('Alex Scientist'),
    authorHandle: 'alex@mastodon.example.com',
    authorAvatarUrl: O.some('/static/images/profile-dark.svg'),
    content: sanitise(toHtmlFragment('<p>New preprint showing that functional peroxisomes are needed for heat-induced hormesis in <i>C. elegans</i>. Worth a read.</p>')),
    href: 'https://mastodon.example.com/@alex/1',
  }])}

    <h3 class="_style-guide-heading">Bonfire mention</h3>
    ${renderFeed([{
    type: 'activitypub-mention-published',
    publishedAt: new Date('2024-05-04'),
    source: 'Bonfire',
    authorName: O.some('Robin Biologist'),
    authorHandle: 'robin@bonfire.example.com',
    authorAvatarUrl: O.some('/static/images/profile-dark.svg'),
    content: sanitise(toHtmlFragment('<p>Interesting discussion of the antioxidant response in the <i>Δctl-2</i> mutant.</p>')),
    href: 'https://bonfire.example.com/post/1',
  }])}
    </div>
  `),
});
