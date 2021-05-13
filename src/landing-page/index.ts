import { toHtmlFragment } from '../types/html-fragment';

const content = toHtmlFragment(`
<div class="landing-page">

  <section class="landing-page-hero">
    <div class="landing-page-hero__content">
      <h1 class="landing-page-hero__content__title">
        The home of public preprint evaluation
      </h1>
      <p class="landing-page-hero__content__byline">
        Open evaluation and curation together in one place.
        <br>
        Let Sciety help you navigate the preprint landscape.
      </p>
      <p class="landing-page-hero__content__byline">Follow the journey through <a href="/blog">our blog</a>.</p>
      <form class="landing-page-hero__search_form" action="/search" method="get">
        <label for="searchText" class="visually-hidden">Search term</label>
        <input id="searchText" name="query" placeholder="Search for a topic of interest" class="landing-page-hero__search_text">
        <button type="submit" class="landing-page-hero__search_button">Search</button>
        <button type="reset" class="visually-hidden">Reset</button>
      </form>
    </div>

    <picture>
      <source srcset="/static/images/landing-page-illustration.svg" media="(min-width: 60.25em)">
      <img src="data:" alt="" class="landing-page-hero__image">
    </picture>
  </section>

  <section class="landing-page-recently-evaluated">
    <h2 class="landing-page-recently-evaluated__title">Recently evaluated by groups on Sciety</h2>
    <ul class="landing-page-recently-evaluated__articles">
      <li>
        <article class="article-card">
          <h3 class="article-card__title">
            <a class="article-card__link" href="/articles/activity/10.1101/2021.01.10.426076">Single-cell RNA-seq analysis reveals penaeid shrimp hemocyte subpopulations and cell differentiation process</a>
          </h3>
          <p>Evaluated by <a href="/groups/b560187e-f2fb-4ff9-a861-a204f3fc0fb0">eLife</a>.</p>
          <div class="article-card__meta">
            <time datetime="2021-05-12">May 12, 2021</time>
          </div>
        </article>
      </li>
      <li>
        <article class="article-card">
          <h3 class="article-card__title">
            <a class="article-card__link" href="/articles/activity/10.1101/2021.02.20.20248421">Nosocomial outbreak of SARS-CoV-2 in a “non-COVID-19” hospital ward: virus genome sequencing as a key tool to understand cryptic transmission</a>
          </h3>
          <p>Evaluated by <a href="/groups/62f9b0d0-8d43-4766-a52a-ce02af61bc6a">NCRC</a>.</p>
          <div class="article-card__meta">
            <time datetime="2021-04-22">Apr 22, 2021</time>
          </div>
        </article>
      </li>
      <li>
        <article class="article-card">
          <h3 class="article-card__title">
            <a class="article-card__link" href="/articles/activity/10.1101/2021.04.12.439490">Design, Synthesis and Evaluation of WD-repeat containing protein 5 (WDR5) degraders</a>
          </h3>
          <p>Evaluated by <a href="/groups/10360d97-bf52-4aef-b2fa-2f60d319edd7">PREreview</a>.</p>
          <div class="article-card__meta">
            <time datetime="2021-05-10">May 10, 2021</time>
          </div>
        </article>
      </li>
    </ul>
  </section>

  <section class="landing-page-personas">
    <h2 class="landing-page-personas__title">Where effort meets impact</h2>
    <div class="landing-page-personas__content">
      <div class="landing-page-personas__persona">
        <img src="/static/images/landing-persona-readers.svg" alt="" class="landing-page-personas__image">
        <p>Quickly find relevant content and spend more time reading what you care about.</p>
      </div>
      <div class="landing-page-personas__persona">
        <img src="/static/images/landing-persona-groups.svg" alt="" class="landing-page-personas__image">
        <p>Share your group's insights to grow your readership and keep the community informed.</p>
      </div>
    </div>
  </section>

  <section class="landing-page-calls-to-action">
    <h2 class="landing-page-calls-to-action__title">Get started with Sciety</h2>
    <p class="landing-page-call-to-action__text">Follow your first group, save interesting articles and keep up to date with the latest trends.</p>
    <div class="landing-page-calls-to-action__buttons">
      <a class="landing-page-calls-to-action__login_button" href="/log-in">Log in</a>
      <a class="landing-page-calls-to-action__subscribe_button" href="https://blog.sciety.org/subscribe">Subscribe for updates</a>
    </div>
  </section>
</div>
`);

export const landingPage = {
  title: 'Sciety: the home of public preprint evaluation',
  content,
};
