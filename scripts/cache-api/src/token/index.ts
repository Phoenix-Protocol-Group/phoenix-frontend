import {Request, Response} from "express"
import prisma from "../prisma";

export async function getAll(req: Request, res: Response) {
  const tokens = await prisma.token.findMany();

  res.json(tokens);
}

export async function getByAddress(req: Request, res: Response) {
  if(!req.params.address) res.status(400).send("Missing token address");

  const token = await prisma.token.findFirst({
    where: {
      address: req.params.address
    }
  });

  return res.json(token);
}
