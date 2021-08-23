import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

import swaggerUi from 'swagger-ui-express';

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as CookieStrategy } from 'passport-cookie';

const swaggerDoc = require('./swagger.json');

import { v1Router } from './infra/api/http/v1';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:8080', 'app://.'],
    credentials: true,
  }),
);
app.use(helmet());
app.use(cookieParser());

app.use(passport.initialize());

passport.use(
  new LocalStrategy(
    { passwordField: 'password', usernameField: 'account' },
    (username, _, done) => {
      done(null, username);
    },
  ),
);

passport.use(
  new CookieStrategy((token, done) => {
    try {
      const user = jwt.verify(token, '123') as {
        userId: string;
        email: string;
      };

      done(null, user);
    } catch (err) {
      done(null, false);
    }
  }),
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1', v1Router);

app.listen(process.env.SERVER_PORT || 3001, () =>
  console.log('server running'),
);
