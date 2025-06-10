import prisma from "../db/db.config.js";

export const addTaskProgress = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { progressDescription } = req.body;

    const offer = await prisma.offer.findFirst({
      where: {
        taskId,
        accountId: req.user.id,
        status: "ACCEPTED",
      },
    });

    if (!offer) {
      return res.status(403).json({
        error: "You can only add progress if your offer was ACCEPTED",
      });
    }

    const progress = await prisma.taskProgress.create({
      data: {
        taskId,
        accountId: req.user.id,
        progressDescription,
      },
    });

    res.status(201).json({
      message: "Progress update added successfully",
      progress,
    });
  } catch (error) {
    console.error("Add Task Progress error:", error);
    res.status(400).json({ error: error.message || "Failed to add progress" });
  }
};

export const getTaskProgress = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    let isAllowed = false;

    if (req.user.role === "USER" && task.accountId === req.user.id) {
      isAllowed = true;
    }

    if (req.user.role === "PROVIDER") {
      const offer = await prisma.offer.findFirst({
        where: {
          taskId,
          accountId: req.user.id,
          status: "ACCEPTED",
        },
      });

      if (offer) isAllowed = true;
    }

    if (!isAllowed) {
      return res.status(403).json({ error: "You are not authorized to view progress for this task" });
    }

    const progressEntries = await prisma.taskProgress.findMany({
      where: { taskId },
      orderBy: { timestamp: "desc" },
    });

    res.json({
      message: "Progress fetched successfully",
      progress: progressEntries,
    });
  } catch (error) {
    console.error("Get Task Progress error:", error);
    res.status(400).json({ error: error.message || "Failed to fetch progress" });
  }
};

