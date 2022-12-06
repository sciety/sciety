import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded } from '../../src/domain-events';
import { constructCommand } from '../../src/policies/add-article-to-evaluated-articles-list';
import * as Gid from '../../src/types/group-id';
import * as Lid from '../../src/types/list-id';
import { dummyLogger } from '../dummy-logger';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('add-article-to-evaluated-articles-list', () => {
  describe('when the group has an evaluated articles list', () => {
    const articleId = arbitraryArticleId();
    const listId = Lid.fromValidatedString('f8459240-f79c-4bb2-bb55-b43eae25e4f6');
    const groupId = Gid.fromValidatedString('bc1f956b-12e8-4f5c-aadc-70f91347bd18');

    const ports = {
      logger: dummyLogger,
      commitEvents: shouldNotBeCalled,
      getAllEvents: shouldNotBeCalled,
    };

    const command = pipe(
      evaluationRecorded(groupId, articleId, arbitraryReviewId()),
      constructCommand(ports),
    );

    it('returns a command', () => {
      expect(command).toStrictEqual(E.right({
        articleId,
        listId,
      }));
    });
  });

  describe('when the group does not have an evaluated articles list', () => {
    it.todo('returns nothing to do');
  });
});
