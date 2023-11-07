import * as O from 'fp-ts/Option';
import { HtmlPage } from './html-page';
import { UserDetails } from '../types/user-details';
import { HtmlFragment } from '../types/html-fragment';

export type PageLayout = (user: O.Option<UserDetails>) => (page: HtmlPage) => HtmlFragment;
