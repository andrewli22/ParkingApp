import { SendEmailCommand } from '@aws-sdk/client-ses';
import { sesClient } from './sesClient.js';

export const sendEmail = async (name, subject, message) => {
  const params = {
    Source: 'parkingappproject55@gmail.com',
    Destination: {
      ToAddresses: ['parkingappproject55@gmail.com'],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8',
      },
      Body: {
        Text: {
          Data: message,
          Charset: 'UTF-8',
        },
        Html: {
          Data: `<html><body><p>${name}</p><p>${message}</p></body></html>`,
          Charset: 'UTF-8',
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log('Email sent successfully:', response.MessageId);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
