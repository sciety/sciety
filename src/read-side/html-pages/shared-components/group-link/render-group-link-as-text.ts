import { htmlEscape } from 'escape-goat';
import { GroupLinkAsTextViewModel } from './group-link-as-text-view-model';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

export const renderGroupLinkAsText = (group: GroupLinkAsTextViewModel): HtmlFragment => toHtmlFragment(`<a href="${group.href}">${htmlEscape(group.groupName)}</a>`);
