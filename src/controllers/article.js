import Models from '../models';

const { Articles } = Models;

export default {
  /**
    * controller for creating comments
    *
    * @function
    *
    * @param {Object} request - express request object
    * @param {Object} response - express response object
    *
    * @return {Object} - callback that execute the controller
    */
  createComment: async (request, response) => {
    const { articleId } = request.params;
    const { id: userId } = request.user;

    const comment = { ...request.body, userId };

    const articleData = await Articles.createComment({ articleId, comment });

    return response.status(201).json({ status: 'success', data: articleData, message: 'Comment added succesfully' });
  }
};
