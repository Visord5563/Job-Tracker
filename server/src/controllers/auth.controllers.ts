import type { Request, Response } from 'express';
import * as authservices from '../services/auth.services';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "invalid format" });
            return;
        }

        await authservices.register(name, email, password);
        res.status(201).json({ message: "user created" });

    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("here", email, password);
            res.status(400).json({ message: "invalid format" });
            return;
        }

        const token = await authservices.login(email, password);
        res.cookie("token", token);
        res.status(200).json({ token });

    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
