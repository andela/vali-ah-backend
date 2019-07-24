import express, { json, urlencoded } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import Debug from 'debug';

import routes from './routes';

config();

const debug = Debug('dev');
const { PORT, NODE_ENV } = process.env;
const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());

app.use('/api/v1', routes);

app.get('/', (request, response) => {
  response.status(200).send('1kbIdeas');
});

const isProduction = NODE_ENV === 'production';

if (!isProduction) {
  // will print stacktrace
  app.use((err, request, response) => {
    debug(err.stack);
    response.status(err.status || 500);
    response.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

if (isProduction) {
  // no stack trace leaked to user
  app.use((err, request, response) => {
    response.status(err.status || 500);
    response.json({
      errors: {
        message: err.message,
        error: {}
      }
    });
  });
}

app.use('*', (request, response) => {
  response.status(404).send('Not Found');
});
app.listen(PORT, () => debug(`Server started on port ${PORT}`));

export default app;
