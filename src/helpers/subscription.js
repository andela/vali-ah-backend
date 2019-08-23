import { ApplicationError } from '.';
import models from '../models';

const { Categories } = models;

export default async (categories) => {
  if (!categories.length) {
    throw new ApplicationError(400, 'Categories array cannot be empty');
  }

  const data = await Categories.findAll({ attributes: ['category'], raw: true });
  const tags = data.map(d => d.category.toLowerCase());

  const stringifiedValues = JSON.stringify(categories).toLowerCase();
  const categoriesArray = JSON.parse(stringifiedValues);

  const checkCategories = categoriesArray.filter(category => !tags.includes(category));

  if (checkCategories.length) {
    throw new ApplicationError(
      400,
      `${checkCategories.length === 1 ? 'Category' : 'Categories'} '${checkCategories.join(
        "', '"
      )}' not supported`
    );
  }

  return categoriesArray;
};
