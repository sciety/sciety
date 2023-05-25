import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

type EvaluationCardViewModel = {
  articleLink: string,
  quote: HtmlFragment,
  caption: string,
  articleTitle: HtmlFragment,
};

const evaluationCard = {
  articleLink: '/articles/activity/10.1101/2022.06.22.497259',
  quote: toHtmlFragment('The preprint by Yang et al. asks how the shape of the membrane influences the localization of mechanosensitive Piezo channels. The authors use a creative approach involving methods that distort the plasma membrane by generating blebs and artificial filopodia. They convincingly show that curvature of the lipid environment influences Piezo1 localization, such that increased curvature causes channel depletion, and that application of the chemical modulator Yoda1 is sufficient to allow channels to enter filopodia. The study provides support for a provocative “flattening model” of Yoda1 action, and should inspire future studies by researchers interested in mechanosensitive channels and membrane curvature.'),
  caption: 'Curated by Biophysics Colab',
  articleTitle: toHtmlFragment('Membrane curvature governs the distribution of Piezo1 in live cells'),
};

const renderEvaluationCard = (viewModel: EvaluationCardViewModel) => `
  <article class="curation-teaser">
    <figure>
      <blockquote class="curation-teaser__quote" cite="${viewModel.articleLink}">
        ${viewModel.quote}
      </blockquote>
      <figcaption>
        <p>${viewModel.caption}</p>
        <cite><a href="${viewModel.articleLink}">${viewModel.articleTitle}</a></cite>
      </figcaption>
    </figure>
  </article>
`;

const evaluationCards = () => toHtmlFragment(`
  <h2 class="home-page-cards__title">Most recent evaluations</h2>
  <ul class="home-page-cards__cards">
    <li>
      ${renderEvaluationCard(evaluationCard)}
    </li>
    <li>
      ${renderEvaluationCard(evaluationCard)}
    </li>
    <li>
      ${renderEvaluationCard(evaluationCard)}
    </li>
  </ul>
`);

export const renderEvaluationCardsSection = (): HtmlFragment => toHtmlFragment(`
  <section class="home-page-cards">
    ${evaluationCards()}
  </section>
`);
