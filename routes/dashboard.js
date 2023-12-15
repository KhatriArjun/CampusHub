import express from "express";

import "dotenv/config";
import passport from "passport";
let router = express.Router();

router.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {}
);
