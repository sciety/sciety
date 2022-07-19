import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const renderVideoCallToAction = () => `
  <div class="home-page-hero__video_call_to_action">
    <div class="home-page-hero__video_cta_text_wrapper">
      <p class="home-page-hero__video_cta_copy">Learn about Sciety.</p>
      <a class="home-page-hero__video_cta_link" href="/learn-about">Play video<img src="/static/images/play-button.svg" alt=""/></a></div>
    </div>
`;

export const hero: HtmlFragment = toHtmlFragment(`
  <section class="home-page-hero">
    <div class="home-page-hero__content">
      <div class="home-page-hero__left_wrapper">
        <h1 class="home-page-hero__content_title">
          The home of public preprint evaluation
        </h1>
        <p class="home-page-hero__content_byline">
          Explore and curate evaluated preprints.
        </p>
        <h2>Find evaluated preprints</h2>
        <form class="home-page-hero__search_form" action="/search" method="get">
          <input type="hidden" name="category" value="articles">
          <label for="searchText" class="visually-hidden">Search term</label>
          <input id="searchText" name="query" placeholder="Search for a topic of interest" class="home-page-hero__search_text">
          <input type="hidden" name="evaluatedOnly" value="true">
          <button type="submit" class="home-page-hero__search_button">Search</button>
          <button type="reset" class="visually-hidden">Reset</button>
        </form>
        <h2>Follow peer review groups</h2>
        <p>
          Researchers reviewing and curating the latest preprints.<br>
          <a href="/groups" class="home-page-hero__groups_link">Explore their work</a>
        </p>
        <h2>Organize &amp; share with peers</h2>
        <p>Create an account to start sharing preprints with your community.</p>
        <a href="/sign-up" class="home-page-hero__sign_up_button">Sign Up</a>
      </div>

      <div class="home-page-hero__right_wrapper">
        ${renderVideoCallToAction()}
      </div>
    </div>
  </section>
`);
