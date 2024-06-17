import { toHtmlFragment } from '../../../../../types/html-fragment';

export const siteFooter = toHtmlFragment(`
  <footer>
    <div class="pre-footer">
      <div class="pre-footer__slogan">Stay updated. Get involved.</div>
      <a href="/subscribe-to-mailing-list" class="pre-footer__call_to_action">Subscribe to our newsletter</a>
    </div>
    <div class="main-footer">
      <ul class="main-footer__navigation">
        <li class="main-footer__navigation_item">
          <a href="/sciety-feed" class="main-footer__link">Feed</a>
        </li>
        <li class="main-footer__navigation_item">
          <a href="/blog" class="main-footer__link">Blog</a>
        </li>
        <li class="main-footer__navigation_item">
          <a href="/about" class="main-footer__link">About Sciety</a>
        </li>
        <li class="main-footer__navigation_item">
          <a href="/contact-us" class="main-footer__link">Contact</a>
        </li>
        <li class="main-footer__navigation_item">
          <a href="https://twitter.com/scietyHQ"><img src="/static/images/twitter-bird-white.svg" alt="Follow us on Twitter"/></a>
        </li>
        <li class="main-footer__navigation_item">
          <a href="https://www.facebook.com/ScietyHQ/"><img src="/static/images/facebook-white.svg" alt="Follow us on Facebook"/></a>
        </li>
      </ul>
      <small class="main-footer__small_print">
        © eLife Sciences Publications Ltd.
        <a href="/legal">Legal&nbsp;information</a>
      </small>
    </div>
  </footer>
`);
