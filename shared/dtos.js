import { z } from "zod";
export const UserRegisterSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username has to be at least 3 characters long")
        .max(20, "Username has to be at most 20 characters long"),
    password: z
        .string()
        .min(8, "Password has to be at least 8 characters long")
        .max(20, "Password has to be at most 20 characters long")
        .regex(/[A-Z]/, "Password has to contain at least one uppercase letter"),
});
export const USER_ROLES = ["admin", "client"];
//# sourceMappingURL=dtos.js.map