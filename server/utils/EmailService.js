import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST  || "smtp.gmail.com",
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("SMTP connection failed:", err.message);
  } else {
    console.log("SMTP ready — logged in as:", process.env.SMTP_USER);
  }
});

export const sendOTPEmail = async (to, otp, subject = "OTP Verification") => {
  const year    = new Date().getFullYear();
  const appName = process.env.APP_NAME || "Portfolio";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

          <!-- HEADER -->
          <tr>
            <td style="background:#0C4733;padding:28px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 10px;">
                <tr>
                  <td style="background:rgba(255,255,255,0.12);border-radius:8px;padding:8px 10px;vertical-align:middle;">
                    <img src="https://img.icons8.com/ios/24/ffffff/lock-2.png"
                      width="22" height="22" alt="" style="display:block;" />
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:20px;font-weight:600;letter-spacing:-0.3px;">
                      ${appName}
                    </span>
                  </td>
                </tr>
              </table>
              <p style="margin:0;color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:0.3px;">
                ${subject}
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px 40px 24px;">
              <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.7;">Hello,</p>
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.7;">
                We received a request to reset the password for your
                <strong style="color:#0C4733;">${appName}</strong> account.
                Use the OTP below to continue.
              </p>

              <!-- OTP BOX -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#EEF6F2;border:1.5px dashed #0C4733;border-radius:10px;padding:26px;text-align:center;">
                    <span style="font-size:40px;font-weight:700;letter-spacing:14px;color:#0C4733;font-family:'Courier New',monospace;">
                      ${otp}
                    </span>
                    <p style="margin:10px 0 0;color:#4E9C79;font-size:12px;">
                      &#9201; Valid for <strong>10 minutes</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.7;">
                If you did not request a password reset, you can safely ignore this email.
                Your password will remain unchanged.
              </p>
            </td>
          </tr>

          <!-- WARNING STRIP -->
          <tr>
            <td style="padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#EEF6F2;border-radius:8px;padding:12px 16px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:10px;padding-top:1px;">
                          <span style="font-size:15px;">&#9888;&#65039;</span>
                        </td>
                        <td>
                          <p style="margin:0;color:#083826;font-size:12px;line-height:1.6;">
                            <strong>Never share this OTP with anyone.</strong>
                            ${appName} staff will never ask for your OTP or password.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:24px 40px 0;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:16px 40px 28px;text-align:center;">
              <p style="margin:0 0 8px;color:#9ca3af;font-size:11px;">
                &copy; ${year} ${appName}. All rights reserved.
              </p>
              <p style="margin:0;font-size:11px;">
                <a href="#" style="color:#4E9C79;text-decoration:none;margin:0 8px;">Privacy Policy</a>
                <span style="color:#d1d5db;">·</span>
                <a href="#" style="color:#4E9C79;text-decoration:none;margin:0 8px;">Help Center</a>
                <span style="color:#d1d5db;">·</span>
                <a href="#" style="color:#4E9C79;text-decoration:none;margin:0 8px;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  const info = await transporter.sendMail({
    from:    `"${appName}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log(` OTP email sent to ${to} | MessageId: ${info.messageId} | Response: ${info.response}`);
  return info;
};