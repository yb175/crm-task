import { prisma } from "../../lib/prisma.js";
import { createCustomerSchema } from "../../utils/customerValidation.js";
import { updateCustomerSchema } from "../../utils/customerValidation.js";

const createCustomer = async (req: any, res: any) => {
    try {
        const parsed = createCustomerSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.format() });
        }

        const { name, email, phone } = parsed.data;

        const customer = await prisma.customer.create({
            data: {
                name,
                email,
                phone,
            },
        });

        res.status(201).json(customer);
    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(409).json({ message: "Duplicate entry: A customer with this email or phone already exists." });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

const getCustomers = async (req: any, res: any) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        if(limitNumber <= 0 || pageNumber <= 0) {
            return res.status(400).json({ message: "Page and limit must be positive integers." });
        }
        const totalRecords = await prisma.customer.count();
        const totalPages = Math.ceil(totalRecords / limitNumber);

        const customers = await prisma.customer.findMany({
            skip: (pageNumber - 1) * limitNumber,
            take: limitNumber,
        });

        res.json({
            page: pageNumber,
            limit: limitNumber,
            totalRecords,
            totalPages,
            data: customers,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getCustomerById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const customer = await prisma.customer.findUnique({
            where: { id },
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateCustomer = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const parsed = updateCustomerSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.format() });
        }
        const prevCustomer = await prisma.customer.findUnique({
            where: { id },
        });

        if (!prevCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        const customer = await prisma.customer.update({
            where: { id },
            data: {
                name: parsed.data.name || prevCustomer.name ,
                email: parsed.data.email || prevCustomer.email ,
                phone: parsed.data.phone || prevCustomer.phone ,
                company: parsed.data.company || prevCustomer.company ,
            },
        });

        res.json(customer);
    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(409).json({ message: "Duplicate entry: A customer with this email or phone already exists." });
        }
        if (error.code === "P2025") {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteCustomer = async (req: any, res: any) => {
    try {
        const { id } = req.params;

        await prisma.customer.delete({
            where: { id },
        });

        res.status(204).send({message : "Customer deleted successfully"});
    } catch (error: any) {
        if (error.code === "P2025") {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export default { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer };