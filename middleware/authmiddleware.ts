import jwt from "jsonwebtoken";

export default function authMiddleware(req: any, res: any, next: any): void {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
