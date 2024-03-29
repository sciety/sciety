import * as O from 'fp-ts/Option';
import { HtmlPage } from './html-page';
import { UserDetails } from '../types/user-details';
import { ContentWrappedInLayout } from './content-wrapped-in-layout';

export type PageLayout = (user: O.Option<UserDetails>) => (page: HtmlPage) => ContentWrappedInLayout;
