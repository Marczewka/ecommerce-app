import type { UserRes } from "../../shared/dtos.ts";
import { User } from "./db/schema";

declare global {
    namespace Express {
        interface Request {
            user?: UserRes | null;
        }
    }
}

export {};
