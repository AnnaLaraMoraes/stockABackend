import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import middleware from '../middleware/index';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();

    this.routes();
  }

  /**
   * Apply middlewares to the server.
   */
  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(middleware.decodeToken);
  }

  /**
   * Apply routes to the server and handle routes errors.
   */
  routes() {
    this.server.disable('x-powered-by');
    this.server.use('/api', routes);
    this.server.use(() => {
      console.log('Oops, route not found!', 404);
    });
    this.server.use((error, req, res, next) => {
      console.log('error:', error);
      if (res.headerSent) {
        return next(error);
      }

      const status = 'ERROR';

      if (error) {
        return res.status(error.statusCode).json({
          message: error.message,
          status,
        });
      }

      console.error(error);

      return res.status(500).json({
        message: 'Internal server error',
        status,
      });
    });
  }
}

export default new App().server;
