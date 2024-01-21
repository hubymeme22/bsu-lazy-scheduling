import { Request, Response } from "express";
import { requestHandler } from "../utils";

import { ITotal, IOverallSummary } from "../../db/models/FooterDetails";
import * as service from "../services/footer-details.service";

interface FooterDetailsRequestFormat {
  id: number;
  total: ITotal;
  summary: IOverallSummary,
}

export const getFooterById = async (req: Request, res: Response) => {
  requestHandler(res, async () => {
    res.json(await service.getFooterDetailById(parseInt(req.params.id)));
  });
};

export const createFooterDetails = async (req: Request, res: Response) => {
  requestHandler(res, async () => {
    const { id, total, summary }: FooterDetailsRequestFormat = req.body;
    res.json(await service.createFooterDetail(id, total, summary));
  });
};