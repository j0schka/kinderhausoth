import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung – Kinderhaus",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="card mb-5">
    <h2 className="font-black text-lg mb-3" style={{ color: "#2D3436" }}>
      {title}
    </h2>
    <div className="text-sm font-semibold leading-relaxed space-y-2" style={{ color: "#636e72" }}>
      {children}
    </div>
  </div>
);

export default function Datenschutz() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #FFF9EE 0%, #FFF0C8 100%)" }}
    >
      {/* Header */}
      <header className="w-full px-4 pt-5 pb-3 flex items-center gap-2 max-w-lg mx-auto">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="text-3xl">🏡</span>
          <div>
            <p className="font-black text-base leading-tight" style={{ color: "#2D3436" }}>
              Kinderhaus
            </p>
            <p className="text-xs font-semibold" style={{ color: "#8B5E3C" }}>
              Förderantrag
            </p>
          </div>
        </Link>
      </header>

      <main className="flex-1 px-4 pb-10 max-w-lg mx-auto w-full">
        <div className="pt-2 mb-6">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm font-bold mb-5"
            style={{ color: "#8B5E3C", textDecoration: "none" }}
          >
            ← Zurück
          </Link>
          <h1 className="font-black text-2xl mb-1" style={{ color: "#2D3436" }}>
            Datenschutzerklärung 🔒
          </h1>
          <p className="text-sm font-semibold" style={{ color: "#8B5E3C" }}>
            Stand: Juni 2025
          </p>
        </div>

        <Section title="1. Verantwortliche Stelle">
          <p>
            Verantwortlich für die Verarbeitung personenbezogener Daten im Rahmen dieses
            Förderantrags ist:
          </p>
          <div
            className="rounded-xl p-3 mt-2"
            style={{ background: "#FFF9EE", border: "1.5px solid #FFD93D" }}
          >
            <p className="font-black" style={{ color: "#2D3436" }}>Kinderhaus</p>
            <p>[Straße und Hausnummer]</p>
            <p>[PLZ und Ort]</p>
            <p>E-Mail: [kontakt@kinderhaus.de]</p>
          </div>
        </Section>

        <Section title="2. Welche Daten wir erheben">
          <p>Im Rahmen des Förderantrags erheben wir folgende personenbezogene Daten:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Anrede, Vor- und Nachname</li>
            <li>E-Mail-Adresse</li>
            <li>Postanschrift (sofern eine Spendenquittung gewünscht wird)</li>
            <li>IBAN und Kontoinhaber (für SEPA-Lastschrift)</li>
            <li>Betrag, Zahlungsrhythmus und optionale Nachricht</li>
          </ul>
        </Section>

        <Section title="3. Zweck und Rechtsgrundlage der Verarbeitung">
          <p>
            Wir verarbeiten deine Daten ausschließlich zur Abwicklung deines Förderantrags und
            der damit verbundenen Zahlung. Die Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
            (Vertragserfüllung) sowie Art. 6 Abs. 1 lit. c DSGVO (gesetzliche Aufbewahrungspflichten,
            z.&nbsp;B. steuerrechtliche Nachweispflichten).
          </p>
          <p>
            Sofern du eine Spendenquittung anforderst, verarbeiten wir deine Adressdaten
            zusätzlich auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO.
          </p>
        </Section>

        <Section title="4. SEPA-Lastschriftmandat">
          <p>
            Mit der Erteilung des SEPA-Lastschriftmandats ermächtigst du uns, den angegebenen
            Betrag von deinem Konto einzuziehen. Deine Bankdaten (IBAN, Kontoinhaber) werden
            ausschließlich zur Abwicklung der Zahlung genutzt und nicht an Dritte weitergegeben,
            außer an die zur Zahlungsabwicklung beauftragten Kreditinstitute.
          </p>
          <p>
            Du kannst eine Lastschrift innerhalb von 8 Wochen ab Buchungsdatum bei deiner Bank
            zurückbuchen lassen.
          </p>
        </Section>

        <Section title="5. Weitergabe an Dritte">
          <p>
            Deine Daten werden nicht an Dritte verkauft oder zu Werbezwecken weitergegeben.
            Eine Übermittlung erfolgt nur, soweit dies zur Vertragsabwicklung notwendig ist
            (z.&nbsp;B. Zahlungsdienstleister, Steuerberater) oder gesetzliche Verpflichtungen
            dies erfordern.
          </p>
        </Section>

        <Section title="6. Speicherdauer">
          <p>
            Wir speichern deine Daten nur so lange, wie es für die genannten Zwecke erforderlich
            ist oder gesetzliche Aufbewahrungsfristen bestehen. Steuerlich relevante Unterlagen
            (z.&nbsp;B. Spendenquittungen) bewahren wir gemäß § 147 AO für 10 Jahre auf.
          </p>
          <p>
            Bankdaten werden nach vollständiger Abwicklung aller Zahlungen gelöscht, sofern
            keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </p>
        </Section>

        <Section title="7. Deine Rechte">
          <p>Du hast jederzeit das Recht auf:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong style={{ color: "#2D3436" }}>Auskunft</strong> über deine gespeicherten Daten
              (Art. 15 DSGVO)
            </li>
            <li>
              <strong style={{ color: "#2D3436" }}>Berichtigung</strong> unrichtiger Daten
              (Art. 16 DSGVO)
            </li>
            <li>
              <strong style={{ color: "#2D3436" }}>Löschung</strong> deiner Daten, sofern keine
              Aufbewahrungspflichten entgegenstehen (Art. 17 DSGVO)
            </li>
            <li>
              <strong style={{ color: "#2D3436" }}>Einschränkung</strong> der Verarbeitung
              (Art. 18 DSGVO)
            </li>
            <li>
              <strong style={{ color: "#2D3436" }}>Widerspruch</strong> gegen die Verarbeitung
              (Art. 21 DSGVO)
            </li>
            <li>
              <strong style={{ color: "#2D3436" }}>Datenübertragbarkeit</strong> (Art. 20 DSGVO)
            </li>
          </ul>
          <p className="mt-2">
            Zur Ausübung deiner Rechte wende dich bitte an: [kontakt@kinderhaus.de]
          </p>
          <p>
            Du hast außerdem das Recht, dich bei der zuständigen Datenschutzaufsichtsbehörde
            zu beschweren.
          </p>
        </Section>

        <Section title="8. Datensicherheit">
          <p>
            Alle Daten werden verschlüsselt über HTTPS übertragen. Wir treffen technische und
            organisatorische Maßnahmen, um deine Daten vor unbefugtem Zugriff, Verlust oder
            Missbrauch zu schützen.
          </p>
        </Section>

        <Section title="9. Hosting">
          <p>
            Diese Website wird über Vercel Inc., 340 Pine Street, Suite 900, San Francisco,
            CA 94104, USA gehostet. Beim Aufruf der Seite können Zugriffsdaten (IP-Adresse,
            Zeitpunkt, aufgerufene Seiten) in Server-Logs gespeichert werden. Details findest
            du in der{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#4DA8FF" }}
            >
              Datenschutzerklärung von Vercel
            </a>
            .
          </p>
        </Section>

        <Section title="10. Änderungen dieser Erklärung">
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen. Die
            jeweils aktuelle Fassung ist auf dieser Seite abrufbar. Stand: Juni 2025.
          </p>
        </Section>

        <div className="text-center mt-8 mb-4">
          <Link href="/">
            <button className="btn-secondary" style={{ width: "auto", display: "inline-flex" }}>
              ← Zurück zum Förderantrag
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
