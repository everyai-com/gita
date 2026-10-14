/**
 * Original learning content written for this app: plain-language chapter
 * guides, the 7-day "Essentials" path and the verse-of-the-day pool.
 * Verse text and translations come from public/data/gita.json.
 */

export type ChapterGuide = { theme: string; oneLine: string; takeaways: [string, string][] };

/** takeaways: [idea, verse ref that carries it] */
export const GUIDES: Record<number, ChapterGuide> = {
  1: {
    theme: "When life overwhelms you",
    oneLine: "On the eve of war, the great archer Arjuna sees family on both sides and collapses in grief.",
    takeaways: [
      ["Even the strongest people reach a breaking point. That is where wisdom begins.", "1.28"],
      ["Fear and grief show up in the body: Arjuna's bow slips from his hand.", "1.30"],
      ["Grief clouds our judgement about what is right.", "1.47"],
    ],
  },
  2: {
    theme: "Who you really are",
    oneLine: "Krishna begins: you are the eternal Self, not the body. Act, but let go of the results.",
    takeaways: [
      ["The Self is never born and never dies. Only bodies change.", "2.20"],
      ["You have a right to your work, never to its fruits.", "2.47"],
      ["A steady mind stays calm in pleasure and in pain.", "2.56"],
    ],
  },
  3: {
    theme: "Act without selfishness",
    oneLine: "Running from action is not freedom. Work done as an offering sets you free.",
    takeaways: [
      ["No one can stay without acting even for a moment, so act well.", "3.5"],
      ["Work done for others, without attachment, leads to the highest.", "3.19"],
      ["What great people do, others follow. Lead by example.", "3.21"],
    ],
  },
  4: {
    theme: "Wisdom in action",
    oneLine: "Krishna reveals why He comes to the world, and how knowledge purifies every action.",
    takeaways: [
      ["Whenever goodness declines, the Divine appears to restore it.", "4.7"],
      ["Nothing in this world purifies like true knowledge.", "4.38"],
      ["Faith and self-control lead to knowledge, and knowledge to peace.", "4.39"],
    ],
  },
  5: {
    theme: "Renounce inside, act outside",
    oneLine: "Real renunciation is in the heart, not in leaving the world.",
    takeaways: [
      ["Act like a lotus leaf: in the water, yet untouched by it.", "5.10"],
      ["The wise see the same Self in a scholar, a cow, an elephant and a dog.", "5.18"],
      ["Know the Divine as your friend, and you find peace.", "5.29"],
    ],
  },
  6: {
    theme: "Master your mind",
    oneLine: "A practical guide to meditation, and to becoming your own best friend.",
    takeaways: [
      ["Lift yourself by yourself. You are your own friend and your own enemy.", "6.5"],
      ["Balance in food, sleep, work and play removes sorrow.", "6.17"],
      ["The restless mind is tamed by practice and letting go.", "6.35"],
    ],
  },
  7: {
    theme: "Knowing the Divine",
    oneLine: "Everything in the universe is strung on the Divine, like pearls on a thread.",
    takeaways: [
      ["All that exists rests on Krishna, like pearls on a thread.", "7.7"],
      ["Krishna is the taste in water and the light of the sun and moon.", "7.8"],
      ["Those who take refuge cross over the great illusion.", "7.14"],
    ],
  },
  8: {
    theme: "What remains at the end",
    oneLine: "What we hold in our heart at the end shapes where we go next.",
    takeaways: [
      ["Whatever you remember at the end, you go to.", "8.6"],
      ["Remember the Divine always, and do your duty.", "8.7"],
      ["The one who remembers Krishna constantly reaches Him easily.", "8.14"],
    ],
  },
  9: {
    theme: "The royal secret",
    oneLine: "The most intimate teaching: God accepts the smallest offering made with love.",
    takeaways: [
      ["A leaf, a flower, a fruit or water, offered with love, is accepted.", "9.26"],
      ["To those who are devoted, Krishna brings what they lack and protects what they have.", "9.22"],
      ["Krishna's devotee never perishes.", "9.31"],
    ],
  },
  10: {
    theme: "God in everything",
    oneLine: "Krishna describes His glories, so we can see the Divine everywhere.",
    takeaways: [
      ["Krishna is the Self in every heart, the beginning, middle and end.", "10.20"],
      ["Wherever you see glory, beauty or power, see a spark of the Divine.", "10.41"],
      ["To the devoted, Krishna gives the understanding that leads to Him.", "10.10"],
    ],
  },
  11: {
    theme: "The cosmic vision",
    oneLine: "Arjuna is given divine sight and sees the universal form of Krishna.",
    takeaways: [
      ["Ordinary eyes cannot see the cosmic form. Divine sight is a gift.", "11.8"],
      ["Time is the great force that ends everything.", "11.32"],
      ["Only by single-minded devotion can the Divine be truly known.", "11.54"],
    ],
  },
  12: {
    theme: "The path of love",
    oneLine: "The shortest chapter: what devotion looks like, and who is dear to God.",
    takeaways: [
      ["The one free of hatred, friendly and compassionate is dear to Krishna.", "12.13"],
      ["If one practice is too hard, take the simpler one. Every step counts.", "12.10"],
      ["The one who neither disturbs the world nor is disturbed by it is dear.", "12.15"],
    ],
  },
  13: {
    theme: "Body and its knower",
    oneLine: "The body is the field; the Self is the one who knows it.",
    takeaways: [
      ["The body is called the field; the one who knows it is the knower.", "13.2"],
      ["Humility, non-violence, patience and honesty are true knowledge.", "13.8"],
      ["One who sees the Divine equally in all beings truly sees.", "13.28"],
    ],
  },
  14: {
    theme: "Three forces of nature",
    oneLine: "Goodness, passion and inertia (the three gunas) shape everything we do.",
    takeaways: [
      ["Sattva, rajas and tamas bind the Self to the body.", "14.5"],
      ["Each force bears its own fruit: knowledge, greed or confusion.", "14.17"],
      ["Steady devotion carries you beyond all three.", "14.26"],
    ],
  },
  15: {
    theme: "The tree of life",
    oneLine: "The world is an upside-down tree. Cut through it with the axe of detachment.",
    takeaways: [
      ["The world is like a tree with roots above and branches below.", "15.1"],
      ["Every living being is an eternal part of the Divine.", "15.7"],
      ["Krishna dwells in every heart as memory, knowledge and wisdom.", "15.15"],
    ],
  },
  16: {
    theme: "Divine and demonic traits",
    oneLine: "Two kinds of nature. Grow the divine ones; drop the ones that bind.",
    takeaways: [
      ["Fearlessness, purity and generosity are divine qualities.", "16.1"],
      ["Lust, anger and greed are three gates to ruin.", "16.21"],
      ["Let wise teaching guide what to do and what not to do.", "16.24"],
    ],
  },
  17: {
    theme: "Three kinds of faith",
    oneLine: "You become what you believe in. Faith, food and giving all come in three moods.",
    takeaways: [
      ["Every person's faith matches their nature. You are your faith.", "17.3"],
      ["Speech that is true, kind and helpful is an austerity.", "17.15"],
      ["Give at the right time, to the right person, expecting nothing back.", "17.20"],
    ],
  },
  18: {
    theme: "Freedom through surrender",
    oneLine: "The grand summary: do your own duty, offer it all, and take refuge.",
    takeaways: [
      ["Better your own path done imperfectly than another's done well.", "18.47"],
      ["Let go of everything and take refuge in Krishna. Do not grieve.", "18.66"],
      ["Where Krishna and Arjuna stand together, there is victory.", "18.78"],
    ],
  },
};

