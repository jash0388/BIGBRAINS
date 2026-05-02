import { Router, type IRouter } from "express";
import healthRouter from "./health";
import rubrixProxyRouter from "./rubrix-proxy";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/proxy", rubrixProxyRouter);

export default router;
