import { User } from "./db/schema";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                username: string;
                role: string;
            } | null;
        }
    }
}

export {};
