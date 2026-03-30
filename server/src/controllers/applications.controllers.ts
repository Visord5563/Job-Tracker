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

export const getApplications = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const result = await services.getApplications(userId);
        res.status(200).json(result);
    }
    catch (error: any){
        res.status(500).json(error);
    }
};

export const getApplicationById = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const result = await services.getApplicationById(id, userId);
        if (!result) {
            res.status(404).json({ message: "application not found" });
            return;
        }
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(error);
    }
};

export const updateApplication = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const body = req.body;
        const result = await services.updateApplication(id, userId, body);
        if (!result) {
            res.status(404).json({ message: "application not found" });
            return;
        }
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(error);
    }
};

export const deleteApplication = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await services.deleteApplication(id, userId);
        res.status(200).json({ message: "application deleted" });
    } catch (error: any) {
        res.status(500).json(error);
    }
};