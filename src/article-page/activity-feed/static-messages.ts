import { toHtmlFragment } from '../../types/html-fragment';

export const retryLater = toHtmlFragment('Please try refreshing this page, or try again later.');

export const missingFullTextAndSourceLink = toHtmlFragment(`We are unable to display this evaluation right now. ${retryLater}`);
