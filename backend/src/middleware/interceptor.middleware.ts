import type { Request, Response, NextFunction } from "express";

export const interceptor = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    console.error(err);
    if (err?.cause?.code === "23503") {
        return res.status(400).json({
            message: err.cause.detail,
        });
    }
    res.status(500).json({ message: "Internal server error" });
};
