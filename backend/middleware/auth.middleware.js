import prisma  from "../db/db.config.js";


export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header is missing" });
        }

        const token = req.headers.authorization?.split(" ")[1];
        console.log("Token received:", token);
        const account = await prisma.account.findUnique({
            where: { authToken: token }

        });
        // console.log("Account found:", account);

        if (!account) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        // console.log("Account found:", account);
        req.user = account;
        next();
    }

    catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};