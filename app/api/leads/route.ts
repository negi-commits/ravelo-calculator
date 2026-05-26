import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { formatMoney } from "@/lib/currency";
import { Resend } from "resend";

const LeadSchema = z.object({
  name:    z.string().optional(),
  email:   z.string().email(),
  company: z.string().optional(),
  source:  z.string().default("cost-calculator"),
  payload: z.any().optional(),
});

function buildEmailHtml(lead: { name?: string; email: string; source: string; payload?: any }) {
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
            full: { bg: "#e2fbe8", text: "#1b5e20" },
            partial: { bg: "#fff3e0", text: "#e65100" },
            unlikely: { bg: "#ffebee", text: "#c62828" },
          };
          const colors = badgeColors[automatability] || { bg: "#f5f5f5", text: "#616161" };

          return `
            <tr>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-size: 14px;"><strong>${taskName}</strong></td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-align: center;">${people}</td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-align: center;">${mins}m (${freq})</td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-align: center;">
                <span style="background-color: ${colors.bg}; color: ${colors.text}; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 11px; text-transform: uppercase;">
                  ${automatability}
                </span>
              </td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-align: center;">${yearlyHours.toLocaleString()} hrs</td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-align: right; font-weight: 600; color: #3b82f6;">${yearlyCost}</td>
            </tr>
          `;
        })
        .join("");
    }

    resultsHtml = `
      <div style="margin-top: 24px; padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h3 style="margin-top: 0; color: #1e293b; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">📊 Manual Work Cost Analysis</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-size: 15px; color: #475569;"><strong>Total Yearly Hours Lost:</strong></td>
            <td style="padding: 8px 0; font-size: 18px; font-weight: bold; color: #0f172a; text-align: right;">${totalYearlyHours.toLocaleString()} hrs</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 15px; color: #475569;"><strong>Total Yearly Cost of Manual Work:</strong></td>
            <td style="padding: 8px 0; font-size: 22px; font-weight: bold; color: #10b981; text-align: right;">${formattedCost}</td>
          </tr>
        </table>

        ${tasksRows ? `
        <h4 style="margin: 16px 0 8px 0; color: #334155; font-size: 15px;">Task Breakdown</h4>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; min-width: 500px;">
            <thead>
              <tr style="background-color: #f1f5f9; text-align: left;">
                <th style="padding: 8px; font-size: 12px; color: #475569; text-transform: uppercase;">Task</th>
                <th style="padding: 8px; font-size: 12px; color: #475569; text-transform: uppercase; text-align: center;">Staff</th>
                <th style="padding: 8px; font-size: 12px; color: #475569; text-transform: uppercase; text-align: center;">Mins & Freq</th>
                <th style="padding: 8px; font-size: 12px; color: #475569; text-transform: uppercase; text-align: center;">Auto</th>
                <th style="padding: 8px; font-size: 12px; color: #475569; text-transform: uppercase; text-align: right;">Yearly Hours</th>
                <th style="padding: 8px; font-size: 12px; color: #475569; text-transform: uppercase; text-align: right;">Yearly Cost</th>
              </tr>
            </thead>
            <tbody>
              ${tasksRows}
            </tbody>
          </table>
        </div>
        ` : ""}
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Lead Captured</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f6; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e4e8;">
          <div style="background: linear-gradient(135deg, #06060e, #1e1b4b); padding: 30px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">🚀 New Lead Captured</h1>
            <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px;">Ravelo Manual Work Cost Calculator</p>
          </div>
          
          <div style="padding: 30px; color: #334155; line-height: 1.5;">
            <p style="font-size: 16px; margin-top: 0;">Hi Team,</p>
            <p style="font-size: 15px;">A new lead has just submitted their information through the cost calculator tool.</p>
            
            <div style="margin: 20px 0; padding: 16px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #64748b; width: 80px;"><strong>Name:</strong></td>
                  <td style="padding: 4px 0; font-size: 14px; color: #0f172a;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #64748b;"><strong>Email:</strong></td>
                  <td style="padding: 4px 0; font-size: 14px; color: #0f172a;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none; font-weight: 600;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #64748b;"><strong>Source:</strong></td>
                  <td style="padding: 4px 0; font-size: 14px; color: #0f172a;"><span style="background-color: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase;">${source}</span></td>
                </tr>
              </table>
            </div>

            ${resultsHtml}
            
            <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px;">
              This notification was generated automatically by your Ravelo Calculator Lead Engine.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function buildClientReportHtml(lead: { name?: string; email: string; source: string; payload?: any }) {
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
            full: { bg: "#e2fbe8", text: "#1b5e20" },
            partial: { bg: "#fff3e0", text: "#e65100" },
            unlikely: { bg: "#ffebee", text: "#c62828" },
          };
          const colors = badgeColors[automatability] || { bg: "#f5f5f5", text: "#616161" };

          return `
            <tr>
              <td style="padding: 12px 8px; border-bottom: 1px solid #1e1e2e; font-size: 14px; color: #e2e8f0;">${taskName}</td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #1e1e2e; font-size: 14px; text-align: center;">
                <span style="background-color: ${colors.bg}; color: ${colors.text}; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; text-transform: uppercase;">${automatability}</span>
              </td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #1e1e2e; font-size: 14px; text-align: right; color: #94a3b8;">${yearlyHours.toLocaleString()} hrs</td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #1e1e2e; font-size: 14px; text-align: right; font-weight: 600; color: #22d3a5;">${yearlyCost}</td>
            </tr>
          `;
        })
        .join("");
    }
  }

  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><title>Your Cost of Manual Work Report</title></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0d0d1a; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #06060e; border-radius: 12px; overflow: hidden; border: 1px solid #1e1e2e;">
          
          <div style="background: linear-gradient(135deg, #06060e, #1e1b4b); padding: 36px 30px; text-align: center;">
            <p style="margin: 0 0 8px 0; color: #5b8bff; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Ravelo</p>
            <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #ffffff;">Your Manual Work Cost Report</h1>
            <p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px;">Here's what repetitive work is costing your business</p>
          </div>

          <div style="padding: 30px; color: #e2e8f0; line-height: 1.6;">
            <p style="font-size: 16px; margin-top: 0;">Hi ${name},</p>
            <p style="font-size: 15px; color: #94a3b8;">Thanks for using the Ravelo calculator. Based on the tasks you entered, here's your personalized breakdown:</p>

            <div style="background: #0f0f1a; border-radius: 10px; padding: 24px; margin: 24px 0; text-align: center; border: 1px solid #1e1e2e;">
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Total Annual Cost of Manual Work</p>
              <p style="margin: 0; font-size: 36px; font-weight: 700; color: #5b8bff;">${formattedCost}</p>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #475569;">${totalYearlyHours.toLocaleString()} hours lost per year</p>
            </div>

            ${tasksRows ? `
            <h3 style="color: #e2e8f0; font-size: 15px; margin: 24px 0 12px 0;">Task Breakdown</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #0f0f1a;">
                  <th style="padding: 10px 8px; font-size: 11px; color: #475569; text-transform: uppercase; text-align: left;">Task</th>
                  <th style="padding: 10px 8px; font-size: 11px; color: #475569; text-transform: uppercase; text-align: center;">Automation</th>
                  <th style="padding: 10px 8px; font-size: 11px; color: #475569; text-transform: uppercase; text-align: right;">Yearly Hrs</th>
                  <th style="padding: 10px 8px; font-size: 11px; color: #475569; text-transform: uppercase; text-align: right;">Yearly Cost</th>
                </tr>
              </thead>
              <tbody>${tasksRows}</tbody>
            </table>
            ` : ""}

            <div style="margin-top: 32px; padding: 20px; background: linear-gradient(135deg, #0f0f1a, #1e1b4b); border-radius: 10px; text-align: center; border: 1px solid #2d2b6b;">
              <p style="margin: 0 0 8px 0; font-size: 15px; color: #e2e8f0;">Ready to cut this cost?</p>
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748b;">We help businesses automate repetitive work and reclaim thousands of hours.</p>
              <a href="https://ravelo.in" style="display: inline-block; background: #5b8bff; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                Get a Free Consultation →
              </a>
            </div>

            <p style="margin-top: 32px; font-size: 12px; color: #334155; text-align: center; border-top: 1px solid #1e1e2e; padding-top: 20px;">
              Ravelo · You received this because you used our cost calculator.<br>
              <a href="https://ravelo.in" style="color: #475569;">ravelo.in</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lead = LeadSchema.parse(body);

    console.log("[Lead captured]", lead);

    const resendApiKey = process.env.RESEND_API_KEY || "re_xxxxxxxxx";
    const fromEmail = process.env.LEAD_NOTIFICATION_FROM || "onboarding@resend.dev";
    const toEmail = process.env.LEAD_NOTIFICATION_TO || "hrithikiit12@gmail.com";

    try {
      const resend = new Resend(resendApiKey);

      // 1. Send lead notification to YOU
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: `New lead: ${lead.name || lead.email} via ${lead.source}`,
        html: buildEmailHtml(lead),
      });

      if (error) {
        console.error("[Resend Error - notification]", error);
      } else {
        console.log("[Resend Success - notification]", data);
      }

      // 2. Send the report to the CLIENT
      const { data: clientData, error: clientError } = await resend.emails.send({
        from: fromEmail,
        to: lead.email,
        subject: "Your Cost of Manual Work Report – Ravelo",
        html: buildClientReportHtml(lead),
      });

      if (clientError) {
        console.error("[Resend Error - client report]", clientError);
      } else {
        console.log("[Resend Success - client report]", clientData);
      }

    } catch (err) {
      console.error("[Resend Exception]", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Lead error]", err);
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
