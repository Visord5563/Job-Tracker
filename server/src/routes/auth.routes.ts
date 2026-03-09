import * as authcontrollers from '../controllers/auth.controllers';
import {Router} from 'express';

const  routes = Router()

routes.post('/auth/register', authcontrollers.register);
routes.post('/auth/login', authcontrollers.login);

export default routes;