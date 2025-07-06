import crypto from "crypto";

function genPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha512').toString('hex'); // 32 bytes
    return { salt, hash };
}

function verifyPassword(password, hash, salt) {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha512').toString('hex'); // 32 bytes
    return hash === hashVerify;
}
export { genPassword, verifyPassword };
