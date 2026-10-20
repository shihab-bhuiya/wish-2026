"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { galleryImages } from "@/assets/gallery";
import {
  chapters,
  chat,
  chatLabels,
  experienceCopy,
  finalMessage,
  futureWishes,
  jarWishes,
  letter,
  photos,
  prayers,
  presentWishes,
  qualities,
  recipient,
  randomWishes,
  scratchCards,
  secretMessages,
} from "@/data/content";

const sparklePieces = Array.from({ length: 34 }, (_, i) => i);

function Confetti({ burst }: { burst: number }) {
  if (!burst) return null;
  return (
    <div className="confetti-layer" aria-hidden="true" key={burst}>
      {Array.from({ length: 58 }, (_, i) => (
        <i
          key={`${burst}-${i}`}
          style={{
            "--x": `${(i * 37 + 13) % 100}%`,
            "--delay": `${(i % 9) * 0.035}s`,
            "--spin": `${(i * 83) % 720}deg`,
            "--hue": `${(i * 29 + 26) % 360}`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

function PageHeading({ index }: { index: number }) {
  const info = chapters[index];
  return (
    <header className="chapter-heading">
      <p className="eyebrow"><span>{info.number}</span><i />{info.eyebrow}</p>
      <h1>{info.title}</h1>
    </header>
  );
}

function NextButton({ onClick, children = "Continue" }: { onClick: () => void; children?: string }) {
  return (
    <button className="next-button" onClick={onClick}>
      <span>{children}</span><b aria-hidden="true">→</b>
    </button>
  );
}

function TypedText({ text }: { text: string }) {
  const [visibleLength, setVisibleLength] = useState(0);
  useEffect(() => {
    let length = 0;
    const timer = window.setInterval(() => {
      length = Math.min(text.length, length + 4);
      setVisibleLength(length);
      if (length >= text.length) window.clearInterval(timer);
    }, 22);
    return () => window.clearInterval(timer);
  }, [text]);
  return <span aria-label={text}>{text.slice(0, visibleLength)}{visibleLength < text.length && <i className="typing-cursor">|</i>}</span>;
}

function GiftScene({ onOpen, onMoon, opened, secret }: { onOpen: () => void; onMoon: () => void; opened: boolean; secret: string }) {
  return (
    <div className="gift-scene">
      <div className="moon-wrap">
        <button className="moon" aria-label={experienceCopy.opening.moonLabel} onClick={onMoon}>☾</button>
        {secret && <span className="moon-secret">{secret}</span>}
      </div>
      <div className="gift-halo" />
      <button className={`gift-box ${opened ? "is-opening" : ""}`} onClick={onOpen} aria-label={experienceCopy.opening.giftLabel}>
        <span className="gift-lid"><i /></span>
        <span className="gift-body"><i className="gift-ribbon" /><i className="gift-bow">♡</i></span>
        <span className="gift-glow" />
      </button>
      <p className="gift-whisper">{experienceCopy.opening.giftMessage}</p>
      <p className="tap-hint">{experienceCopy.opening.tapHint} <span>✦</span></p>
    </div>
  );
}

export default function BirthdayExperience() {
  const [chapter, setChapter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [untilBirthday, setUntilBirthday] = useState("");
  const [giftOpened, setGiftOpened] = useState(false);
  const [moonTaps, setMoonTaps] = useState(0);
  const [moonSecret, setMoonSecret] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [countdownDone, setCountdownDone] = useState(false);
  const [burst, setBurst] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [chatIndex, setChatIndex] = useState(0);
  const [chatReply, setChatReply] = useState("");
  const [chatAnswers, setChatAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [wishCount, setWishCount] = useState(0);
  const [jarWish, setJarWish] = useState("");
  const [scratched, setScratched] = useState<number[]>([]);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [showAllLetter, setShowAllLetter] = useState(false);
  const [cakeTaps, setCakeTaps] = useState(0);
  const [cakeSecret, setCakeSecret] = useState("");
  const [dailyWish, setDailyWish] = useState("");
  const [musicOn, setMusicOn] = useState(false);
  const [musicError, setMusicError] = useState("");
  const [tapSparkles, setTapSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const tapId = useRef(0);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const scratchMoves = useRef<number[]>([0, 0, 0]);
  const scratchDown = useRef<number | null>(null);
  const letterText = letter;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get("preview") === "true";
    const checkDate = () => {
      const now = new Date();
      const unlockAt = new Date(2026, 9, 21, 0, 0, 0);
      const hasArrived = now >= unlockAt;
      setUnlocked(preview || hasArrived);
      if (!hasArrived && !preview) {
        const difference = unlockAt.getTime() - now.getTime();
        const days = Math.floor(difference / 86_400_000);
        const hours = Math.floor((difference % 86_400_000) / 3_600_000);
        const minutes = Math.floor((difference % 3_600_000) / 60_000);
        const seconds = Math.floor((difference % 60_000) / 1_000);
        setUntilBirthday(`${days ? `${days}d ` : ""}${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`);
      }
    };
    checkDate();
    const dateTimer = window.setInterval(checkDate, 1000);
    const loadTimer = window.setTimeout(() => setLoading(false), 900);
    return () => {
      window.clearInterval(dateTimer);
      window.clearTimeout(loadTimer);
    };
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;
    const moveGlow = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", moveGlow, { passive: true });
    return () => window.removeEventListener("pointermove", moveGlow);
  }, []);

  useEffect(() => {
    if (chapter !== 1 || countdownDone) return;
    let currentCount = 3;
    const tick = window.setInterval(() => {
      currentCount -= 1;
      if (currentCount <= 0) {
        window.clearInterval(tick);
        setCountdown(1);
        setCountdownDone(true);
        setBurst((value) => value + 1);
      } else setCountdown(currentCount);
    }, 850);
    return () => window.clearInterval(tick);
  }, [chapter, countdownDone]);

  useEffect(() => {
    if (chapter !== 6) return;
    let currentScore = 0;
    const timer = window.setInterval(() => {
      currentScore = Math.min(500, currentScore + 17);
      setScore(currentScore);
      if (currentScore >= 500) {
        window.clearInterval(timer);
        setBurst((burstValue) => burstValue + 1);
      }
    }, 45);
    return () => window.clearInterval(timer);
  }, [chapter]);

  useEffect(() => {
    if (chapter !== 10) return;
    const canvases = canvasRefs.current;
    canvases.forEach((canvas, index) => {
      if (!canvas || scratched.includes(index)) return;
      const bounds = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, bounds.width * ratio);
      canvas.height = Math.max(1, bounds.height * ratio);
      const context = canvas.getContext("2d");
      if (!context) return;
      context.scale(ratio, ratio);
      const gradient = context.createLinearGradient(0, 0, bounds.width, bounds.height);
      gradient.addColorStop(0, "#d7b77d");
      gradient.addColorStop(0.5, "#f3dfb5");
      gradient.addColorStop(1, "#b6864e");
      context.fillStyle = gradient;
      context.fillRect(0, 0, bounds.width, bounds.height);
      context.fillStyle = "rgba(37, 28, 48, .75)";
      context.font = "600 11px Arial";
      context.textAlign = "center";
      context.fillText("✦  SCRATCH TO REVEAL  ✦", bounds.width / 2, bounds.height / 2 + 4);
    });
  }, [chapter, scratched]);

  useEffect(() => {
    if (!envelopeOpen || showAllLetter || typedLength >= letterText.length) return;
    const timer = window.setInterval(() => {
      setTypedLength((value) => Math.min(letterText.length, value + 7));
    }, 18);
    return () => window.clearInterval(timer);
  }, [envelopeOpen, showAllLetter, typedLength, letterText.length]);

  const goNext = useCallback(() => {
    if (chapter + 1 === 6) setScore(0);
    setChapter((current) => Math.min(chapters.length - 1, current + 1));
  }, [chapter]);

  const replay = () => {
    setChapter(0);
    setScore(0);
    setGiftOpened(false);
    setCountdown(3);
    setCountdownDone(false);
    setCakeTaps(0);
    setCakeSecret("");
    setWishCount(0);
    setJarWish("");
    setScratched([]);
    scratchMoves.current = [0, 0, 0];
    setEnvelopeOpen(false);
    setTypedLength(0);
    setShowAllLetter(false);
    setChatIndex(0);
    setChatReply("");
    setChatAnswers([]);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
      return;
    }
    try {
      await audio.play();
      setMusicOn(true);
      setMusicError("");
    } catch {
      setMusicOn(false);
      setMusicError("Add your MP3 at public/music/birthday.mp3");
    }
  };

  const addTapSparkle = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") return;
    const id = ++tapId.current;
    setTapSparkles((current) => [...current, { id, x: event.clientX, y: event.clientY }]);
    window.setTimeout(() => setTapSparkles((current) => current.filter((sparkle) => sparkle.id !== id)), 800);
  };

  const openGift = () => {
    if (giftOpened) return;
    setGiftOpened(true);
    window.setTimeout(() => setChapter(1), 950);
  };

  const tapMoon = () => {
    const nextTap = moonTaps + 1;
    setMoonTaps(nextTap);
    if (nextTap >= 3) {
      setMoonSecret(secretMessages.moon);
      setMoonTaps(0);
    }
  };

  const chooseChatReply = (reply: string, answer: string) => {
    setChatReply(reply);
    setChatAnswers((current) => {
      const next = [...current];
      next[chatIndex] = answer;
      return next;
    });
    if (chatIndex === 0) window.setTimeout(() => {
      setChatIndex((index) => Math.min(chat.length - 1, index + 1));
      setChatReply("");
    }, 1800);
  };

  const drawScratch = (event: ReactPointerEvent<HTMLCanvasElement>, index: number) => {
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d");
    if (!context || scratched.includes(index)) return;
    const bounds = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    context.globalCompositeOperation = "destination-out";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 28 * ratio;
    const x = (event.clientX - bounds.left) * ratio;
    const y = (event.clientY - bounds.top) * ratio;
    if (scratchDown.current === index) {
      context.lineTo(x, y);
      context.stroke();
    } else {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + 1, y + 1);
      context.stroke();
    }
    scratchDown.current = index;
  };

  const endScratch = (index: number) => {
    scratchDown.current = null;
    if (scratched.includes(index)) return;
    const nextMoves = [...scratchMoves.current];
    nextMoves[index] += 1;
    scratchMoves.current = nextMoves;
    if (nextMoves[index] >= 5) {
      setScratched((current) => [...current, index]);
      setBurst((value) => value + 1);
    }
  };

  if (loading) {
    return <main className="loading-screen"><span className="loader-star">✦</span><p>{experienceCopy.loading}</p><div className="loading-line"><i /></div></main>;
  }

  if (!unlocked) {
    return (
      <main className="lock-screen">
        <div className="ambient-orb orb-one" /><div className="ambient-orb orb-two" />
        <div className="lock-card glass-card">
          <p className="eyebrow"><span>✦</span> {experienceCopy.lock.eyebrow}</p>
          <div className="lock-icon">♡</div>
          <h1>For {recipient.firstName},<br /><em>on the right day.</em></h1>
          <p className="lock-copy">{experienceCopy.lock.opening} <strong>{experienceCopy.lock.date}</strong>.</p>
          <div className="lock-countdown"><span>{untilBirthday || "00 : 00 : 00"}</span><small>{experienceCopy.lock.countdownLabel}</small></div>
          <p className="lock-note">{experienceCopy.lock.note}</p>
        </div>
        <p className="lock-signature">{experienceCopy.lock.signature}</p>
      </main>
    );
  }

  return (
    <main className={`experience ${chapter === 5 ? "du-theme" : ""}`} onPointerDown={addTapSparkle}>
      <div className="ambient-orb orb-one" /><div className="ambient-orb orb-two" /><div className="ambient-orb orb-three" />
      <div className="grain" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />
      {tapSparkles.map((sparkle) => <span key={sparkle.id} className="tap-sparkle" style={{ left: sparkle.x, top: sparkle.y }}>✦</span>)}
      <div className="star-field" aria-hidden="true">
        {sparklePieces.map((piece) => <i key={piece} style={{ "--top": `${(piece * 37 + 9) % 100}%`, "--left": `${(piece * 61 + 5) % 100}%`, "--duration": `${2 + (piece % 5)}s`, "--delay": `${(piece % 11) * -0.7}s` } as CSSProperties} />)}
        <b className="firefly firefly-one" /><b className="firefly firefly-two" /><b className="firefly firefly-three" />
      </div>
      <Confetti burst={burst} />
      <audio ref={audioRef} src="/music/birthday.mp3" loop preload="none" />

      <header className="topbar">
        <a className="wordmark" href="#top" onClick={(event) => event.preventDefault()}><span>✦</span> ANI, AT 20</a>
        <div className="topbar-right"><span className="chapter-counter">{String(chapter + 1).padStart(2, "0")} <i>/</i> 14</span><button className={`music-button ${musicOn ? "playing" : ""}`} onClick={toggleMusic} aria-label={musicOn ? "Pause birthday music" : "Play birthday music"}><span>{musicOn ? "Ⅱ" : "♫"}</span><small>{musicOn ? "Pause" : "Music"}</small></button>{musicError && <span className="music-error" role="status">{musicError}</span>}</div>
      </header>

      <div className="progress-track" aria-label={`Chapter ${chapter + 1} of 14`}><i style={{ width: `${((chapter + 1) / chapters.length) * 100}%` }} /><span className="progress-star" style={{ left: `${((chapter + 1) / chapters.length) * 100}%` }}>✦</span></div>

      <AnimatePresence mode="wait" initial={false}>
      <motion.section
        className={`chapter chapter-${chapter + 1}`}
        key={chapter}
        id="top"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.98, filter: "blur(9px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.985, filter: "blur(8px)" }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {chapter !== 0 && chapter !== 1 && chapter !== 13 && <PageHeading index={chapter} />}

        {chapter === 0 && <>
          <div className="chapter-one-intro"><p className="eyebrow">{experienceCopy.opening.eyebrow}</p><h1>{experienceCopy.opening.title}<br /><em>{experienceCopy.opening.titleAccent}</em></h1></div>
          <GiftScene onOpen={openGift} onMoon={tapMoon} opened={giftOpened} secret={moonSecret} />
        </>}

        {chapter === 1 && <div className="birthday-reveal">
            {!countdownDone ? <div className="countdown-orbit"><span>{countdown}</span><i /><b /><small>{experienceCopy.birthday.countdownHint}</small></div> : <>
            <p className="eyebrow reveal-eyebrow">{experienceCopy.birthday.eyebrow}</p>
            <h1 className="birthday-title"><span>{experienceCopy.birthday.greeting}</span><em>{experienceCopy.birthday.title}</em><strong>{experienceCopy.birthday.name}</strong></h1>
            <p className="bangla-title">{experienceCopy.birthday.bangla}</p>
            <div className="birthday-cake" aria-hidden="true">🎂</div>
            <div className="balloons" aria-hidden="true"><i>♡</i><i>✦</i><i>♡</i><i>✧</i></div>
            <NextButton onClick={goNext}>{experienceCopy.birthday.next}</NextButton>
          </>}
        </div>}

        {chapter === 2 && <div className="gallery-layout">
          <div className="fairy-string"><span>✦</span><span>✧</span><span>✦</span><span>✧</span><span>✦</span><span>✧</span><span>✦</span></div>
          <div className="polaroid-grid">
            {galleryImages.map((image, index) => <button className={`polaroid polaroid-${index + 1}`} key={image.src} onClick={() => setLightbox(index)} aria-label={`Open photo ${index + 1}`}>
              <Image src={image} alt={photos[index]?.caption ?? `A favorite memory ${index + 1}`} sizes="(max-width: 640px) 42vw, 220px" />
              <span className="polaroid-caption">{photos[index]?.caption}</span><span className="photo-date">{photos[index]?.date}</span>
            </button>)}
          </div>
          <p className="gallery-footnote">{experienceCopy.gallery.footnote}</p>
          <NextButton onClick={goNext}>{experienceCopy.gallery.next}</NextButton>
        </div>}

        {chapter === 3 && <div className="quality-grid">
          {qualities.map((quality, index) => <button className={`quality-card ${flipped.includes(index) ? "flipped" : ""}`} key={quality.title} onClick={() => setFlipped((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])} aria-label={`${flipped.includes(index) ? "Hide" : "Reveal"} ${quality.title}`}>
            <span className="quality-front"><i>{quality.icon}</i><b>{quality.title}</b><small>tap to turn over ↗</small></span><span className="quality-back">{quality.detail}</span>
          </button>)}
          <p className="quality-note">{experienceCopy.qualities.note}</p>
          <NextButton onClick={goNext}>{experienceCopy.qualities.next}</NextButton>
        </div>}

        {chapter === 4 && <div className="chat-card glass-card">
          <div className="chat-topline"><span className="online-dot" /> {experienceCopy.chat.header}</div>
          {chat.slice(0, chatIndex + 1).map((line, index) => <div className="chat-exchange" key={index}>
            <div className="chat-bubble shihab-bubble"><small>{chatLabels.shihab}</small><p><TypedText text={line.text} /></p></div>
            {index < chatIndex && <div className="chat-bubble ani-bubble"><small>{chatLabels.ani}</small><p>{chatAnswers[index]}</p></div>}
          </div>)}
          {chatReply && <div className="chat-bubble shihab-bubble reply-bubble"><small>{chatLabels.shihab}</small><p><TypedText text={chatReply} /></p></div>}
          {!chatReply && <div className="reply-options">{chat[chatIndex].replies.map((reply) => <button key={reply.label} onClick={() => chooseChatReply(reply.response, reply.label)}>{reply.label}</button>)}</div>}
          {chatIndex === chat.length - 1 && !chatReply && <p className="chat-hint">{experienceCopy.chat.hint}</p>}
          <NextButton onClick={goNext}>{experienceCopy.chat.next}</NextButton>
        </div>}

        {chapter === 5 && <div className="du-scene-wrap">
          <div className="du-stars"><i>✦</i><i>✧</i><i>✦</i><i>·</i><i>✧</i></div>
          <div className="du-copy"><p className="du-label">{experienceCopy.dream.label}</p><h2>Dhaka<br /><em>University.</em></h2><p>{experienceCopy.dream.description}</p></div>
          <div className="curzon-scene" aria-label="An illustrated university building at dusk">
            <div className="du-moon" />
            <svg className="curzon-svg" viewBox="0 0 420 210" role="img" aria-label="A domed academic building silhouette">
              <path d="M24 190h372v14H24zM42 176h336v14H42zM60 163h300v13H60z" fill="#c49b61" opacity=".72" />
              <path d="M75 156V96l30-18 30 18v60h-15v-45h-30v45zm105 0V87l30-20 30 20v69h-15v-54h-30v54zm105 0V96l30-18 30 18v60h-15v-45h-30v45z" fill="#372c3c" stroke="#d4ac69" strokeWidth="2" />
              <path d="M57 95l48-29 48 29h-20l-28-17-28 17zm105-8l48-29 48 29h-20l-28-17-28 17zm105 8l48-29 48 29h-20l-28-17-28 17z" fill="#b89057" />
              <path d="M42 160h336v10H42zM33 172h354v7H33z" fill="#d9b87e" />
              {[99, 120, 204, 225, 309, 330].map((x) => <path key={x} d={`M${x} 111v44`} stroke="#d1a96c" strokeWidth="3" />)}
              <path d="M197 132q13-27 26 0v24h-26z" fill="#121a2b" stroke="#e1be7e" strokeWidth="2" />
              <path d="M210 18v31m-16-15h32m-27-11 22 22m0-22-22 22" stroke="#ffdf9a" strokeWidth="2" />
              <circle cx="210" cy="34" r="13" fill="#f5d78d" opacity=".12" />
            </svg>
            <span className="floating-cap">🎓</span><span className="gold-petal petal-one">✿</span><span className="gold-petal petal-two">✦</span><span className="gold-petal petal-three">✿</span>
          </div>
          <div className="du-star-line"><span>✦</span><i /><b>{experienceCopy.dream.footnote}</b></div>
          <NextButton onClick={goNext}>{experienceCopy.dream.next}</NextButton>
        </div>}

        {chapter === 6 && <div className="gpa-scene">
          <div className="gpa-rays" />
          <p className="gpa-intro">{experienceCopy.result.intro}</p>
          <div className={`gpa-number ${score >= 500 ? "gpa-complete" : ""}`}><span>GPA</span><strong>{(score / 100).toFixed(2)}</strong><i>✦</i></div>
          <p className="gpa-message">{experienceCopy.result.message}</p>
          <button className="wish-star-button" onClick={() => setBurst((value) => value + 1)} aria-label={experienceCopy.result.starHint.replace("\n", " ")}>✦<small>{experienceCopy.result.starHint.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</small></button>
          <NextButton onClick={goNext}>{experienceCopy.result.next}</NextButton>
        </div>}

        {chapter === 7 && <div className="wishes-grid">
          {presentWishes.map((wish, index) => <article className="wish-card" key={wish.text} style={{ "--card-delay": `${index * 0.08}s` } as CSSProperties}><span>{wish.icon}</span><p>{wish.text}</p></article>)}
          <NextButton onClick={goNext}>{experienceCopy.present.next}</NextButton>
        </div>}

        {chapter === 8 && <div className="jar-scene">
          <p className="jar-intro">{experienceCopy.jar.intro}</p>
          <div className={`wish-jar ${wishCount >= 8 ? "jar-full" : ""}`}>
            <span className="jar-neck" /><div className="jar-mouth" />
            {jarWishes.slice(0, wishCount).map((wish, index) => <i key={wish} className={`jar-star jar-star-${index + 1}`} style={{ "--jar-x": `${18 + ((index * 31) % 66)}%`, "--jar-y": `${22 + ((index * 19) % 57)}%` } as CSSProperties}>✦</i>)}
            <div className="jar-label">{experienceCopy.jar.label.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</div>
          </div>
          <p className="jar-current">{jarWish || experienceCopy.jar.empty}</p>
          <button className="jar-tap" onClick={() => { const next = Math.min(8, wishCount + 1); setWishCount(next); setJarWish(jarWishes[next - 1] ?? experienceCopy.jar.full); if (next === 8) setBurst((value) => value + 1); }} disabled={wishCount >= 8}>{wishCount < 8 ? `${experienceCopy.jar.add} · ${wishCount}/8` : experienceCopy.jar.full}</button>
          {wishCount >= 8 && <p className="jar-overflow">{experienceCopy.jar.overflow}</p>}
          <NextButton onClick={goNext}>{experienceCopy.jar.next}</NextButton>
        </div>}

        {chapter === 9 && <div className="timeline-wrap">
          <div className="timeline-line"><i /></div>
          {futureWishes.map((wish, index) => <article className={`timeline-item ${index % 2 ? "timeline-right" : "timeline-left"}`} key={wish.age}>
            <span className="timeline-dot">✦</span><div className="timeline-card"><small>{wish.age}</small><h3>{wish.title}</h3><p>{wish.detail}</p></div>
          </article>)}
          <p className="timeline-end">{experienceCopy.future.ending.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</p>
          <NextButton onClick={goNext}>{experienceCopy.future.next}</NextButton>
        </div>}

        {chapter === 10 && <div className="scratch-grid">
          {scratchCards.map((card, index) => <article className={`scratch-card ${scratched.includes(index) ? "revealed" : ""}`} key={card.label}>
            <div className="scratch-under"><small>{card.label}</small><p>{card.reveal}</p></div>
            {!scratched.includes(index) && <canvas ref={(node) => { canvasRefs.current[index] = node; }} className="scratch-canvas" onPointerDown={(event) => { scratchDown.current = null; event.currentTarget.setPointerCapture(event.pointerId); drawScratch(event, index); }} onPointerMove={(event) => drawScratch(event, index)} onPointerUp={() => endScratch(index)} onPointerCancel={() => endScratch(index)} aria-label={`Scratch to reveal ${card.label}`} />}
          </article>)}
          <p className="scratch-hint">{experienceCopy.scratch.hint}</p>
          <NextButton onClick={goNext}>{experienceCopy.scratch.next}</NextButton>
        </div>}

        {chapter === 11 && <div className="prayer-scene">
          <div className="lantern-field" aria-hidden="true"><span>⌑</span><span>⌑</span><span>⌑</span><span>⌑</span><span>⌑</span></div>
          <div className="prayer-list">{prayers.map((prayer, index) => <p key={prayer} style={{ "--prayer-delay": `${index * 0.45}s` } as CSSProperties}><span>✦</span>{prayer}</p>)}</div>
          <p className="dua">{experienceCopy.prayer.dua}</p>
          <p className="dua-translation">{experienceCopy.prayer.translation}</p>
          <NextButton onClick={goNext}>{experienceCopy.prayer.next}</NextButton>
        </div>}

        {chapter === 12 && <div className="letter-scene">
          {!envelopeOpen ? <button className="envelope" onClick={() => setEnvelopeOpen(true)} aria-label={`Open ${recipient.sender}'s letter`}><span className="envelope-back" /><span className="envelope-paper" /><span className="envelope-flap" /><span className="wax-seal">S</span><small>FOR {recipient.firstName.toUpperCase()}, WITH LOVE</small></button> : <article className="letter-paper">
            <div className="letter-decor">✦ &nbsp; A LETTER FOR YOU &nbsp; ✦</div>
            <p className="letter-body">{(showAllLetter ? letterText : letterText.slice(0, typedLength)).split("\n").map((line, index) => <span className="letter-line" key={`${index}-${line}`}>{line || " "}<br /></span>)}{!showAllLetter && typedLength < letterText.length && <i className="typing-cursor">|</i>}</p>
            {typedLength < letterText.length && <button className="show-letter" onClick={() => { setShowAllLetter(true); setTypedLength(letterText.length); }}>Read the whole letter →</button>}
            {typedLength >= letterText.length && <p className="letter-signoff">With all my love,<br /><em>Shihab</em></p>}
          </article>}
          {!envelopeOpen && <p className="envelope-hint">{experienceCopy.letter.hint}</p>}
          {envelopeOpen && typedLength >= letterText.length && <NextButton onClick={goNext}>{experienceCopy.letter.next}</NextButton>}
        </div>}

        {chapter === 13 && <div className="finale-scene">
          <div className="skyline" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <div className="finale-fireworks" aria-hidden="true"><span>✳</span><span>✧</span><span>✳</span><span>✴</span><span>✳</span></div>
          <div className="finale-hearts" aria-hidden="true"><span>♡</span><span>♡</span><span>♡</span><span>♡</span></div>
          <div className="lantern-field finale-lanterns" aria-hidden="true"><span>⌑</span><span>⌑</span><span>⌑</span><span>⌑</span></div>
          <p className="eyebrow">{experienceCopy.finale.eyebrow}</p>
          <h1 className="finale-title">{experienceCopy.finale.titleLead}<br /><em>{recipient.fullName}</em></h1>
          <button className="final-cake" onClick={() => { const next = cakeTaps + 1; setCakeTaps(next); if (next >= 5) setCakeSecret(secretMessages.cake); }} aria-label="Tap the cake five times">🎂</button>
          {cakeSecret && <p className="cake-secret">{cakeSecret}</p>}
          <p className="final-quote">{finalMessage}<br /><em>~ {recipient.sender.split(" ")[0]}</em></p>
          <button className="daily-wish-button" onClick={() => setDailyWish(randomWishes[Math.floor(Math.random() * randomWishes.length)])}>{experienceCopy.finale.wishButton}</button>
          {dailyWish && <p className="daily-wish">“{dailyWish}”</p>}
          <div className="final-actions"><button className="next-button" onClick={() => setBurst((value) => value + 1)}><span>{experienceCopy.finale.makeWish}</span><b>✦</b></button><button className="replay-button" onClick={replay}>{experienceCopy.finale.replay}</button></div>
          <p className="cake-hint">{experienceCopy.finale.cakeHint}</p>
        </div>}
      </motion.section>
      </AnimatePresence>

      {chapter < 13 && chapter !== 0 && chapter !== 1 && chapter !== 12 && <nav className="chapter-dots" aria-label="Chapter navigation">{chapters.map((item, index) => <button key={item.number} className={index === chapter ? "active" : index < chapter ? "visited" : ""} onClick={() => { if (index === 6) setScore(0); setChapter(index); }} aria-label={`Go to chapter ${index + 1}`} title={item.title} />)}</nav>}
      {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Memory photo" onClick={() => setLightbox(null)}><button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close photo">×</button><Image src={galleryImages[lightbox]} alt={photos[lightbox]?.caption ?? "A favorite memory"} sizes="90vw" priority /><p>{photos[lightbox]?.caption}</p><span>Tap anywhere to close</span></div>}
      <footer className="experience-footer"><span>{experienceCopy.footer.madeFor}</span><span>✦</span><span>{experienceCopy.footer.date}</span></footer>
    </main>
  );
}
