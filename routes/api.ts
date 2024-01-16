import { Router, Request, Response } from "express";
import usersRoute from './users';
import facultiesRoute from './faculties';
import schedulesRoute from './schedules';
import detailsRoute from './details';

const router = Router();

router.use('/details', detailsRoute);
router.use('/faculties', facultiesRoute);
router.use('/schedules',  schedulesRoute);
router.use('/users', usersRoute);

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API route working'
  });
});

export default router;