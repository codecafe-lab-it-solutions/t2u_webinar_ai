export interface ConfirmationEmailData {
  userName: string;
  registrationId: string;
  webinarName: string;
  webinarDate: string;
  webinarTime: string;
  webinarDuration: string;
  webinarMode: string;
  /** Omit when the booking type has no individual seat assignment. */
  seatNumber?: string;
  bookingUrl: string;
  calendarUrl: string;
  whatsappUrl: string;
  supportEmail: string;
  supportPhone: string;
  unsubscribeUrl: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function confirmationEmailSubject(webinarName: string): string {
  return `🎉 Your Seat is Confirmed — ${webinarName}`;
}

export function confirmationEmailPreheader(data: ConfirmationEmailData): string {
  return `You're all set, ${data.userName}! Confirmation #${data.registrationId} — save the date for ${data.webinarDate} at ${data.webinarTime}.`;
}

/**
 * Renders the transactional "seat confirmed" email as a self-contained,
 * email-client-safe HTML document (table layout, inline styles — see
 * emails/booking-confirmation.html for the original hand-authored/portable
 * version this mirrors). All dynamic values are HTML-escaped since
 * userName/etc. originate from a public lead-capture form.
 */
export function renderConfirmationEmailHtml(raw: ConfirmationEmailData): string {
  const d = {
    userName: escapeHtml(raw.userName),
    registrationId: escapeHtml(raw.registrationId),
    webinarName: escapeHtml(raw.webinarName),
    webinarDate: escapeHtml(raw.webinarDate),
    webinarTime: escapeHtml(raw.webinarTime),
    webinarDuration: escapeHtml(raw.webinarDuration),
    webinarMode: escapeHtml(raw.webinarMode),
    seatNumber: raw.seatNumber ? escapeHtml(raw.seatNumber) : "",
    bookingUrl: escapeHtml(raw.bookingUrl),
    calendarUrl: escapeHtml(raw.calendarUrl),
    whatsappUrl: escapeHtml(raw.whatsappUrl),
    supportEmail: escapeHtml(raw.supportEmail),
    supportPhone: escapeHtml(raw.supportPhone),
    unsubscribeUrl: escapeHtml(raw.unsubscribeUrl),
  };

  const currentYear = new Date().getFullYear();
  const preheader = escapeHtml(confirmationEmailPreheader(raw));

  const durationCell = `
    <td class="t2u-stack" width="50%" valign="top" style="padding: 8px 8px 0 0;">
      <p class="t2u-detail-label" style="margin:0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 10px; font-weight:700; letter-spacing: 0.08em; text-transform:uppercase; color:#8a8398;">Duration</p>
      <p style="margin:2px 0 0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; font-weight:600; color:#171421;">${d.webinarDuration}</p>
    </td>`;

  const seatCell = d.seatNumber
    ? `
    <td class="t2u-stack" width="50%" valign="top" style="padding: 8px 0 0 8px;">
      <p class="t2u-detail-label" style="margin:0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 10px; font-weight:700; letter-spacing: 0.08em; text-transform:uppercase; color:#8a8398;">Seat No.</p>
      <p style="margin:2px 0 0; font-family: 'Courier New', Courier, monospace; font-size: 15px; font-weight:700; color:#171421;">${d.seatNumber}</p>
    </td>`
    : "";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Your Seat is Confirmed</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<style>
  table { border-collapse: collapse; }
  td, th, p, span, a { font-family: "Segoe UI", Arial, sans-serif !important; }
</style>
<![endif]-->
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
  a[x-apple-data-detectors] {
    color: inherit !important; text-decoration: none !important; font-size: inherit !important;
    font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important;
  }
  @media only screen and (max-width: 600px) {
    .t2u-container { width: 100% !important; max-width: 100% !important; }
    .t2u-px { padding-left: 20px !important; padding-right: 20px !important; }
    .t2u-py-lg { padding-top: 28px !important; padding-bottom: 28px !important; }
    .t2u-headline { font-size: 22px !important; line-height: 30px !important; }
    .t2u-stack { display: block !important; width: 100% !important; }
    .t2u-detail-label { padding-bottom: 2px !important; }
    .t2u-btn-td { padding-left: 0 !important; padding-right: 0 !important; }
    .t2u-btn-a { display: block !important; width: 100% !important; box-sizing: border-box !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#f4f3f7;">

  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; opacity:0;">
    ${preheader}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f3f7;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" class="t2u-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">

          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <span style="font-family: 'Plus Jakarta Sans', 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 800; color: #171421;">
                T2<span style="color:#7c3aed;">Upgrade</span>
              </span>
            </td>
          </tr>

          <tr>
            <td style="background-color:#ffffff; border:1px solid #ece9f4; border-radius:14px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                <tr>
                  <td align="center" class="t2u-py-lg" style="padding-top:40px; padding-bottom:0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="64" height="64" align="center" valign="middle" style="width:64px; height:64px; border-radius:32px; background-color:#e8faf3; border:1px solid #b7f0d9;">
                          <span style="font-family: Arial, sans-serif; font-size: 30px; line-height: 30px; color:#10b981;">&#10003;</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" class="t2u-px" style="padding: 20px 40px 8px;">
                    <h1 class="t2u-headline" style="margin:0; font-family: 'Plus Jakarta Sans', 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 26px; line-height: 34px; font-weight: 800; color:#171421;">
                      Your Seat is Confirmed!
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td align="center" class="t2u-px" style="padding: 0 40px 28px;">
                    <p style="margin:0 0 12px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 25px; color:#3f3a4d;">
                      Hi ${d.userName},
                    </p>
                    <p style="margin:0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 25px; color:#3f3a4d;">
                      Great news — your registration for <strong style="color:#171421;">${d.webinarName}</strong> has been successfully booked. We've saved your seat and can't wait to have you join us.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 40px;">
                    <div style="border-top:1px solid #ece9f4;"></div>
                  </td>
                </tr>

                <tr>
                  <td class="t2u-px" style="padding: 28px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#faf9fc; border:1px solid #ece9f4; border-radius:12px;">
                      <tr>
                        <td style="padding: 24px 24px 8px;">
                          <p style="margin:0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 10px; font-weight:700; letter-spacing: 0.08em; text-transform:uppercase; color:#8a8398;">
                            Confirmation Number
                          </p>
                          <p style="margin:4px 0 0; font-family: 'Courier New', Courier, monospace; font-size: 17px; font-weight:700; letter-spacing: 0.02em; color:#171421;">
                            ${d.registrationId}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 24px 24px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td class="t2u-stack" width="50%" valign="top" style="padding: 8px 8px 8px 0;">
                                <p class="t2u-detail-label" style="margin:0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 10px; font-weight:700; letter-spacing: 0.08em; text-transform:uppercase; color:#8a8398;">Event</p>
                                <p style="margin:2px 0 0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; font-weight:600; color:#171421;">${d.webinarName}</p>
                              </td>
                              <td class="t2u-stack" width="50%" valign="top" style="padding: 8px 0 8px 8px;">
                                <p class="t2u-detail-label" style="margin:0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 10px; font-weight:700; letter-spacing: 0.08em; text-transform:uppercase; color:#8a8398;">Mode</p>
                                <p style="margin:2px 0 0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 15px; font-weight:600; color:#171421;">${d.webinarMode}</p>
                              </td>
                            </tr>
                            <tr>
                              <td class="t2u-stack" width="50%" valign="top" style="padding: 8px 8px 8px 0;">
                                <p class="t2u-detail-label" style="margin:0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 10px; font-weight:700; letter-spacing: 0.08em; text-transform:uppercase; color:#8a8398;">Date</p>
                                <p style="margin:2px 0 0; font-family: 'Courier New', Courier, monospace; font-size: 15px; font-weight:700; color:#171421;">${d.webinarDate}</p>
                              </td>
                              <td class="t2u-stack" width="50%" valign="top" style="padding: 8px 0 8px 8px;">
                                <p class="t2u-detail-label" style="margin:0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 10px; font-weight:700; letter-spacing: 0.08em; text-transform:uppercase; color:#8a8398;">Time</p>
                                <p style="margin:2px 0 0; font-family: 'Courier New', Courier, monospace; font-size: 15px; font-weight:700; color:#171421;">${d.webinarTime}</p>
                              </td>
                            </tr>
                            <tr>${durationCell}${seatCell}</tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" class="t2u-px" style="padding: 0 40px 8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="center" class="t2u-btn-td" style="padding-bottom: 12px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                            <tr>
                              <td align="center" bgcolor="#7c3aed" style="border-radius:10px;">
                                <a href="${d.bookingUrl}" class="t2u-btn-a" target="_blank" style="display:inline-block; padding:14px 28px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size:15px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:10px;">
                                  View My Booking
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <a href="${d.calendarUrl}" target="_blank" style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size:14px; font-weight:600; color:#7c3aed; text-decoration:underline;">
                            + Add to Google Calendar
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 28px 40px 0;">
                    <div style="border-top:1px solid #ece9f4;"></div>
                  </td>
                </tr>

                <tr>
                  <td class="t2u-px" style="padding: 24px 40px 8px;">
                    <p style="margin:0 0 14px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 13px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:#171421;">
                      What Happens Next
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom:12px;" valign="top">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                            <td valign="top" style="padding-right:10px;"><span style="display:inline-block; width:6px; height:6px; margin-top:8px; border-radius:3px; background-color:#f97316;">&nbsp;</span></td>
                            <td style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 22px; color:#3f3a4d;">
                              Your join link will be sent by email and WhatsApp before the event — no need to search for it, just watch your inbox.
                            </td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;" valign="top">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                            <td valign="top" style="padding-right:10px;"><span style="display:inline-block; width:6px; height:6px; margin-top:8px; border-radius:3px; background-color:#f97316;">&nbsp;</span></td>
                            <td style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 22px; color:#3f3a4d;">
                              We'll remind you 24 hours, 3 hours, and 30 minutes before ${d.webinarName} starts.
                            </td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr>
                        <td valign="top">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                            <td valign="top" style="padding-right:10px;"><span style="display:inline-block; width:6px; height:6px; margin-top:8px; border-radius:3px; background-color:#f97316;">&nbsp;</span></td>
                            <td style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 22px; color:#3f3a4d;">
                              Plans changed? Reply to this email at least 24 hours in advance and we'll sort it out — see our cancellation policy for details.
                            </td>
                          </tr></table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td class="t2u-px" style="padding: 24px 40px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3eefe; border:1px solid #e2d5fb; border-radius:12px;">
                      <tr>
                        <td align="center" style="padding: 20px 24px;">
                          <p style="margin:0 0 10px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 14px; line-height:21px; color:#4a3a72;">
                            Join our WhatsApp community for reminders, updates, and networking with fellow attendees.
                          </p>
                          <a href="${d.whatsappUrl}" target="_blank" style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size:14px; font-weight:700; color:#7c3aed; text-decoration:underline;">
                            Join WhatsApp Community &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 24px 20px 8px;">
              <p style="margin:0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 13px; line-height:20px; color:#8a8398;">
                Questions about your booking? Just reply to this email, or reach us at
                <a href="mailto:${d.supportEmail}" style="color:#7c3aed; text-decoration:underline;">${d.supportEmail}</a>
                &nbsp;/&nbsp;
                <a href="tel:${d.supportPhone}" style="color:#7c3aed; text-decoration:underline;">${d.supportPhone}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 20px 20px 0;">
              <p style="margin:0 0 6px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 12px; line-height:18px; color:#a39cb0;">
                T2Upgrade Pvt. Ltd. &middot; [Registered Address, City, State, PIN] &middot; India
              </p>
              <p style="margin:0 0 12px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 12px; line-height:18px; color:#a39cb0;">
                &copy; ${currentYear} T2Upgrade Pvt. Ltd. All rights reserved.
              </p>
              <p style="margin:0 0 20px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 12px; line-height:18px; color:#a39cb0;">
                <a href="${d.unsubscribeUrl}" style="color:#a39cb0; text-decoration:underline;">Unsubscribe from booking emails</a>
                &nbsp;&middot;&nbsp;
                <a href="https://t2upgrade.com/privacy-policy" style="color:#a39cb0; text-decoration:underline;">Privacy Policy</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

/** Plain-text alternative — improves deliverability and covers text-only clients. */
export function renderConfirmationEmailText(data: ConfirmationEmailData): string {
  const lines = [
    `Your Seat is Confirmed!`,
    ``,
    `Hi ${data.userName},`,
    ``,
    `Great news — your registration for ${data.webinarName} has been successfully booked. We've saved your seat and can't wait to have you join us.`,
    ``,
    `BOOKING DETAILS`,
    `Confirmation Number: ${data.registrationId}`,
    `Event: ${data.webinarName}`,
    `Mode: ${data.webinarMode}`,
    `Date: ${data.webinarDate}`,
    `Time: ${data.webinarTime}`,
    `Duration: ${data.webinarDuration}`,
  ];
  if (data.seatNumber) lines.push(`Seat No.: ${data.seatNumber}`);
  lines.push(
    ``,
    `View your booking: ${data.bookingUrl}`,
    `Add to calendar: ${data.calendarUrl}`,
    ``,
    `WHAT HAPPENS NEXT`,
    `- Your join link will be sent by email and WhatsApp before the event.`,
    `- We'll remind you 24 hours, 3 hours, and 30 minutes before ${data.webinarName} starts.`,
    `- Plans changed? Reply to this email at least 24 hours in advance.`,
    ``,
    `Join our WhatsApp community: ${data.whatsappUrl}`,
    ``,
    `Questions? Reply to this email or contact ${data.supportEmail} / ${data.supportPhone}`,
    ``,
    `T2Upgrade Pvt. Ltd. — [Registered Address, City, State, PIN], India`,
    `Unsubscribe: ${data.unsubscribeUrl}`
  );
  return lines.join("\n");
}
