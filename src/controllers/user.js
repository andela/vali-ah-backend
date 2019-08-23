import Model from '../models';
import * as helpers from '../helpers';

const {
  Users, Followers, Categories, Bookmarks
} = Model;
const { ApplicationError, NotFoundError, paginator } = helpers;

export default {
  /**
   * Controller to update a users profile
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @returns {Object} - response after executing the controller
   */
  updateProfile: async (request, response) => {
    const {
      params: { id },
      body: payload
    } = request;

    if (request.user.id !== id) {
      return response.status(401).json({ status: 'error', message: ' Unauthorized update' });
    }

    const [, affectedRows] = await Users.update(
      { ...payload },
      { where: { id }, returning: true, raw: true }
    );

    delete affectedRows[0].password;

    return response
      .status(200)
      .json({ status: 'success', message: 'Successfully updated', data: affectedRows[0] });
  },

  /**
   * Controller to view a user profile
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @returns {Object} - response after executing the controller
   */
  viewProfile: async (request, response) => {
    const {
      params: { id }
    } = request;

    const existingUser = await Users.findOne({ where: { id }, raw: true });

    if (!existingUser) {
      return response.status(404).json({ status: 'error', message: 'User does not exist' });
    }

    delete existingUser.password;

    return response
      .status(200)
      .json({ status: 'success', message: 'Request was successful', data: existingUser });
  },

  /**
   * Controller that enables a user to follow and unfollow another user
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @returns {Object} - response after executing the controller
   */
  followAndUnfollow: async (request, response) => {
    const {
      params: { userId },
      user: { id }
    } = request;

    const userThatWantsToFollowOrUnfollow = id;
    const userToBeFollowedOrUnfollowed = await Users.findOne({ where: { id: userId } });

    if (!userToBeFollowedOrUnfollowed) throw new NotFoundError('User not found');
    if (userThatWantsToFollowOrUnfollow === userToBeFollowedOrUnfollowed.id) {
      throw new ApplicationError(409, 'User cannot perform this action');
    }

    const { firstName, lastName } = userToBeFollowedOrUnfollowed;

    let followerData = await Followers.findOne({
      where: {
        followeeId: userToBeFollowedOrUnfollowed.id,
        followerId: userThatWantsToFollowOrUnfollow
      }
    });

    if (!followerData) {
      followerData = await Followers.create({
        followerId: userThatWantsToFollowOrUnfollow,
        followeeId: userToBeFollowedOrUnfollowed.id
      });
    } else {
      followerData = await followerData.update({ active: !followerData.active, returning: true });
    }

    return response.status(200).json({
      status: 'success',
      message: `Successfully ${
        followerData.active ? 'unfollowed' : 'followed'
      } ${firstName} ${lastName}`,
      data: followerData.toJSON()
    });
  },

  /**
   * Controller to get all followers of a user
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @returns {Object} - response after executing the controller
   */
  getAllFollowers: async (request, response) => {
    const {
      query: { page = 1, limit = 10 },
      params: { userId }
    } = request;

    const { data, count } = await paginator(null, {
      page,
      limit,
      dataSource: Users.getUserFollowers,
      dataToSource: { user: userId }
    });

    return response.status(200).json({
      status: 'success',
      message: 'Request successful',
      data,
      count,
      page
    });
  },

  /**
   * Get all following of a user
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @returns {Object} - response after executing the controller
   */
  getAllFollowings: async (request, response) => {
    const {
      query: { page = 1, limit = 10 },
      params: { userId }
    } = request;

    const { data, count } = await paginator(null, {
      page,
      limit,
      dataSource: Users.getUserFollowings,
      dataToSource: { user: userId }
    });

    return response.status(200).json({
      status: 'success',
      data,
      count,
      page,
      message: 'Request successful'
    });
  },

  /**
   * Controller to create subscriptions for a user
   * A user can subscribe to different categories
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @returns {Object} - response object after executing the controller
   */
  createSubscriptions: async (request, response) => {
    const { categories } = request.body;
    const { id: userId } = request.user;
    const currentUser = await Users.findByPk(userId);

    const subscribedCategories = await Categories.findAll({
      where: { category: categories },
      attributes: ['id', 'category'],
      raw: true
    });

    const data = await currentUser.bulkUpsertSubscriptions(subscribedCategories);

    return response.status(200).json({
      status: 'success',
      data,
      message: `Successfully subscribed to ${categories.join(', ')}`
    });
  },

  /**
   * Controller for getting all bookmarks for a user
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @returns {Object} - all bookmark for a user
   */
  getAllBookmark: async (request, response) => {
    const { id: userId, limit = 10, page = 1 } = request.user;

    const { data, count } = await paginator(Bookmarks, { where: { userId }, page, limit });

    return response.status(200).json({
      status: 'success',
      data,
      page,
      count
    });
  }
};
