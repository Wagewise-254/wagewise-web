// lib/email.ts
import { BrevoClient} from '@getbrevo/brevo';

// Initialize the Brevo client
const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY as string,
});

export const sendWelcomeEmail = async ({
  to,
  ownerName,
  workspaceName,
  credentials,
}: {
  to: string;
  ownerName: string;
  workspaceName: string;
  credentials: { email: string; password: string };
}) => {
  try {
    const htmlContent = getWelcomeEmailTemplate(ownerName, workspaceName, credentials);

   // Send the email using the smtp service
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: "Welcome to WageDesk - Your Workspace is Ready!",
      //WageWise<wagewise.dev@gmail.com>
      htmlContent: htmlContent,
      sender: { 
        name: "WageWise", 
        email: "wagewise.dev@gmail.com" 
      },
      to: [{ 
        email: to 
      }],
    });

     console.log('Email sent successfully:', result);
    return result;
    
 } catch (error: unknown) {
    console.error("Brevo Error:", error instanceof Error ? error.message : "Unknown error");
    throw new Error("Failed to send welcome email");
  }
};

const getWelcomeEmailTemplate = (name: string, workspace: string, creds: { email: string; password: string }) => {
  const currentYear = new Date().getFullYear();
  const downloadUrl = "https://sage-croquembouche-522f2a.netlify.app/download";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
        <div style="background-color: #1F3A8A; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to WageDesk</h1>
        </div>
        <div style="padding: 32px; background-color: white;">
          <p style="font-size: 16px; margin-top: 0;">Hello <strong>${name}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6;">Your workspace <strong>"${workspace}"</strong> has been successfully created. You can now manage your payroll and HR tasks through our desktop application.</p>
          
          <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-top: 0;">Your Login Credentials</h2>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Email:</strong> ${creds.email}</p>
            <p style="margin: 8px 0; font-size: 15px;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${creds.password}</code></p>
          </div>

          <p style="font-size: 14px; color: #ef4444; margin-bottom: 24px;"><em>Important: Please change your password immediately after your first login.</em></p>

          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${downloadUrl}" style="background-color: #1F3A8A; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Download Desktop App</a>
          </div>

          <p style="font-size: 14px; color: #64748b;">If you didn't expect this email, please ignore it or contact our support team.</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            &copy; ${currentYear} WageDesk. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};