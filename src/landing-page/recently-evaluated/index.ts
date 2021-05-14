import { toHtmlFragment } from '../../types/html-fragment';

export const recentlyEvaluated = toHtmlFragment(`
  <section class="landing-page-recently-evaluated">
    <h2 class="landing-page-recently-evaluated__title">Recently evaluated by groups on Sciety</h2>
    <ul class="landing-page-recently-evaluated__articles">
      <li>
        <article class="article-card landing-page-card">
          <h3 class="article-card__title landing-page-card__title">
            <a class="article-card__link" href="/articles/activity/10.1101/2021.01.10.426076?utm_source=landingpage&utm_medium=banner&utm_campaign=recently-evaluated-1">Single-cell RNA-seq analysis reveals penaeid shrimp hemocyte subpopulations and cell differentiation process</a>
          </h3>
          <p class="landing-page-card__group">
            <img class="group-card__avatar landing-page-card__avatar" src="/static/groups/elife--b560187e-f2fb-4ff9-a861-a204f3fc0fb0.png" alt="" />
            <span>Evaluated by <a href="/groups/b560187e-f2fb-4ff9-a861-a204f3fc0fb0">eLife</a></span>
          </p>
          <div class="article-card__meta landing-page-card__meta">
            <time datetime="2021-05-12">May 12, 2021</time>
          </div>
        </article>
      </li>
      <li>
        <article class="article-card landing-page-card">
          <h3 class="article-card__title landing-page-card__title">
            <a class="article-card__link" href="/articles/activity/10.1101/2021.02.20.20248421?utm_source=landingpage&utm_medium=banner&utm_campaign=recently-evaluated-2">Nosocomial outbreak of SARS-CoV-2 in a “non-COVID-19” hospital ward: virus genome sequencing as a key tool to understand cryptic transmission</a>
          </h3>
          <p class="landing-page-card__group">
            <img class="group-card__avatar landing-page-card__avatar" src="/static/groups/ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg" alt="" />
            <span>Evaluated by <a href="/groups/62f9b0d0-8d43-4766-a52a-ce02af61bc6a">NCRC</a></span>
          </p>
          <div class="article-card__meta landing-page-card__meta">
            <time datetime="2021-04-22">Apr 22, 2021</time>
          </div>
        </article>
      </li>
      <li>
        <article class="article-card landing-page-card">
          <h3 class="article-card__title landing-page-card__title">
            <a class="article-card__link" href="/articles/activity/10.1101/2021.04.12.439490?utm_source=landingpage&utm_medium=banner&utm_campaign=recently-evaluated-3">Design, Synthesis and Evaluation of WD-repeat containing protein 5 (WDR5) degraders</a>
          </h3>
          <p class="landing-page-card__group">
            <img class="group-card__avatar landing-page-card__avatar" src="/static/groups/prereview-community--10360d97-bf52-4aef-b2fa-2f60d319edd7.jpg" alt="" />
            <span>Evaluated by <a href="/groups/10360d97-bf52-4aef-b2fa-2f60d319edd7">PREreview</a></span>
          </p>
          <div class="article-card__meta landing-page-card__meta">
            <time datetime="2021-05-10">May 10, 2021</time>
          </div>
        </article>
      </li>
    </ul>
    <div class="landing-page-recently-evaluated__call_to_action">
      <a href="/groups" class="landing-page__secondary_button">Discover more groups</a>
    </div>
  </section>
`);
