import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ArticleViewModel } from '../../../shared-components/article-card';
import { renderAuthors } from './render-authors';
import { renderFeed } from './render-feed';
import { renderSaveArticle } from './render-save-article';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderListedIn } from './render-listed-in';
import { renderRelatedArticles } from './render-related-articles';
import { renderLangAttribute } from '../../../shared-components/lang-attribute';
import { templateListItems } from '../../../shared-components/list-items';

const renderRelatedArticlesLink = (relatedArticles: O.Option<ReadonlyArray<ArticleViewModel>>) => pipe(
  relatedArticles,
  O.match(
    () => '',
    () => `
      <a href="#relatedArticles" class="see-related-articles-button">See related articles</a>
    `,
  ),
);

type CurationStatement = {
  groupName: string,
  groupLargeLogo: string,
  statement: string,
};

const renderCurationStatement = (curationStatement: CurationStatement) => toHtmlFragment(`
  <h2>Curated by ${curationStatement.groupName}</h2>
  <img src="${curationStatement.groupLargeLogo}">
  ${curationStatement.statement}
`);

const renderCurationStatements = (viewmodel: ViewModel) => {
  if (process.env.EXPERIMENT_ENABLED !== 'true') {
    return '';
  }
  if (viewmodel.doi.value !== '10.1101/2022.02.23.481615') {
    return '';
  }
  const curationStatements: ReadonlyArray<CurationStatement> = [
    {
      groupName: 'eLife',
      groupLargeLogo: '/static/images/home-page/elife.svg',
      statement: `
        <div lang="en">
          <p><strong>eLife assessment</strong></p>
          <p>This fundamental study presents solid evidence for T1r (sweet /umami) taste receptors as chloride (Cl-) receptors, based on a combination of state-of-the-art techniques to demonstrate that T1r receptors from Medaka fish bind chloride and that this binding induces a conformational change in the heteromeric receptor. This conformational change leads to low-concentration chloride-specific action potential firing in nerves from neurons containing these receptors in mice, results that represent an important advance in our understanding of the logic of taste perception.</p>
        </div>
      `,
    },
    {

      groupName: 'Biophysics Colab',
      groupLargeLogo: '/static/images/home-page/biophysics-colab.png',
      statement: `
        <div lang="en">
          <p><strong>Endorsement statement (17 November 2022)</strong></p>
          <p>The preprint by Atsumi <em>et al</em>. describes how chloride binding to sweet- and umami-sensing proteins (T1R taste receptors) can evoke taste sensation. The authors use an elegant combination of structural, biophysical and electrophysiological approaches to locate a chloride binding site in the ligand-binding domain of medaka fish T1r2a/3 receptors. They convincingly show that low mM concentrations of chloride induce conformational changes and, using single fiber recordings, establish that mouse chorda tympani nerves are activated by chloride in a T1R-dependent manner. This suggests that chloride binding to sweet receptors could mediate the commonly reported sweet taste sensation following ingestion of low concentrations of table salt. The findings will be of broad relevance to those studying taste sensation and ligand recognition in GPCRs.</p>
          <p><em>(This endorsement by Biophysics Colab refers to version 2 of this preprint, which has been revised in response to peer review of version 1.)</em></p>
        </div>
      `,
    },
  ];
  return pipe(
    curationStatements,
    RA.map(renderCurationStatement),
    templateListItems,
    (listItems) => `<ul>${listItems}</ul>`,
  );
};

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  <div class="sciety-grid-two-columns">
    <header class="page-header page-header--article">
      <h1${renderLangAttribute(viewmodel.titleLanguageCode)}>${viewmodel.title}</h1>
      ${renderAuthors(viewmodel.authors)}
      ${renderCurationStatements(viewmodel)}
    </header>
    <section class="article-actions">
      <a href="${viewmodel.fullArticleUrl}" class="full-article-button">Read the full article</a>
      ${renderRelatedArticlesLink(viewmodel.relatedArticles)}
      <div class="list-management">
        ${renderListedIn(viewmodel.listedIn)}
        ${renderSaveArticle(viewmodel)}
      </div>
    </section>
    <section>
      <section role="doc-abstract" class="article-abstract">
        <h2>Abstract</h2>
        <div${renderLangAttribute(viewmodel.abstractLanguageCode)}>${viewmodel.abstract}</div>
      </section>
      ${renderFeed(viewmodel.feedItemsByDateDescending)}
      ${renderRelatedArticles(viewmodel)}
    </section>
  </div>
`);
