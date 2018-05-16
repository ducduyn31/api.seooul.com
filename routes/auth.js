import express from 'express';

import register from '../auth/register.controller';
import signIn from '../auth/signin.controller';
import Response from "../fancy-response/response";

const router = express.Router();

import accessLevel from '../auth/checkPermissions.middleware';

/** GET /auth/test */
router.route('/test').get((req, res) => {
    let r = new Response(200);
    res.json(r);
});

/** POST /auth/register */
router.route('/register').post(register);

/** POST /auth/signin */
router.route('/signin').post(signIn, accessLevel(2, false));

export default router;
