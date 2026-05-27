import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { formatMoney, CURRENCIES, CurrencyCode } from "@/lib/currency";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// PDF generation + nodemailer require the Node.js runtime (not Edge).
export const runtime = "nodejs";

const LeadSchema = z.object({
  name:    z.string().optional(),
  email:   z.string().email(),
  company: z.string().optional(),
  source:  z.string().default("cost-calculator"),
  payload: z.any().optional(),
});

// ─── Gmail transporter (sends from ravelo.9283@gmail.com) ─────────────────────
const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "ravelo.9283@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ─── Team notification email (sent to YOU via Resend) ─────────────────────────
function buildTeamNotificationHtml(lead: { name?: string; email: string; source: string; payload?: any }) {
  const name = lead.name || "Not provided";
  const email = lead.email;
  const source = lead.source;
  const payload = lead.payload || {};
  const result = payload.result;
  const currency = payload.currency || "USD";

  let resultsHtml = "";

  if (result) {
    const totalYearlyHours = result.totalYearlyHours || 0;
    const totalYearlyCost = result.totalYearlyCost || 0;
    const formattedCost = formatMoney(totalYearlyCost, currency);

    let tasksRows = "";
    if (Array.isArray(result.tasks) && result.tasks.length > 0) {
      tasksRows = result.tasks
        .map((t: any) => {
          const taskName = t.task?.name || "Unnamed Task";
          const people = t.task?.people || 1;
          const mins = t.task?.minutesPerTask || 0;
          const freq = t.task?.frequency || "daily";
          const automatability = t.task?.automatability || "unlikely";
          const yearlyHours = t.yearlyHours || 0;
          const yearlyCost = formatMoney(t.yearlyCost || 0, currency);

          const badgeColors: Record<string, { bg: string; text: string }> = {
            full:     { bg: "#e2fbe8", text: "#1b5e20" },
            partial:  { bg: "#fff3e0", text: "#e65100" },
            unlikely: { bg: "#ffebee", text: "#c62828" },
          };
          const colors = badgeColors[automatability] || { bg: "#f5f5f5", text: "#616161" };

          return `
            <tr>
              <td style="padding:12px 8px;border-bottom:1px solid #e2e8f0;font-size:14px"><strong>${taskName}</strong></td>
              <td style="padding:12px 8px;border-bottom:1px solid #e2e8f0;font-size:14px;text-align:center">${people}</td>
              <td style="padding:12px 8px;border-bottom:1px solid #e2e8f0;font-size:14px;text-align:center">${mins}m (${freq})</td>
              <td style="padding:12px 8px;border-bottom:1px solid #e2e8f0;font-size:14px;text-align:center">
                <span style="background:${colors.bg};color:${colors.text};padding:2px 6px;border-radius:4px;font-weight:bold;font-size:11px;text-transform:uppercase">${automatability}</span>
              </td>
              <td style="padding:12px 8px;border-bottom:1px solid #e2e8f0;font-size:14px;text-align:right">${yearlyHours.toLocaleString()} hrs</td>
              <td style="padding:12px 8px;border-bottom:1px solid #e2e8f0;font-size:14px;text-align:right;font-weight:600;color:#3b82f6">${yearlyCost}</td>
            </tr>`;
        })
        .join("");
    }

    resultsHtml = `
      <div style="margin-top:24px;padding:20px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
        <h3 style="margin-top:0;color:#1e293b;font-size:18px;border-bottom:2px solid #e2e8f0;padding-bottom:8px">📊 Manual Work Cost Analysis</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <tr>
            <td style="padding:8px 0;font-size:15px;color:#475569"><strong>Total Yearly Hours Lost:</strong></td>
            <td style="padding:8px 0;font-size:18px;font-weight:bold;color:#0f172a;text-align:right">${totalYearlyHours.toLocaleString()} hrs</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:15px;color:#475569"><strong>Total Yearly Cost:</strong></td>
            <td style="padding:8px 0;font-size:22px;font-weight:bold;color:#10b981;text-align:right">${formattedCost}</td>
          </tr>
        </table>
        ${tasksRows ? `
        <h4 style="margin:16px 0 8px;color:#334155;font-size:15px">Task Breakdown</h4>
        <table style="width:100%;border-collapse:collapse;min-width:500px">
          <thead>
            <tr style="background:#f1f5f9;text-align:left">
              <th style="padding:8px;font-size:12px;color:#475569;text-transform:uppercase">Task</th>
              <th style="padding:8px;font-size:12px;color:#475569;text-transform:uppercase;text-align:center">Staff</th>
              <th style="padding:8px;font-size:12px;color:#475569;text-transform:uppercase;text-align:center">Mins & Freq</th>
              <th style="padding:8px;font-size:12px;color:#475569;text-transform:uppercase;text-align:center">Auto</th>
              <th style="padding:8px;font-size:12px;color:#475569;text-transform:uppercase;text-align:right">Yearly Hours</th>
              <th style="padding:8px;font-size:12px;color:#475569;text-transform:uppercase;text-align:right">Yearly Cost</th>
            </tr>
          </thead>
          <tbody>${tasksRows}</tbody>
        </table>` : ""}
      </div>`;
  }

  return `<!DOCTYPE html>
  <html>
    <head><meta charset="utf-8"><title>New Lead</title></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f5f6;padding:20px;margin:0">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);border:1px solid #e1e4e8">
        <div style="background:linear-gradient(135deg,#06060e,#1e1b4b);padding:30px;text-align:center;color:#fff">
          <h1 style="margin:0;font-size:24px;font-weight:700">🚀 New Lead Captured</h1>
          <p style="margin:8px 0 0;color:#94a3b8;font-size:14px">Ravelo Manual Work Cost Calculator</p>
        </div>
        <div style="padding:30px;color:#334155;line-height:1.5">
          <p style="font-size:16px;margin-top:0">Hi Team Ravelo,</p>
          <p style="font-size:15px">A new lead just submitted through the calculator.</p>
          <div style="margin:20px 0;padding:16px;background:#f8fafc;border-radius:8px;border-left:4px solid #3b82f6">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:4px 0;font-size:14px;color:#64748b;width:80px"><strong>Name:</strong></td>
                <td style="padding:4px 0;font-size:14px;color:#0f172a">${name}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:14px;color:#64748b"><strong>Email:</strong></td>
                <td style="padding:4px 0;font-size:14px"><a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;font-weight:600">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:14px;color:#64748b"><strong>Source:</strong></td>
                <td style="padding:4px 0;font-size:14px;color:#0f172a">${source}</td>
              </tr>
            </table>
          </div>
          ${resultsHtml}
          <div style="margin-top:30px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:20px">
            Sent automatically by Ravelo Calculator
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

// ─── Client report email (sent FROM ravelo.9283@gmail.com TO client) ──────────
function buildClientReportHtml(lead: { name?: string; email: string; payload?: any }) {
  const name = lead.name || "there";
  const payload = lead.payload || {};
  const result = payload.result;
  const currency = payload.currency || "USD";

  let tasksRows = "";
  let totalYearlyHours = 0;
  let formattedCost = "";

  if (result) {
    totalYearlyHours = result.totalYearlyHours || 0;
    const totalYearlyCost = result.totalYearlyCost || 0;
    formattedCost = formatMoney(totalYearlyCost, currency);

    if (Array.isArray(result.tasks) && result.tasks.length > 0) {
      tasksRows = result.tasks
        .map((t: any) => {
          const taskName = t.task?.name || "Unnamed Task";
          const automatability = t.task?.automatability || "unlikely";
          const yearlyHours = t.yearlyHours || 0;
          const yearlyCost = formatMoney(t.yearlyCost || 0, currency);

          const badgeColors: Record<string, { bg: string; text: string }> = {
            full:     { bg: "#e2fbe8", text: "#1b5e20" },
            partial:  { bg: "#fff3e0", text: "#e65100" },
            unlikely: { bg: "#ffebee", text: "#c62828" },
          };
          const colors = badgeColors[automatability] || { bg: "#f5f5f5", text: "#616161" };

          return `
            <tr>
              <td style="padding:12px 8px;border-bottom:1px solid #1e1e2e;font-size:14px;color:#e2e8f0">${taskName}</td>
              <td style="padding:12px 8px;border-bottom:1px solid #1e1e2e;font-size:14px;text-align:center">
                <span style="background:${colors.bg};color:${colors.text};padding:2px 8px;border-radius:4px;font-weight:bold;font-size:11px;text-transform:uppercase">${automatability}</span>
              </td>
              <td style="padding:12px 8px;border-bottom:1px solid #1e1e2e;font-size:14px;text-align:right;color:#94a3b8">${yearlyHours.toLocaleString()} hrs</td>
              <td style="padding:12px 8px;border-bottom:1px solid #1e1e2e;font-size:14px;text-align:right;font-weight:600;color:#22d3a5">${yearlyCost}</td>
            </tr>`;
        })
        .join("");
    }
  }

  return `<!DOCTYPE html>
  <html>
    <head><meta charset="utf-8"><title>Your Cost of Manual Work Report</title></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0d0d1a;padding:20px;margin:0">
      <div style="max-width:600px;margin:0 auto;background:#06060e;border-radius:12px;overflow:hidden;border:1px solid #1e1e2e">
        <div style="background:linear-gradient(135deg,#06060e,#1e1b4b);padding:36px 30px;text-align:center">
          <p style="margin:0 0 8px;color:#5b8bff;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase">Ravelo</p>
          <h1 style="margin:0;font-size:26px;font-weight:700;color:#fff">Your Manual Work Cost Report</h1>
          <p style="margin:10px 0 0;color:#64748b;font-size:14px">Here's what repetitive work is costing your business</p>
        </div>
        <div style="padding:30px;color:#e2e8f0;line-height:1.6">
          <p style="font-size:16px;margin-top:0">Hi ${name},</p>
          <p style="font-size:15px;color:#94a3b8">Thanks for using the Ravelo calculator. Here's your personalised breakdown:</p>

          <div style="background:#0f0f1a;border-radius:10px;padding:24px;margin:24px 0;text-align:center;border:1px solid #1e1e2e">
            <p style="margin:0 0 6px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:1px">Total Annual Cost of Manual Work</p>
            <p style="margin:0;font-size:36px;font-weight:700;color:#5b8bff">${formattedCost}</p>
            <p style="margin:8px 0 0;font-size:13px;color:#475569">${totalYearlyHours.toLocaleString()} hours lost per year</p>
          </div>

          ${tasksRows ? `
          <h3 style="color:#e2e8f0;font-size:15px;margin:24px 0 12px">Task Breakdown</h3>
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:#0f0f1a">
                <th style="padding:10px 8px;font-size:11px;color:#475569;text-transform:uppercase;text-align:left">Task</th>
                <th style="padding:10px 8px;font-size:11px;color:#475569;text-transform:uppercase;text-align:center">Automation</th>
                <th style="padding:10px 8px;font-size:11px;color:#475569;text-transform:uppercase;text-align:right">Yearly Hrs</th>
                <th style="padding:10px 8px;font-size:11px;color:#475569;text-transform:uppercase;text-align:right">Yearly Cost</th>
              </tr>
            </thead>
            <tbody>${tasksRows}</tbody>
          </table>` : ""}

          <div style="margin-top:32px;padding:20px;background:linear-gradient(135deg,#0f0f1a,#1e1b4b);border-radius:10px;text-align:center;border:1px solid #2d2b6b">
            <p style="margin:0 0 8px;font-size:15px;color:#e2e8f0">Ready to cut this cost?</p>
            <p style="margin:0 0 16px;font-size:13px;color:#64748b">We help businesses automate repetitive work and reclaim thousands of hours.</p>
            <a href="https://ravelo.in" style="display:inline-block;background:#5b8bff;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">
              Get a Free Consultation →
            </a>
          </div>

          <p style="margin-top:32px;font-size:12px;color:#334155;text-align:center;border-top:1px solid #1e1e2e;padding-top:20px">
            Ravelo · You received this because you used our cost calculator.
          </p>
        </div>
      </div>
    </body>
  </html>`;
}

// ─── Client report PDF (attached to the client email) ────────────────────────
// pdf-lib's standard fonts use WinAnsi encoding, which can't render glyphs like
// ₹ or emoji. Sanitize all drawn text and use ASCII-safe currency symbols.
function pdfSafe(s: string): string {
  return (s ?? "")
    .replace(/₹/g, "Rs")               // ₹
    .replace(/[→➔➤]/g, "->")  // → ➔ ➤
    .replace(/[•]/g, "-")               // •
    .replace(/[–—]/g, "-")         // – —
    .replace(/[‘’]/g, "'")         // ‘ ’
    .replace(/[“”]/g, '"')         // “ ”
    .replace(/…/g, "...")               // …
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "");  // drop remaining non-Latin1 glyphs
}

function moneyForPdf(amount: number, currency: CurrencyCode): string {
  const n = new Intl.NumberFormat(CURRENCIES[currency].locale, {
    maximumFractionDigits: 0,
  }).format(amount || 0);
  const sym = currency === "INR" ? "Rs " : currency === "AED" ? "AED " : CURRENCIES[currency].symbol;
  return `${sym}${n}`;
}

async function buildClientReportPdf(lead: { name?: string; email: string; payload?: any }): Promise<Buffer> {
  const name = pdfSafe(lead.name || "there");
  const payload = lead.payload || {};
  const result = payload.result || {};
  const currency: CurrencyCode = (payload.currency as CurrencyCode) in CURRENCIES ? payload.currency : "USD";

  const totalYearlyHours = result.totalYearlyHours || 0;
  const totalYearlyCost = result.totalYearlyCost || 0;
  const tasks: any[] = Array.isArray(result.tasks) ? result.tasks : [];

  const doc = await PDFDocument.create();
  doc.setTitle("Ravelo - Cost of Manual Work Report");
  doc.setAuthor("Ravelo");
  const page = doc.addPage([595.28, 841.89]); // A4 portrait
  const { width: W, height: H } = page.getSize();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const MARGIN = 50;
  const accent = rgb(0.357, 0.545, 1);  // #5b8bff
  const ink = rgb(0.06, 0.09, 0.16);
  const muted = rgb(0.45, 0.5, 0.58);
  const line = rgb(0.88, 0.9, 0.93);

  const drawRight = (text: string, edge: number, y: number, size: number, f = font, color = ink) => {
    page.drawText(text, { x: edge - f.widthOfTextAtSize(text, size), y, size, font: f, color });
  };

  // Header band
  page.drawRectangle({ x: 0, y: H - 120, width: W, height: 120, color: rgb(0.024, 0.024, 0.055) });
  page.drawText("RAVELO", { x: MARGIN, y: H - 52, size: 11, font: bold, color: accent });
  page.drawText("Your Manual Work Cost Report", { x: MARGIN, y: H - 82, size: 20, font: bold, color: rgb(1, 1, 1) });
  page.drawText("What repetitive work is costing your business", { x: MARGIN, y: H - 102, size: 10, font, color: rgb(0.6, 0.66, 0.75) });

  let y = H - 160;
  page.drawText(`Hi ${name},`, { x: MARGIN, y, size: 13, font: bold, color: ink });
  y -= 20;
  page.drawText("Thanks for using the Ravelo calculator. Here is your personalised breakdown:", { x: MARGIN, y, size: 10.5, font, color: muted });

  // Headline cost box
  y -= 32;
  const boxH = 90;
  page.drawRectangle({ x: MARGIN, y: y - boxH, width: W - MARGIN * 2, height: boxH, color: rgb(0.96, 0.97, 0.99), borderColor: line, borderWidth: 1 });
  page.drawText("TOTAL ANNUAL COST OF MANUAL WORK", { x: MARGIN + 20, y: y - 30, size: 9, font: bold, color: muted });
  page.drawText(moneyForPdf(totalYearlyCost, currency), { x: MARGIN + 20, y: y - 64, size: 30, font: bold, color: accent });
  drawRight(`${Math.round(totalYearlyHours).toLocaleString()} hours lost per year`, W - MARGIN - 20, y - 64, 11, font, muted);
  y -= boxH + 38;

  // Task breakdown table
  if (tasks.length > 0) {
    page.drawText("Task Breakdown", { x: MARGIN, y, size: 13, font: bold, color: ink });
    y -= 22;

    const colTask = MARGIN;
    const colAuto = MARGIN + 235;
    const colHrs = W - MARGIN - 130; // right edge for hours
    const colCost = W - MARGIN;      // right edge for cost
    const maxNameW = colAuto - colTask - 14;

    page.drawRectangle({ x: MARGIN, y: y - 6, width: W - MARGIN * 2, height: 22, color: rgb(0.95, 0.96, 0.98) });
    page.drawText("TASK", { x: colTask + 6, y, size: 8.5, font: bold, color: muted });
    page.drawText("AUTOMATION", { x: colAuto, y, size: 8.5, font: bold, color: muted });
    drawRight("YEARLY HRS", colHrs, y, 8.5, bold, muted);
    drawRight("YEARLY COST", colCost, y, 8.5, bold, muted);
    y -= 24;

    const autoLabel: Record<string, string> = { full: "Fully automatable", partial: "Partially", unlikely: "Unlikely" };

    for (const t of tasks) {
      if (y < 120) break; // single-page guard
      let nm = pdfSafe(t.task?.name || "Unnamed Task");
      while (nm.length > 3 && font.widthOfTextAtSize(nm, 10) > maxNameW) nm = nm.slice(0, -2);
      if (nm !== pdfSafe(t.task?.name || "Unnamed Task")) nm = nm.slice(0, -1) + "...";

      page.drawText(nm, { x: colTask + 6, y, size: 10, font, color: ink });
      page.drawText(pdfSafe(autoLabel[t.task?.automatability] || t.task?.automatability || "-"), { x: colAuto, y, size: 9.5, font, color: muted });
      drawRight(`${Math.round(t.yearlyHours || 0).toLocaleString()} hrs`, colHrs, y, 10, font, muted);
      drawRight(moneyForPdf(t.yearlyCost || 0, currency), colCost, y, 10, bold, accent);
      y -= 9;
      page.drawLine({ start: { x: MARGIN, y }, end: { x: W - MARGIN, y }, thickness: 0.5, color: line });
      y -= 17;
    }
  }

  // CTA footer
  if (y > 130) {
    const fH = 72;
    page.drawRectangle({ x: MARGIN, y: y - fH, width: W - MARGIN * 2, height: fH, color: rgb(0.06, 0.06, 0.11) });
    page.drawText("Ready to cut this cost?", { x: MARGIN + 20, y: y - 26, size: 12, font: bold, color: rgb(1, 1, 1) });
    page.drawText("We help businesses automate repetitive work and reclaim thousands of hours.", { x: MARGIN + 20, y: y - 44, size: 9, font, color: rgb(0.6, 0.66, 0.75) });
    page.drawText("Get a free consultation  ->  ravelo.in", { x: MARGIN + 20, y: y - 60, size: 10, font: bold, color: accent });
  }

  page.drawText("Ravelo - You received this because you used our cost calculator.", { x: MARGIN, y: 40, size: 8, font, color: muted });

  return Buffer.from(await doc.save());
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lead = LeadSchema.parse(body);

    console.log("[Lead captured]", lead);

    // 1. Send YOU a notification via Resend
    try {
      const resend = new Resend(process.env.RESEND_API_KEY || "re_xxxxxxxxx");
      const { data, error } = await resend.emails.send({
        from: process.env.LEAD_NOTIFICATION_FROM || "onboarding@resend.dev",
        to:   process.env.LEAD_NOTIFICATION_TO   || "monunegi1190@gmail.com",
        subject: `New lead: ${lead.name || lead.email}`,
        html: buildTeamNotificationHtml(lead),
      });
      if (error) console.error("[Resend Error]", error);
      else console.log("[Resend Success] Notification sent", data);
    } catch (err) {
      console.error("[Resend Exception]", err);
    }

    // 2. Send CLIENT the report FROM ravelo.9283@gmail.com (with PDF attached)
    try {
      // Build the PDF separately so a PDF failure never blocks the email.
      let attachments: { filename: string; content: Buffer; contentType: string }[] = [];
      try {
        const pdf = await buildClientReportPdf(lead);
        attachments = [{ filename: "Ravelo-Cost-of-Manual-Work-Report.pdf", content: pdf, contentType: "application/pdf" }];
      } catch (pdfErr) {
        console.error("[PDF Error] Falling back to email without attachment", pdfErr);
      }

      await gmailTransporter.sendMail({
        from: `"Ravelo" <${process.env.GMAIL_USER || "ravelo.9283@gmail.com"}>`,
        to:   lead.email,
        subject: "Your Cost of Manual Work Report – Ravelo",
        html: buildClientReportHtml(lead),
        attachments,
      });
      console.log(`[Gmail Success] Report sent to: ${lead.email} (PDF attached: ${attachments.length > 0})`);
    } catch (err) {
      console.error("[Gmail Error]", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Lead error]", err);
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
