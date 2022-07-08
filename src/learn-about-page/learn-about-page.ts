import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const learnAboutPage: Page = {
  title: 'Learn about Sciety',
  content: toHtmlFragment(`
    <header class="page-header">
      <h1>Learn about Sciety</h1>
    </header>
      <video controls preload="metadata" class="learn-about-page-video">
        <source src="/static/video/sciety-animation-video.mp4" type="video/mp4"></source>
      </video>
  `),
};
