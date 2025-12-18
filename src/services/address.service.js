    const { PrismaClient } = require("@prisma/client");
    const AppError = require("../utils/errorHandler.util");
    const prisma = new PrismaClient();

    class AddressService {
      static async createAddress(userId, addressData) {
        try {
          return await prisma.address.create({
            data: {
              userId,
              street: addressData.street,
              number: addressData.number,
              complement: addressData.complement,
              district: addressData.district,
              city: addressData.city,
              state: addressData.state,
              zipCode: addressData.zipCode,
            },
          });
        } catch (error) {
          throw new AppError(
            error.message || "Error creating address",
            error.statusCode || 500
          );
        }
      }
      static async getAddressByUserId(userId) {
        try {
          return await prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
          });
        } catch (error) {
          throw new AppError("Error fetching addresses", 500);
        }
      }
      static async updateAddress(addressId, addressData, userId) {
        try {
          const address = await prisma.address.updateMany({
            where: { id: addressId },
          });
          if (!address || address.userId !== userId) {
            throw new AppError(
              "Address not found or you do not have permission to update it",
              404
            );
          }
          return await prisma.address.update({
            where: { id: addressId },
            data: addressData,
          });
        } catch (error) {
          throw new AppError(
            error.message || "Error updating address",
            error.statusCode || 500
          );
        }
      }

      static async deleteAddress(addressId, userId) {
        try {
          const address = await prisma.address.findUnique({
            where: { id: addressId },
          });
          if (!address || address.userId !== userId) {
            throw new AppError(
              "Address not found or you do not have permission to delete it",
              404
            );
          }
          await prisma.address.delete({
            where: { id: addressId },
          });
          return { message: "Address deleted successfully!" };
        } catch (error) {
          throw new AppError(
            error.message || "Error deleting address",
            error.statusCode || 500
          );
        }
      }
    }
module.exports = AddressService;