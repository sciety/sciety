import { toHtmlFragment } from '../../../types/html-fragment';

export const renderValueStatements = process.env.EXPERIMENT_ENABLED === 'true'
  ? toHtmlFragment('Value statement')
  : toHtmlFragment('');
