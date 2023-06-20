import * as O from 'fp-ts/Option';
import * as B from 'fp-ts/boolean';
import { constant, flow, pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { renderCountWithDescriptor } from '../render-count-with-descriptor';
import { ArticleAuthors } from '../../types/article-authors';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment, sanitise } from '../../types/sanitised-html-fragment';
import { templateDate } from '../date';
import { renderAuthors } from '../render-card-authors';
import { LanguageCode, renderLangAttribute } from '../lang-attribute';

export type ArticleCardViewModel = {
  articleId: Doi,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  latestVersionDate: O.Option<Date>,
  latestActivityAt: O.Option<Date>,
  evaluationCount: number,
  listMembershipCount: number,
};

type AnnotationContent = O.Option<HtmlFragment>;

const wrapInSpan = (text: string) => toHtmlFragment(`<span>${text}</span>`);

const renderEvaluationCount = (evaluationCount: ArticleCardViewModel['evaluationCount']) => pipe(
  evaluationCount === 0,
  B.fold(
    () => pipe(
      renderCountWithDescriptor(evaluationCount, 'evaluation', 'evaluations'),
      wrapInSpan,
    ),
    constant(''),
  ),
);

const renderListMembershipCount = (listMembershipCount: ArticleCardViewModel['listMembershipCount']) => pipe(
  listMembershipCount === 0,
  B.fold(
    () => pipe(
      `Appears in ${renderCountWithDescriptor(listMembershipCount, 'list', 'lists')}`,
      wrapInSpan,
    ),
    constant(''),
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

type CurationStatementViewModel = {
  groupName: string,
  content: SanitisedHtmlFragment,
  contentLanguageCode: O.Option<LanguageCode>,
};

const curationStatements: ReadonlyArray<CurationStatementViewModel> = [{
  groupName: 'Biophysics Colab',
  content: sanitise(toHtmlFragment(`
    <p><strong>Endorsement statement (17 November 2022)</strong></p>
    <p>The preprint by Atsumi <em>et al</em>. describes how chloride binding to sweet- and umami-sensing proteins (T1R taste receptors) can evoke taste sensation. The authors use an elegant combination of structural, biophysical and electrophysiological approaches to locate a chloride binding site in the ligand-binding domain of medaka fish T1r2a/3 receptors. They convincingly show that low mM concentrations of chloride induce conformational changes and, using single fiber recordings, establish that mouse chorda tympani nerves are activated by chloride in a T1R-dependent manner&hellip;</p>
  `)),
  contentLanguageCode: O.some('en'),
},
{
  groupName: 'eLife',
  content: sanitise(toHtmlFragment(`
    <p><strong>eLife assessment</strong></p>
    <p>This fundamental study presents solid evidence for T1r (sweet /umami) taste receptors as chloride (Cl-) receptors, based on a combination of state-of-the-art techniques to demonstrate that T1r receptors from Medaka fish bind chloride and that this binding induces a conformational change in the heteromeric receptor. This conformational change leads to low-concentration chloride-specific action potential firing in nerves from neurons containing these receptors in mice, results that represent an important advance in our understanding of the logic of taste perception.</p>
  `)),
  contentLanguageCode: O.some('en'),
},
];

const renderCurationStatements = (articleId: ArticleCardViewModel['articleId']) => {
  if (articleId.value !== '10.1101/2022.02.23.481615') {
    return '';
  }
  return pipe(
    curationStatements,
    RA.map(({ groupName, content, contentLanguageCode }) => `
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
    <div class="visually-hidden">This article has been curated by ${renderCountWithDescriptor(curationStatements.length, 'group', 'groups')}:</div>
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
  ${renderCurationStatements(model.articleId)}
  <footer class="article-card__footer">
    <div class="article-card__meta">
      <span class="visually-hidden">This article has ${model.evaluationCount === 0 ? 'no evaluations' : ''}</span>${renderEvaluationCount(model.evaluationCount)}${renderListMembershipCount(model.listMembershipCount)}${renderArticleVersionDate(model.latestVersionDate)}${renderArticleLatestActivityDate(model.latestActivityAt)}
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
