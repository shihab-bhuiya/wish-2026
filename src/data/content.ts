export const chapters = [
    { number: "01", title: "A little surprise", eyebrow: "A gift, made just for you" },
    { number: "02", title: "Twenty looks good on you", eyebrow: "The moment is yours" },
    { number: "03", title: "Little pieces of us", eyebrow: "A few favorite frames" },
    { number: "04", title: "The rarest kind of human", eyebrow: "Six things I adore about you" },
    { number: "05", title: "A tiny conversation", eyebrow: "Just us being us" },
    { number: "06", title: "The dream with your name on it", eyebrow: "One day, Dhaka University" },
    { number: "07", title: "For the result days", eyebrow: "I believe in you, always" },
    { number: "08", title: "For right now", eyebrow: "Wishes for 20-year-old you" },
    { number: "09", title: "A jar full of maybes", eyebrow: "Tap to collect a little magic" },
    { number: "10", title: "The life you are building", eyebrow: "A future full of your own light" },
    { number: "11", title: "Three tiny surprises", eyebrow: "Scratch a little, find a lot" },
    { number: "12", title: "A quiet prayer for you", eyebrow: "May the kindest things find you" },
    { number: "13", title: "A letter, from me to you", eyebrow: "Read this whenever you need it" },
    { number: "14", title: "And this is only the beginning", eyebrow: "The world is lucky to have you" },
] as const;

export const recipient = {
    firstName: "Ani",
    fullName: "Umme Habia Binte Akbar Ani",
    sender: "Shihab Bhuiya",
} as const;

export const photos = [
    { src: "whatsapp-1", caption: "A moment I wish I could bottle up.", date: "A favorite frame" },
    { src: "whatsapp-2", caption: "Proof that ordinary days can feel golden.", date: "Us, being us" },
    { src: "whatsapp-3", caption: "One of my favorite versions of today.", date: "A little while ago" },
    { src: "whatsapp-4", caption: "The camera roll understood the assignment.", date: "A very good day" },
    { src: "whatsapp-5", caption: "Your smile: still my favorite plot twist.", date: "Keep this one" },
    { src: "whatsapp-6", caption: "We really do make the best memories by accident.", date: "No big plans needed" },
    { src: "whatsapp-7", caption: "A tiny reminder that you make life brighter.", date: "One for the keeps" },
    { src: "birthday-frame", caption: "More chapters, more laughs, more us.", date: "To everything ahead" },
] as const;

export const qualities = [
    { icon: "✿", title: "Your kindness", detail: "You notice the little things people need, then somehow make them feel cared for without making a big deal of it." },
    { icon: "☼", title: "That laugh", detail: "You can turn a completely normal conversation into the highlight of my day. It is genuinely contagious." },
    { icon: "✧", title: "Your honesty", detail: "With you, there is room to be real. No pretending, no perfect answers—just the comfort of being understood." },
    { icon: "♧", title: "Your strength", detail: "Even when things feel uncertain, you keep showing up. That quiet courage of yours deserves a standing ovation." },
    { icon: "⌘", title: "Your brilliant mind", detail: "You have the kind of mind that keeps asking, learning, connecting dots—and then surprising everyone, especially yourself." },
    { icon: "♡", title: "The safe place you are", detail: "We can talk about anything, laugh at everything, and still feel completely ourselves. That is a rare kind of magic." },
] as const;

export const chat = [
    { from: "shihab", text: "Ani, quick question. Do you know what today is?", replies: [{ label: "My birthday? 👀", response: "Correct. And I have been planning this with an unreasonable amount of excitement." }, { label: "Tuesday?", response: "Also possibly Tuesday. But more importantly: the day the world got you." }, { label: "Should I be worried?", response: "Only about how many birthday wishes are about to arrive. No escape." }] },
    { from: "shihab", text: "Twenty years of being wonderfully, hilariously, unmistakably you.", replies: [{ label: "Aww", response: "You deserve every soft, lovely thing. Today and on all the random Tuesdays too." }, { label: "Stop it 😭", response: "I would, but the birthday feelings have taken over the keyboard." }, { label: "Tell me more", response: "Deal. Proceed to the next chapter for premium best-friend-level sincerity." }] },
] as const;