export type EssentialDay = { day: number; title: string; why: string; refs: string[]; reflect: string; practice: string };

/** A 7-day starter path through the most loved verses. */
export const ESSENTIALS: EssentialDay[] = [
  { day: 1, title: "Asking for help", why: "The Gita begins with a strong man admitting he is lost.", refs: ["2.7", "2.13", "2.20"],
    reflect: "Where in your life do you feel a little like Arjuna right now?", practice: "Tell one trusted person about something you're unsure of." },
  { day: 2, title: "Do your best, let go", why: "The most famous teaching of the Gita.", refs: ["2.47", "2.48", "3.19"],
    reflect: "Which result are you holding on to so tightly that it spoils the work itself?", practice: "Do one task today fully, then consciously let go of how it turns out." },
  { day: 3, title: "A steady mind", why: "How to stay calm when life swings.", refs: ["2.14", "2.56", "6.5"],
    reflect: "What usually knocks you off balance, and what helps you come back?", practice: "When something upsets you today, pause for three breaths before reacting." },
  { day: 4, title: "How anger grows", why: "A chain from thought to downfall, and how to break it.", refs: ["2.62", "2.63", "6.35"],
    reflect: "Think of a recent flash of anger. What was the small want underneath it?", practice: "Notice one craving today without acting on it. Just watch it pass." },
  { day: 5, title: "Why the Divine comes", why: "A promise for every age.", refs: ["4.7", "4.8", "4.38"],
    reflect: "Where have you seen goodness return after a hard time?", practice: "Do one quiet good deed that nobody will know about." },
  { day: 6, title: "The path of love", why: "God asks for so little.", refs: ["9.22", "9.26", "12.13"],
    reflect: "What small thing could you offer with love today?", practice: "Offer something small with full attention: a meal, a flower, your time." },
  { day: 7, title: "Surrender", why: "The final, most intimate teaching.", refs: ["18.47", "18.65", "18.66"],
    reflect: "What would you put down if you truly trusted that you are held?", practice: "Before sleep, name one worry and consciously hand it over." },
];

