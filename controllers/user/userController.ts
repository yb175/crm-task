import { prisma } from "../../lib/prisma.js";

const getAllUsers = async (req: any, res: any) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getUserById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateUserRole = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["ADMIN", "EMPLOYEE"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
        });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (error: any) {
        if (error.code === "P2025") {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export default { getAllUsers, getUserById, updateUserRole };