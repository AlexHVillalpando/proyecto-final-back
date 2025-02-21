import CryptoJS from "crypto-js";
import { envs } from "./env";

const secretKey = envs.CRYPTO_SECRETKEY

// Función para encriptar
export const encryptData = (data: string) => {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
};

// Función para descifrar
export const decryptData = (encryptedData: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

