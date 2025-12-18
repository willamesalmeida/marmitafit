const AddressService = require("../services/address.service");

const AppError = require("../utils/errorHandler.util");

class AddressController {
  static async createAddress(req, res, next) {
    try {
      const userId = req.user.userId;
      const addressData = req.body;
      const address = await AddressService.createAddress(userId, addressData);
      res
        .status(201)
        .json({ message: "Address created successfully", address });
    } catch (error) {
      next(error);
    }
  }
  static async getUserAddresses(req, res, next) {
    try {
      const userId = req.user.userId;
      const addresses = await AddressService.getAddressByUserId(userId);
      res.status(200).json(addresses);
    } catch (error) {
      next(error);
    }
  }
  static async updateAddress(req, res, next) {
    try {
      const userId = req.user.userId;
      const addressId = req.params.id;
      const addressData = req.body;
      const updateAddress = await AddressService.updateAddress(
        addressId,
        addressData,
        userId
      );
      res
        .status(200)
        .json({ message: "Address updated successfully", updateAddress });
    } catch (error) {
      next(error);
    }
  }
  static async deleteAddress(req, res, next) {
    try{
      const userId = req.user.userId;
      const addressId = req.params.id;
      await AddressService.deleteAddress(addressId, userId);
      res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AddressController;
