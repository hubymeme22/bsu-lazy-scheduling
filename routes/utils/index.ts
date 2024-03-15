import { Response } from "express";

export const TIME_TYPE = [
  // "06:00 - 06:30",
  // "06:30 - 07:00",
  "07:00 - 07:30",
  "07:30 - 08:00",
  "08:00 - 08:30",
  "08:30 - 09:00",
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
  "11:00 - 11:30",
  "11:30 - 12:00",
  "12:00 - 12:30",
  "12:30 - 01:00",
  "01:00 - 01:30",
  "01:30 - 02:00",
  "02:00 - 02:30",
  "02:30 - 03:00",
  "03:00 - 03:30",
  "03:30 - 04:00",
  "04:00 - 04:30",
  "04:30 - 05:00",
  "05:00 - 05:30",
  "05:30 - 18:00",
  "18:00 - 18:30",
  "18:30 - 19:00",
  "19:00 - 19:30",
  "19:30 - 20:00"
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