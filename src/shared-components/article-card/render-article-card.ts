import * as O from 'fp-ts/Option';
import * as B from 'fp-ts/boolean';
import { constant, flow, pipe } from 'fp-ts/function';
import { ArticleAuthors } from '../../types/article-authors';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { templateDate } from '../date';
import { renderAuthors } from '../render-card-authors';

export type ArticleViewModel = {
  articleId: Doi,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  latestVersionDate: O.Option<Date>,
  latestActivityAt: O.Option<Date>,
  evaluationCount: number,
  listMembershipCount: number,
};

const wrapInSpan = (text: string) => toHtmlFragment(`<span>${text}</span>`);

const renderEvaluationCount = (evaluationCount: number) => pipe(
  evaluationCount === 0,
  B.fold(
    () => pipe(
      evaluationCount === 1,
      (singular) => `${evaluationCount} ${singular ? 'evaluation' : 'evaluations'}`,
      wrapInSpan,
    ),
    constant(''),
  ),
);

const renderListMembershipCount = (listMembershipCount: number) => pipe(
  listMembershipCount === 0,
  B.fold(
    () => pipe(
      listMembershipCount === 1,
      (singular) => `Appears in ${listMembershipCount} ${singular ? 'list' : 'lists'}`,
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

const renderCurationStatement = (articleId: Doi) => {
  if (process.env.EXPERIMENT_ENABLED !== 'true') {
    return '';
  }
  if (articleId.value !== '10.1101/2022.02.23.481615') {
    return '';
  }
  return `
      <div class="visually-hidden">This article has been curated by two groups:</div>
      <ul class="card-teasers__teasers" role="list">
      <li role="listitem">
        <h4 class="card-teaser__heading">Curated by <strong>Biophysics Colab</strong></h4>
        <div lang="en" class="curation-teaser__quote_card">
          <p><strong>Endorsement statement (17 November 2022)</strong></p>
          <p>The preprint by Atsumi <em>et al</em>. describes how chloride binding to sweet- and umami-sensing proteins (T1R taste receptors) can evoke taste sensation. The authors use an elegant combination of structural, biophysical and electrophysiological approaches to locate a chloride binding site in the ligand-binding domain of medaka fish T1r2a/3 receptors. They convincingly show that low mM concentrations of chloride induce conformational changes and, using single fiber recordings, establish that mouse chorda tympani nerves are activated by chloride in a T1R-dependent manner&hellip;</p>
        </div>
      </li>
      <li role="listitem">
        <h4 class="card-teaser__heading">Curated by <strong>eLife</strong></h4>
        <div lang="en" class="curation-teaser__quote_card">
          <p><strong>eLife assessment</strong></p>
          <p>This fundamental study presents solid evidence for T1r (sweet /umami) taste receptors as chloride (Cl-) receptors, based on a combination of state-of-the-art techniques to demonstrate that T1r receptors from Medaka fish bind chloride and that this binding induces a conformational change in the heteromeric receptor. This conformational change leads to low-concentration chloride-specific action potential firing in nerves from neurons containing these receptors in mice, results that represent an important advance in our understanding of the logic of taste perception.</p>
        </div>
      </li>
      </ul>
    `;
};

const renderAnnotationContent = (content: O.Option<HtmlFragment>) => pipe(
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

const renderArticleCardContents = (model: ArticleViewModel): HtmlFragment => toHtmlFragment(`
  <h3 class="article-card__title"><a class="article-card__link" href="/articles/activity/${model.articleId.value}">${model.title}</a></h3>
  ${renderAuthors(model.authors)}
  ${renderCurationStatement(model.articleId)}
  <footer class="article-card__footer">
    <div class="article-card__meta">
      <span class="visually-hidden">This article has ${model.evaluationCount === 0 ? 'no evaluations' : ''}</span>${renderEvaluationCount(model.evaluationCount)}${renderListMembershipCount(model.listMembershipCount)}${renderArticleVersionDate(model.latestVersionDate)}${renderArticleLatestActivityDate(model.latestActivityAt)}
    </div>
  </footer>
`);

export const renderArticleCard = (model: ArticleViewModel): HtmlFragment => toHtmlFragment(`
  <section class="article-card">
    ${renderArticleCardContents(model)}
  </section>
`);

export const renderArticleCardWithControlsAndOptionalAnnotation = (model: ArticleViewModel, controls: HtmlFragment, annotationContent: O.Option<HtmlFragment>): HtmlFragment => toHtmlFragment(`
  <article>
    <section class="article-card">
      ${renderArticleCardContents(model)}
      ${controls}
    </section>
    ${renderAnnotationContent(annotationContent)}
  </article>
`);
