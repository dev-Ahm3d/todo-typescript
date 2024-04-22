import { PrismaClient } from "@prisma/client";
import softDelete from "./prisma-extensions/soft-delete";

const prisma = new PrismaClient().$extends(softDelete)

export default prisma