export const DAILY_POOL = [
  "2.47", "2.20", "2.14", "2.22", "2.23", "2.40", "2.56", "2.62", "2.70", "3.19", "3.21", "3.27", "3.30", "3.35",
  "4.7", "4.8", "4.38", "4.39", "5.10", "6.5", "6.6", "6.17", "6.19", "6.35", "7.7", "8.7", "9.22", "9.26",
  "9.29", "10.20", "10.41", "11.33", "12.13", "12.15", "13.28", "14.26", "15.7", "16.21", "17.3", "17.15",
  "18.47", "18.63", "18.65", "18.66", "18.78",
];

export function dayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function verseOfTheDay(d = new Date()): string {
  const start = new Date(d.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((d.getTime() - start) / 86_400_000);
  return DAILY_POOL[(dayOfYear + d.getFullYear()) % DAILY_POOL.length];
}

/** Life topics: the Gita by what's on your mind, not by chapter. */
export type Topic = { id: string; title: string; line: string; refs: string[]; chapter: number };

export const TOPICS: Topic[] = [
  { id: "peace", title: "Peace of mind", line: "For stress, worry and a mind that won't settle.", refs: ["2.14", "2.56", "2.70", "2.71", "5.12", "12.15"], chapter: 2 },
  { id: "work", title: "Work & ambition", line: "Doing your best without being eaten up by results.", refs: ["2.47", "2.48", "2.50", "3.19", "18.45"], chapter: 3 },
  { id: "purpose", title: "Purpose & direction", line: "Finding your own path, and walking it.", refs: ["3.35", "18.47", "18.46", "3.8", "4.18"], chapter: 18 },
  { id: "mind", title: "Focus & discipline", line: "Training a restless mind, gently.", refs: ["6.5", "6.6", "6.26", "6.35", "2.58", "6.19"], chapter: 6 },
  { id: "anger", title: "Anger & desire", line: "How a small want becomes a fire, and how to cool it.", refs: ["2.62", "2.63", "3.37", "5.23", "16.21", "5.26"], chapter: 2 },
  { id: "love", title: "Love & relationships", line: "Seeing others with an equal, kind eye.", refs: ["12.13", "12.14", "6.9", "5.18", "6.32", "16.2"], chapter: 12 },
  { id: "grief", title: "Grief & loss", line: "When someone you love is gone.", refs: ["2.11", "2.13", "2.20", "2.22", "2.27", "2.28"], chapter: 2 },
  { id: "fear", title: "Fear & courage", line: "Standing up when you want to run.", refs: ["2.3", "4.10", "16.1", "2.40", "18.66"], chapter: 2 },
  { id: "success", title: "Success & failure", line: "Staying the same person in victory and defeat.", refs: ["2.38", "4.22", "6.7", "14.24", "5.20", "12.18"], chapter: 2 },
  { id: "self", title: "Who am I?", line: "The Self that no weapon can cut.", refs: ["2.23", "2.24", "13.2", "15.7", "6.29", "10.20"], chapter: 13 },
  { id: "faith", title: "Devotion & faith", line: "Love, offering and trust.", refs: ["9.22", "9.26", "9.29", "7.21", "12.8", "18.65"], chapter: 9 },
  { id: "kind", title: "Kindness & giving", line: "Giving freely, speaking gently.", refs: ["17.20", "17.15", "16.2", "16.3", "12.4", "5.25"], chapter: 17 },
  { id: "balance", title: "Food, sleep & balance", line: "Moderation as a spiritual practice.", refs: ["6.16", "6.17", "17.8", "14.6"], chapter: 6 },
  { id: "doubt", title: "Doubt & confusion", line: "When you don't know what to do.", refs: ["2.7", "4.42", "18.63", "18.72", "18.73"], chapter: 18 },
  { id: "lead", title: "Leading others", line: "Being the example others follow.", refs: ["3.20", "3.21", "3.25", "3.26", "18.78"], chapter: 3 },
  { id: "death", title: "Life & death", line: "What changes, and what never does.", refs: ["2.13", "2.20", "2.27", "8.5", "8.6", "15.8"], chapter: 8 },
];

export const topicById = (id: string) => TOPICS.find((t) => t.id === id);

/** Onboarding: what brings you here, with a gentle "you're not alone" reply. */
export const REASONS: { topic: string; label: string; reply: string; ref: string }[] = [
  { topic: "peace", label: "I want more peace", reply: "Arjuna's hands were shaking too. The Gita begins exactly where you are.", ref: "2.14" },
  { topic: "purpose", label: "I'm searching for purpose", reply: "The whole Gita is an answer to one question: what should I do with my life?", ref: "3.35" },
  { topic: "work", label: "Work feels heavy", reply: "Krishna's most famous teaching is about work. You'll meet it on day 2.", ref: "2.47" },
  { topic: "mind", label: "I want a calmer, focused mind", reply: "Chapter 6 is a practical guide to the mind, written 2,000 years ago.", ref: "6.35" },
  { topic: "love", label: "Relationships", reply: "The Gita's idea of love asks for no conditions. It starts with seeing everyone equally.", ref: "12.13" },
  { topic: "grief", label: "I'm grieving", reply: "Krishna's first teaching is for someone in grief. Go gently.", ref: "2.20" },
  { topic: "anger", label: "Anger or cravings", reply: "Two verses explain how anger is born. Knowing the chain is how you break it.", ref: "2.62" },
  { topic: "faith", label: "Deepen my devotion", reply: "A leaf, a flower, a little water, offered with love. That's all it asks.", ref: "9.26" },
  { topic: "self", label: "I'm simply curious", reply: "Welcome. 700 verses, one conversation, and it is still talking to us.", ref: "2.20" },
];

export const LEVELS = [
  { id: "new", label: "I'm new to the Gita", sub: "Start with the 7 most loved teachings" },
  { id: "some", label: "I know a few verses", sub: "Essentials first, then chapter by chapter" },
  { id: "deep", label: "I've studied it", sub: "Go straight to the chapter-by-chapter path" },
] as const;
