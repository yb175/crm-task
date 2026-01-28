import { z } from "zod";

export const createCustomerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(10, "Phone must be at least 10 characters"),
});

export const updateCustomerSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().min(10, "Phone must be at least 10 characters").optional(),
    company: z.string().optional(),
});