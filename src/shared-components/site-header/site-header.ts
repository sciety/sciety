import * as O from 'fp-ts/Option';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { User } from '../../types/user';
import { utilityBar } from '../utility-bar';

export const siteHeader = (user: O.Option<User>): HtmlFragment => toHtmlFragment(`<header class="site-header">
    <div class="site-header__inner">
    <a href="/menu" class="site-header__menu_link">
        <img src="/static/images/menu-icon.svg" alt="" />
    </a>

    ${utilityBar(user)}
    </div>
</header>`);
