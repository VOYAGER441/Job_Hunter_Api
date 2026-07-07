import nodemailer from "nodemailer";
import { Log } from "@/utils/logger";
import env from "@/environment";

class MailService {
  private transporter: nodemailer.Transporter;
  private readonly isDemoDomain: boolean;
  private readonly accountOwnerEmail: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.MAILTRAP_SMTP_HOST,
      port: Number(env.MAILTRAP_SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: env.MAILTRAP_SMTP_USER,
        pass: env.MAILTRAP_SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    // Mailtrap demo domains can only send to account owner's email
    this.isDemoDomain = env.MAILTRAP_FROM_EMAIL.includes("demomailtrap.co");
    this.accountOwnerEmail = env.MAILTRAP_ACCOUNT_OWNER_EMAIL || env.MAILTRAP_FROM_EMAIL;
    
    Log.info("MailService::constructor:::: Mailtrap SMTP transport initialized", { 
      isDemoDomain: this.isDemoDomain 
    });
  }

  async sendInvoiceEmail(
    to: string,
    invoiceNumber: string,
    pdfBuffer: Buffer,
    amount: number,
    currency: string
  ): Promise<boolean> {
    // Redirect to account owner email if using demo domain
    const recipientEmail = this.isDemoDomain ? this.accountOwnerEmail : to;
    
    Log.info("MailService::sendInvoiceEmail:::: sending invoice email", { 
      originalRecipient: to,
      actualRecipient: recipientEmail,
      invoiceNumber 
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%); padding: 30px; text-align: center; }
    .header h1 { color: #fff; font-size: 24px; margin: 0; }
    .content { padding: 30px; }
    .message { font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px; }
    .invoice-details { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .invoice-details p { margin: 8px 0; font-size: 14px; }
    .invoice-details strong { color: #6366f1; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Invoice from Job Hunter</h1>
    </div>
    <div class="content">
      <p class="message">Thank you for your purchase! Your invoice is attached to this email.</p>
      <div class="invoice-details">
        <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
        <p><strong>Amount:</strong> ${currency} ${amount.toFixed(2)}</p>
      </div>
      <p class="message">If you have any questions, please contact our support team.</p>
    </div>
    <div class="footer">
      <p>Job Hunter - Your AI-powered job search companion</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const mailOptions = {
      from: env.MAILTRAP_FROM_EMAIL,
      to: recipientEmail,
      subject: `Invoice ${invoiceNumber} - Job Hunter`,
      html,
      attachments: [
        {
          filename: `invoice_${invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    try {
      await this.transporter.sendMail(mailOptions);
      Log.info("MailService::sendInvoiceEmail:::: invoice email sent successfully", { 
        recipient: recipientEmail, 
        invoiceNumber 
      });
      return true;
    } catch (error) {
      Log.error("MailService::sendInvoiceEmail:::: failed to send invoice email", error);
      return false;
    }
  }

  async sendPaymentFailedEmail(
    to: string,
    orderId: string,
    reason: string
  ): Promise<boolean> {
    // Redirect to account owner email if using demo domain
    const recipientEmail = this.isDemoDomain ? this.accountOwnerEmail : to;
    
    Log.info("MailService::sendPaymentFailedEmail:::: sending payment failed email", { 
      originalRecipient: to,
      actualRecipient: recipientEmail,
      orderId 
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #ef4444 0%, #f87171 100%); padding: 30px; text-align: center; }
    .header h1 { color: #fff; font-size: 24px; margin: 0; }
    .content { padding: 30px; }
    .message { font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px; }
    .error-details { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .error-details p { margin: 8px 0; font-size: 14px; color: #dc2626; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Payment Failed</h1>
    </div>
    <div class="content">
      <p class="message">We're sorry, but your payment could not be processed.</p>
      <div class="error-details">
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Reason:</strong> ${reason}</p>
      </div>
      <p class="message">Please try again or contact our support team if the issue persists.</p>
    </div>
    <div class="footer">
      <p>Job Hunter - Your AI-powered job search companion</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const mailOptions = {
      from: env.MAILTRAP_FROM_EMAIL,
      to: recipientEmail,
      subject: `Payment Failed - Order ${orderId}`,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      Log.info("MailService::sendPaymentFailedEmail:::: payment failed email sent successfully", { 
        recipient: recipientEmail, 
        orderId 
      });
      return true;
    } catch (error) {
      Log.error("MailService::sendPaymentFailedEmail:::: failed to send payment failed email", error);
      return false;
    }
  }
}

export default new MailService();