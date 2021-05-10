import { toHtmlFragment } from '../types/html-fragment';

const content = toHtmlFragment(`
<div class="sciety-grid sciety-grid--home">
    
  <header class="home-page-header">
    <h1>
      Welcome to Sciety
    </h1>
    <p>
      Where research is evaluated and curated by the groups you trust.<br><a href="/about">Learn more about the platform.</a>
    </p>
  </header>

    <div class="home-page-feed-container">
      
  <section>
    <h2>
      Recently evaluated by groups you follow
    </h2>
    
  <p>Welcome to Sciety.</p>
  <p>
    Follow research as it develops and stay up to date with the next big thing,
    evaluated by the groups you trust.
  </p>
  <p>
    <a href="/log-in">Log in with Twitter</a> to see your feed here or start building a new one
    by following some groups!
  </p>
  <img src="/static/images/feed-screenshot.png" alt="Screenshot of a feed" class="feed__image">

  </section>

    </div>
  </div>
`);

export const landingPage = {
  title: 'Sciety',
  content,
};
