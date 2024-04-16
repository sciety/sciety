import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './view-model';

const renderUpdatedTagOfEntry = (date: ViewModel['articles'][number]['articleCard']['latestActivityAt']) => pipe(
  date,
  O.getOrElse(
    () => new Date(),
  ),
  (d) => d.toISOString(),
);

const renderEntries = (entries: ViewModel['articles']) => pipe(
  entries,
  RA.map((entry) => `
  <entry>
    <title type="xhtml">
      <div xmlns="http://www.w3.org/1999/xhtml">
        ${entry.articleCard.title}
      </div>
    </title>
    <link rel="alternate" type="text/html" href="https://sciety.org${entry.articleCard.paperActivityPageHref}"/>
    <id>https://sciety.org${entry.articleCard.paperActivityPageHref}</id>
    <updated>${renderUpdatedTagOfEntry(entry.articleCard.latestActivityAt)}</updated>
  </entry>
  `),
  (items) => items.join('\n'),
);

export const renderAsAtom = (viewModel: ViewModel): string => `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${viewModel.name}</title>
  <link rel="alternate" href="${viewModel.listPageAbsoluteUrl.toString()}"/>
  <link rel="self" href="${viewModel.listPageAbsoluteUrl.toString()}/feed.atom"/>
  <updated>${viewModel.updatedAt.toISOString()}</updated>
  <author>
    <name>${viewModel.ownerName}</name>
  </author>
  <id>urn:uuid:${viewModel.listId}</id>

  ${renderEntries(viewModel.articles)}

</feed>
`;
