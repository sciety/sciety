import { PageLayout } from '../html-pages/page-layout';
import { toCompleteHtmlDocument } from '../html-pages/complete-html-document';

export const contentWithoutLayout: PageLayout = () => (page) => toCompleteHtmlDocument(page.content);
