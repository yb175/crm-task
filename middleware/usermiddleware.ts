import jwt from "jsonwebtoken";

export default function userMiddleware(req: any, res: any, next: any): void {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        if (typeof decoded === "object" && "role" in decoded) {
            req.user = decoded;
            next();
        } else {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}