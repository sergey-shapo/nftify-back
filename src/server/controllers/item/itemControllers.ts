import { type NextFunction, type Response } from "express";
import Item from "../../../database/models/Item.js";
import CustomError from "../../CustomError/CustomError.js";
import { type CustomRequest } from "../../types.js";

export const getItems = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const {
    query: { limit, skip },
  } = req;

  const reqLimit = Number(limit);
  const reqSkip = Number(skip);

  try {
    const nfts = await Item.find().skip(reqSkip).limit(reqLimit).exec();

    const length = await Item.countDocuments();

    res.status(200);
    res.json({ nfts, length });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { itemId } = req.params;

  try {
    const itemToDelete = await Item.findByIdAndDelete(itemId).exec();

    if (!itemToDelete) {
      throw new CustomError(404, "NFT not found");
    }

    res.status(200).json({ message: "NFT deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const addItem = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  try {
    const item = await Item.create({ ...body });

    res.status(201);
    res.json({ item });
  } catch (error) {
    next(error);
  }
};