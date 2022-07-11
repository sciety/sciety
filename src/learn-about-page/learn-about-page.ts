import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const learnAboutPage: Page = {
  title: 'Learn about Sciety',
  content: toHtmlFragment(`
    <header class="page-header">
      <h1>Learn about Sciety</h1>
    </header>

    <section>
      <video controls preload="metadata" class="learn-about-page-video">
        <source src="/static/video/sciety-animation-video.mp4" type="video/mp4"></source>
      </video>

      <h2>Video transcript</h2>
      <p>Do you work in biomedical and life sciences?</p>
      <p>How do you keep on top of the growing number of preprints now being made available?</p>
      <p>How can you tell if a preprint is worth your time?</p>
      <p>How can you and your peers share the preprints you find interesting or important?</p>
      <p>How about discovering evaluated preprints, especially from underrepresented labs?</p>
      <p>There is an answer…</p>
      <p>Sciety aggregates evaluations of preprints in one place, helping you organise your preprints of choice into your own shareable lists.</p>
      <p>Gone are the days when curation is for the selected few…</p>
      <p>On Sciety, you can find open reviews, assessments and evaluations by groups of experts you can trust...</p>
      <p>Organise lists of articles in your own space on Sciety</p>
      <p>Follow the groups evaluating articles you care about to receive their latest reviews in your personal feed.</p>
      <p>Or form your own group to share your own evaluations of preprints.</p>
      <p>Visit Sciety now to discover your next important read. </p>
      <p>Sciety; for the shared discovery, evaluation and organisation of preprints.</p>
    </section>

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
