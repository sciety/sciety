import { ViewModel } from '../view-model';

export const renderPage = (viewmodel: ViewModel) => `
  ${viewmodel.header}
  <div class="group-page-follow-toggle">
    ${viewmodel.followButton}
  </div>
  ${viewmodel.content}
`;
