import axios from 'axios';

void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');

  const links = [
    'https://zool.peercommunityin.org/public/rec?id=4',
    'https://zool.peercommunityin.org/public/rec?id=1',
    'https://zool.peercommunityin.org/public/rec?id=3',
  ];

  links.forEach(async (link) => {
    const { data } = await axios.get<string>(link);
    const date = new Date();
    const articleDoi = '';
    const [,reviewDoi] = /<meta name="citation_doi" content="(.*?)" \/>/.exec(data) ?? [];
    process.stdout.write(`${date.toISOString()},${articleDoi},${reviewDoi}\n`);
  });
})();
