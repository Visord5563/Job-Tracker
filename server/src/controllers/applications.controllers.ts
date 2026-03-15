import type { Request, Response } from "express";
import * as services from '../services/applications.services'
export const createApplication = async (req: Request, res: Response)=> {
    try {
        const body = req.body;
        const userId = req.user.id;
        if (!body.company || !body.role || !body.status || !body.appliedAt) {
            res.status(400).json({ message: "missing required fields" });
            return;
        }
        const result = await services.createApplication(body, userId);
        res.status(201).json(result);
    }catch (error: any){
        res.status(500).json(error);
    }
};