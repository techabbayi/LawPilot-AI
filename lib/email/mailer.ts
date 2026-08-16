import nodemailer from "nodemailer";

/**
 * Enterprise Production SMTP Transporter
 * Strictly relies on SMTP environment variables (No dev fallback mock)
 */
const getTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });
};

const getFromEmail = () => {
  return process.env.SMTP_FROM || `"LawPilot AI Platform" <noreply@lawpilot.ai>`;
};

const getAppUrl = () => {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

// ==============================================================================
// EMAIL TEMPLATE 1: PASSWORD RESET AUTHORIZATION EMAIL
// ==============================================================================
export async function sendPasswordResetEmail(toEmail: string, resetToken: string, userName?: string) {
  const resetLink = `${getAppUrl()}/reset-password?token=${resetToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #0F172A; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; }
          .header { background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%); padding: 32px; text-align: center; color: #ffffff; }
          .content { padding: 32px; font-size: 14px; line-height: 1.6; }
          .btn-container { text-align: center; margin: 28px 0; }
          .btn { background-color: #1E3A8A; color: #ffffff !important; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; }
          .warning { background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 14px; font-size: 12px; color: #92400E; margin-top: 24px; }
          .footer { background: #F1F5F9; padding: 20px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #E2E8F0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0; font-size: 24px;">LawPilot AI</h1>
            <p style="margin:4px 0 0 0; font-size: 12px; color: #93C5FD; text-transform: uppercase;">Password Reset Authorization</p>
          </div>
          <div class="content">
            <p style="font-size: 16px; font-weight: bold; margin-top: 0;">Hello ${userName || "Legal Counsel"},</p>
            <p>We received a request to reset the password for your LawPilot AI Enterprise account (<strong>${toEmail}</strong>).</p>
            <p>Click the button below to authorize and set your new password. This link will expire in <strong>60 minutes</strong>.</p>
            
            <div class="btn-container">
              <a href="${resetLink}" class="btn" target="_blank">Reset Password Now</a>
            </div>

            <p style="font-size: 12px; color: #64748B; word-break: break-all;">
              Direct Link: <a href="${resetLink}" style="color: #1E3A8A;">${resetLink}</a>
            </p>

            <div class="warning">
              <strong>Security Alert:</strong> If you did not request a password reset, please ignore this email or contact support immediately at <strong>security@lawpilot.ai</strong>.
            </div>
          </div>
          <div class="footer">
            <p style="margin:0;">© ${new Date().getFullYear()} LawPilot AI Platform • Enterprise Legal Intelligence SaaS</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: getFromEmail(),
    to: toEmail,
    subject: "LawPilot AI - Password Reset Authorization",
    html: htmlContent,
  });

  return { success: true, messageId: info.messageId, resetLink };
}

// ==============================================================================
// EMAIL TEMPLATE 2: WELCOME ACCOUNT CREATION EMAIL
// ==============================================================================
export async function sendWelcomeEmail(toEmail: string, userName: string) {
  const loginLink = `${getAppUrl()}/login`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #0F172A; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; }
          .header { background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%); padding: 32px; text-align: center; color: #ffffff; }
          .content { padding: 32px; font-size: 14px; line-height: 1.6; }
          .btn-container { text-align: center; margin: 28px 0; }
          .btn { background-color: #1E3A8A; color: #ffffff !important; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; }
          .footer { background: #F1F5F9; padding: 20px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #E2E8F0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0; font-size: 24px;">Welcome to LawPilot AI</h1>
            <p style="margin:4px 0 0 0; font-size: 12px; color: #93C5FD; text-transform: uppercase;">Enterprise Legal SaaS Account Active</p>
          </div>
          <div class="content">
            <p style="font-size: 16px; font-weight: bold; margin-top: 0;">Welcome, ${userName}!</p>
            <p>Your enterprise legal workspace account has been successfully created and configured on LawPilot AI.</p>
            
            <ul style="padding-left: 20px; color: #475569;">
              <li><strong>Multi-Provider AI Gateway:</strong> Query Gemini 1.5, Groq, OpenAI, and DeepSeek.</li>
              <li><strong>Clause Risk Auditor:</strong> Upload PDF/DOCX contracts for 0-100 risk scoring.</li>
              <li><strong>Cascading Hard Wipe:</strong> Zero retention data privacy guaranteed.</li>
            </ul>

            <div class="btn-container">
              <a href="${loginLink}" class="btn" target="_blank">Sign In to Platform Workspace</a>
            </div>
          </div>
          <div class="footer">
            <p style="margin:0;">© ${new Date().getFullYear()} LawPilot AI Platform • Enterprise Legal Intelligence SaaS</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: getFromEmail(),
    to: toEmail,
    subject: "Welcome to LawPilot AI - Enterprise Legal SaaS",
    html: htmlContent,
  });

  return { success: true, messageId: info.messageId };
}

// ==============================================================================
// EMAIL TEMPLATE 3: RAZORPAY INR PAYMENT RECEIPT EMAIL
// ==============================================================================
export async function sendRazorpayPaymentReceiptEmail(
  toEmail: string,
  userName: string,
  paymentDetails: { paymentId: string; orderId: string; planName: string; amountInRupees: number }
) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #0F172A; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; }
          .header { background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%); padding: 32px; text-align: center; color: #ffffff; }
          .content { padding: 32px; font-size: 14px; line-height: 1.6; }
          .receipt-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: #F8FAFC; border-radius: 10px; overflow: hidden; border: 1px solid #E2E8F0; }
          .receipt-table td { padding: 12px 16px; border-bottom: 1px solid #E2E8F0; font-size: 13px; }
          .footer { background: #F1F5F9; padding: 20px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #E2E8F0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0; font-size: 24px;">Razorpay Payment Confirmation</h1>
            <p style="margin:4px 0 0 0; font-size: 12px; color: #93C5FD; text-transform: uppercase;">Subscription Activated (INR)</p>
          </div>
          <div class="content">
            <p style="font-size: 16px; font-weight: bold; margin-top: 0;">Hello ${userName},</p>
            <p>Thank you for subscribing to LawPilot AI! Your Razorpay payment has been verified and your platform tier upgraded.</p>
            
            <table class="receipt-table">
              <tr>
                <td><strong>Plan Subscription:</strong></td>
                <td>LawPilot AI ${paymentDetails.planName.toUpperCase()}</td>
              </tr>
              <tr>
                <td><strong>Amount Paid:</strong></td>
                <td><strong>₹${paymentDetails.amountInRupees.toLocaleString("en-IN")} INR</strong></td>
              </tr>
              <tr>
                <td><strong>Razorpay Payment ID:</strong></td>
                <td><code>${paymentDetails.paymentId}</code></td>
              </tr>
              <tr>
                <td><strong>Order ID:</strong></td>
                <td><code>${paymentDetails.orderId}</code></td>
              </tr>
              <tr>
                <td><strong>Payment Gateway:</strong></td>
                <td>Razorpay India (UPI, NetBanking, Cards)</td>
              </tr>
            </table>
          </div>
          <div class="footer">
            <p style="margin:0;">© ${new Date().getFullYear()} LawPilot AI Platform • Enterprise Legal Intelligence SaaS</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: getFromEmail(),
    to: toEmail,
    subject: `LawPilot AI Payment Receipt - ₹${paymentDetails.amountInRupees.toLocaleString("en-IN")} INR`,
    html: htmlContent,
  });

  return { success: true, messageId: info.messageId };
}

// ==============================================================================
// EMAIL TEMPLATE 4: CASCADING HARD WIPE SECURITY DESTRUCTION ALERT
// ==============================================================================
export async function sendCascadingHardWipeEmail(toEmail: string, documentTitle: string, documentId: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #0F172A; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; }
          .header { background: #0F172A; padding: 28px; text-align: center; color: #ffffff; }
          .content { padding: 32px; font-size: 14px; line-height: 1.6; }
          .alert-box { background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 14px; font-size: 13px; color: #065F46; margin: 20px 0; }
          .footer { background: #F1F5F9; padding: 20px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #E2E8F0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0; font-size: 22px;">Cascading Hard Wipe Executed</h1>
            <p style="margin:4px 0 0 0; font-size: 12px; color: #34D399; text-transform: uppercase;">Zero Retention Data Destruction Confirmation</p>
          </div>
          <div class="content">
            <p style="font-size: 15px; font-weight: bold; margin-top: 0;">Security Confirmation Audit</p>
            <p>Per your configured retention policy, the contract <strong>"${documentTitle}"</strong> has undergone complete cascading hard deletion.</p>
            
            <div class="alert-box">
              <strong>Destroyed Items:</strong>
              <ul style="margin: 8px 0 0 0; padding-left: 20px;">
                <li>Cloudinary PDF/DOCX file asset wiped</li>
                <li>MongoDB metadata document removed</li>
                <li>RAG 128D dense vector indices cleared</li>
                <li>OCR text extraction cache purged</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p style="margin:0;">© ${new Date().getFullYear()} LawPilot AI Platform • Enterprise Legal Intelligence SaaS</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: getFromEmail(),
    to: toEmail,
    subject: `Security Alert: Cascading Hard Wipe Executed - ${documentTitle}`,
    html: htmlContent,
  });

  return { success: true, messageId: info.messageId };
}

// ==============================================================================
// EMAIL TEMPLATE 5: CONTRACT CLAUSE AUDIT COMPLETE EMAIL
// ==============================================================================
export async function sendContractAuditCompleteEmail(
  toEmail: string,
  documentTitle: string,
  overallRiskScore: number,
  overallRiskLevel: string
) {
  const vaultLink = `${getAppUrl()}/docs`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #0F172A; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; }
          .header { background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%); padding: 32px; text-align: center; color: #ffffff; }
          .content { padding: 32px; font-size: 14px; line-height: 1.6; }
          .btn-container { text-align: center; margin: 28px 0; }
          .btn { background-color: #1E3A8A; color: #ffffff !important; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; }
          .footer { background: #F1F5F9; padding: 20px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #E2E8F0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0; font-size: 24px;">AI Clause Risk Audit Complete</h1>
            <p style="margin:4px 0 0 0; font-size: 12px; color: #93C5FD; text-transform: uppercase;">Contract Analysis Report</p>
          </div>
          <div class="content">
            <p style="font-size: 16px; font-weight: bold; margin-top: 0;">Contract Audit Finalized</p>
            <p>Your uploaded document <strong>"${documentTitle}"</strong> has been processed by the AI Clause Audit Engine.</p>
            
            <p style="font-size: 18px; font-weight: bold;">
              Overall Risk Score: <span style="color: ${overallRiskScore > 50 ? '#DC2626' : '#059669'};">${overallRiskScore}/100</span> (${overallRiskLevel.toUpperCase()} RISK)
            </p>

            <div class="btn-container">
              <a href="${vaultLink}" class="btn" target="_blank">View Audit Report in Docs Vault</a>
            </div>
          </div>
          <div class="footer">
            <p style="margin:0;">© ${new Date().getFullYear()} LawPilot AI Platform • Enterprise Legal Intelligence SaaS</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: getFromEmail(),
    to: toEmail,
    subject: `AI Clause Audit Complete: ${documentTitle} (${overallRiskScore}/100 Risk Score)`,
    html: htmlContent,
  });

  return { success: true, messageId: info.messageId };
}
