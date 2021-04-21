import express from 'express';
import passport from 'passport';

import { makeMigrationController } from '../../useCases/makeMigration';

const migrationRouter = express.Router();

migrationRouter.post(
  '/',
  passport.authenticate('cookie', { session: false }),
  (req, res) => makeMigrationController.execute(req, res),
);

export { migrationRouter };
