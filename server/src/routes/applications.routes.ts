import * as applications from '../controllers/applications.controllers'
import {Router} from 'express';
import { authorization } from '../middleware/authorization';

const routes = Router();

routes.use(authorization);

routes.post("/applications",  applications.createApplication);

routes.get('/applications', applications.getApplications);

routes.get('/applications/:id', applications.getApplicationById);

routes.put('/applications/:id', applications.updateApplication);

routes.delete('/applications/:id', applications.deleteApplication);



export default routes;