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

export const updateOfferStatus = async (req, res) => {
  try {
    const offerId = parseInt(req.params.id);
    const action =
      req.body?.action ||
      (req.path.endsWith("/accept") ? "ACCEPT" : req.path.endsWith("/reject") ? "REJECT" : null);


    if (!["ACCEPT", "REJECT"].includes(action)) {
      return res.status(400).json({ error: "Action must be ACCEPT or REJECT" });
    }

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { task: true },
    });

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    if (offer.task.accountId !== req.user.id) {
      return res.status(403).json({ error: "You do not own this task" });
    }

    if (offer.status !== "PENDING") {
      return res
        .status(400)
        .json({ error: "Only PENDING offers can be accepted/rejected" });
    }

    const newStatus = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";

    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: { status: newStatus },
    });

    res.json({
      message: `Offer ${newStatus.toLowerCase()} successfully`,
      offer: updatedOffer,
    });
  } catch (error) {
    console.error("Update Offer Status error:", error);
    res
      .status(400)
      .json({ error: error.message || "Failed to respond to offer" });
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

