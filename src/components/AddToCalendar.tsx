"use client";

function escapeIcs(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll("\n", "\\n");
}

export default function AddToCalendar() {
  const download = () => {
    const site = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//For Ani//Birthday Surprise//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:ani-birthday-2026@birthday-surprise",
      `DTSTAMP:${new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
      "DTSTART:20261020T180000Z",
      "DTEND:20261020T183000Z",
      `SUMMARY:${escapeIcs("Ani’s birthday surprise is ready")}`,
      `DESCRIPTION:${escapeIcs(`Your surprise is ready. Open it here: ${site}`)}`,
      `URL:${site}`,
      "BEGIN:VALARM",
      "TRIGGER:PT0M",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeIcs("Ani’s birthday surprise is ready 🎁")}`,
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ani-birthday-surprise.ics";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return <button className="calendar-button" type="button" onClick={download}>＋ Add to calendar</button>;
}
