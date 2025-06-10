import prisma from "../db/db.config.js";

export const createSkill = async (req, res) => {
  try {
    const { category, experienceYears, workNature, hourlyRate, currency } =
      req.body;

    const skill = await prisma.skill.create({
      data: {
        category,
        experienceYears,
        workNature,
        hourlyRate,
        currency,
        accountId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    console.error("Create Skill error:", error);
    res.status(400).json({ error: error.message || "Failed to create skill" });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skillId = parseInt(req.params.id);

    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    if (skill.accountId !== req.user.id) {
      return res.status(403).json({ error: "You do not own this skill" });
    }

    const updatedSkill = await prisma.skill.update({
      where: { id: skillId },
      data: req.body, 
    });

    res.json({
      message: "Skill updated successfully",
      skill: updatedSkill,
    });
  } catch (error) {
    console.error("Update Skill error:", error);
    res.status(400).json({ error: error.message || "Failed to update skill" });
  }
};

export const getMySkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      where: {
        accountId: req.user.id,
      },
      orderBy: {
        category: "asc",
      },
    });

    res.json({
      message: "My skills fetched successfully",
      skills,
    });
  } catch (error) {
    console.error("Get My Skills error:", error);
    res.status(400).json({
      error: error.message || "Failed to list my skills",
    });
  }
};

