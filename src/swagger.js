import path from 'path';

const routesPath = path.resolve(__dirname, 'routes/*.js');

const config = {
  info: {
    title: '1kbIdeas',
    version: '1.0.0', // Version (required)
    description: 'The one-stop shop for all the self-help ideas you need',
    termsOfService: '',
    contact: {
      email: ''
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
    }
  },
  basePath: '/api/v1',
  apis: [routesPath]
};

module.exports = config;
