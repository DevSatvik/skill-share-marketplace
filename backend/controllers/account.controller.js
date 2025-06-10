import prisma from "../db/db.config.js";

import { v4 as uuidv4 } from "uuid";

function validateAccountFields(data) {
  if (data.type === "INDIVIDUAL") {
    const required = [
      "firstName",
      "lastName",
      "addressStreetNumber",
      "addressStreetName",
      "addressCitySuburb",
      "addressState",
      "addressPostcode",
    ];
    for (let field of required) {
      if (!data[field]) {
        throw new Error(`${field} is required for individual accounts`);
      }
    }
  }

  if (data.type === "COMPANY") {
    const required = [
      "companyName",
      "taxID",
      "repFirstName",
      "repLastName",
    ];
    for (let field of required) {
      if (!data[field]) {
        throw new Error(`${field} is required for company accounts`);
      }
    }
  }
}

export const registerAccount = async (req, res) => {
  try {
    const data = req.body;

    validateAccountFields(data);

    const authToken = uuidv4();

    const account = await prisma.account.create({
      data: {
        role: data.role, // USER or PROVIDER
        email: data.email,
        password: data.password, // For challenge, storing plain text (later use hashing!)
        mobileNumber: data.mobileNumber,
        type: data.type, // INDIVIDUAL or COMPANY
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
        companyPhoneNumber: data.companyPhoneNumber,
        taxID: data.taxID,
        repFirstName: data.repFirstName,
        repLastName: data.repLastName,
        addressStreetNumber: data.addressStreetNumber,
        addressStreetName: data.addressStreetName,
        addressCitySuburb: data.addressCitySuburb,
        addressState: data.addressState,
        addressPostcode: data.addressPostcode,
        authToken, // Saved in database - used for authentication
      },
    });

    res.status(201).json({
      message: "Account registered successfully",
      authToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(400).json({ error: error.message || "Registration failed" });
  }
};

export const loginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    const account = await prisma.account.findUnique({
      where: { email },
    });

    if (!account || account.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const newAuthToken = uuidv4();

    await prisma.account.update({
      where: { id: account.id },
      data: { authToken: newAuthToken },
    });

    res.json({
      message: "Login successful",
      authToken: newAuthToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const getProfile = async (req, res) => {
  res.json({
    message: "Authenticated!",
    user: req.user, 
  });
};
