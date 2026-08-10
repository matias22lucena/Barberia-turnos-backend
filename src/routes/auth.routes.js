import { Router } from "express";

import { loginAdministrador } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", loginAdministrador);

export default router;