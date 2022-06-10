import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export const pageFooter: HtmlFragment = toHtmlFragment(`
  <footer class="page-footer">
    <div class="pre-footer">
      <div class="page-footer__slogan">Stay Updated. Get Involved.</div>
      <a href="https://staging.sciety.org/signup" class="page-footer__call_to_action">Subscribe to Mailing List</a>
    </div>
    <div class="main-footer">
      <ul class="main-footer__navigation">
        <li>
          <a href="/blog" class="main-footer__link">Blog</a>
        </li>
      </ul>
    </div>
  </footer>
`);
