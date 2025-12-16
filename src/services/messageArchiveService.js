import cron from "node-cron";
import { Op } from "sequelize";
import Message from "../models/message.js";
import ArchivedMessage from "../models/messageArchived.js";

const archiveOldMessages = async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Step 1: Get messages older than 1 day
  const oldMessages = await Message.findAll({
    where: {
      createdAt: { [Op.lt]: oneDayAgo },
    },
  });

  if (!oldMessages.length) return;
  console.log(oldMessages);

  // Step 2: Insert into ArchivedMessage
  const plain = oldMessages.map((m) => m.toJSON());
  await ArchivedMessage.bulkCreate(plain);

  // Step 3: Delete from Message
  await Message.destroy({
    where: {
      createdAt: { [Op.lt]: oneDayAgo },
    },
  });
};

// Run every night at 2 AM
cron.schedule("0 2 * * *", archiveOldMessages);
export default archiveOldMessages;
