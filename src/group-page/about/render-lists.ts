import { toHtmlFragment } from '../../types/html-fragment';

export const renderLists = process.env.EXPERIMENT_ENABLED === 'true' ? toHtmlFragment('Placeholder for group lists') : toHtmlFragment('');
