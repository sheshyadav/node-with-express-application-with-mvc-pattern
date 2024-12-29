import { Queue, Worker } from "bullmq";
import redis from "../../config/redis.js";
import logger from "../services/logger.js";
import sendMail from "../../config/mailer.js";
import 'dotenv/config';

const mailNotification = new Queue("Notification", { connection: redis });

const worker = new Worker("Notification", async (job) => {
    switch(job.name) {
        case 'send-welcome-email':
          await sendMail({
            from: {
              name:process.env.MAIL_FROM_NAME,
              address: process.env.MAIL_FROM_ADDRESS
            },
            to: job.data.email,
            subject: 'Welcome User',
            text: `Hi ${job.data.name}, Welcome to the chatApp.`
          }); 
          logger.info("New user welcome mail send.");
          break;
        case 'send-verification-email':
          const _verifylink = `${process.env.APP_URL}/verify-email/${job.data.resetToken}`;
          sendMail({
            from: {
              name:process.env.MAIL_FROM_NAME,
              address: process.env.MAIL_FROM_ADDRESS
            },
            to: job.data.email,
            subject: 'Verify Email Address',
            text: `Hi ${job.data.name}, Click here to verify your email address: ${_verifylink}`
          });
          logger.info("New user email verify link mail send.");
          break;
        case 'send-reset-password-email':
          const _passlink = `${process.env.APP_URL}/reset-password/${job.data.resetToken}`;
          sendMail({
            from: {
              name:process.env.MAIL_FROM_NAME,
              address: process.env.MAIL_FROM_ADDRESS
            },
            to: job.data.email,
            subject: 'Password Reset',
            text: `Hi ${job.data.name}, Click here to reset your password: ${_passlink}`
          });
          logger.info("User account password reset link send");
          break;
        default:
          logger.info('Unknown job type');
    }
},{ connection: redis });

worker.on('progress', job => {
  logger.info(`ID:${job.id} Name:${job.name} job has progress!`);
});

worker.on('completed', job => {
  logger.info(`ID:${job.id} Name:${job.name} job has completed!`);
});
  
worker.on('failed', (job, err) => {
  logger.error(`ID:${job.id} Name:${job.name} job has failed with ${err.message}`);
});

worker.on('error', err => { logger.error(err) });

export default mailNotification;
