import express from 'express';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res) => {
    res.json({
        environment: process.env.ENVIRONMENT,
        port: process.env.PORT
    });
});

export default router;
