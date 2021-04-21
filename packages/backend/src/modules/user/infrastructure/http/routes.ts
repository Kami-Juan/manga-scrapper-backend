import express from 'express';
import passport from 'passport';

import { getStoreUserController } from '../../useCases/storeUser';
import { getLoginController } from '../../useCases/login';
import { getAllUsersController } from '../../useCases/getAllUsers';

const userRouter = express.Router();

userRouter.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res) => getLoginController.execute(req, res),
);
userRouter.post(
  '/',
  passport.authenticate('cookie', { session: false }),
  (req, res) => getStoreUserController.execute(req, res),
);
userRouter.get(
  '/',
  passport.authenticate('cookie', { session: false }),
  (req, res) => getAllUsersController.execute(req, res),
);
userRouter.get(
  '/logout',
  (req, res) => {
    req.logout();
    res.clearCookie('token');

    return res.sendStatus(200);
  },
);

export { userRouter };
