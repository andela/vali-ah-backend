import errorhandler from 'errorhandler';
import express, { json, urlencoded } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import Debug from 'debug';
import routes from './routes';

config();

const debug = Debug('dev');

const { PORT } = process.env;
const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());
app.use('/api/v1', routes);

app.get('/', (request, response) => {
  response.status(200).send('1kbIdeas');
});

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  app.use(errorhandler());
}

// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res) => {
    debug(err.stack);
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

app.use('*', (request, response) => {
  response.status(404).send('Not Found');
});
app.listen(PORT, () => debug(`Server started on port ${PORT}`));

export default app;
