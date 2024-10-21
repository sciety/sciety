import * as O from 'fp-ts/Option';
import { ContentWrappedInLayout } from './content-wrapped-in-layout';
import { HtmlPage } from './html-page';
import { UserDetails } from '../../types/user-details';

type ViewModel = O.Option<UserDetails>;

export type PageLayout = (viewModel: ViewModel) => (page: HtmlPage) => ContentWrappedInLayout;
