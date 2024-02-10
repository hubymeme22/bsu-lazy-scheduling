import { Router, Request, Response } from "express";
// import { adminAuthChecker, authChecker } from "../middlewares/auth-check";
import usersRoute from './users';
import facultiesRoute from './faculties';
import schedulesRoute from './schedules';
import detailsRoute from './details';
import formdetails from './form';

const router = Router();

// router.use('/details', authChecker, detailsRoute);
// router.use('/faculties', authChecker, facultiesRoute);
// router.use('/schedules', authChecker, schedulesRoute);
// router.use('/users', adminAuthChecker, usersRoute);

router.use('/details', detailsRoute);
router.use('/faculties', facultiesRoute);
router.use('/form-details', formdetails);
router.use('/schedules', schedulesRoute);
router.use('/users', usersRoute);

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API route working'
  });
});

export default router;