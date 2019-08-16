import Model from '../models';
import paginator from '../helpers/paginator';
import { modelFieldsToLiteral } from '../helpers/models';

const { Articles, Users } = Model;

export default {
  /**
   * Get a list of all authors
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @return {Object} - list of all authors
   */
  getAllAuthors: async (request, response) => {
    const { limit = 10, page = 1 } = request.query;
    const fields = ['firstName', 'email', 'lastName', 'avatarUrl'];
    const queryObject = {
      attributes: ['authorId', ...modelFieldsToLiteral({ alias: 'authors', fields })],
      nest: false,
      group: ['authorId', 'authors.id'],
      include: [
        {
          model: Users,
          as: 'authors',
          attributes: []
        }
      ],
      limit,
      page
    };

    const authors = await paginator(Articles, queryObject);

    return response.status(200).json({ status: 'success', ...authors });
  }
};
