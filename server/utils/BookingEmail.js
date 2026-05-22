
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("Mailer auth failed:", err.message);
  } else {
    console.log("Mailer ready:", process.env.EMAIL_USER);
  }
});
const U = {
  bell: "&#128276;",   // 🔔
  calendar: "&#128197;",   // 📅
  clock: "&#128336;",   // 🕐
  person: "&#128100;",   // 👤
  mail: "&#9993;",     // ✉
  phone: "&#128222;",   // 📞
  link: "&#128279;",   // 🔗
  note: "&#128221;",   // 📝
  video: "&#127909;",   // 🎥
  check: "&#10003;",    // ✓
  calCheck: "&#128197;",   // 📅
};

//  BOOKING ID GENERATOR
const randomBookingId = () => `BK-${Math.floor(1000 + Math.random() * 8999)}`;
//  USER EMAIL HELPERS
const userInfoRow = (icon, label, value, last = false) => `
  <tr>
    <td style="padding:12px 16px;border-bottom:${last ? "none" : "1px solid #1e1e1e"};">
      <table cellpadding="0" cellspacing="0" style="width:100%"><tr>
        <td style="width:36px;vertical-align:middle;">
          <div style="width:32px;height:32px;background:#1f1f1f;border-radius:8px;text-align:center;line-height:32px;font-size:15px;display:inline-block;">${icon}</div>
        </td>
        <td style="padding-left:12px;vertical-align:middle;">
          <div style="font-size:11px;color:#666666;margin-bottom:2px;">${label}</div>
          <div style="font-size:13px;color:#eeeeee;font-weight:500;">${value}</div>
        </td>
      </tr></table>
    </td>
  </tr>`;

const noteBlock = (icon, text) => `
  <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:12px;"><tr>
    <td style="border-left:3px solid #ff6a00;background:#141414;border-radius:0 8px 8px 0;padding:12px 16px;">
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:top;padding-right:10px;padding-top:2px;font-size:15px;">${icon}</td>
        <td style="font-size:12px;color:#999999;line-height:1.6;">${text}</td>
      </tr></table>
    </td>
  </tr></table>`;


//  USER EMAIL

const userEmailHtml = (b) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Booking Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;">
<table cellpadding="0" cellspacing="0" style="width:100%;background:#0a0a0a;">
  <tr><td style="padding:40px 20px;">
    <table cellpadding="0" cellspacing="0" style="max-width:540px;margin:0 auto;background:#111111;border:1px solid #1e1e1e;border-radius:20px;overflow:hidden;">

      <!-- Header -->
      <tr><td style="background:#ff6a00;padding:32px 28px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;">
            <div style="width:48px;height:48px;background:rgba(255,255,255,.18);border-radius:12px;text-align:center;line-height:48px;font-size:22px;display:inline-block;">${U.calCheck}</div>
          </td>
          <td style="padding-left:14px;vertical-align:middle;">
            <div style="font-size:20px;font-weight:600;color:#ffffff;margin-bottom:3px;">Booking Confirmed</div>
            <div style="font-size:12px;color:rgba(255,255,255,.72);">Your discovery call is scheduled</div>
          </td>
        </tr></table>
      </td></tr>

      <!-- Body -->
      <tr><td style="padding:28px;">

        <!-- Date/time pill -->
        <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:22px;"><tr>
          <td style="background:#ff6a00;border-radius:10px;padding:13px 18px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="vertical-align:middle;padding-right:10px;font-size:16px;">${U.clock}</td>
              <td style="font-size:14px;font-weight:600;color:#ffffff;vertical-align:middle;">
                ${b.date}&nbsp;&nbsp;<span style="opacity:.6">|</span>&nbsp;&nbsp;${b.time} IST
              </td>
            </tr></table>
          </td>
        </tr></table>

        <!-- Info card -->
        <table cellpadding="0" cellspacing="0" style="width:100%;background:#161616;border:1px solid #242424;border-radius:14px;overflow:hidden;margin-bottom:18px;">
          ${userInfoRow(U.person, "Name", `${b.firstName} ${b.lastName}`)}
          ${userInfoRow(U.mail, "Email", b.email)}
          ${userInfoRow(U.phone, "Phone", b.phone)}
          ${b.socialLink ? userInfoRow(U.link, "Social", b.socialLink, !b.message) : ""}
        </table>

        ${b.message ? noteBlock(U.note, b.message) : ""}
    ${noteBlock(U.video, "Our team will contact you shortly.<br/>Please stay available for quick communication.")}

      </td></tr>

      <!-- Footer -->
      <tr><td style="border-top:1px solid #1a1a1a;padding:14px 28px;text-align:center;font-size:11px;color:#3a3a3a;">
        &copy; ${new Date().getFullYear()} Booking System &nbsp;&middot;&nbsp; All rights reserved
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;


