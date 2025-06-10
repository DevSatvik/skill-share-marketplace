import express from "express";
import { createOffer, acceptOfferStatus, rejectOfferStatus, getMyOffers} from "../controllers/offer.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import requireRole from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/offers", 
    authenticate, 
    requireRole("PROVIDER"), 
    createOffer
);

router.post(
    "/offers/:id/accept", 
    authenticate, 
    requireRole("USER"), 
    acceptOfferStatus
);

router.post(
    "/offers/:id/reject", 
    authenticate, 
    requireRole("USER"), 
    rejectOfferStatus
);

router.get(
    "/offers/made-by-me", 
    authenticate, 
    requireRole("PROVIDER"), 
    getMyOffers
);

export default router;
