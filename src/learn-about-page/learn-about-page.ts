import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

const renderNoJsFallbackVideo = () => `
  <noscript>
    <video controls preload="metadata" class="learn-about-page-video">
      <source src="/static/video/sciety-animation-video.mp4" type="video/mp4">
    </video>
  </noscript>
`;

// The html below generated on Vimeo https://vimeo.com/manage/videos/727774522 (login required)
const renderVimeoVideo = () => `
  <div style="padding:56.25% 0 0 0;position:relative;">
    <iframe src="https://player.vimeo.com/video/727774522?h=6e8839dc6b&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Sciety animation video"></iframe>
  </div>
  <script src="https://player.vimeo.com/api/player.js"></script>
  <p><a href="https://vimeo.com/727774522">Watch video on Vimeo</a></p>
`;

const renderVideoTranscript = () => `
  <section class="learn-about-page-transcript">
    <h2>Video transcript</h2>
    <p>Are you a researcher with an interest in preprint literature?</p>
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
`;

const renderCopy = () => `
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
`;

export const learnAboutPage: Page = {
  title: 'Learn about Sciety',
  content: toHtmlFragment(`
    <header class="page-header">
      <h1>Learn about Sciety</h1>
    </header>

    <section>
      <div class="learn-about-page-video-wrapper">
        ${renderNoJsFallbackVideo()}
        ${renderVimeoVideo()}
      </div>

      ${renderVideoTranscript()}
    </section>

    <section class="learn-about-page-copy">
      ${renderCopy()}
    </section>
  `),
};
