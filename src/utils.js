import { dirname } from "path";
import { fileURLToPath } from "url";
export const __dirname = dirname(fileURLToPath(import.meta.url));


export function toCapital(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}