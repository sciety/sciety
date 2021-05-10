import { toHtmlFragment } from '../types/html-fragment';

const content = toHtmlFragment(`
<div class="landing-page-content">
  <h1>
    The home of public preprint evaluation
  </h1>    
  <p>Open evaluation and curation together in one place. Let Sciety help you navigate the preprint landscape.</p>
  <p>Follow the journey through <a href="/blog">our blog</a>.</p>
</div>
`);

export const landingPage = {
  title: 'Sciety',
  content,
};
