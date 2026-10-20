"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import AddToCalendar from "@/components/AddToCalendar";
import { AniPhoto } from "@/components/AniPhoto";
import { useSfx } from "@/lib/sfx";

interface TimeSnapshot {
  serverNow: number;
  unlockAt: number;
  sampledAt: number;
}

const starIds = Array.from({ length: 22 }, (_, index) => index);

export default function LockedExperience({ unlockAt }: { unlockAt: number }) {
  const router = useRouter();
  const { play } = useSfx();
  const [snapshot, setSnapshot] = useState<TimeSnapshot | null>(null);
  const [monotonicNow, setMonotonicNow] = useState(0);
  const revealStarted = useRef(false);

  useEffect(() => {
    let active = true;
    const readServerTime = async () => {
      try {
        const response = await fetch("/api/time", { cache: "no-store" });
        if (!response.ok) return;
        const value = await response.json() as { serverNow: number; unlockAt: number };
        if (active) setSnapshot({ ...value, sampledAt: performance.now() });
      } catch {
        // Keep the last server timestamp; never use the device wall clock as authority.
      }
    };
    void readServerTime();
    const poll = window.setInterval(readServerTime, 3000);
    const ticker = window.setInterval(() => setMonotonicNow(performance.now()), 250);
    return () => {
      active = false;
      window.clearInterval(poll);
      window.clearInterval(ticker);
    };
  }, []);

  const remaining = snapshot
    ? Math.max(0, (snapshot.unlockAt || unlockAt) - (snapshot.serverNow + Math.max(0, monotonicNow - snapshot.sampledAt)))
    : null;

  const visibleSecond = remaining === null ? null : Math.floor(remaining / 1000);
  const lastSecond = useRef<number | null>(null);
  useEffect(() => {
    if (visibleSecond === null || lastSecond.current === visibleSecond) return;
    if (lastSecond.current !== null && visibleSecond < lastSecond.current) play("counter-tick");
    lastSecond.current = visibleSecond;
  }, [play, visibleSecond]);

  useEffect(() => {
    if (remaining !== 0 || revealStarted.current) return;
    revealStarted.current = true;
    play("gift-open");
    play("confetti");
    const revealTimer = window.setTimeout(() => router.refresh(), 2400);
    return () => window.clearTimeout(revealTimer);
  }, [play, remaining, router]);

  const opened = remaining === 0;

  const seconds = remaining === null ? null : Math.floor(remaining / 1000);
  const countdown = seconds === null ? ["--", "--", "--", "--"] : [
    String(Math.floor(seconds / 86_400)).padStart(2, "0"),
    String(Math.floor((seconds % 86_400) / 3600)).padStart(2, "0"),
    String(Math.floor((seconds % 3600) / 60)).padStart(2, "0"),
    String(seconds % 60).padStart(2, "0"),
  ];

  return (
    <main className={`lock-screen locked-experience ${opened ? "unlocking" : ""}`}>
      <div className="ambient-orb orb-one" /><div className="ambient-orb orb-two" />
      <div className="locked-stars" aria-hidden="true">{starIds.map((star) => <i key={star} style={{ "--star-index": star, "--star-top": `${(star * 37 + 8) % 100}%`, "--star-left": `${(star * 61 + 4) % 100}%` } as CSSProperties}>✦</i>)}</div>
      <div className="locked-layout">
        <div className="locked-photo-wrap"><div className="locked-balloons" aria-hidden="true"><i>♡</i><i>✦</i><i>♡</i><i>✧</i></div><AniPhoto chapter="lock" /><span className="photo-caption">A little birthday magic, just for you</span></div>
        <div className="locked-copy glass-card">
          <p className="eyebrow"><i /> A GIFT, MADE JUST FOR YOU <i /></p>
          <h1>Ani, your surprise<br /><em>opens at midnight</em></h1>
          <p className="locked-message">Ani, your surprise opens at midnight on 21 October... 🎁</p>
          <div className="locked-countdown" aria-label="Time remaining until 21 October at midnight in Dhaka">
            {countdown.map((unit, index) => <span className="countdown-unit" key={index}><b>{unit}</b><small>{["days", "hours", "minutes", "seconds"][index]}</small></span>)}
            <i>:</i><i>:</i><i>:</i>
          </div>
          <div className={`locked-gift ${opened ? "gift-unsealed" : ""}`} aria-hidden="true"><span>🎁</span><i /></div>
          <AddToCalendar />
        </div>
      </div>
      <p className="lock-signature">the stars are keeping your surprise safe · S</p>
      {opened && <div className="confetti-layer unlock-confetti" aria-hidden="true">{Array.from({ length: 52 }, (_, index) => <i key={index} style={{ "--x": `${(index * 41 + 11) % 100}%`, "--delay": `${(index % 9) * 0.04}s`, "--spin": `${index * 47}deg`, "--hue": `${(index * 31 + 32) % 360}` } as CSSProperties} />)}</div>}
      {opened && <div className="unlock-light" aria-hidden="true" />}
    </main>
  );
}
