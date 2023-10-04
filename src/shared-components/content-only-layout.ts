import { HtmlPage } from '../types/html-page';

export const contentOnlyLayout = () => (page: HtmlPage): HtmlPage['content'] => page.content;
