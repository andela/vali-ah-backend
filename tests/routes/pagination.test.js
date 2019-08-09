import chai, { should } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../src/index';
import Models from '../../src/models/index';

const { Articles, ArticleCategories } = Models;

chai.use(chaiHttp);
should();


describe('Pagination support for articles', () => {
  it('should return page must be a number', async () => {
    const response = await chai.request(app).get('/api/v1/articles?page=&limit=3');

    response.should.have.status(400);
    response.body.error.errors.page.should.eql('Page must be a number');
  });

  it('should return limit must be a number', async () => {
    const response = await chai.request(app).get('/api/v1/articles?page=1&limit=m');

    response.should.have.status(400);
    response.body.error.errors.limit.should.eql('Limit must be a number');
  });

  it('should return request successfull', async () => {
    const response = await chai.request(app).get('/api/v1/articles?page=1&limit=5');

    response.should.have.status(200);
    response.body.message.should.eql('Articles retrieved successfully');
  });

  it('should return page number does not exist', async () => {
    const response = await chai.request(app).get('/api/v1/articles?page=10000&limit=5');

    response.should.have.status(404);
    response.body.error.message.should.eql('Page does not exist');
  });

  it('should return no articles found', async () => {
    await Articles.destroy({ where: {} });
    await ArticleCategories.destroy({ where: {} });

    const response = await chai.request(app).get('/api/v1/articles?page=1&limit=5');

    response.should.have.status(404);
    response.body.error.message.should.eql('No articles found');
  });
});
