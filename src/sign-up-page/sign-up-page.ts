import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const signUpPage: Page = {
  title: 'Sign up for Sciety',
  content: toHtmlFragment(`
    <header class="page-header">
      <h1>Sign up for Sciety</h1>
    </header>
    <div class="sign-up-page-content">
      <p><a href="/sign-up-call-to-action" class="sign-up-page-call-to-action">Sign up with your Twitter account</a></p>
  
      <h2>Don't have a Twitter account?</h2>
      <p>You will need to create a Twitter account before you can sign up for Sciety.</p>
      <p><a href="https://twitter.com/">Create a Twitter account</a></p>
  
      <h3>Don't want to create a Twitter account?</h3>
      <p>We will be adding other sign-in methods soon. <a href="/subscribe-to-mailing-list">Subscribe to our newsletter</a> to be notified when we do.</p>
  
      <h2>Why should I make a Sciety account?</h2>
      <p>You don't need an account to use Sciety, but having an account unlocks new features.</p>
      <ul>
        <li><strong>Save your favourite preprints</strong>: never lose the preprints that interest you most.</li>
        <li><strong>Follow trusted groups</strong>: stay updated on what your favourite groups are evaluating.</li>
        <li><strong>Track recent activity</strong>: always see new evaluations on saved preprints.</li>
      </ul>
  
      <p><a href="/about">Learn more about Sciety</a></p>
    </div>

    <aside class="sign-up-page-supplementary">
      <h2>What we do with your data</h2>
      <h3>Twitter data</h3>
      <p>We only use your user name. We never post on your behalf.</p>
      <h3>Sciety data</h3>
      <p>We use website data to inform our improvements.</p>
      <p>Read more on our <a href="/legal">legal information page</a>.</p>
    </aside>

  `),
};
