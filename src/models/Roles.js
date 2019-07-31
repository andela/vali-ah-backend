import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Roles category
 *
 * @class
 *
 * @extends Model
 *
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
   * initializes the Roles model
   *
   * @static
   * @memberof Roles
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the Roles model
   */
  static init(sequelize) {
    const model = super.init(Roles.modelFields, { sequelize });

    return model;
  }

  /**
   * model association
   *
   * @static
   * @memberof Roles
   *
   * @param {Object} models the models object
   *
   * @returns {object} the model
   */
  static associate() {

  }
}
