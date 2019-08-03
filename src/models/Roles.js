import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Roles
 *
 * @class
 *
 * @extends Model
 * @exports Roles
 */
export default class Roles extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING
  }

  /**
   * Initializes the Roles model
   *
   * @static
   * @memberof Roles
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the Roles model
   */
  static init(sequelize) {
    const model = super.init(Roles.modelFields, { sequelize });

    return model;
  }
}
