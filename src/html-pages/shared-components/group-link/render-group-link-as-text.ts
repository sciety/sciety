import { htmlEscape } from 'escape-goat';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { GroupLinkAsTextViewModel } from './group-link-as-text-view-model';

export const renderGroupLinkAsText = (group: GroupLinkAsTextViewModel): HtmlFragment => toHtmlFragment(`<a href="${group.href}">${htmlEscape(group.groupName)}</a>`);
