"use server";
import * as jose from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const alg = "HS256";

//defining cookie with option
const cookie = {
    name: "session",
    options: {
        secure: true,
        httpOnly: true,
        expires: Date.now() + 48 * 60 * 60 * 1000,
        path: "/",
        sameSite: "strict",
    },
};

//function to encrypt user and create token
export async function encrypt(user) {
    try {
        const jwt = await new jose.SignJWT({})
            .setProtectedHeader({ alg })
            .setSubject(user)
            .sign(secret);
        return jwt;
    } catch (err) {
        return false;
    }
}

//function to decrypt token and return payload
export async function decrypt(token) {
    try {
        const res = await jose.jwtVerify(token, secret, {});
        return { ...res.payload.sub, success: true };
    } catch (err) {
        return { message: "not authorized", success: false };
    }
}

//function to create a session i.e, creating cookie with token
export async function createSession(user) {
    const token = await encrypt(user);
    if (token) {
        cookies().set(cookie?.name, token, { ...cookie.options });
        return { message: "Login Sucessful", success: true };
    }
    return { message: "unable to login", success: false };
}

//function to verify the session, i.e, if user is loggedIn or not
export async function verifySession() {
    const token = cookies().get(cookie.name)?.value;
    if (token) {
        //const user = await decrypt(token);
        // if (user.success) {
        //     return true;
        // }
        return true;
    }
    return false;
}

//function to logout and redirect to login page
export async function deleteSession() {
    try {
        cookies().delete(cookie.name);
        return { message: "session deleted", success: true };
    } catch (err) {
        console.log(err);
        return { message: "an error occured", success: false };
    }
}
