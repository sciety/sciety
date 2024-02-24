import * as O from 'fp-ts/Option';
import { HtmlPage } from './html-page.js';
import { UserDetails } from '../types/user-details.js';
import { ContentWrappedInLayout } from './content-wrapped-in-layout.js';

export type PageLayout = (user: O.Option<UserDetails>) => (page: HtmlPage) => ContentWrappedInLayout;
