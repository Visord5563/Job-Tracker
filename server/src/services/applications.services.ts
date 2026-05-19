import prisma from "../config/prissma";


export const createApplication = async (body: any, userId: string) => {
    const result = await prisma.application.create({
        data: {
            ...body,
            appliedAt: new Date(body.appliedAt),
            deadline: body.deadline ? new Date(body.deadline) : undefined,
            userId
        }
    });
    return result;
};

export const getApplications = async (userId: string) => {
    const result = await prisma.application.findMany({
        where: {userId: userId}
    });
    return result;
};

export const getApplicationById = async (id: string, userId: string) => {
    const result = await prisma.application.findFirst({
        where: { id, userId }
    });
    return result;
};

export const updateApplication = async (id: string, userId: string, body: any) => {
    const result = await prisma.application.updateMany({
        where: { id, userId },
        data: body
    });
    return result;
};

export const deleteApplication = async (id: string, userId: string) => {
    await prisma.application.deleteMany({
        where: { id, userId }
    });
};