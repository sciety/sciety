import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const learnAboutPage: Page = {
  title: 'Learn about Sciety',
  content: toHtmlFragment(`
    <header class="page-header">
      <h1>Learn about Sciety</h1>
    </header>

    <video controls autoplay preload="metadata" class="learn-about-page-video">
      <source src="/static/video/sciety-animation-video.mp4" type="video/mp4"></source>
    </video>

    <section class="learn-about-page-copy">
      <h2>Join Sciety</h2>
      <p>Start a new way of curating and sharing evaluated preprints. <a href="/sign-up">Sign up</a> today.</p>

      <h2>What Sciety offers</h2>
      <p>Sciety is changing the landscape of preprint curation.</p>
      <ul>
        <li>Discover evaluated preprints</li>
        <li>Organise preprints into shareable lists</li>
        <li>Follow groups evaluating articles you care about</li>
        <li>Form a group to share your own evaluations of preprints</li>
      </ul>
    </section>
  `),
};
