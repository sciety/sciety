import * as O from 'fp-ts/Option';
import { HtmlPage } from './html-page';
import { UserDetails } from '../types/user-details';
import { CompleteHtmlDocument } from './complete-html-document';

export type PageLayout = (user: O.Option<UserDetails>) => (page: HtmlPage) => CompleteHtmlDocument;
