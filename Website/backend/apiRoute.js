import express from "express";
import { home, addDate, homeEdit, dateEdit} from "./directController.js";
import cors from "cors";

const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: "https://smart-bin-d25n.onrender.com",
  })
);

router.get("/api", home);
router.post("/api/add/:bin", addDate);
router.put("/api/:del", homeEdit);
router.put("/api/:field/:date", dateEdit);

export default router;
