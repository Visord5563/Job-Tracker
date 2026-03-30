import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';


export const authorization = (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token)
        {
            throw new Error("unautorised");
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }
        req.user = { id: decoded.id };
        next();
    }catch (error: any){
        
        res.status(401).json({message: "unautorised"})
        return;
    }
};

