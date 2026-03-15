import prisma from "../config/prissma";

export const createApplication = async (body: any, userId: string) =>{
    const result = await prisma.application.create({
        data: {...body, userId}
    });
    return result;
}