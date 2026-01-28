import { prisma } from "../../lib/prisma.js";
import { z } from "zod";
export async function createTask(req: any, res: any): Promise<void> {
    try {
        const { title, description, assignedTo, customerId, status } = req.body;
        if (!title || !assignedTo || !customerId) {
            return res.status(400).json({ message: "title, assignedTo and customerId are required" });
        }
        const employee = await prisma.user.findUnique({ where: { id: assignedTo } });
        if (!employee || employee.role !== "EMPLOYEE") {
            return res.status(404).json({ message: "Assigned employee not found" });
        }

        const customer = await prisma.customer.findUnique({ where: { id: customerId } });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const allowedStatuses = ["PENDING", "IN_PROGRESS", "DONE"];
        const finalStatus = allowedStatuses.includes(status) ? status : "PENDING";
        const task = await prisma.task.create({
            data: {
                title,
                description,
                assignedToId: assignedTo,
                customerId,
                status: finalStatus,
            },
        });

        res.status(201).json(task);
    } catch (error : any) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}

const getTasks = async (req: any, res: any) => {
    try {
        const user = req.user;

        const tasks = await prisma.task.findMany({
            where: user.role === "ADMIN" ? {} : { assignedToId: user.userId },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateTaskStatusSchema = z.object({
    status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]),
});

const updateTaskStatus = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const parsed = updateTaskStatusSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.format() });
        }

        const task = await prisma.task.findUnique({
            where: { id: id },
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (user.role !== "ADMIN" && task.assignedToId !== user.userId) {
            return res.status(403).json({ message: "Forbidden: You cannot update this task" });
        }

        const updatedTask = await prisma.task.update({
            where: { id: id },
            data: { status: parsed.data.status },
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export  { getTasks, updateTaskStatus };