import { Response } from "express";

export const TIME_TYPE = [
  "06:00 - 07:00",
  "07:00 - 08:00",
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 01:00",
  "01:00 - 02:00",
  "02:00 - 03:00",
  "03:00 - 04:00",
  "04:00 - 05:00",
  "05:00 - 06:00",
  "18:00 - 19:00",
  "19:00 - 20:00"
];

export const DAY_TYPE = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

export const requestHandler = async (res: Response, callback: () => void) => {
  try { await callback(); }
  catch(err) {
    if (!Array.isArray(err))
      return res.json({ message: err });

    res.status(err[1]);
    res.json({ message: err[0] });
  }
}