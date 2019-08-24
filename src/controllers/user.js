import Model from '../models';
import * as helpers from '../helpers';

const { Users, Followers, Categories } = Model;
const {
  ApplicationError, NotFoundError, paginator, isEmptyObject
} = helpers;

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

    if (isEmptyObject(payload)) {
      throw new ApplicationError(400, 'Request body cannot be empty');
    }

    if (request.user.id !== id) {
      throw new ApplicationError(403, 'Unauthorized update');
    }

    const [, affectedRows] = await Users.update(
      { ...payload },
      { where: { id }, returning: true, raw: true }
    );

    delete affectedRows[0].password;

    return response
      .status(200)
      .json({ status: 'success', data: affectedRows[0], message: 'Profile updated successfully' });
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
  getProfile: async (request, response) => {
    const { params: { id } } = request;
    const existingUser = await Users.findOne({ where: { id }, raw: true });

    if (!existingUser) {
      throw new NotFoundError('User does not exist');
    }

    delete existingUser.password;

    return response
      .status(200)
      .json({ status: 'success', data: existingUser, message: 'Profile fetched successfully' });
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
      params: { userId: followerId },
      user: { id: userId }
    } = request;

    const userToBeFollowedOrUnfollowed = await Users.findOne({ where: { id: followerId } });

    if (!userToBeFollowedOrUnfollowed) throw new NotFoundError('User does not exist');
    if (userId === userToBeFollowedOrUnfollowed.id) {
      throw new ApplicationError(409, 'User cannot perform this action');
    }

    const { firstName, lastName } = userToBeFollowedOrUnfollowed;

    let followerData = await Followers.findOne({
      where: {
        followeeId: userToBeFollowedOrUnfollowed.id,
        followerId: userId
      }
    });

    if (!followerData) {
      followerData = await Followers.create({
        followerId: userId,
        followeeId: userToBeFollowedOrUnfollowed.id
      });
    } else {
      followerData = await followerData.update({ active: !followerData.active, returning: true });
    }

    return response.status(200).json({
      status: 'success',
      data: followerData.toJSON(),
      message: `${firstName} ${lastName} ${
        followerData.active ? 'unfollowed' : 'followed'
      } successfully`,
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
      data,
      count,
      page: +page,
      limit: +limit,
      message: 'Followers fetched succesfully',
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
      dataSource: Users.getUserFollowing,
      dataToSource: { user: userId }
    });

    return response.status(200).json({
      status: 'success',
      data,
      count,
      page: +page,
      limit: +limit,
      message: 'Followings fetched successfully'
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
      message: `${categories.join(', ')} subscribed to successfully`
    });
  },
};
