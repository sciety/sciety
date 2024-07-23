import { renderHomepageHeroCtas } from './render-homepage-hero-ctas';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { ViewModel } from '../../view-model';

export const renderHero = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <section class="home-page-hero-wrapper">
    <img class="home-page-hero__left_image" src="/static/images/home-page/sciety-pattern-left.svg" alt=""/>
    <div class="home-page-hero">
      <h1 class="home-page-hero__content_title">
        ${viewModel.pageHeading}
      </h1>
      <p class="home-page-hero__content_byline">
        Find preprints recommended and peer-reviewed by trusted groups of scientists.
      </p>
      <section>
        ${renderHomepageHeroCtas()}
      </section>
    </div>
    <img class="home-page-hero__right_image" src="/static/images/home-page/sciety-pattern-right.svg" alt=""/>
  </section>
`);
