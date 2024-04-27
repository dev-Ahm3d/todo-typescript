import { PrismaClient } from "@prisma/client";
import softDelete from "./prisma-extensions/soft-delete";
import softRestore from "./prisma-extensions/soft-restore";

const prisma = new PrismaClient().$extends(softDelete).$extends(softRestore)

export default prisma