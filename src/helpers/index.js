import makeCapitalize from './makeCapitalize';
import { ApplicationError, NotFoundError } from './errors';
import genericArticle from './genericArticleHelper';

const { filter, extractArticles } = genericArticle;

export { filter, extractArticles };

export default {
  makeCapitalize,
  ApplicationError,
  NotFoundError
};
