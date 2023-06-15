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
  if (articleId.value !== '10.1101/2022.06.22.497259') {
    return '';
  }
  return `
      <section>
        <header class="curation-statement-header">
          <h4>Curated by <a href="/groups/biophysics-colab">Biophysics Colab</a></h4>
          <img src="/static/images/home-page/biophysics-colab.png" alt="Biophysics Colab logo">
        </header>
        <div lang="en" class="curation-statement-text">
          <p><strong>Endorsement statement (6 December 2022)</strong></p>
          <p>The preprint by Yang <em>et al</em>. asks how the shape of the membrane influences the localization of mechanosensitive Piezo channels. The authors use a creative approach involving methods that distort the plasma membrane by generating blebs and artificial filopodia. They convincingly show that curvature of the lipid environment influences Piezo1 localization, such that increased curvature causes channel depletion, and that application of the chemical modulator Yoda1 is sufficient to allow channels to enter filopodia. The study provides support for a provocative “flattening model” of Yoda1 action, and should inspire future studies by researchers interested in mechanosensitive channels and membrane curvature.</p>
          <p><em>(This endorsement by Biophysics Colab refers to version 2 of this preprint, which has been revised in response to peer review of version 1.)</em></p>
        </div>
      </section>
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
  ${renderAuthors(model.authors, `article-card-author-list-${model.articleId.value}`)}
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
