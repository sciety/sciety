import { toHtmlFragment } from '../../../../types/html-fragment';

const retryLater = toHtmlFragment('Please try refreshing this page, or try again later.');

export const missingDigestAndSourceLink = toHtmlFragment(`We are unable to display this evaluation right now. ${retryLater}`);