export const chatLabels = { shihab: "SHIHAB", ani: "ANI" } as const;

export const presentWishes = [
    { icon: "✦", text: "A GPA 5.00 that makes you smile for years." },
    { icon: "☁", text: "A peaceful mind, even when the to-do list gets dramatic." },
    { icon: "☼", text: "Good health and glowing energy, every single day." },
    { icon: "♡", text: "Real friends who protect your heart and celebrate your wins." },
    { icon: "↗", text: "Confidence that stays steady, even on the hard days." },
    { icon: "✿", text: "Laughter until your stomach hurts and your cheeks ache." },
    { icon: "❋", text: "A heart that stays soft and a spirit that stays strong." },
    { icon: "☾", text: "Sleep without worries and mornings full of hope." },
    { icon: "✧", text: "Good news arriving at exactly the right time." },
    { icon: "☪", text: "Your prayers being answered in the most beautiful ways." },
    { icon: "☆", text: "Every small joy noticed; every big dream protected." },
    { icon: "🎂", text: "The happiest birthday you have ever had—starting right now." },
] as const;

export const jarWishes = ["Success", "Peace", "Love", "Travel", "Dream career", "Endless laughter", "Barakah", "A little bit of everything good"] as const;

export const futureWishes = [
    { age: "20 · This year", title: "A door opens", detail: "A GPA 5.00, a DU admission letter, new friends, and a confidence that feels like it finally fits." },
    { age: "21—22", title: "The days you will tell stories about", detail: "Amazing DU days, teachers who inspire you, and memories that glow long after the semesters end." },
    { age: "23—24", title: "Finding your stride", detail: "Top results, meaningful internships, leadership moments, and the discovery that you are unstoppable." },
    { age: "25", title: "Your own kind of success", detail: "A career shaped around your passion, financial independence, and pride in everything you built yourself." },
    { age: "30", title: "A life that feels like yours", detail: "Success, respect, a beautiful home, peace, deep love, and a life you designed with your own hands." },
    { age: "Someday", title: "More than you once imagined", detail: "Travel the world, make everyone who believes in you proud, help others the way you are helped, and become the person your 10-year-old self dreamed of." },
] as const;

export const scratchCards = [
    { label: "A little truth", reveal: "You make even the most ordinary days feel like stories worth keeping." },
    { label: "A promise", reveal: "When your DU admission comes, your treat is on me. This promise is legally binding in best-friend court." },
    { label: "Our inside joke", reveal: "Insert our most ridiculous inside joke here—and then laugh because no one else would understand it. 😌" },
] as const;

export const prayers = [
    "May your health stay strong and your days feel light.",
    "May your hard work meet the success it deserves.",
    "May happiness find you in big celebrations and tiny moments.",
    "May you always be protected from harm and surrounded by goodness.",
    "May every uncertain road slowly reveal a bright path.",
    "May your heart have more peace than it knows what to do with.",
] as const;

export const letter = `My dearest ${recipient.fullName},\n\nHappy twentieth birthday, my favorite human. I wanted to give you something that felt a little like us: a bit silly, a bit sentimental, and made with a whole lot of care. I’m still an aspiring software engineer, so I built this—one line of code, one tiny detail, and one “she has to see this” thought at a time.\n\nBeing your best friend is one of the things I am quietly, constantly grateful for. Thank you for the honest conversations, the unexpected laughs, the comfort of being able to talk about absolutely anything, and for being exactly yourself with me. You make the world feel warmer just by being in it.\n\nI know your HSC result is so close now, and I know how much your Dhaka University dream means to you. Whatever the result says, please remember that it cannot measure your courage, your curiosity, or the brilliant person you are becoming. I believe in you with my whole heart. I am already proud of you—and I will be cheering the loudest for every next step, every new beginning, and every little win. May that GPA 5.00 find its way to you, and may DU soon feel like home.\n\nNo matter what this next year brings, you do not have to figure everything out alone. I am here for the excited voice notes, the overthinking, the celebrations, the “tell me everything” calls, and all the ordinary days in between. You can always come as you are.\n\nI hope being 20 brings you a little more freedom, a lot more laughter, kind people, answered prayers, and the kind of happiness that stays even after the candles are gone. Keep dreaming your big dreams, ${recipient.firstName}. The world has no idea what it is in for.\n\nশুভ জন্মদিন, আনি! আল্লাহ তোমার সব স্বপ্ন পূরণ করুন।\n\nAlways in your corner,\n${recipient.sender}`;

