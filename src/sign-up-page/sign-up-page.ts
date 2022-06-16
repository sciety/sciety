import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const signUpPage: Page = {
  title: 'Sign Up for Sciety',
  content: toHtmlFragment(`
    <header class="page-header">
      <h1>Sign Up for Sciety</h1>
    </header>

    <p><a href="/log-in">Sign Up With Your Twitter Account</a></p>

    <h2>Don't Have a Twitter Account?</h2>
    <p>You will need to create a twitter account before you can sign up for Sciety.</p>
    <p><a href="https://twitter.com/">Create a Twitter Account</a></p>

    <h3>Don't Want to Create a Twitter Account?</h3>
    <p>We will be adding other sign-in methods soon. <a href="/signup">Subscribe to our newsletter</a> to be notified when we do.</p>

    <h2>Why Should I Make a Sciety Account?</h2>
    <p>You don't need an account to use Sciety, but having an account unlocks new features.</p>
    <ul>
      <li><b>Save Your Favourite Preprints</b>: Never lose the preprints that interest you most.</li>
      <li><b>Follow Trusted Groups</b>: Stay updated on what your favourite groups are evaluating.</li>
      <li><b>Track Recent Activity</b>: Always see new evaluations on saved preprints.</li>
    </ul>

    <p><a href="/about">Learn more about Sciety</a></p>
  `),
};
