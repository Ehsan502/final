import Notification from "../models/Notification.js";
import { emitToUser } from "../socket/index.js";

export const createNotification = async ({ user, sender, type, text, link = "", relatedId = null }) => {
  const notification = await Notification.create({ user, sender, type, text, link, relatedId });
  const populated = await notification.populate("sender", "name avatar");
  emitToUser(user, "notification:new", populated);
  return populated;
};
