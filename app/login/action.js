"use server";

import { createSession } from "../(lib)/sessions";
import prisma from "../(lib)/prisma";

export default async function loginAction({ email, password }) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (user == null) {
            throw new Error("account doesn't exist, please register");
        } else {
            if (password == user.password) {
                const session = await createSession({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    gender: user.gender,
                });
                if (session.success) {
                    return { ...session };
                } else {
                    throw new Error(session.message);
                }
            } else {
                throw new Error("invalid username or password");
            }
        }
    } catch (err) {
        console.log(err);
        return { message: err.message, success: false };
    }
}
