import { NotHtml } from '../../../html-page';
import { renderCountWithDescriptor } from '../../../shared-components/render-count-with-descriptor';
import { ViewModel } from '../view-model';

export const renderDescription = (viewmodel: ViewModel): NotHtml => `${renderCountWithDescriptor(viewmodel.listCount, 'list', 'lists')} | Following ${renderCountWithDescriptor(viewmodel.groupIds.length, 'group', 'groups')}` as NotHtml;
