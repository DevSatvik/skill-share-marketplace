import prisma from "../db/db.config.js";

export const createOffer = async (req, res) => {
  try {
    const { taskId } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const existingOffer = await prisma.offer.findFirst({
      where: {
        taskId,
        accountId: req.user.id,
      },
    });

    if (existingOffer) {
      return res.status(400).json({
        error: "You have already submitted an offer for this task",
      });
    }

    const offer = await prisma.offer.create({
      data: {
        taskId,
        accountId: req.user.id, 
        status: "PENDING",
      },
    });

    res.status(201).json({
      message: "Offer submitted successfully",
      offer,
    });
  } catch (error) {
    console.error("Create Offer error:", error);
    res.status(400).json({ error: error.message || "Failed to create offer" });
  }
};

export const acceptOfferStatus = (req, res) => {
  req.body = req.body || {}; 
  req.body.action = "ACCEPT";
  return updateOfferStatus(req, res);
};

export const rejectOfferStatus = (req, res) => {
  req.body = req.body || {};
  req.body.action = "REJECT";
  return updateOfferStatus(req, res);
};

export const getMyOffers = async (req, res) => {
  try {
    const offers = await prisma.offer.findMany({
      where: {
        accountId: req.user.id,
      },
      include: {
        task: true,
      },
    });

    const myOffers = offers.map((offer) => ({
      offerId: offer.id,
      taskId: offer.task.id,
      taskName: offer.task.taskName,
      status: offer.status,
    }));

    res.json({
      message: "My offers fetched successfully",
      offers: myOffers,
    });
  } catch (error) {
    console.error("Get My Offers error:", error);
    res.status(400).json({
      error: error.message || "Failed to list my offers",
    });
  }
};

