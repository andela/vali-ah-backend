import Models from '../models';
import { NotFoundError } from '../helpers/errors';
import notification from '../services/notification';

const { Comments, CommentVotes } = Models;

export default {
  /**
   * controller for up voting and down voting articles
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @return {Object} - callback that execute the controller
   */
  voteComment: async (request, response) => {
    const { voteType } = request.body;
    const { commentId } = request.params;
    const { id: userId } = request.user;

    let responseData = {};
    let created;

    const comment = await Comments.findOne({ where: { id: commentId, suspended: false } });

    if (!comment) throw new NotFoundError('Comment does not exist or has been suspended');

    if (voteType === 'nullVote') {
      await CommentVotes.destroy({ where: { userId, commentId } });
      responseData = { data: {}, message: 'Vote removed successfully' };
    } else {
      let data;
      const vote = voteType === 'upVote';

      ({ created, data } = await CommentVotes.upsertCommentVotes({ commentId, userId, vote }));

      notification.emit('articleVoted', { commentId, userId, vote });

      responseData = {
        data,
        message: `Comment ${vote ? 'upvoted' : 'downvoted'} successfully`
      };
    }

    const suspended = await comment.suspendComment();
    if (suspended) notification.emit('commentSuspended', { commentId });

    const status = created ? 201 : 200;

    return response.status(status).json({
      status: 'success',
      ...responseData
    });
  }
};
