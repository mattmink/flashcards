import { Client } from "fauna";

const defaultSecret = import.meta.env.VITE_FAUNA_GUEST_KEY;
let client = new Client({ secret: JSON.parse(localStorage.getItem('auth')) || defaultSecret });

export function query(queryValue) {
    return client.query(queryValue);
}

export function setAuth(secret) {
    client = new Client({ secret });
    localStorage.setItem('auth', JSON.stringify(secret))
}

export function clearAuth(secret) {
    client = new Client({ secret: defaultSecret });
    localStorage.removeItem('auth')
}
