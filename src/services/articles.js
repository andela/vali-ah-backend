import Models from '../models';
import { NotFoundError } from '../helpers/errors';

const { Articles } = Models;

/**
 * Class used for all email related notifications
 *
 * @class
 *
 * @extends EventEmitter
 * @exports Notification – A notification instance to ensure singleton pattern
 * @description handles all notification related activites. supported activity type are
 */
class ArticlesService {
  /**
   * Create a Notification.
   * @description initialises the service
   */
  constructor() {
    this.model = Articles;
  }

  /**
   * create a comment for an article
   *
   * @param {Object} data - The event payload. Contains notification type and payload.
   * @param {String} data.article - article to comment on
   * @param {String} data.comment - comment data
   *
   * @return {Object | void} - details of comment data
   */
  async createComment({ article, comment }) {
    const articleObject = await this.model.findByPk(article);

    if (articleObject) return articleObject.createComment(comment);

    throw new NotFoundError();
  }
}

export default new ArticlesService();
