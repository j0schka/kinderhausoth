import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { generateApplicationPdf } from "@/lib/generatePdf";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const VORSTAND_EMAIL = "vorstand@kinderhaus-onkel-tom.org";
const FROM_EMAIL = "Kinderhaus Onkel Tom <noreply@kinderhaus-onkel-tom.org>";

const intervalLabel: Record<string, string> = {
  einmalig: "Einmalig",
  monatlich: "Monatlich",
  jaehrlich: "Jährlich",
};

function formatIBAN(iban: string) {
  return iban.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
}

// ─── Spender-Bestätigung ──────────────────────────────────────────────────────
function donorEmail(data: Record<string, unknown>): string {
  const amount = data.customAmount ? parseFloat(data.customAmount as string) : data.amount;
  const interval = intervalLabel[(data.interval as string) ?? "einmalig"];
  const isRecurring = data.interval !== "einmalig";
  const ibanMasked = `•••• •••• •••• ${String(data.iban ?? "").replace(/\s/g, "").slice(-4)}`;

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Deine Förderbestätigung</title>
</head>
<body style="margin:0;padding:0;background:#FFF9EE;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF9EE;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <!-- Header -->
        <tr>
          <td style="padding-bottom:24px;text-align:center;">
            <span style="font-size:40px;">🏡</span>
            <h1 style="margin:8px 0 4px;font-size:22px;font-weight:900;color:#2D3436;">Kinderhaus Onkel Tom</h1>
            <p style="margin:0;font-size:13px;color:#8B5E3C;font-weight:600;">Förderbestätigung</p>
          </td>
        </tr>

        <!-- Hero -->
        <tr>
          <td style="background:linear-gradient(135deg,#FFD93D,#FF6B6B);border-radius:20px;border:2px solid #2D3436;padding:28px;text-align:center;margin-bottom:24px;">
            <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#2D3436;">Vielen herzlichen Dank, ${data.firstName}! 💛</p>
            <p style="margin:0;font-size:40px;font-weight:900;color:#2D3436;">${amount} €</p>
            <p style="margin:6px 0 0;font-size:14px;font-weight:700;color:#2D3436;">${interval}</p>
          </td>
        </tr>

        <!-- Spacer -->
        <tr><td style="height:20px;"></td></tr>

        <!-- Details -->
        <tr>
          <td style="background:white;border-radius:20px;border:2px solid #2D3436;padding:24px;">
            <h2 style="margin:0 0 16px;font-size:15px;font-weight:900;color:#2D3436;">📋 Deine Förderdetails</h2>
            <table width="100%" cellpadding="6" cellspacing="0">
              <tr style="border-bottom:1px solid #f1f2f6;">
                <td style="font-size:13px;color:#8B5E3C;font-weight:600;white-space:nowrap;">Name</td>
                <td style="font-size:13px;color:#2D3436;font-weight:700;text-align:right;">${data.salutation ? data.salutation + " " : ""}${data.firstName} ${data.lastName}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f2f6;">
                <td style="font-size:13px;color:#8B5E3C;font-weight:600;">Betrag</td>
                <td style="font-size:13px;color:#2D3436;font-weight:700;text-align:right;">${amount} €</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f2f6;">
                <td style="font-size:13px;color:#8B5E3C;font-weight:600;">Zahlungsrhythmus</td>
                <td style="font-size:13px;color:#2D3436;font-weight:700;text-align:right;">${interval}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f2f6;">
                <td style="font-size:13px;color:#8B5E3C;font-weight:600;">Zahlungsart</td>
                <td style="font-size:13px;color:#2D3436;font-weight:700;text-align:right;">SEPA-Lastschrift</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#8B5E3C;font-weight:600;">IBAN (Ende)</td>
                <td style="font-size:13px;color:#2D3436;font-weight:700;text-align:right;">${ibanMasked}</td>
              </tr>
              ${data.message ? `<tr style="border-top:1px solid #f1f2f6;">
                <td style="font-size:13px;color:#8B5E3C;font-weight:600;">Deine Nachricht</td>
                <td style="font-size:13px;color:#2D3436;font-weight:700;text-align:right;">${data.message}</td>
              </tr>` : ""}
            </table>
          </td>
        </tr>

        <!-- Spacer -->
        <tr><td style="height:20px;"></td></tr>

        <!-- SEPA info -->
        <tr>
          <td style="background:#EFF8FF;border-radius:20px;border:1.5px solid #4DA8FF;padding:20px;">
            <h2 style="margin:0 0 12px;font-size:15px;font-weight:900;color:#2D3436;">🏦 SEPA-Lastschriftmandat</h2>
            <p style="margin:0 0 8px;font-size:13px;color:#636e72;font-weight:600;line-height:1.6;">
              Du hast uns ein SEPA-Lastschriftmandat erteilt. Wir werden den Betrag von <strong style="color:#2D3436;">${amount} €</strong> (${interval.toLowerCase()}) von deinem Konto einziehen.
            </p>
            <p style="margin:0 0 8px;font-size:13px;color:#636e72;font-weight:600;line-height:1.6;">
              <strong style="color:#2D3436;">Kontoinhaber:</strong> ${data.accountHolder}<br/>
              <strong style="color:#2D3436;">IBAN:</strong> ${ibanMasked}
            </p>
            <p style="margin:0;font-size:12px;color:#8B5E3C;font-weight:600;line-height:1.6;">
              Du kannst die Lastschrift innerhalb von <strong>8 Wochen</strong> ab Buchungsdatum bei deiner Bank zurückbuchen lassen.
            </p>
          </td>
        </tr>

        <!-- Spacer -->
        <tr><td style="height:20px;"></td></tr>

        ${isRecurring ? `<!-- Cancellation -->
        <tr>
          <td style="background:#F0FFF4;border-radius:20px;border:1.5px solid #6BCB77;padding:20px;">
            <h2 style="margin:0 0 12px;font-size:15px;font-weight:900;color:#2D3436;">✉️ Förderung kündigen</h2>
            <p style="margin:0 0 8px;font-size:13px;color:#636e72;font-weight:600;line-height:1.6;">
              Deine ${interval.toLowerCase()}e Förderung kannst du jederzeit und ohne Angabe von Gründen kündigen – einfach per E-Mail an uns:
            </p>
            <p style="margin:0;text-align:center;">
              <a href="mailto:${VORSTAND_EMAIL}?subject=Kündigung%20Förderung%20${encodeURIComponent((data.firstName as string) + " " + (data.lastName as string))}" style="display:inline-block;background:#6BCB77;color:#2D3436;font-weight:900;font-size:14px;padding:10px 20px;border-radius:9999px;text-decoration:none;border:2px solid #2D3436;">
                ${VORSTAND_EMAIL}
              </a>
            </p>
            <p style="margin:8px 0 0;font-size:12px;color:#8B5E3C;font-weight:600;text-align:center;">
              Bitte nenne deinen Namen und deine IBAN (letzte 4 Stellen).
            </p>
          </td>
        </tr>
        <tr><td style="height:20px;"></td></tr>` : ""}

        <!-- Receipt note -->
        ${data.receiptWanted ? `<tr>
          <td style="background:#FFFBEA;border-radius:16px;border:1.5px solid #FFD93D;padding:16px;">
            <p style="margin:0;font-size:13px;color:#636e72;font-weight:600;line-height:1.6;">
              📋 <strong style="color:#2D3436;">Spendenquittung:</strong> Du erhältst deine Spendenquittung nach Eingang der Zahlung per Post an:<br/>
              <span style="color:#2D3436;">${data.street} ${data.houseNumber}, ${data.zip} ${data.city}</span>
            </p>
          </td>
        </tr>
        <tr><td style="height:20px;"></td></tr>` : ""}

        <!-- Footer -->
        <tr>
          <td style="text-align:center;padding-top:8px;">
            <p style="margin:0 0 4px;font-size:12px;color:#b2bec3;font-weight:600;">
              Kinderhaus Onkel Tom e.V. · ${VORSTAND_EMAIL}
            </p>
            <p style="margin:0;font-size:11px;color:#b2bec3;">
              Diese E-Mail wurde automatisch generiert. Bitte nicht direkt antworten.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Vorstand-Kopie ───────────────────────────────────────────────────────────
function vorstandEmail(data: Record<string, unknown>): string {
  const amount = data.customAmount ? parseFloat(data.customAmount as string) : data.amount;
  const interval = intervalLabel[(data.interval as string) ?? "einmalig"];
  const ibanFull = formatIBAN(data.iban as string);
  const now = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>Neuer Förderantrag</title>
</head>
<body style="margin:0;padding:0;background:#f8f9fa;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <!-- Header -->
        <tr>
          <td style="background:#2D3436;border-radius:16px 16px 0 0;padding:20px 24px;">
            <h1 style="margin:0;font-size:18px;font-weight:900;color:#FFD93D;">🏡 Neuer Förderantrag eingegangen</h1>
            <p style="margin:4px 0 0;font-size:12px;color:#b2bec3;">${now} Uhr</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:white;border:2px solid #2D3436;border-top:none;border-radius:0 0 16px 16px;padding:24px;">

            <!-- Amount highlight -->
            <div style="background:#FFFBEA;border:1.5px solid #FFD93D;border-radius:12px;padding:16px;text-align:center;margin-bottom:20px;">
              <p style="margin:0;font-size:32px;font-weight:900;color:#2D3436;">${amount} €</p>
              <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#8B5E3C;">${interval} · SEPA-Lastschrift</p>
            </div>

            <h2 style="margin:0 0 12px;font-size:14px;font-weight:900;color:#2D3436;">👤 Förderer</h2>
            <table width="100%" cellpadding="5" cellspacing="0" style="font-size:13px;margin-bottom:20px;">
              <tr style="border-bottom:1px solid #f1f2f6;">
                <td style="color:#8B5E3C;font-weight:600;width:140px;">Name</td>
                <td style="color:#2D3436;font-weight:700;">${data.salutation ? data.salutation + " " : ""}${data.firstName} ${data.lastName}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f2f6;">
                <td style="color:#8B5E3C;font-weight:600;">E-Mail</td>
                <td style="color:#2D3436;font-weight:700;"><a href="mailto:${data.email}" style="color:#4DA8FF;">${data.email}</a></td>
              </tr>
              ${data.receiptWanted ? `<tr style="border-bottom:1px solid #f1f2f6;">
                <td style="color:#8B5E3C;font-weight:600;">Adresse</td>
                <td style="color:#2D3436;font-weight:700;">${data.street} ${data.houseNumber}, ${data.zip} ${data.city}</td>
              </tr>` : ""}
              ${data.message ? `<tr>
                <td style="color:#8B5E3C;font-weight:600;">Nachricht</td>
                <td style="color:#2D3436;font-weight:700;">${data.message}</td>
              </tr>` : ""}
            </table>

            <h2 style="margin:0 0 12px;font-size:14px;font-weight:900;color:#2D3436;">🏦 Bankdaten für den Lastschrifteinzug</h2>
            <table width="100%" cellpadding="5" cellspacing="0" style="font-size:13px;margin-bottom:20px;">
              <tr style="border-bottom:1px solid #f1f2f6;">
                <td style="color:#8B5E3C;font-weight:600;width:140px;">Kontoinhaber</td>
                <td style="color:#2D3436;font-weight:700;">${data.accountHolder}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f2f6;">
                <td style="color:#8B5E3C;font-weight:600;">IBAN</td>
                <td style="color:#2D3436;font-weight:700;letter-spacing:0.05em;">${ibanFull}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f2f6;">
                <td style="color:#8B5E3C;font-weight:600;">Betrag</td>
                <td style="color:#2D3436;font-weight:700;">${amount} €</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f2f6;">
                <td style="color:#8B5E3C;font-weight:600;">Rhythmus</td>
                <td style="color:#2D3436;font-weight:700;">${interval}</td>
              </tr>
              <tr>
                <td style="color:#8B5E3C;font-weight:600;">Spendenquittung</td>
                <td style="color:#2D3436;font-weight:700;">${data.receiptWanted ? "✅ Ja" : "Nein"}</td>
              </tr>
            </table>

            <div style="background:#F0FFF4;border:1.5px solid #6BCB77;border-radius:12px;padding:14px;">
              <p style="margin:0;font-size:13px;color:#2D3436;font-weight:700;">✅ Nächste Schritte</p>
              <ul style="margin:8px 0 0;padding-left:16px;font-size:13px;color:#636e72;font-weight:600;line-height:1.8;">
                <li>Lastschriftmandat im System anlegen</li>
                <li>Ersten Einzug planen (${interval.toLowerCase()}er Rhythmus)</li>
                ${data.receiptWanted ? "<li>Spendenquittung nach erstem Einzug erstellen</li>" : ""}
              </ul>
            </div>
          </td>
        </tr>

        <tr>
          <td style="padding-top:16px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#b2bec3;">Automatisch generiert · Kinderhaus Onkel Tom Förderantrag</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── API Handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const amount = data.customAmount ? parseFloat(data.customAmount) : data.amount;
    const interval = intervalLabel[data.interval ?? "einmalig"];

    const resend = getResend();

    // Generate PDF once, attach to both emails
    const pdfBuffer = await generateApplicationPdf(data);
    const pdfName = `Foerderantrag_${data.lastName}_${data.firstName}.pdf`.replace(/\s/g, "_");
    const pdfAttachment = {
      filename: pdfName,
      content: pdfBuffer,
    };

    const [donorResult, vorstandResult] = await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [data.email as string],
        subject: `Deine Förderbestätigung – ${amount} € ${interval} 💛`,
        html: donorEmail(data),
        attachments: [pdfAttachment],
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [VORSTAND_EMAIL],
        subject: `Neuer Förderantrag: ${data.firstName} ${data.lastName} – ${amount} € ${interval}`,
        html: vorstandEmail(data),
        attachments: [pdfAttachment],
      }),
    ]);

    if (donorResult.error || vorstandResult.error) {
      console.error("Resend error:", donorResult.error ?? vorstandResult.error);
      return NextResponse.json({ error: "E-Mail-Versand fehlgeschlagen" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Interner Fehler" }, { status: 500 });
  }
}
