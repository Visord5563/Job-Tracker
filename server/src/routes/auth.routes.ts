import * as authcontrollers from '../controllers/auth.controllers';
import {Router} from 'express';

const  routes = Router()

routes.post('/auth/register', authcontrollers.register);
routes.post('/auth/login', authcontrollers.login);
routes.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "logged out" });
});


export default routes;