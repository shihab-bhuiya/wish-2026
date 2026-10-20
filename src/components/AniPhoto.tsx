"use client";

import Image from "next/image";
import { useState } from "react";
import { photoMap } from "@/data/content";
import { photoSources } from "@/assets/gallery";

export function AniPhoto({ chapter, onTap }: { chapter: keyof typeof photoMap; onTap?: () => void }) {
  const [failed, setFailed] = useState(false);
  const image = photoSources[photoMap[chapter]] ?? photoSources["photo-01"];

  return (
    <button className="ani-photo" type="button" onClick={onTap} aria-label="Tap Ani's photo" data-sfx="heart">
      <span className="ani-photo-glow" />
      <span className="ani-photo-frame">
        <Image
          src={failed ? "/photos/photo-fallback.svg" : image}
          alt="Ani"
          fill
          sizes="(max-width: 640px) 72px, 92px"
          placeholder={failed ? "empty" : "blur"}
          blurDataURL={failed ? undefined : image.blurDataURL}
          onError={() => setFailed(true)}
          className="ani-photo-image"
        />
      </span>
      <span className="ani-photo-sparkle" aria-hidden="true">✦</span>
    </button>
  );
}
