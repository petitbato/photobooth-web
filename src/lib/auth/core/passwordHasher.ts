import crypto from 'crypto'

export function hashPassword(password: string, salt: string) {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password.normalize(), salt, 64, (err, hash) => {
          if (err) reject(err);
            resolve(hash.toString('hex'));
        });
    });
}

export function generateSalt() {
    return crypto.randomBytes(16).toString('hex').normalize();
}

export async function comparePasswords(password: string, hashedPassword: string, salt: string) {
    const hash = await hashPassword(password, salt);
    return hash === hashedPassword;
}