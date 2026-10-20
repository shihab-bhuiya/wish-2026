import photoOne from "./images/WhatsApp Image 2026-10-20 at 6.23.57 PM.jpeg";
import photoTwo from "./images/WhatsApp Image 2026-10-20 at 6.25.04 PM.jpeg";
import photoThree from "./images/WhatsApp Image 2026-10-20 at 6.25.05 PM.jpeg";
import photoFour from "./images/WhatsApp Image 2026-10-20 at 6.25.50 PM.jpeg";
import photoFive from "./images/WhatsApp Image 2026-10-20 at 6.26.45 PM.jpeg";
import photoSix from "./images/WhatsApp Image 2026-10-20 at 6.26.46 PM.jpeg";
import photoSeven from "./images/WhatsApp Image 2026-10-20 at 6.28.05 PM.jpeg";
import photoEight from "./images/image.png";

export const photoSources = {
    "photo-01": photoOne,
    "photo-02": photoTwo,
    "photo-03": photoThree,
    "photo-04": photoFour,
    "photo-05": photoFive,
    "photo-06": photoSix,
    "photo-07": photoSeven,
    "photo-08": photoEight,
} as const;

export const galleryImages = Object.values(photoSources);
