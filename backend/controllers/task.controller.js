import prisma from "../db/db.config.js";

export const createTask = async (req, res) => {
  try {
    const {
      category,
      taskName,
      taskDescription,
      expectedStartDate,
      expectedHours,
      hourlyRate,
      currency,
    } = req.body;

    const task = await prisma.task.create({
      data: {
        category,
        taskName,
        taskDescription,
        expectedStartDate: new Date(expectedStartDate),
        expectedHours,
        hourlyRate,
        currency,
        accountId: req.user.id, 
      },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create Task error:", error);
    res.status(400).json({ error: error.message || "Failed to create task" });
  }
};

export const getOpenTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { completed: false },
      orderBy: { expectedStartDate: "asc" },
    });

    res.json({
      message: "Open tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    console.error("List Open Tasks error:", error);
    res
      .status(400)
      .json({ error: error.message || "Failed to list open tasks" });
  }
};


export const markTaskComplete = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.accountId !== req.user.id) {
      return res.status(403).json({ error: "You do not own this task" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { completed: true },
    });

    res.json({
      message: "Task marked as completed",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Mark Task Complete error:", error);
    res
      .status(400)
      .json({ error: error.message || "Failed to mark task as complete" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.accountId !== req.user.id) {
      return res.status(403).json({ error: "You do not own this task" });
    }

    if (task.completed) {
      return res
        .status(400)
        .json({ error: "Cannot update a task that is already completed" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: req.body,
    });

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update Task error:", error);
    res.status(400).json({ error: error.message || "Failed to update task" });
  }
};

export const getProviderAcceptedTasks = async (req, res) => {
  try {
    const offers = await prisma.offer.findMany({
      where: {
        accountId: req.user.id,
        status: "ACCEPTED",
      },
      include: {
        task: true,
      },
    });

    const acceptedTasks = offers.map((offer) => offer.task);

    res.json({
      message: "Accepted tasks fetched successfully",
      tasks: acceptedTasks,
    });
  } catch (error) {
    console.error("Get Provider Accepted Tasks error:", error);
    res
      .status(400)
      .json({ error: error.message || "Failed to list accepted tasks" });
  }
};

export const getOffersOnUserPostedTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        accountId: req.user.id,
      },
      include: {
        offers: {
          include: {
            account: true, 
          },
        },
      },
    });

    const offers = tasks.flatMap((task) =>
      task.offers.map((offer) => ({
        offerId: offer.id,
        taskId: task.id,
        taskName: task.taskName,
        providerName: offer.account.firstName
          ? `${offer.account.firstName} ${offer.account.lastName || ""}`
          : offer.account.companyName || "Unknown Provider",
        status: offer.status,
      }))
    );

    res.json({
      message: "Offers fetched successfully",
      offers,
    });
  } catch (error) {
    console.error("Get Offers on User Posted Tasks error:", error);
    res.status(400).json({
      error: error.message || "Failed to list offers",
    });
  }
};


export const providerMarkTaskComplete = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    const offer = await prisma.offer.findFirst({
      where: {
        taskId,
        accountId: req.user.id,
        status: "ACCEPTED",
      },
    });

    if (!offer) {
      return res.status(403).json({
        error: "You can only mark complete if your offer was accepted",
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        providerMarkedComplete: true,
        userAcceptedCompletion: null,
      },
    });

    res.json({
      message: "Provider marked task as complete",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Provider Mark Complete error:", error);
    res.status(400).json({
      error: error.message || "Failed to mark complete",
    });
  }
};

export const userAcceptCompletion = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.accountId !== req.user.id) {
      return res.status(403).json({ error: "You do not own this task" });
    }

    if (!task.providerMarkedComplete) {
      return res.status(400).json({
        error: "Provider has not yet marked this task as complete",
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        userAcceptedCompletion: true,
        completed: true,
      },
    });

    res.json({
      message: "You accepted task completion",
      task: updatedTask,
    });
  } catch (error) {
    console.error("User Accept Completion error:", error);
    res.status(400).json({
      error: error.message || "Failed to accept completion",
    });
  }
};

export const userRejectCompletion = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.accountId !== req.user.id) {
      return res.status(403).json({ error: "You do not own this task" });
    }

    if (!task.providerMarkedComplete) {
      return res.status(400).json({
        error: "Provider has not yet marked this task as complete",
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        userAcceptedCompletion: false,
        completed: false,
        providerMarkedComplete: false,
      },
    });

    res.json({
      message: "You rejected task completion",
      task: updatedTask,
    });
  } catch (error) {
    console.error("User Reject Completion error:", error);
    res.status(400).json({
      error: error.message || "Failed to reject completion",
    });
  }
};

export const getUserPostedTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        accountId: req.user.id,
      },
      orderBy: {
        expectedStartDate: "desc",
      },
    });

    res.json({
      message: "My posted tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    console.error("Get User Posted Tasks error:", error);
    res.status(400).json({
      error: error.message || "Failed to list my posted tasks",
    });
  }
};