//  ADMIN EMAIL HELPERS

const adminDataRow = (icon, label, value, last = false) => `
  <tr>
    <td style="padding:11px 0;border-bottom:${last ? "none" : "1px solid #141414"};width:150px;vertical-align:middle;">
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="padding-right:8px;font-size:14px;vertical-align:middle;">${icon}</td>
        <td style="font-size:12px;color:#444444;vertical-align:middle;">${label}</td>
      </tr></table>
    </td>
    <td style="padding:11px 0;border-bottom:${last ? "none" : "1px solid #141414"};vertical-align:middle;">${value}</td>
  </tr>`;


//  ADMIN EMAIL — PROFESSIONAL FORMAT

const adminEmailHtml = (b) => {
  const id = randomBookingId();
  const initials = `${b.firstName?.[0] ?? ""}${b.lastName?.[0] ?? ""}`.toUpperCase();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Booking &mdash; Admin</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;">
<table cellpadding="0" cellspacing="0" style="width:100%;background:#080808;">
  <tr><td style="padding:36px 20px;">
    <table cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#0e0e0e;border:1px solid #1c1c1c;border-radius:22px;overflow:hidden;">

      <!-- Orange top accent bar -->
      <tr><td style="background:#ff6a00;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>

      <!-- Header -->
      <tr><td style="padding:24px 28px 20px;border-bottom:1px solid #181818;">
        <table cellpadding="0" cellspacing="0" style="width:100%"><tr>
          <td style="vertical-align:middle;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="vertical-align:middle;">
                <div style="width:40px;height:40px;background:#1a1a1a;border:1px solid #252525;border-radius:10px;text-align:center;line-height:40px;font-size:18px;display:inline-block;">${U.bell}</div>
              </td>
              <td style="padding-left:12px;vertical-align:middle;">
                <div style="font-size:14px;font-weight:600;color:#e0e0e0;">New Booking Alert</div>
                <div style="font-size:11px;color:#444444;margin-top:1px;">Admin Notification</div>
              </td>
            </tr></table>
          </td>
          <td style="text-align:right;vertical-align:middle;">
            <span style="background:#ff6a00;color:#ffffff;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;">New</span>
            &nbsp;
            <span style="background:#161616;border:1px solid #252525;color:#555555;font-size:11px;padding:5px 10px;border-radius:20px;font-family:ui-monospace,monospace;">#${id}</span>
          </td>
        </tr></table>
      </td></tr>

      <!-- Session tiles -->
      <tr><td style="padding:22px 28px 0;">
        <div style="font-size:10px;font-weight:600;letter-spacing:.1em;color:#333333;text-transform:uppercase;margin-bottom:14px;">Session details</div>
        <table cellpadding="0" cellspacing="0" style="width:100%"><tr>
          <td style="width:49%;vertical-align:top;padding-right:8px;">
            <table cellpadding="0" cellspacing="0" style="width:100%;background:#141414;border:1px solid #1e1e1e;border-radius:12px;">
              <tr><td style="padding:14px 16px;">
                <div style="font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#444444;margin-bottom:8px;">${U.calendar}&nbsp; Date</div>
                <div style="font-size:15px;font-weight:600;color:#e8e8e8;">${b.date}</div>
              </td></tr>
            </table>
          </td>
          <td style="width:49%;vertical-align:top;padding-left:8px;">
            <table cellpadding="0" cellspacing="0" style="width:100%;background:#141414;border:1px solid #1e1e1e;border-radius:12px;">
              <tr><td style="padding:14px 16px;">
                <div style="font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#444444;margin-bottom:8px;">${U.clock}&nbsp; Time</div>
                <div style="font-size:15px;font-weight:600;color:#e8e8e8;">${b.time} <span style="font-size:12px;color:#555555;font-weight:400;">IST</span></div>
              </td></tr>
            </table>
          </td>
        </tr></table>
      </td></tr>

      <!-- Divider -->
      <tr><td style="padding:20px 28px 0;">
        <table cellpadding="0" cellspacing="0" style="width:100%"><tr><td style="height:1px;background:#141414;font-size:0;line-height:0;">&nbsp;</td></tr></table>
      </td></tr>

      <!-- Client information -->
      <tr><td style="padding:20px 28px 0;">
        <div style="font-size:10px;font-weight:600;letter-spacing:.1em;color:#333333;text-transform:uppercase;margin-bottom:16px;">Client information</div>

        <!-- Avatar + name -->
        <table cellpadding="0" cellspacing="0" style="margin-bottom:18px;"><tr>
          <td style="vertical-align:middle;">
            <div style="width:46px;height:46px;background:#1a1a1a;border:1px solid #252525;border-radius:12px;text-align:center;line-height:46px;font-size:16px;font-weight:700;color:#ff6a00;display:inline-block;">${initials}</div>
          </td>
          <td style="padding-left:14px;vertical-align:middle;">
            <div style="font-size:16px;font-weight:600;color:#e8e8e8;">${b.firstName} ${b.lastName}</div>
            <div style="margin-top:5px;background:#1a1a1a;border:1px solid #252525;border-radius:6px;padding:3px 9px;display:inline-block;font-size:11px;color:#666666;">${U.check}&nbsp; New client</div>
          </td>
        </tr></table>

        <!-- Contact data rows -->
        <table cellpadding="0" cellspacing="0" style="width:100%;">
          ${adminDataRow(U.mail, "Email",
    `<a href="mailto:${b.email}" style="font-size:13px;font-weight:500;color:#ff6a00;text-decoration:none;">${b.email}</a>`)}
          ${adminDataRow(U.phone, "Phone",
      `<span style="font-size:13px;font-weight:500;color:#cccccc;">${b.phone}</span>`)}
          ${b.socialLink
      ? adminDataRow(U.link, "Social",
        `<a href="${b.socialLink}" style="font-size:13px;font-weight:500;color:#ff6a00;text-decoration:none;">${b.socialLink}</a>`,
        !b.message)
      : ""}
        </table>
      </td></tr>

      <!-- Client note (optional) -->
      ${b.message ? `
      <tr><td style="padding:18px 28px 0;">
        <table cellpadding="0" cellspacing="0" style="width:100%"><tr><td style="height:1px;background:#141414;font-size:0;line-height:0;">&nbsp;</td></tr></table>
      </td></tr>
      <tr><td style="padding:18px 28px 0;">
        <div style="font-size:10px;font-weight:600;letter-spacing:.1em;color:#333333;text-transform:uppercase;margin-bottom:12px;">Client note</div>
        <table cellpadding="0" cellspacing="0" style="width:100%;"><tr>
          <td style="background:#141414;border:1px solid #1e1e1e;border-radius:10px;padding:14px 16px;">
            <div style="font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#333333;margin-bottom:8px;">${U.note}&nbsp; Message from client</div>
            <div style="font-size:13px;color:#888888;line-height:1.6;">${b.message}</div>
          </td>
        </tr></table>
      </td></tr>` : ""}

      <!-- Footer -->
      <tr><td style="padding:20px 28px;border-top:1px solid #141414;margin-top:20px;">
        <table cellpadding="0" cellspacing="0" style="width:100%;"><tr>
          <td style="font-size:11px;color:#333333;">&copy; ${new Date().getFullYear()} Booking System</td>
          <td style="text-align:right;">
            <table cellpadding="0" cellspacing="0" style="display:inline-table;"><tr>
              <td style="width:6px;height:6px;background:#ff6a00;border-radius:3px;vertical-align:middle;"></td>
              <td style="padding-left:7px;font-size:11px;color:#555555;vertical-align:middle;">Awaiting confirmation</td>
            </tr></table>
          </td>
        </tr></table>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
};

//  SEND BOTH EMAILS
export const sendBookingEmails = async (b) => {
  await transporter.sendMail({
    from: `"Booking System" <${process.env.EMAIL_USER}>`,
    to: b.email,
    subject: `\u2713 Booking Confirmed \u2014 ${b.date} at ${b.time}`,
    html: userEmailHtml(b),
  });

  await transporter.sendMail({
    from: `"Booking System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking \u2014 ${b.firstName} ${b.lastName} (#${randomBookingId()})`,
    html: adminEmailHtml(b),
  });
};