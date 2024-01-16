import { Response } from "express";

export const requestHandler = async (res: Response, callback: () => void) => {
  try { await callback(); }
  catch(err) {
    if (!Array.isArray(err))
      return res.json({ message: err });

    res.status(err[1]);
    res.json({ message: err[0] });
  }
}