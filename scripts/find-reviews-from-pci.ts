import fs from 'fs';
import axios from 'axios';
import { DOMParser } from 'xmldom';
import { JSDOM } from 'jsdom';

type PciCommunity = {
  id: string,
  prefix: string,
};

const pciCommunities: Array<PciCommunity> = [
  { id: '74fd66e9-3b90-4b5a-a4ab-5be83db4c5de', prefix: 'zool' },
  { id: '19b7464a-edbe-42e8-b7cc-04d1eb1f7332', prefix: 'evolbiol' },
  { id: '32025f28-0506-480e-84a0-b47ef1e92ec5', prefix: 'ecology' },
  { id: '4eebcec9-a4bb-44e1-bde3-2ae11e65daaa', prefix: 'animsci' },
  { id: 'b90854bf-795c-42ba-8664-8257b9c68b0c', prefix: 'archaeo' },
  { id: '7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84', prefix: 'paleo' },
];

const parser = new DOMParser({
  errorHandler: (_, msg) => {
    throw msg;
  },
});

type Recommendation = {
  date: Date,
  articleDoi: string,
  reviewDoi: string,
};

const findRecommendations = async (community: PciCommunity): Promise<Array<Recommendation>> => {
  const result = [];

  const { data: feed } = await axios.get(`https://${community.prefix}.peercommunityin.org/public/rss4bioRxiv`);
  const doc = parser.parseFromString(feed, 'text/xml');

  for (const link of Array.from(doc.getElementsByTagName('link'))) {
    const url = link.getElementsByTagName('url')[0];
    const articleDoiString = link.getElementsByTagName('doi')[0]?.textContent ?? '';

    const biorxivDoiRegex = /^\s*(?:doi:|(?:(?:https?:\/\/)?(?:dx\.)?doi\.org\/))?(10\.1101\/(?:[^%"#?\s])+)\s*$/;
    const [, articleDoi] = biorxivDoiRegex.exec(articleDoiString) ?? [];

    if (articleDoi) {
      const { data: html } = await axios.get<string>(url?.textContent ?? '');
      const { document } = new JSDOM(html).window;
      const date = document.querySelector('meta[name="citation_publication_date"]')?.getAttribute('content');
      if (!date) {
        throw new Error(`Unable to get citation publication date for ${articleDoi}`);
      }
      const reviewDoi = document.querySelector('meta[name="citation_doi"]')?.getAttribute('content');
      if (!reviewDoi) {
        throw new Error(`Unable to get the review (citation) doi for ${articleDoi}`);
      }
      result.push({
        date: new Date(date),
        articleDoi,
        reviewDoi,
      });
    }
  }

  return result;
};

void (async (): Promise<void> => {
  pciCommunities.forEach(async (community) => {
    const recommendations = await findRecommendations(community);

    if (recommendations.length === 0) {
      process.stderr.write(`No recommendations found for ${community.prefix}\n`);
      return;
    }

    const reviewsFilename = `./data/reviews/${community.id}.csv`;
    const contents = recommendations.map((recommendation) => (
      `${recommendation.date.toISOString()},${recommendation.articleDoi},doi:${recommendation.reviewDoi}`
    )).join('\n');
    fs.writeFileSync(reviewsFilename, `Date,Article DOI,Review ID\n${contents}\n`);
    process.stderr.write(`Written ${recommendations.length} reviews to ${reviewsFilename} for ${community.prefix}\n`);

    const endorsementsFilename = `./data/endorsements/${community.id}.csv`;
    const endorsementContents = recommendations.map((recommendation) => (
      `${recommendation.date.toISOString()},${recommendation.articleDoi}`
    )).join('\n');
    fs.writeFileSync(endorsementsFilename, `Date,Article DOI\n${endorsementContents}\n`);
    process.stderr.write(`Written ${recommendations.length} endorsements to ${endorsementsFilename} for ${community.prefix}\n`);
  });
})();
