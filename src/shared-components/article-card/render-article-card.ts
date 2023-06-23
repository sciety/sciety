import * as O from 'fp-ts/Option';
import { constant, flow, pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { renderCountWithDescriptor } from '../render-count-with-descriptor';
import { ArticleAuthors } from '../../types/article-authors';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { templateDate } from '../date';
import { renderAuthors } from '../render-card-authors';
import { LanguageCode, renderLangAttribute } from '../lang-attribute';

export type CurationStatementTeaserViewModel = {
  groupName: string,
  quote: SanitisedHtmlFragment,
  quoteLanguageCode: O.Option<LanguageCode>,
};

export type ArticleCardViewModel = {
  articleId: Doi,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  latestVersionDate: O.Option<Date>,
  latestActivityAt: O.Option<Date>,
  evaluationCount: O.Option<number>,
  listMembershipCount: O.Option<number>,
  curationStatementsTeasers: ReadonlyArray<CurationStatementTeaserViewModel>,
};

type AnnotationContent = O.Option<HtmlFragment>;

const wrapInSpan = (text: string) => toHtmlFragment(`<span>${text}</span>`);

const renderEvaluationCount = (evaluationCount: ArticleCardViewModel['evaluationCount']) => pipe(
  evaluationCount,
  O.fold(
    () => '<span class="visually-hidden">This article has no evaluations</span>',
    (count) => pipe(
      renderCountWithDescriptor(count, 'evaluation', 'evaluations'),
      wrapInSpan,
      (content) => `<span class="visually-hidden">This article has </span>${content}`,
    ),
  ),
);

const renderListMembershipCount = (listMembershipCount: ArticleCardViewModel['listMembershipCount']) => pipe(
  listMembershipCount,
  O.fold(
    constant(''),
    (count) => pipe(
      `Appears in ${renderCountWithDescriptor(count, 'list', 'lists')}`,
      wrapInSpan,
    ),
  ),
);

const renderArticleVersionDate = O.fold(
  constant(''),
  flow(
    templateDate,
    (date) => `Latest version ${date}`,
    wrapInSpan,
  ),
);

const renderArticleLatestActivityDate = O.fold(
  constant(''),
  flow(
    templateDate,
    (date) => `Latest activity ${date}`,
    wrapInSpan,
  ),
);

const renderCurationStatements = (curationStatementsTeasers: ArticleCardViewModel['curationStatementsTeasers']) => {
  if (curationStatementsTeasers.length === 0) {
    return '';
  }
  return pipe(
    curationStatementsTeasers,
    RA.map(({ groupName, quote: content, quoteLanguageCode: contentLanguageCode }) => `
      <li role="listitem" class="article-card-teasers__teaser">
        <article>
          <h4 class="article-card-teasers__teaser_heading">Curated by <strong>${groupName}</strong></h4>
          <div ${renderLangAttribute(contentLanguageCode)}class="article-card-teasers__teaser_quote">
            ${content}
          </div>
        </article>
      </li>
    `),
    (listItems) => listItems.join(''),
    (listContent) => `
    <div class="visually-hidden">This article has been curated by ${renderCountWithDescriptor(curationStatementsTeasers.length, 'group', 'groups')}:</div>
    <ul class="article-card-teasers" role="list">
      ${listContent}
    </ul>
  `,
  );
};

const renderAnnotationContent = (content: AnnotationContent) => pipe(
  content,
  O.match(
    () => '',
    (annotation) => `
      <section class="article-card-annotation">
        <h4 class="visually-hidden">Annotation by AvasthiReading</h4>
        <p>${annotation}</p>
      </section>
    `,
  ),
);

const renderArticleCardContents = (model: ArticleCardViewModel): HtmlFragment => toHtmlFragment(`
  <h3 class="article-card__title"><a class="article-card__link" href="/articles/activity/${model.articleId.value}">${model.title}</a></h3>
  ${renderAuthors(model.authors)}
  ${renderCurationStatements(model.curationStatementsTeasers)}
  <footer class="article-card__footer">
    <div class="article-card__meta">
      ${renderEvaluationCount(model.evaluationCount)}${renderListMembershipCount(model.listMembershipCount)}${renderArticleVersionDate(model.latestVersionDate)}${renderArticleLatestActivityDate(model.latestActivityAt)}
    </div>
  </footer>
`);

export const renderArticleCard = (model: ArticleCardViewModel): HtmlFragment => toHtmlFragment(`
  <section class="article-card">
    ${renderArticleCardContents(model)}
  </section>
`);

export const renderArticleCardWithControlsAndOptionalAnnotation = (model: ArticleCardViewModel, controls: HtmlFragment, annotationContent: AnnotationContent): HtmlFragment => toHtmlFragment(`
  <article>
    <section class="article-card">
      ${renderArticleCardContents(model)}
      ${controls}
    </section>
    ${renderAnnotationContent(annotationContent)}
  </article>
`);
