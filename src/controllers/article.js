import Models from '../models';

const { Articles } = Models;

export default {
  /**
    * controller for creating comments
    *
    * @function
    *
    * @param {request} request - express request object
    *
    * @return {Object} - callback that execute the controller
    */
  createComment: async (request) => {
    const { articleId } = request.params;
    const { id: userId } = request.user || {};
    /* TODO - Miracle: Remove optional property when authentication feature is done */
    const comment = { ...request.body, ...(userId && { userId }) };

    const articleData = await Articles.createComment({ articleId, comment });

    return { status: 201, data: articleData, message: 'comment added succesfully' };
  }
};
