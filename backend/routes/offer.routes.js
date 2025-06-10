import express from "express";
import { createOffer, acceptOfferStatus, rejectOfferStatus, getMyOffers} from "../controllers/offer.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import requireRole from "../middleware/role.middleware.js";

const router = express.Router();
/**
 * @swagger
 * /api/offers:
 *   post:
 *     summary: Create offer (Provider only)
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Offer created
 */

router.post(
    "/offers", 
    authenticate, 
    requireRole("PROVIDER"), 
    createOffer
);

/**
 * @swagger
 * /api/offers/{id}/accept:
 *   post:
 *     summary: Accept an offer (User only)
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 */

router.post(
    "/offers/:id/accept", 
    authenticate, 
    requireRole("USER"), 
    acceptOfferStatus
);

/**
 * @swagger
 * /api/offers/{id}/reject:
 *   post:
 *     summary: Reject an offer (User only)
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 */

router.post(
    "/offers/:id/reject", 
    authenticate, 
    requireRole("USER"), 
    rejectOfferStatus
);

/**
 * @swagger
 * /api/offers/made-by-me:
 *   get:
 *     summary: Get offers made by provider
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 */

router.get(
    "/offers/made-by-me", 
    authenticate, 
    requireRole("PROVIDER"), 
    getMyOffers
);

export default router;