export const randomWishes = [
    "May the right doors open for you at just the right time.",
    "May your next chapter surprise you in the loveliest ways.",
    "May your heart stay brave, soft, and wonderfully yours.",
    "May every effort you make come back to you as joy.",
    "May you always find your way back to peace—and to people who feel like home.",
    "May your DU dream become one of your favorite true stories.",
    "May this year be gentle with you and generous with its good news.",
] as const;

export const secretMessages = {
    moon: "Moon says: your bedtime is between you and your 47 unread messages. 🌙",
    cake: "Secret unlocked: your birthday treat is still happening. Pick the place; I’ll bring the appetite. 🎂",
} as const;

export const finalMessage = "Made with code, by someone who believes in you.";

export const experienceCopy = {
    loading: "Preparing something special for Ani…",
    lock: {
        eyebrow: "A little birthday magic is on its way",
        opening: "This little corner of the universe opens on",
        date: "21 October",
        countdownLabel: "until your day",
        note: "Until then, the stars are keeping your surprise safe. ✨",
        signature: "made with a whole lot of love · S",
    },
    opening: {
        eyebrow: "A GIFT, MADE JUST FOR YOU",
        title: "For my favorite",
        titleAccent: `human, ${recipient.firstName}.`,
        giftMessage: "Ani, someone made something special just for you…",
        tapHint: "TAP THE GIFT TO OPEN",
        moonLabel: "Tap the moon",
        giftLabel: "Open your birthday gift",
    },
    birthday: {
        countdownHint: "something lovely is about to happen",
        eyebrow: "THE BIG DAY IS HERE",
        greeting: "Happy",
        title: "20th Birthday,",
        name: `${recipient.firstName}!`,
        bangla: "শুভ জন্মদিন, আনি!",
        next: "Let’s begin",
    },
    gallery: { footnote: "A few frames. A whole lot of love.", next: "Keep going" },
    qualities: { note: "I could make a hundred cards. We’d still need more.", next: "Next little thing" },
    chat: {
        header: "YOUR FAVORITE CHAT, PROBABLY",
        hint: "Pick whichever reply feels most like you.",
        next: "Obviously, tell me more",
    },
    dream: {
        label: "A DREAM WITH YOUR NAME ON IT",
        description: "One day soon, you’ll walk through those gates as a proud DU student.",
        footnote: "your dream is closer than it feels",
        next: "Keep believing",
    },
    result: {
        intro: "A wish from my whole heart",
        message: "I believe in you. Your result will make everyone proud, and I will be the loudest one cheering.",
        starHint: "tap the star\nmake a wish",
        next: "I’m keeping that wish",
    },
    present: { next: "One more surprise" },
    jar: {
        intro: "One tap = one wish, sealed with stardust.",
        label: "A little\ngoodness",
        empty: "A jar full of good things, just for you.",
        add: "Add a wish",
        full: "Overflowing with good things ✨",
        overflow: "May every one of these find its way to you.",
        next: "Carry the wishes with you",
    },
    future: {
        ending: "Whatever you dream,\nI hope life says yes.",
        next: "A few secrets next",
    },
    scratch: { hint: "Use your finger to scratch each card ✦", next: "Keep this close" },
    prayer: {
        dua: "আল্লাহ তোমার সব স্বপ্ন পূরণ করুন।",
        translation: "May every beautiful thing you pray for find its way to you.",
        next: "A letter from me",
    },
    letter: {
        hint: "Tap the seal to open your letter",
        showAll: "Read the whole letter →",
        next: "One last thing",
    },
    finale: {
        eyebrow: "HERE’S TO YOUR NEXT CHAPTER",
        titleLead: "Happy Birthday,",
        wishButton: "✧ Wish of the day",
        makeWish: "Make a Wish",
        replay: "↺   Replay from the beginning",
        cakeHint: "Psst… tap the cake five times.",
    },
    footer: { madeFor: "MADE FOR ANI", date: "21 · 10 · ALWAYS" },
} as const;
