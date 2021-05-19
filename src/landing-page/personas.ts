import { toHtmlFragment } from '../types/html-fragment';

export const personas = toHtmlFragment(`
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
`);
