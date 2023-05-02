import { ViewModel } from '../view-model';
import { renderCountWithDescriptor } from '../../../../shared-components/render-count-with-descriptor';

export const renderDescription = (viewmodel: ViewModel): string => `${renderCountWithDescriptor(viewmodel.listCount, 'list', 'lists')} | Following ${renderCountWithDescriptor(viewmodel.groupIds.length, 'group', 'groups')}`;
