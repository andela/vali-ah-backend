import { Sequelize, Model } from 'sequelize';

/**
 * Model class for Categories
 *
 * @class
 *
 * @extends Model
 * @exports Categories
 */
export default class Categories extends Model {
  static modelFields = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    category: Sequelize.STRING,
    description: Sequelize.STRING
  };

  /**
   * Initializes the Categories model
   *
   * @static
   * @memberof Categories
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {Object} the Categories model
   */
  static init(sequelize) {
    const model = super.init(Categories.modelFields, { sequelize });

    return model;
  }

  /**
   * Model associations
   *
   * @static
   * @memberof Categories
   *
   * @param {any} models all models
   *
   * @returns {void} no return
   */
  static associate(models) {
    Categories.belongsToMany(models.Articles, {
      as: 'article',
      through: 'ArticleCategories',
      foreignKey: 'articleId',
      otherKey: 'categoryId',
      onDelete: 'CASCADE'
    });
  }

  /**
 * checks tags and returns those in database
 *
 * @function
 *
 * @param {Array} tag - tag to validate
 *
 * @returns {Array} - returns array of tags present in database
 */
  static async checkTagsExistence(tag) {
    const availableCategory = await Categories.findAll({
      where: { id: tag }
    });
    return availableCategory;
  }
}
