import Model from '../models';

const { Users } = Model;

export default {
  /**
* Generic update profile
* @function
*
* @param {Object} request - express request object
* @param {Object} response - express response object
*
* @return {Object} - callback that execute the controller
*/
  updateProfile: async (request, response) => {
    const {
      params: { id },
      body: payload
    } = request;

    if (request.user.id !== id) return response.status(401).json({ status: 'error', message: ' Unauthorized update' });

    const [, affectedRows] = await Users.update(
      { ...payload },
      { where: { id }, returning: true, raw: true }
    );

    delete affectedRows[0].password;

    return response.status(200).json({ status: 'success', message: 'Successfully updated', data: affectedRows[0] });
  },

  /**
   * Generic update profile
   *
   * @function
   *
   * @param {Object} request - express request object
   * @param {Object} response - express response object
   *
   * @return {Object} - callback that execute the controller
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

    return response.status(200).json({ status: 'success', message: 'Request was successful', data: existingUser });
  }
};
