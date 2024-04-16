import * as O from 'fp-ts/Option';
import { ContentWrappedInLayout } from './content-wrapped-in-layout';
import { HtmlPage } from './html-page';
import { UserDetails } from '../types/user-details';

export type PageLayout = (user: O.Option<UserDetails>) => (page: HtmlPage) => ContentWrappedInLayout;
