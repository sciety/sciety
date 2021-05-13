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
          
            <div class="hidden" id="article-card-author-list-10.1101/2021.01.10.426076">This article's authors</div>
            <ol class="article-card__authors" role="list" aria-describedby="article-card-author-list-10.1101/2021.01.10.426076">
              <li class="article-card__author">Keiichiro Koiwai</li><li class="article-card__author">Takashi Koyama</li><li class="article-card__author">Soichiro Tsuda</li><li class="article-card__author">Atsushi Toyoda</li><li class="article-card__author">Kiyoshi Kikuchi</li><li class="article-card__author">Hiroaki Suzuki</li><li class="article-card__author">Ryuji Kawano</li>
            </ol>
          
          <div class="article-card__meta">
            <span class="visually-hidden">This article has </span><span>5 evaluations</span><span>Latest version <time datetime="2021-01-27">Jan 27, 2021</time></span><span>Latest activity <time datetime="2021-05-12">May 12, 2021</time></span>
          </div>
        </article>
      </li>
      <li>
        <article class="article-card">
          <h3 class="article-card__title">
            <a class="article-card__link" href="/articles/activity/10.1101/2021.02.20.20248421">Nosocomial outbreak of SARS-CoV-2 in a “non-COVID-19” hospital ward: virus genome sequencing as a key tool to understand cryptic transmission</a>
          </h3>
          
            <div class="hidden" id="article-card-author-list-10.1101/2021.02.20.20248421">This article's authors</div>
            <ol class="article-card__authors" role="list" aria-describedby="article-card-author-list-10.1101/2021.02.20.20248421">
              <li class="article-card__author">Vítor Borges</li><li class="article-card__author">Joana Isidro</li><li class="article-card__author">Filipe Macedo</li><li class="article-card__author">José Neves</li><li class="article-card__author">Luís Silva</li><li class="article-card__author">Mário Paiva</li><li class="article-card__author">José Barata</li><li class="article-card__author">Judite Catarino</li><li class="article-card__author">Liliana Ciobanu</li><li class="article-card__author">Sílvia Duarte</li><li class="article-card__author">Luís Vieira</li><li class="article-card__author">Raquel Guiomar</li><li class="article-card__author">João Paulo Gomes</li>
            </ol>
          
          <div class="article-card__meta">
            <span class="visually-hidden">This article has </span><span>1 evaluation</span><span>Latest version <time datetime="2021-02-23">Feb 23, 2021</time></span><span>Latest activity <time datetime="2021-04-22">Apr 22, 2021</time></span>
          </div>
        </article>
      </li>
      <li>
        <article class="article-card">
          <h3 class="article-card__title">
            <a class="article-card__link" href="/articles/activity/10.1101/2021.04.12.439490">Design, Synthesis and Evaluation of WD-repeat containing protein 5 (WDR5) degraders</a>
          </h3>
          
            <div class="hidden" id="article-card-author-list-10.1101/2021.04.12.439490">This article's authors</div>
            <ol class="article-card__authors" role="list" aria-describedby="article-card-author-list-10.1101/2021.04.12.439490">
              <li class="article-card__author">Anja Dölle</li><li class="article-card__author">Bikash Adhikari</li><li class="article-card__author">Andreas Krämer</li><li class="article-card__author">Janik Weckesser</li><li class="article-card__author">Nicola Berner</li><li class="article-card__author">Lena-Marie Berger</li><li class="article-card__author">Mathias Diebold</li><li class="article-card__author">Magdalena M. Szewczyk</li><li class="article-card__author">Dalia Barsyte-Lovejoy</li><li class="article-card__author">Cheryl H. Arrowsmith</li><li class="article-card__author">Jakob Gebel</li><li class="article-card__author">Frank Löhr</li><li class="article-card__author">Volker Dötsch</li><li class="article-card__author">Martin Eilers</li><li class="article-card__author">Stephanie Heinzlmeir</li><li class="article-card__author">Bernhard Küster</li><li class="article-card__author">Christoph Sotriffer</li><li class="article-card__author">Elmar Wolf</li><li class="article-card__author">Stefan Knapp</li>
            </ol>
          
          <div class="article-card__meta">
            <span class="visually-hidden">This article has </span><span>1 evaluation</span><span>Latest version <time datetime="2021-04-12">Apr 12, 2021</time></span><span>Latest activity <time datetime="2021-05-10">May 10, 2021</time></span>
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
