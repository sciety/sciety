import { toHtmlFragment } from '../../../types/html-fragment';

export const renderListedIn = () => toHtmlFragment(
  process.env.EXPERIMENT_ENABLED === 'true'
    ? `
      <div>
        <p>Listed in</p>
      </div>
    `
    : '',
);
