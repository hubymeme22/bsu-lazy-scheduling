import { Request, Response } from "express";
import { requestHandler } from "../utils";
import * as service from "../services/form-details.service";

export const setDean = (req: Request, res: Response) => {
  requestHandler(res, () => {
    const { dean } = req.body;
    service.setDean(dean);
    res.json({ created: true });
  });
};

export const setVCAA = (req: Request, res: Response) => {
  requestHandler(res, () => {
    const { vcaa } = req.body;
    service.setVCAA(vcaa);
    res.json({ created: true });
  });
};

export const setSemester = (req: Request, res: Response) => {
  requestHandler(res, () => {
    const { semester } = req.body;
    service.setSemester(semester);
    res.json({ created: true });
  });
};

export const setAcademicYear = (req: Request, res: Response) => {
  requestHandler(res, () => {
    const { academic_year } = req.body;
    service.setAcademicYear(academic_year);
    res.json({ created: true });
  });
};

export const getAll = (res: Response) => {
  requestHandler(res, () => {
    res.json(service.getAll());
  });
};