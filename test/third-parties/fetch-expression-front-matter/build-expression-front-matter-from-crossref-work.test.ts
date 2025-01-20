import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import {
  buildExpressionFrontMatterFromCrossrefWork,
} from '../../../src/third-parties/fetch-expression-front-matter/build-expression-front-matter-from-crossref-work';
import * as DE from '../../../src/types/data-error';
import { abortTest } from '../../abort-test';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryString } from '../../helpers';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';

const postedContentCrossrefResponseWith = (content: string): string => `
  <?xml version="1.0" encoding="UTF-8"?>
  <doi_records>
    <doi_record>
      <crossref>
        <posted_content>
          ${content}
        </posted_content>
      </crossref>
    </doi_record>
  </doi_records>
`;

const journalCrossrefResponseWith = (content: string): string => `
  <?xml version="1.0" encoding="UTF-8"?>
  <doi_records>
    <doi_record>
      <crossref>
        <journal>
          <journal_article>
            ${content}
          </journal_article>
        </journal>
      </crossref>
    </doi_record>
  </doi_records>
`;

describe('build-expression-front-matter-from-crossref-work', () => {
  describe.each(
    [
      ['journal', journalCrossrefResponseWith],
      ['posted-content', postedContentCrossrefResponseWith],
    ],
  )('given a %s work', (_, crossrefResponseWith) => {
    describe('parsing the abstract', () => {
      const extractAbstractFromFrontMatter = (partialResponse: string) => {
        const response = crossrefResponseWith(`
          <titles>
            <title>${arbitraryString()}</title>
          </titles>
          ${partialResponse}
        `);
        return pipe(
          buildExpressionFrontMatterFromCrossrefWork(response, dummyLogger, arbitraryExpressionDoi()),
          E.getOrElseW(abortTest('Failed to build expression front matter')),
          (frontMatter) => frontMatter.abstract,
        );
      };

      it('extracts the abstract text from the XML response', async () => {
        const abstract = extractAbstractFromFrontMatter(`
          <abstract>
            Some random nonsense.
          </abstract>`);

        expect(abstract).toStrictEqual(O.some(expect.stringContaining('Some random nonsense.')));
      });

      it.failing('extracts the first abstract text from the XML response when multiple abstracts are available', async () => {
        const abstract = extractAbstractFromFrontMatter(`
          <abstract>
            Some random nonsense.
          </abstract>
          <abstract>
            Some other random nonsense.
          </abstract>
          `);

        expect(abstract).toStrictEqual(O.some(expect.stringContaining('Some random nonsense.')));
      });

      it('removes the <abstract> element', async () => {
        const abstract = extractAbstractFromFrontMatter(`
          <abstract class="something">
            ${arbitraryString()}
          </abstract>`);

        expect(abstract).toStrictEqual(O.some(expect.not.stringContaining('<abstract>')));
        expect(abstract).toStrictEqual(O.some(expect.not.stringContaining('</abstract>')));
      });

      it('removes the first <title> if present', async () => {
        const abstract = extractAbstractFromFrontMatter(`
          <abstract>
            <title class="something">Abstract</title>
            ${arbitraryString()}
          </abstract>
        `);

        expect(abstract).toStrictEqual(O.some(expect.not.stringContaining('Abstract')));
      });

      it('replaces remaining <title>s with HTML <h3>s', async () => {
        const abstract = extractAbstractFromFrontMatter(`
          <abstract>
            <title class="something">expected to be removed</title>
            <p>Lorem ipsum</p>
            <title class="something">should be an h3</title>
            <p>Lorem ipsum</p>
            <title class="something">should also be an h3</title>
            </sec>
          </abstract>
        `);

        expect(abstract).toStrictEqual(O.some(expect.stringContaining('<h3>should be an h3</h3>')));
        expect(abstract).toStrictEqual(O.some(expect.stringContaining('<h3>should also be an h3</h3>')));
        expect(abstract).toStrictEqual(O.some(expect.not.stringContaining('<title>')));
        expect(abstract).toStrictEqual(O.some(expect.not.stringContaining('</title>')));
      });

      it('renders italic if present', async () => {
        const abstract = extractAbstractFromFrontMatter(`
          <abstract>
            <title>Abstract</title>
            <p>
              ${arbitraryString()}
              <italic class="something">Cannabis sativa</italic>
              ${arbitraryString()}
              <italic class="something">in vivo</italic>
              ${arbitraryString()}
            </p>
          </abstract>`);

        expect(abstract).toStrictEqual(O.some(expect.stringContaining('<i>Cannabis sativa</i>')));
        expect(abstract).toStrictEqual(O.some(expect.stringContaining('<i>in vivo</i>')));
      });

      it('replaces <list> unordered list with HTML <ul>', async () => {
        const abstract = extractAbstractFromFrontMatter(`
          <abstract>
            <list class="something" list-type="bullet" id="id-1">
              <list-item class="something">
                <p>${arbitraryString()}</p>
              </list-item>
              <list-item class="something">
                <p>${arbitraryString()}</p>
              </list-item>
            </list>
          </abstract>`);

        expect(abstract).toStrictEqual(O.some(expect.stringContaining('<ul>')));
        expect(abstract).toStrictEqual(O.some(expect.stringContaining('</ul>')));
        expect(abstract).toStrictEqual(O.some(expect.stringContaining('<li>')));
        expect(abstract).toStrictEqual(O.some(expect.stringContaining('</li>')));
      });

      it('replaces <sec> with HTML <section>', () => {
        const abstract = extractAbstractFromFrontMatter(`
          <abstract>
            <sec class="something">
              <p>Lorem ipsum</p>
            </sec>
          </abstract>`);

        expect(abstract).toStrictEqual(O.some(expect.stringContaining('<section>')));
        expect(abstract).toStrictEqual(O.some(expect.stringContaining('</section>')));
        expect(abstract).toStrictEqual(O.some(expect.not.stringContaining('<sec>')));
        expect(abstract).toStrictEqual(O.some(expect.not.stringContaining('</sec>')));
      });

      it('strips <title> named Graphical abstract', () => {
        const abstract = extractAbstractFromFrontMatter(`
          <abstract>
            <title>First title</title>
            <sec>
              <title>Graphical abstract</title>
              <fig id="ufig1" position="float" fig-type="figure" orientation="portrait">
                <graphic href="222794v2_ufig1" position="float" orientation="portrait" />
              </fig>
            </sec>
          </abstract>`);

        expect(abstract).toStrictEqual(expect.not.stringContaining('Graphical abstract'));
      });

      it('strips <section> elements that are empty or only contain whitespace', () => {
        const abstract = extractAbstractFromFrontMatter(`
          <abstract>
            <sec>
              <fig id="ufig1" position="float" fig-type="figure" orientation="portrait">
                <graphic href="222794v2_ufig1" position="float" orientation="portrait" />
              </fig>
            </sec>
          </abstract>`);

        expect(abstract).toStrictEqual(O.some(expect.not.stringContaining('<section>')));
        expect(abstract).toStrictEqual(O.some(expect.not.stringContaining('</section>')));
      });

      it('doesn\'t strip <section> elements that are not empty', () => {
        const abstract = extractAbstractFromFrontMatter(`
          <abstract>
            <sec>
              Lorem ipsum
            </sec>
          </abstract>`);

        expect(abstract).toStrictEqual(O.some(expect.stringContaining('<section>')));
        expect(abstract).toStrictEqual(O.some(expect.stringContaining('Lorem ipsum')));
        expect(abstract).toStrictEqual(O.some(expect.stringContaining('</section>')));
      });
    });

    describe('parsing the authors', () => {
      const extractAuthorsFromFrontMatter = (partialResponse: string) => {
        const response = crossrefResponseWith(`
    <titles>
      <title>${arbitraryString()}</title>
    </titles>
    ${partialResponse}
  `);
        return pipe(
          buildExpressionFrontMatterFromCrossrefWork(response, dummyLogger, arbitraryExpressionDoi()),
          E.getOrElseW(abortTest('Failed to build expression front matter')),
          (frontMatter) => frontMatter.authors,
        );
      };

      describe('when there are no contributors', () => {
        it('returns none', async () => {
          const authors = extractAuthorsFromFrontMatter('');

          expect(authors).toStrictEqual(O.none);
        });
      });

      describe('when there are person contributors with a given name and a surname', () => {
        it('extracts authors from the XML response', async () => {
          const authors = extractAuthorsFromFrontMatter(`
          <contributors>
            <person_name contributor_role="author" sequence="first">
              <given_name>Eesha</given_name>
              <surname>Ross</surname>
            </person_name>
            <person_name contributor_role="author" sequence="additional">
              <given_name>Fergus</given_name>
              <surname>Fountain</surname>
            </person_name>
          </contributors>`);

          expect(authors).toStrictEqual(O.some(['Eesha Ross', 'Fergus Fountain']));
        });

        describe('when any part of the author name contains XML', () => {
          it('strips XML from the author names', async () => {
            const authors = extractAuthorsFromFrontMatter(`
          <contributors>
            <person_name contributor_role="author" sequence="first">
              <given_name><scp>Fergus</scp></given_name>
              <surname>Fo<scp>untain</scp></surname>
            </person_name>
          </contributors>`);

            expect(authors).toStrictEqual(O.some(['Fergus Fountain']));
          });
        });
      });

      describe('when there is a person author without a given name', () => {
        it('uses the surname', async () => {
          const authors = extractAuthorsFromFrontMatter(`
          <contributors>
            <person_name contributor_role="author" sequence="first">
              <surname>Ross</surname>
            </person_name>
          </contributors>`);

          expect(authors).toStrictEqual(O.some(['Ross']));
        });
      });

      describe('when there are both author and non-author contributors', () => {
        it('only includes authors', async () => {
          const authors = extractAuthorsFromFrontMatter(`
          <contributors>
            <person_name contributor_role="author" sequence="first">
              <given_name>Eesha</given_name>
              <surname>Ross</surname>
            </person_name>
            <person_name contributor_role="reviewer" sequence="additional">
              <given_name>Fergus</given_name>
              <surname>Fountain</surname>
            </person_name>
          </contributors>`);

          expect(authors).toStrictEqual(O.some(['Eesha Ross']));
        });
      });

      describe('when there is an organisational author', () => {
        it('uses the organisation\'s name', () => {
          const authors = extractAuthorsFromFrontMatter(`
          <contributors>
            <organization contributor_role="author" sequence="first">SEQC2 Oncopanel Sequencing Working Group</organization>
            <person_name contributor_role="author" sequence="additional">
              <given_name>Yifan</given_name>
              <surname>Zhang</surname>
              <ORCID>http://orcid.org/0000-0002-3677-6973</ORCID>
            </person_name>
          </contributors>
        `);

          expect(authors).toStrictEqual(O.some(['SEQC2 Oncopanel Sequencing Working Group', 'Yifan Zhang']));
        });
      });

      describe('when the mandatory surname is missing', () => {
        it('return O.none from getAuthors', () => {
          const authors = extractAuthorsFromFrontMatter(`
          <contributors>
            <person_name contributor_role="author" sequence="additional">
              <given_name>Yifan</given_name>
            </person_name>
          </contributors>
        `);

          expect(O.isSome(authors)).toBeFalsy();
        });
      });
    });

    describe('parsing the title', () => {
      const extractTitleFromFrontMatter = (partialResponse: string) => {
        const response = crossrefResponseWith(partialResponse);
        return pipe(
          buildExpressionFrontMatterFromCrossrefWork(response, dummyLogger, arbitraryExpressionDoi()),
          E.getOrElseW(abortTest('Failed to build expression front matter')),
          (frontMatter) => frontMatter.title,
        );
      };

      it('extracts a title from the XML response', async () => {
        const title = extractTitleFromFrontMatter(`
          <titles>
            <title>An article title</title>
          </titles>`);

        expect(title).toBe('An article title');
      });

      it('trims leading and trailing whitespace', () => {
        const title = extractTitleFromFrontMatter(`
          <titles>
            <title>
              An article title
            </title>
          </titles>`);

        expect(title).toBe('An article title');
      });

      it('returns on the left when no title present', async () => {
        const result = pipe(
          crossrefResponseWith(''),
          (response) => buildExpressionFrontMatterFromCrossrefWork(response, dummyLogger, arbitraryExpressionDoi()),
        );

        expect(result).toStrictEqual(E.left(DE.unavailable));
      });

      it('extracts a title containing inline HTML tags from the XML response', async () => {
        const title = extractTitleFromFrontMatter(`
          <titles>
            <title>An article title for <i>C. elegans</i></title>
          </titles>`);

        expect(title).toBe('An article title for <i>C. elegans</i>');
      });

      it('strips non html tags from the title', async () => {
        const title = extractTitleFromFrontMatter(`
          <titles>
            <title>An article title for <scp>C. elegans</scp></title>
          </titles>`);

        expect(title).toBe('An article title for C. elegans');
      });

      it('picks the first available title when multiple entries are present', async () => {
        const title = extractTitleFromFrontMatter(`
          <titles>
            <title>Airway recommendations for perioperative patients during the COVID-19 pandemic: a scoping review</title>
          </titles>
          <titles>
            <title>Recommandations pour la prise en charge des voies aériennes des patients périopératoires pendant la pandémie de COVID-19 : une étude de portée</title>
          </titles>
        `);

        expect(title).toBe('Airway recommendations for perioperative patients during the COVID-19 pandemic: a scoping review');
      });
    });

    describe('detecting unrecoverable errors', () => {
      describe('when the response does not contain a <crossref> tag', () => {
        const input = '<?xml version="1.0" encoding="UTF-8"?>\n<doi_records>\r\n  <doi_record>\r\n      </doi_record>\r\n</doi_records>';

        it('returns on the left', () => {
          const result = buildExpressionFrontMatterFromCrossrefWork(input, dummyLogger, arbitraryExpressionDoi());

          expect(result).toStrictEqual(E.left(expect.anything()));
        });
      });

      describe('when the response contains a <crossref> tag with its only child an <error> tag', () => {
        const input = '<?xml version="1.0" encoding="UTF-8"?>\n<doi_records>\r\n  <doi_record>\r\n    <crossref>\r\n      <error>doi:10.21203/rs.3.rs-3869684/v1</error>\r\n    </crossref>\r\n  </doi_record>\r\n</doi_records>';

        it('returns on the left', () => {
          const result = buildExpressionFrontMatterFromCrossrefWork(input, dummyLogger, arbitraryExpressionDoi());

          expect(result).toStrictEqual(E.left(expect.anything()));
        });
      });
    });

    describe('given an empty input', () => {
      const input = '';

      it('returns on the left', () => {
        const result = buildExpressionFrontMatterFromCrossrefWork(input, dummyLogger, arbitraryExpressionDoi());

        expect(result).toStrictEqual(E.left(expect.anything()));
      });
    });
  });
});
