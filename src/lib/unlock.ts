import { timingSafeEqual } from "node:crypto";

const DEFAULT_UNLOCK_AT = "2026-10-21T00:00:00+06:00";

export function getUnlockTimestamp() {
    const value = process.env.UNLOCK_AT || DEFAULT_UNLOCK_AT;
    const timestamp = Date.parse(value);
    if (!Number.isFinite(timestamp)) {
        throw new Error("UNLOCK_AT must be a valid ISO-8601 timestamp with an explicit timezone.");
    }
    return timestamp;
}

export function isValidPreviewSecret(candidate: string | string[] | undefined) {
    const secret = process.env.PREVIEW_SECRET;
    if (!secret || secret.startsWith("replace-with-") || typeof candidate !== "string") return false;
    const expected = Buffer.from(secret);
    const received = Buffer.from(candidate);
    return expected.length === received.length && timingSafeEqual(expected, received);
}

export function isUnlockedAt(now = Date.now()) {
    return now >= getUnlockTimestamp();
}
