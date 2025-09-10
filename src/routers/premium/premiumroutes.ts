import { Router } from "express";
import isAuthenticated from "../../middlewares/jwt";
import isPremium from "../../middlewares/isPremium";

const premiumrouter = Router();

premiumrouter.get('/payment', isAuthenticated, isPremium, (req, res) => {
    res.json({ message: "Welcome to the premium payment area." });
});

export default premiumrouter;