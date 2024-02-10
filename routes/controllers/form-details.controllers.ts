import { Request, Response } from "express";
import { requestHandler } from "../utils";
import * as service from "../services/form-details.service";

export const updateAll = (req: Request, res: Response) => {
  requestHandler(res, () => {
    const { dean, vcaa, academic_year, semester } = req.body;
    service.setDean(dean);
    service.setAcademicYear(academic_year);
    service.setVCAA(vcaa);
    service.setSemester(semester);

    res.json({ updated: true });
  });
};

export const getAll = (res: Response) => {
  requestHandler(res, () => {
    res.json(service.getAll());
  });
};