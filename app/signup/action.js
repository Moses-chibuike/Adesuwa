"use server";
import prisma from "../(lib)/prisma";
import { createSession } from "../(lib)/sessions";

export default async function signUpAction({ name, gender, email, password }) {
    try {
        const emailExists = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (emailExists) {
            throw new Error("user with email already exists");
        }

        const usernameExists = await prisma.user.findUnique({
            where: {
                name: name,
            },
        });
        if (usernameExists) {
            throw new Error(
                "username already exists, please choose another name"
            );
        }

        const res = await prisma.user.create({
            data: {
                email,
                name,
                password,
                gender,
            },
        });

        if (res) {
            const session = await createSession({
                id: res.id,
                email: res.email,
                name: res.name,
                gender: res.gender,
            });
            if (session.success) {
                return { ...session };
            } else {
                throw new Error(session.message);
            }
        } else {
            throw new Error("an error occured");
        }
    } catch (err) {
        return { message: err.message, success: false };
    }
}
