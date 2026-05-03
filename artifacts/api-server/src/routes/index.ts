import { Router, type IRouter } from "express";
import healthRouter from "./health";
import rubrixProxyRouter from "./rubrix-proxy";
import dbRouter from "./db";
import setupRouter from "./setup";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/proxy", rubrixProxyRouter);
router.use("/db", dbRouter);
router.use("/setup", setupRouter);

export default router;
