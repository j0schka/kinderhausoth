import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  Font,
} from "@react-pdf/renderer";

// Use built-in Helvetica — no external font fetch needed on Vercel
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontSize: 10,
    color: "#2D3436",
  },
  // Header
  header: {
    backgroundColor: "#FFD93D",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#2D3436",
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 10,
    color: "#8B5E3C",
  },
  headerDate: {
    fontSize: 9,
    color: "#8B5E3C",
    textAlign: "right",
  },
  // Section
  section: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: "#F8F6F0",
    padding: "8 12",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#2D3436",
  },
  sectionBody: {
    padding: "10 12",
  },
  // Row
  row: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f6",
  },
  rowLast: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  label: {
    width: "40%",
    color: "#8B5E3C",
    fontSize: 9,
  },
  value: {
    width: "60%",
    fontFamily: "Helvetica-Bold",
    color: "#2D3436",
    fontSize: 10,
  },
  // Highlight box
  highlight: {
    backgroundColor: "#FFFBEA",
    borderWidth: 1,
    borderColor: "#FFD93D",
    borderRadius: 6,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  highlightAmount: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#2D3436",
  },
  highlightInterval: {
    fontSize: 11,
    color: "#8B5E3C",
    marginTop: 2,
  },
  // Note box
  noteBox: {
    backgroundColor: "#EFF8FF",
    borderWidth: 1,
    borderColor: "#4DA8FF",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  noteText: {
    fontSize: 9,
    color: "#636e72",
    lineHeight: 1.5,
  },
  // Footer
  footer: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#b2bec3",
  },
});

function formatIBAN(iban: string) {
  return iban.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
}

// Smart payment label: combines interval + method
function getPaymentLabel(interval: string, method: string): string {
  if (method === "sepa") {
    return interval === "monatlich" ? "SEPA-Lastschrift (monatlich)" : "Einmalige Lastschrift";
  }
  if (method === "dauerauftrag") {
    return interval === "monatlich" ? "Dauerauftrag (monatlich)" : "Einmalige Überweisung";
  }
  return method;
}

function getNoteText(interval: string, method: string, amount: number): string {
  if (method === "sepa" && interval === "monatlich") {
    return `Mit diesem Antrag wurde ein SEPA-Lastschriftmandat erteilt. Der Betrag von ${amount} € wird monatlich vom angegebenen Konto eingezogen. Eine Rückbuchung ist innerhalb von 8 Wochen ab Buchungsdatum möglich.`;
  }
  if (method === "sepa" && interval === "einmalig") {
    return `Mit diesem Antrag wurde ein einmaliges SEPA-Lastschriftmandat erteilt. Der Betrag von ${amount} € wird einmalig vom angegebenen Konto eingezogen. Eine Rückbuchung ist innerhalb von 8 Wochen ab Buchungsdatum möglich.`;
  }
  if (method === "dauerauftrag" && interval === "monatlich") {
    return `Bitte richte einen monatlichen Dauerauftrag über ${amount} € in deinem Online-Banking ein. Die Kontodaten des Vereins findest du in der Bestätigungs-E-Mail.`;
  }
  // einmalig + dauerauftrag = einmalige Überweisung
  return `Bitte überweise den Betrag von ${amount} € einmalig an die Vereins-IBAN. Die Kontodaten findest du in der Bestätigungs-E-Mail.`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateApplicationPdf(data: Record<string, any>): Promise<Buffer> {
  const amount = data.customAmount ? parseFloat(data.customAmount) : data.amount;
  const interval = data.interval ?? "einmalig";
  const method = data.paymentMethod ?? "sepa";
  const paymentLabel = getPaymentLabel(interval, method);
  const noteText = getNoteText(interval, method, amount);
  const now = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });
  const isSepa = method === "sepa";

  const doc = (
    <Document
      title={`Förderantrag – ${data.firstName} ${data.lastName}`}
      author="Kinderhaus Onkel Tom"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Kinderhaus Onkel Tom</Text>
            <Text style={styles.headerSub}>Förderantrag – Bestätigung</Text>
          </View>
          <Text style={styles.headerDate}>Datum: {now}</Text>
        </View>

        {/* Amount highlight */}
        <View style={styles.highlight}>
          <View>
            <Text style={styles.highlightAmount}>{amount} €</Text>
            <Text style={styles.highlightInterval}>{paymentLabel}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 9, color: "#8B5E3C", textAlign: "right" }}>Förderer</Text>
            <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#2D3436", textAlign: "right" }}>
              {data.firstName} {data.lastName}
            </Text>
          </View>
        </View>

        {/* Personal data */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Persönliche Daten</Text>
          </View>
          <View style={styles.sectionBody}>
            {data.salutation ? (
              <View style={styles.row}>
                <Text style={styles.label}>Anrede</Text>
                <Text style={styles.value}>{data.salutation}</Text>
              </View>
            ) : null}
            <View style={styles.row}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{data.firstName} {data.lastName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>E-Mail</Text>
              <Text style={styles.value}>{data.email}</Text>
            </View>
            {data.receiptWanted && (
              <>
                <View style={styles.row}>
                  <Text style={styles.label}>Straße</Text>
                  <Text style={styles.value}>{data.street} {data.houseNumber}</Text>
                </View>
                <View style={styles.rowLast}>
                  <Text style={styles.label}>PLZ / Ort</Text>
                  <Text style={styles.value}>{data.zip} {data.city}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Förderdetails */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Förderdetails</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.row}>
              <Text style={styles.label}>Betrag</Text>
              <Text style={styles.value}>{amount} €</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Zahlungsart</Text>
              <Text style={styles.value}>{paymentLabel}</Text>
            </View>
            <View style={styles.rowLast}>
              <Text style={styles.label}>Spendenquittung</Text>
              <Text style={styles.value}>{data.receiptWanted ? "Ja, gewünscht" : "Nein"}</Text>
            </View>
            {data.message ? (
              <View style={styles.row}>
                <Text style={styles.label}>Nachricht</Text>
                <Text style={styles.value}>{data.message}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Bankdaten (nur SEPA) */}
        {isSepa && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{interval === "monatlich" ? "SEPA-Lastschriftmandat" : "Einmalige Lastschrift – Bankdaten"}</Text>
            </View>
            <View style={styles.sectionBody}>
              <View style={styles.row}>
                <Text style={styles.label}>Kontoinhaber</Text>
                <Text style={styles.value}>{data.accountHolder}</Text>
              </View>
              <View style={styles.rowLast}>
                <Text style={styles.label}>IBAN</Text>
                <Text style={styles.value}>{formatIBAN(data.iban)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{noteText}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Kinderhaus Onkel Tom e.V. · vorstand@kinderhaus-onkel-tom.org</Text>
          <Text style={styles.footerText}>Automatisch generiert am {now}</Text>
        </View>
      </Page>
    </Document>
  );

  return await renderToBuffer(doc);
}
