import { prisma } from "@/lib/prisma";

export const userRepository = {
  getById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
  getByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
};
