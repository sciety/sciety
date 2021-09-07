import { toHtmlFragment } from '../types/html-fragment';

export const personas = toHtmlFragment(`
  <section class="home-page-personas">
    <h2 class="home-page-personas__title">Where evaluation meets impact</h2>
    <div class="home-page-personas__content">
      <div class="home-page-persona">
        <img src="/static/images/landing-persona-readers.svg" alt="" class="home-page-persona__image">
        <p class="home-page-persona__text">Quickly find relevant content and spend more time reading what you care about.</p>
      </div>
      <div class="home-page-persona">
        <img src="/static/images/landing-persona-groups.svg" alt="" class="home-page-persona__image">
        <p class="home-page-persona__text">Share your group's insights to grow your readership and keep the community informed.</p>
      </div>
    </div>
  </section>
`);
