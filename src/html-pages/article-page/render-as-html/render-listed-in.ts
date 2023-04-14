import { toHtmlFragment } from '../../../types/html-fragment';

export const renderListedIn = () => toHtmlFragment(
  process.env.EXPERIMENT_ENABLED === 'true'
    ? `
      <div>
        <h2>Listed in</h2>
        <ul role="list">
          <li><a href="/lists/list-id-placeholder">List name placeholder</a></li>
        </ul>
      </div>
    `
    : '',
);
