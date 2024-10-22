import * as O from 'fp-ts/Option';
import { ContentWrappedInLayout } from './content-wrapped-in-layout';
import { HtmlPage } from './html-page';
import { UserDetails } from '../../types/user-details';

export type PageLayoutViewModel = { userDetails: O.Option<UserDetails> };

export type PageLayout = (viewModel: PageLayoutViewModel) => (page: HtmlPage) => ContentWrappedInLayout;
