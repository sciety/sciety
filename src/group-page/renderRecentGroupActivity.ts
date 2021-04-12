import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

const hardcodedArticleList = `<ul class="search-results-list" role="list">
  <li class="search-results-list__item">
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/articles/activity/10.1101/2020.09.15.286153">Accuracy of predicting chemical body composition of growing pigs using dual-energy X-ray absorptiometry</a>
      <div class="search-results-list__item__description">
        Kasper C, Schlegel P, Ruiz-Ascacibar I, Stoll P, Bee G.
      </div>
      <span class="search-results-list__item__meta">
        <span>1 evaluation</span><span>Latest version <time datetime="2020-12-14">Dec 14, 2020</time></span><span>Latest activity <time datetime="2020-12-15">Dec 15, 2020</time></span>
      </span>
    </div>
  </li>
  <li class="search-results-list__item">
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/articles/activity/10.1101/2019.12.20.884056">Determining insulin sensitivity from glucose tolerance tests in Iberian and Landrace pigs</a>
      <div class="search-results-list__item__description">
        Rodríguez-López J, Lachica M, González-Valero L, Fernández-Fígares I.
      </div>
      <span class="search-results-list__item__meta">
        <span>4 evaluations</span><span>Latest version <time datetime="2020-10-14">Oct 14, 2020</time></span><span>Latest activity <time datetime="2021-03-10">Mar 10, 2021</time></span>
      </span>
    </div>
  </li>
  <li class="search-results-list__item">
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/articles/activity/10.1101/760082">Effects of feeding treatment on growth rate and performance of primiparous Holstein dairy heifers</a>
      <div class="search-results-list__item__description">
        Le Cozler Y, Jurquet J, Bedere N.
      </div>
      <span class="search-results-list__item__meta">
        <span>1 evaluation</span><span>Latest version <time datetime="2019-12-05">Dec 5, 2019</time></span><span>Latest activity <time datetime="2019-12-05">Dec 5, 2019</time></span>
      </span>
    </div>
  </li>
  <li class="search-results-list__item">
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/articles/activity/10.1101/661249">Lactation curve model with explicit representation of perturbations as a phenotyping tool for dairy livestock precision farming</a>
      <div class="search-results-list__item__description">
        Ahmed BA, Laurence P, Pierre G, Olivier M.
      </div>
      <span class="search-results-list__item__meta">
        <span>1 evaluation</span><span>Latest version <time datetime="2019-08-27">Aug 27, 2019</time></span><span>Latest activity <time datetime="2019-09-06">Sep 6, 2019</time></span>
      </span>
    </div>
  </li>
</ul>`;

type ArticleViewModel = {
  doi: Doi,
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<SanitisedHtmlFragment>,
  latestVersionDate: Date,
  latestActivityDate: Date,
  evaluationCount: number,
};

export const renderRecentGroupActivity: (
  items: ReadonlyArray<ArticleViewModel>
) => HtmlFragment = () => toHtmlFragment(hardcodedArticleList);
