/* eslint-disable import/prefer-default-export */
// import Articles from '../services/articles';
import Models from '../models';

const { Articles } = Models;

/**
  * controller for creating comments
  *
  * @function
  *
  * @param {request} request - express request object
  *
  * @return {Object} - callback that execute the controller
  */
export const createComment = async (request) => {
  const { article } = request.params;
  const { id: userId } = request.user || {};
  const comment = { ...request.body, ...(userId && { userId }) };

  const articleData = await Articles.createComment({ article, comment });

  return { status: 201, data: articleData, message: 'comment added succesfully' };
};
