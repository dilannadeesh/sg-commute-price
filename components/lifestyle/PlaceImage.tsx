"use client";

import { useState } from "react";

/** Photo with a branded gradient + emoji fallback when there's no image or it fails to load. */
export default function PlaceImage({
  src, alt, emoji, className = "", eager = false,
}: { src?: string | null; alt: string; emoji: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  const show = !!src && !failed;
  return (
    <div className={`lx-img ${className}`}>
      <div className="lx-img-fallback" aria-hidden={show}><span>{emoji}</span></div>
      {show && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
