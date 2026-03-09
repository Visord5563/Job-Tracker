import prisma from "../config/prissma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (name: string, email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        return user;
    } catch (error) {
            throw new Error("cannot create user");
    }
};


export const login = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error("invalid credentials");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    return token;
};