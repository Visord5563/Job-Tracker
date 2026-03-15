import * as applications from '../controllers/applications.controllers'
import {Router} from 'express';
import { authorization } from '../middleware/authorization';

const routes = Router();

routes.use(authorization);

routes.post("/applications",  applications.createApplication)

export default routes;