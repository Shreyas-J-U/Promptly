import { Router, Request, Response } from "express";
import { streamClient } from "../lib/stream";
import User from "../models/User";

const router = Router();

// Get user profile
router.get(
  "/user/:userId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  },
);

router.post("/token", async (req: Request, res: Response): Promise<void> => {
  const { userId, userName } = req.body;

  if (!userId) {
    res.status(400).json({ error: "UserId is required" });
    return;
  }

  try {
    // 1. Sync with Stream
    await streamClient.upsertUser({
      id: userId,
      name: userName || userId,
      role: "user",
    });

    // 2. Sync with MongoDB
    const user = await User.findOneAndUpdate(
      { userId },
      {
        name: userName || userId,
        lastLogin: new Date(),
        $inc: { "metadata.totalSessions": 1 },
      },
      { upsert: true, new: true },
    );

    const token = streamClient.createToken(userId);
    res.json({ token, user });
  } catch (error) {
    console.error("Error creating token:", error);
    res.status(500).json({ error: "Failed to create token" });
  }
});

// Update user stats
router.patch(
  "/user/:userId/stats",
  async (req: Request, res: Response): Promise<void> => {
    const { field, increment } = req.body;
    try {
      const update: any = {};
      update[`metadata.${field}`] = increment;

      const user = await User.findOneAndUpdate(
        { userId: req.params.userId },
        { $inc: update },
        { new: true },
      );
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update stats" });
    }
  },
);

export default router;
