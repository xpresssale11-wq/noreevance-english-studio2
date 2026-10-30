"use client";

import React, { useState, useEffect } from "react";
import { AppLanguage } from "@/lib/i18n";
import { ShadowingTarget } from "@/lib/persona";
import { ParsedStory, SAMPLE_STORIES } from "@/components/StoryImporter";
import {
  Volume2,
  Sparkles,
  Shuffle,
  ArrowRight,
  BookOpen,
  Lightbulb,
  BookmarkPlus,
  Flame,
  Star,
} from "lucide-react";

const QUIZ_CURATED_UNSPLASH_MAP: Record<string, string> = {
  "stop by":
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
  cozy: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
  vintage:
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80",
  unwind:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  shopkeeper:
    "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=900&q=80",
  brew: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80",
  chamomile:
    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80",
  "play it by ear":
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=80",
  strum:
    "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=900&q=80",
  melody:
    "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=900&q=80",
  immediately:
    "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=900&q=80",
  "strike a chord":
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=900&q=80",
  "before she knew it":
    "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?auto=format&fit=crop&w=900&q=80",
  "lose track of time":
    "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=900&q=80",
  "tap softly":
    "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=900&q=80",
  windowpane:
    "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=900&q=80",
  "fast-paced":
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",
  transform:
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=80",
  entire:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
  "instead of":
    "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80",
  "right away":
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80",
  routine:
    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=900&q=80",
  "low-key":
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  pour: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
  balcony:
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
  savor:
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
  breeze:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
  "give oneself permission":
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=900&q=80",
  schedule:
    "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=900&q=80",
  handle:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
};

const NOREE_SIENNA_PRAISES_TH = [
  "เหมียว~ ถูกต้องเลยค่ะ! 🐾🎸 น้องโนรีกับเจ้าเหมียวเซียนน่าปรบมือให้รัวๆ เลย คุณจำคำศัพท์จากเนื้อเรื่องได้แม่นยำมากค่ะ!",
  "เก่งมากเลยค่ะ! ✨🎵 เสียงดีดกีตาร์ฉลองให้หนึ่งคอร์ดเต็มๆ คำนี้ถ้าเอาไปใช้พูดในชีวิตประจำวันจะฟังดูเป็นธรรมชาติสุดๆ เลย",
  "ยอดเยี่ยมที่สุดเลย! ☕🐱 เจ้าเหมียวเซียนน่าร้องเหมียวชมใหญ่เลยค่ะ ค่อยๆ เก็บคำศัพท์ผ่านภาพแบบนี้จะช่วยให้จำได้นานโดยไม่ต้องท่องจำเลยนะ",
];

const NOREE_SIENNA_ENCOURAGEMENTS_TH = [
  "เกือบถูกแล้วค่ะ ไม่เป็นไรเลยน้า~ 🐾🎸 เจ้าเหมียวเซียนน่ากระซิบใบ้ให้ด้านล่างแล้ว ลองดูความหมายภาษาไทยแล้วเลือกใหม่อีกครั้งนะคะ!",
  "ค่อยๆ คิดได้สบายๆ เลยค่ะ ☕🐱 การลองผิดลองถูกคือจังหวะหนึ่งของการเรียนรู้ ลองดูตัวอักษรใบ้จากน้องโนรีด้านล่างดูนะคะ!",
];

function createCozySvgDataUri(word: string, meaningTh: string, pos: string): string {
  const safeMeaning = (meaningTh || "").replace(/[<>&"']/g, "");
  const safePos = (pos || "vocab").replace(/[<>&"']/g, "");
  const firstChar = (word || "?").charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
    <rect width="800" height="480" fill="#F5EFE6" rx="24"/>
    <text x="400" y="150" text-anchor="middle" font-family="Georgia, serif" font-size="68" fill="#C86D51">🎸 🐾 ☕</text>
    <text x="400" y="235" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="bold" fill="#6B8E78">Noree &amp; Sienna’s Visual Clue (${safePos})</text>
    <text x="400" y="305" text-anchor="middle" font-family="sans-serif" font-size="30" font-weight="bold" fill="#2C2523">“${safeMeaning}”</text>
    <text x="400" y="375" text-anchor="middle" font-family="monospace" font-size="22" fill="#7A6B63">Starts with "${firstChar}..." (${(word || "").length} chars)</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getQuizImageCandidates(word: string, meaningTh: string, pos: string): string[] {
  const cleanWord = (word || "").trim().toLowerCase();
  const keyword = cleanWord.replace(/[^a-z0-9\s]/g, "").trim() || "acoustic";
  const candidates: string[] = [];
  if (QUIZ_CURATED_UNSPLASH_MAP[cleanWord]) {
    candidates.push(QUIZ_CURATED_UNSPLASH_MAP[cleanWord]);
  }
  candidates.push(`https://loremflickr.com/800/500/${encodeURIComponent(keyword.split(/\s+/)[0])}`);
  candidates.push(`https://source.unsplash.com/featured/800x500/?${encodeURIComponent(keyword)}`);
  candidates.push(`https://picsum.photos/seed/${encodeURIComponent(keyword)}/800/500`);
  candidates.push(createCozySvgDataUri(word, meaningTh, pos));
  return candidates;
}

function maskWordInSentence(sentence: string, word: string): string {
  if (!sentence || !word) return sentence;
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escaped}\\b`, "gi");
  if (regex.test(sentence)) return sentence.replace(regex, "_______");
  const root = word.trim().split(/\s+/)[0].replace(/(ed|ing|s)$/i, "");
  if (root.length >= 3) {
    const rootRegex = new RegExp(`\\b${root}[a-z]*\\b`, "i");
    if (rootRegex.test(sentence)) return sentence.replace(rootRegex, "_______");
  }
  return sentence;
}

interface QuizChoice {
  word: string;
  pos: string;
  meaningTh: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  word: string;
  pos: string;
  meaningTh: string;
  contextSentence: string;
  maskedSentence: string;
  contextTranslationTh: string;
  gentleTip: string;
  imageCandidates: string[];
  choices: QuizChoice[];
  hintTh: string;
}

function buildQuizDeck(activeStory: ParsedStory, useAllStories: boolean): QuizQuestion[] {
  const stories = useAllStories
    ? [activeStory, ...SAMPLE_STORIES.filter((s) => s.id !== activeStory.id)]
    : [activeStory];

  const pool: Omit<QuizQuestion, "id" | "choices" | "hintTh">[] = [];
  const seen = new Set<string>();

  for (const st of stories) {
    for (const seg of st.segments || []) {
      for (const v of seg.vocab || []) {
        const key = v.word.trim().toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          pool.push({
            word: v.word,
            pos: v.pos || "vocab",
            meaningTh: v.meaningTh,
            contextSentence: seg.sentence,
            maskedSentence: maskWordInSentence(seg.sentence, v.word),
            contextTranslationTh: seg.thaiTranslation,
            gentleTip: seg.gentleTip,
            imageCandidates: getQuizImageCandidates(v.word, v.meaningTh, v.pos),
          });
        }
      }
    }
  }

  const allVocab = SAMPLE_STORIES.flatMap((s) => s.segments.flatMap((seg) => seg.vocab));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  return shuffled.map((item, idx) => {
    const distractors: QuizChoice[] = [];
    const used = new Set([item.word.toLowerCase()]);
    const candidates = [...pool, ...allVocab].sort(() => Math.random() - 0.5);

    for (const c of candidates) {
      const k = c.word.toLowerCase();
      if (!used.has(k)) {
        used.add(k);
        distractors.push({
          word: c.word,
          pos: c.pos,
          meaningTh: c.meaningTh,
          isCorrect: false,
        });
        if (distractors.length >= 3) break;
      }
    }

    const choices: QuizChoice[] = [
      { word: item.word, pos: item.pos, meaningTh: item.meaningTh, isCorrect: true },
      ...distractors,
    ].sort(() => Math.random() - 0.5);

    const w = item.word.trim();
    const hintTh = `คำนี้เป็น (${item.pos}) แปลว่า "${item.meaningTh}" • ขึ้นต้นด้วยตัว "${w
      .charAt(0)
      .toUpperCase()}" และลงท้ายด้วย "${w.charAt(w.length - 1)}" (${w.length} ตัวอักษร)`;

    return {
      id: `q-${idx}-${w}`,
      ...item,
      choices,
      hintTh,
    };
  });
}

interface PictureQuizGameProps {
  lang: AppLanguage;
  activeStory: ParsedStory;
  onSpeak: (text: string, rate?: number) => void;
  onSavePhrase: (target: ShadowingTarget) => void;
  onBackToStory: () => void;
}

interface MiniDictEntry {
  word: string;
  pos: string;
  posBadge: string;
  meaningTh: string;
  exampleEn: string;
  exampleTh: string;
}

const POS_THAI_LABEL_MAP: Record<string, string> = {
  "n.": "Noun • คำนาม",
  "v.": "Verb • คำกริยา",
  "adj.": "Adj. • คำคุณศัพท์",
  "adv.": "Adv. • กริยาวิเศษณ์",
  "prep.": "Prep. • คำบุพบท",
  "pron.": "Pron. • คำสรรพนาม",
  "conj.": "Conj. • คำสันธาน",
  "det.": "Det. • คำนำหน้านาม",
  "phr. v.": "Phr. Verb • กริยาวลี",
  "v. phr.": "Verb Phr. • วลีกริยา",
  "phr.": "Phrase • วลี",
  idiom: "Idiom • สำนวน",
};

const BUILTIN_WORD_DICT: Record<
  string,
  { word: string; pos: string; meaningTh: string; exampleEn: string; exampleTh: string }
> = {
  every: { word: "every", pos: "det.", meaningTh: "ทุกๆ / แต่ละ", exampleEn: "Every rainy afternoon, Clara stopped by a cozy shop.", exampleTh: "ทุกๆ บ่ายวันฝนพรำ คลาร่าจะแวะไปที่ร้านแสนอบอุ่น" },
  rainy: { word: "rainy", pos: "adj.", meaningTh: "ที่มีฝนตก / วันฝนพรำ", exampleEn: "I love reading on a quiet rainy afternoon.", exampleTh: "ฉันชอบอ่านหนังสือในบ่ายวันฝนพรำที่เงียบสงบ" },
  afternoon: { word: "afternoon", pos: "n.", meaningTh: "ช่วงบ่าย (หลังเที่ยงวัน)", exampleEn: "Let’s grab a warm cup of tea this afternoon.", exampleTh: "บ่ายนี้ไปหาชาอุ่นๆ ดื่มกันเถอะ" },
  stopped: { word: "stop by / stopped", pos: "v.", meaningTh: "แวะไปหา / หยุดแวะ", exampleEn: "Clara stopped by a cozy vintage guitar shop.", exampleTh: "คลาร่าแวะไปที่ร้านกีตาร์วินเทจแสนอบอุ่น" },
  cozy: { word: "cozy", pos: "adj.", meaningTh: "อบอุ่น น่านั่ง สบายใจ", exampleEn: "This little cafe has such a warm and cozy vibe.", exampleTh: "คาเฟ่เล็กๆ แห่งนี้มีบรรยากาศที่อบอุ่นและน่านั่งมาก" },
  vintage: { word: "vintage", pos: "adj.", meaningTh: "คลาสสิก ย้อนยุคแต่มีคุณค่า", exampleEn: "She fell in love with a vintage acoustic guitar.", exampleTh: "เธอตกหลุมรักกีตาร์โปร่งแนววินเทจสุดคลาสสิก" },
  guitar: { word: "guitar", pos: "n.", meaningTh: "กีตาร์", exampleEn: "Noree is tuning her wooden acoustic guitar.", exampleTh: "โนรีกำลังตั้งสายกีตาร์โปร่งไม้ของเธอ" },
  shop: { word: "shop", pos: "n.", meaningTh: "ร้านค้า", exampleEn: "There is a lovely bookshop on Maple Street.", exampleTh: "มีร้านหนังสือที่น่ารักอยู่บนถนนเมเปิล" },
  unwind: { word: "unwind", pos: "v.", meaningTh: "คลายความเหนื่อยล้า / พักผ่อนหย่อนใจ", exampleEn: "Listening to acoustic music helps me unwind after work.", exampleTh: "การฟังเพลงอะคูสติกช่วยให้ฉันผ่อนคลายหลังเลิกงาน" },
  friendly: { word: "friendly", pos: "adj.", meaningTh: "ที่เป็นมิตร / อัธยาศัยดี", exampleEn: "The friendly shopkeeper greeted everyone warmly.", exampleTh: "เจ้าของร้านผู้เป็นมิตรทักทายทุกคนอย่างอบอุ่น" },
  shopkeeper: { word: "shopkeeper", pos: "n.", meaningTh: "เจ้าของร้านค้า", exampleEn: "The friendly shopkeeper brewed a pot of warm tea.", exampleTh: "เจ้าของร้านผู้เป็นมิตรชงชาอุ่นๆ เตรียมไว้" },
  brewed: { word: "brew / brewed", pos: "v.", meaningTh: "ชง (ชาหรือกาแฟ)", exampleEn: "He brewed a fresh pot of warm chamomile tea.", exampleTh: "เขาชงชาคาโมมายล์อุ่นๆ กาใหม่" },
  warm: { word: "warm", pos: "adj.", meaningTh: "อบอุ่น / อุ่นกำลังดี", exampleEn: "Pour yourself a warm cup of coffee.", exampleTh: "รินกาแฟอุ่นๆ ให้ตัวเองสักแก้วสิ" },
  chamomile: { word: "chamomile", pos: "n.", meaningTh: "ดอกคาโมมายล์ (อ่านว่า แคม-โม-ไมล์)", exampleEn: "Chamomile tea helps you sleep peacefully.", exampleTh: "ชาคาโมมายล์ช่วยให้คุณนอนหลับอย่างสบาย" },
  encouraged: { word: "encourage / encouraged", pos: "v.", meaningTh: "ให้กำลังใจ / สนับสนุน", exampleEn: "Noree always encouraged me to speak naturally.", exampleTh: "โนรีให้กำลังใจฉันให้พูดอย่างเป็นธรรมชาติเสมอ" },
  gently: { word: "gently", pos: "adv.", meaningTh: "อย่างอ่อนโยน / อย่างแผ่วเบา", exampleEn: "She gently strummed an old wooden guitar.", exampleTh: "เธอค่อยๆ ดีดกีตาร์ไม้ตัวเก่าอย่างแผ่วเบา" },
  strummed: { word: "strum / strummed", pos: "v.", meaningTh: "ดีดกีตาร์เป็นจังหวะคอร์ด", exampleEn: "She gently strummed an acoustic guitar.", exampleTh: "เธอค่อยๆ ดีดกีตาร์โปร่งอย่างแผ่วเบา" },
  acoustic: { word: "acoustic", pos: "adj.", meaningTh: "อะคูสติก / เครื่องดนตรีโปร่ง", exampleEn: "I love the natural sound of an acoustic guitar.", exampleTh: "ฉันหลงรักเสียงที่เป็นธรรมชาติของกีตาร์อะคูสติก" },
  melody: { word: "melody", pos: "n.", meaningTh: "ท่วงทำนองเพลง", exampleEn: "The soft melody immediately struck a chord in her heart.", exampleTh: "ท่วงทำนองอันนุ่มนวลไปสะกิดความรู้สึกในใจของเธอทันที" },
  immediately: { word: "immediately", pos: "adv.", meaningTh: "ในทันทีทันใด", exampleEn: "The warm atmosphere made me feel at home immediately.", exampleTh: "บรรยากาศที่อบอุ่นทำให้ฉันรู้สึกเหมือนอยู่บ้านในทันที" },
  windowpane: { word: "windowpane", pos: "n.", meaningTh: "บานกระจกหน้าต่าง", exampleEn: "The rain tapped softly against the windowpane.", exampleTh: "สายฝนโปรยปรายกระทบกระจกหน้าต่างอย่างแผ่วเบา" },
  routine: { word: "routine", pos: "n.", meaningTh: "กิจวัตรประจำวัน", exampleEn: "Keep your morning routine low-key and peaceful.", exampleTh: "ทำกิจวัตรยามเช้าของคุณให้เรียบง่ายและเงียบสงบ" },
  peaceful: { word: "peaceful", pos: "adj.", meaningTh: "เงียบสงบและร่มรื่นใจ", exampleEn: "The park looks so peaceful in the morning light.", exampleTh: "สวนสาธารณะดูเงียบสงบมากท่ามกลางแสงแดดยามเช้า" },
  pour: { word: "pour", pos: "v.", meaningTh: "ริน / เท (เครื่องดื่ม)", exampleEn: "Pour yourself a warm cup of coffee.", exampleTh: "รินกาแฟอุ่นๆ ให้ตัวเองสักแก้วสิ" },
  balcony: { word: "balcony", pos: "n.", meaningTh: "ระเบียงห้องหรือบ้าน", exampleEn: "Step out onto the balcony and breathe the fresh air.", exampleTh: "ก้าวออกไปที่ระเบียงแล้วสูดอากาศบริสุทธิ์" },
  savor: { word: "savor", pos: "v.", meaningTh: "ค่อยๆ ลิ้มรสและดื่มด่ำกับช่วงเวลาดีๆ", exampleEn: "Savor the quiet morning breeze.", exampleTh: "ค่อยๆ ดื่มด่ำกับสายลมยามเช้าอันเงียบสงบ" },
  breeze: { word: "breeze", pos: "n.", meaningTh: "สายลมอ่อนๆ ที่พัดเย็นสบาย", exampleEn: "A cool evening breeze rustled the leaves.", exampleTh: "สายลมเย็นยามค่ำพัดผ่านใบไม้เบาๆ" },
  schedule: { word: "schedule", pos: "n.", meaningTh: "ตารางเวลา / ตารางงาน", exampleEn: "Even the busiest schedule feels easier to handle.", exampleTh: "แม้แต่ตารางงานที่ยุ่งที่สุดก็ยังรู้สึกรับมือได้ง่ายขึ้น" },
  handle: { word: "handle", pos: "v.", meaningTh: "รับมือ / จัดการกับภาระงาน", exampleEn: "With a calm mind, any task is easier to handle.", exampleTh: "ด้วยจิตใจที่สงบ งานใดๆ ก็รับมือได้ง่ายขึ้น" },
};

function lookupWordTooltipInfo(rawWord: string, activeStory: ParsedStory): MiniDictEntry {
  const clean = (rawWord || "").replace(/[^a-zA-Z'-]/g, "").toLowerCase();
  if (BUILTIN_WORD_DICT[clean]) {
    const d = BUILTIN_WORD_DICT[clean];
    return {
      word: d.word,
      pos: d.pos,
      posBadge: POS_THAI_LABEL_MAP[d.pos] || d.pos,
      meaningTh: d.meaningTh,
      exampleEn: d.exampleEn,
      exampleTh: d.exampleTh,
    };
  }
  const allStories = [activeStory, ...SAMPLE_STORIES].filter(Boolean);
  for (const st of allStories) {
    for (const seg of st.segments || []) {
      for (const v of seg.vocab || []) {
        const vLower = v.word.toLowerCase();
        const vFirst = vLower.split(/\s+/)[0];
        if (vLower === clean || vFirst === clean) {
          return {
            word: v.word,
            pos: v.pos,
            posBadge: POS_THAI_LABEL_MAP[v.pos] || v.pos,
            meaningTh: v.meaningTh,
            exampleEn: seg.sentence,
            exampleTh: seg.thaiTranslation,
          };
        }
      }
    }
  }
  const guessedPos = /ly$/.test(clean)
    ? "adv."
    : /(ed|ing)$/.test(clean)
    ? "v."
    : "vocab";
  return {
    word: rawWord.replace(/[^a-zA-Z'-]/g, "") || rawWord,
    pos: guessedPos,
    posBadge: POS_THAI_LABEL_MAP[guessedPos] || "Vocab • คำศัพท์",
    meaningTh: "คำศัพท์ในประโยค (กด 🔊 เพื่อฟังเสียงอ่าน)",
    exampleEn: "",
    exampleTh: "",
  };
}

export default function PictureQuizGame({
  lang,
  activeStory,
  onSpeak,
  onSavePhrase,
  onBackToStory,
}: PictureQuizGameProps) {
  const [useAllStories, setUseAllStories] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    buildQuizDeck(activeStory, false)
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answerMode, setAnswerMode] = useState<"choice" | "type">("choice");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [typedInput, setTypedInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [activeTooltipKey, setActiveTooltipKey] = useState<string | null>(null);
  const [dictQuery, setDictQuery] = useState("");

  useEffect(() => {
    setQuestions(buildQuizDeck(activeStory, useAllStories));
    setCurrentIdx(0);
    setSelectedChoice(null);
    setTypedInput("");
    setStatus("idle");
    setImgIdx(0);
    setShowHint(false);
  }, [activeStory, useAllStories]);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectChoice = (choice: QuizChoice) => {
    if (!currentQ || status === "correct") return;
    setSelectedChoice(choice.word);
    if (choice.isCorrect) {
      setStatus("correct");
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
      setFeedbackMsg(
        NOREE_SIENNA_PRAISES_TH[Math.floor(Math.random() * NOREE_SIENNA_PRAISES_TH.length)]
      );
      onSpeak(currentQ.word, 1.0);
    } else {
      setStatus("wrong");
      setStreak(0);
      setFeedbackMsg(
        NOREE_SIENNA_ENCOURAGEMENTS_TH[
          Math.floor(Math.random() * NOREE_SIENNA_ENCOURAGEMENTS_TH.length)
        ]
      );
      setShowHint(true);
    }
  };

  const handleCheckTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQ || !typedInput.trim() || status === "correct") return;
    if (typedInput.trim().toLowerCase() === currentQ.word.trim().toLowerCase()) {
      setStatus("correct");
      setScore((s) => s + 15);
      setStreak((st) => st + 1);
      setFeedbackMsg(
        NOREE_SIENNA_PRAISES_TH[Math.floor(Math.random() * NOREE_SIENNA_PRAISES_TH.length)]
      );
      onSpeak(currentQ.word, 1.0);
    } else {
      setStatus("wrong");
      setStreak(0);
      setFeedbackMsg(
        NOREE_SIENNA_ENCOURAGEMENTS_TH[
          Math.floor(Math.random() * NOREE_SIENNA_ENCOURAGEMENTS_TH.length)
        ]
      );
      setShowHint(true);
    }
  };

  const handleNext = () => {
    if (!questions.length) return;
    setCurrentIdx((i) => (i + 1) % questions.length);
    setSelectedChoice(null);
    setTypedInput("");
    setStatus("idle");
    setFeedbackMsg("");
    setImgIdx(0);
    setShowHint(false);
  };

  if (!currentQ) return null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5DEC9] rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src="/noree-logo.png"
                alt="Noree Vance"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E5DEC9] ring-2 ring-[#C86D51]/30"
              />
              <span
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#FAF6F0] border border-[#E5DEC9] flex items-center justify-center text-sm"
                title="Sienna the Studio Cat"
              >
                🐱
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#6B8E78]/15 text-[#4B6B57] border border-[#6B8E78]/30">
                  🖼️ Vocabulary Picture Quiz
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C86D51]/15 text-[#A85035] border border-[#C86D51]/30">
                  🐾 Noree & Sienna the Studio Cat
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#2C2523]">
                {lang === "th"
                  ? "เกมทายภาพคำศัพท์กับน้องโนรี & เจ้าเหมียวเซียนน่า 🎸🐱"
                  : "Vocabulary Picture Quiz with Noree & Sienna 🎸🐱"}
              </h2>
              <p className="text-xs text-[#6E6059]">
                {lang === "th"
                  ? `ดึงคำศัพท์จากบทเรียน "${activeStory.title}" มาสร้างโจทย์ภาพแบบสุ่ม พร้อมคำชมและคำใบ้แบบอบอุ่น`
                  : `Practicing vocabulary from "${activeStory.title}" with dynamic picture clues & gentle feedback.`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#FAF6F0] border border-[#E5DEC9] text-xs font-semibold text-[#2C2523]">
              <Star className="w-3.5 h-3.5 text-[#C86D51]" />
              <span>{lang === "th" ? "คะแนน:" : "Score:"}</span>
              <span className="text-[#C86D51] font-bold">{score}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#FAF6F0] border border-[#E5DEC9] text-xs font-semibold text-[#2C2523]">
              <Flame className="w-3.5 h-3.5 text-[#6B8E78]" />
              <span>{lang === "th" ? "ต่อเนื่อง:" : "Streak:"}</span>
              <span className="text-[#6B8E78] font-bold">{streak}</span>
            </div>
            <button
              type="button"
              onClick={onBackToStory}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold bg-[#F5EFE6] hover:bg-[#E5DEC9] text-[#2C2523] border border-[#DFD6C7] transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C86D51]" />
              {lang === "th" ? "สลับไปหน้านิทาน/บทความ" : "Back to Story Importer"}
            </button>
          </div>
        </div>

        {/* Deck Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F2ECE1]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#7A6B63]">
              {lang === "th" ? "📚 แหล่งคำศัพท์:" : "📚 Vocab Deck:"}
            </span>
            <button
              type="button"
              onClick={() => setUseAllStories(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                !useAllStories
                  ? "bg-[#C86D51] text-white"
                  : "bg-[#F5EFE6] text-[#5C524E] border border-[#DFD6C7]"
              }`}
            >
              {lang === "th" ? "📖 เฉพาะเรื่องที่นำเข้าล่าสุด" : "📖 Current Story"}
            </button>
            <button
              type="button"
              onClick={() => setUseAllStories(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                useAllStories
                  ? "bg-[#C86D51] text-white"
                  : "bg-[#F5EFE6] text-[#5C524E] border border-[#DFD6C7]"
              }`}
            >
              {lang === "th" ? "🌟 รวมทุกนิทานในสตูดิโอ" : "🌟 All Studio Stories"}
            </button>
            <button
              type="button"
              onClick={() => {
                setQuestions(buildQuizDeck(activeStory, useAllStories));
                setCurrentIdx(0);
                setStatus("idle");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-[#FAF6F0] text-[#5C524E] border border-[#DFD6C7] transition cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              {lang === "th" ? "สุ่มคำถามใหม่" : "Shuffle"}
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F2ECE1] p-1 rounded-xl border border-[#DFD6C7]">
            <button
              type="button"
              onClick={() => setAnswerMode("choice")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                answerMode === "choice"
                  ? "bg-white text-[#2C2523] shadow-2xs"
                  : "text-[#6E6059] hover:text-[#2C2523]"
              }`}
            >
              🎯 {lang === "th" ? "ปรนัย 4 ตัวเลือก" : "4-Choice Mode"}
            </button>
            <button
              type="button"
              onClick={() => setAnswerMode("type")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                answerMode === "type"
                  ? "bg-white text-[#2C2523] shadow-2xs"
                  : "text-[#6E6059] hover:text-[#2C2523]"
              }`}
            >
              ⌨️ {lang === "th" ? "พิมพ์คำตอบเอง" : "Type Answer"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Quiz Area */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left 6 Cols: Dynamic Picture & Context */}
        <div className="lg:col-span-6 bg-white border border-[#E5DEC9] rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between text-xs text-[#7A6B63]">
            <span className="font-bold text-[#C86D51]">
              {lang === "th"
                ? `คำถามข้อที่ ${currentIdx + 1} จาก ${questions.length}`
                : `Question ${currentIdx + 1} of ${questions.length}`}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F5EFE6] border border-[#E5DEC9] text-[11px] font-medium">
              ชนิดคำ: {currentQ.pos}
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-[#F5EFE6] border border-[#E5DEC9] aspect-[16/10] flex items-center justify-center">
            <img
              key={`${currentQ.id}-${imgIdx}`}
              src={currentQ.imageCandidates[imgIdx] || currentQ.imageCandidates[0]}
              onError={() => {
                if (imgIdx < currentQ.imageCandidates.length - 1) {
                  setImgIdx((i) => i + 1);
                }
              }}
              alt="Vocabulary Clue"
              className="w-full h-full object-cover transition duration-300"
            />
            <div className="absolute bottom-3 left-3 right-3 bg-[#2C2523]/80 backdrop-blur-xs text-[#FAF6F0] rounded-xl px-3.5 py-2 flex items-center justify-between gap-2 text-xs">
              <span>
                💡 {lang === "th" ? "ความหมายภาพ:" : "Meaning Clue:"}{" "}
                <strong className="text-[#F5EFE6]">“{currentQ.meaningTh}”</strong>
              </span>
              <span className="text-[10px] text-[#E5DEC9] shrink-0">Unsplash Dynamic</span>
            </div>
          </div>

          <div className="bg-[#FAF6F0] border border-[#E5DEC9] rounded-2xl p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8C7D75]">
                {lang === "th" ? "📖 ประโยคจากในนิทาน/บทความ:" : "📖 Context from Your Story:"}
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C86D51]/15 text-[#A85035] border border-[#C86D51]/30 font-semibold">
                💡 {lang === "th" ? "ชี้หรือแตะที่คำศัพท์เพื่อดูคำแปล" : "Hover or tap any word to translate"}
              </span>
            </div>
            <div className="font-serif text-base font-semibold text-[#2C2523] leading-relaxed">
              “
              {(status === "correct" ? currentQ.contextSentence : currentQ.maskedSentence)
                .split(/\s+/)
                .filter(Boolean)
                .map((token, idx) => {
                  if (token.includes("___")) {
                    return (
                      <span
                        key={`blank-${idx}`}
                        className="inline-block mx-1 px-2.5 py-0.5 rounded-lg bg-[#C86D51]/15 border border-dashed border-[#C86D51] text-[#A85035] font-mono text-sm font-bold"
                      >
                        _______
                      </span>
                    );
                  }
                  const match = token.match(/^([^a-zA-Z0-9']*)([a-zA-Z0-9'-]+)([^a-zA-Z0-9']*)$/);
                  if (!match) return <span key={idx} className="mr-1.5">{token}</span>;
                  const [, lead, core, trail] = match;
                  const tKey = `${currentQ.id}-${idx}-${core.toLowerCase()}`;
                  const isOpen = activeTooltipKey === tKey;
                  const info = lookupWordTooltipInfo(core, activeStory);
                  return (
                    <span
                      key={tKey}
                      className="relative inline-block mr-1.5"
                      onMouseEnter={() => setActiveTooltipKey(tKey)}
                      onMouseLeave={() => setActiveTooltipKey((p) => (p === tKey ? null : p))}
                    >
                      {lead}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTooltipKey((p) => (p === tKey ? null : tKey));
                        }}
                        className={`inline-block rounded-md px-0.5 -mx-0.5 border-b border-dotted transition cursor-pointer select-none ${
                          isOpen
                            ? "bg-[#C86D51] text-white border-[#C86D51]"
                            : "border-[#C86D51]/60 hover:bg-[#C86D51]/15 hover:text-[#A85035]"
                        }`}
                      >
                        {core}
                      </span>
                      {trail}
                      {isOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-40 w-56 sm:w-64 bg-[#2C2523] text-[#FAF6F0] rounded-2xl p-3 shadow-xl border border-[#C86D51]/45 text-left font-sans font-normal"
                        >
                          <div className="flex items-center justify-between gap-1.5 pb-1.5 mb-1.5 border-b border-white/15">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-serif font-bold text-sm text-[#FAF6F0]">
                                {info.word}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6B8E78]/35 text-[#CFE3D6] border border-[#6B8E78]/50 font-semibold">
                                {info.posBadge}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSpeak(core, 0.9);
                              }}
                              className="w-6 h-6 rounded-lg bg-[#C86D51] hover:bg-[#B35B40] text-white text-[11px] flex items-center justify-center shrink-0 cursor-pointer"
                            >
                              🔊
                            </button>
                          </div>
                          <div className="text-xs text-[#F5EFE6] leading-snug">
                            <span className="text-[#E89980] font-semibold mr-1">คำแปล:</span>
                            {info.meaningTh}
                          </div>
                        </div>
                      )}
                    </span>
                  );
                })}
              ”
            </div>
            <p className="text-xs text-[#6E6059]">{currentQ.contextTranslationTh}</p>
          </div>
        </div>

        {/* Right 6 Cols: Choices + Gentle Feedback */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white border border-[#E5DEC9] rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#2C2523]">
                {lang === "th"
                  ? "ภาพและความหมายนี้ ตรงกับคำศัพท์ภาษาอังกฤษข้อใดคะ?"
                  : "Which English vocabulary word matches this picture & meaning?"}
              </h3>
              <button
                type="button"
                onClick={() => setShowHint((v) => !v)}
                className="flex items-center gap-1 text-xs font-semibold text-[#C86D51] hover:underline shrink-0 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                {lang === "th" ? "ขอคำใบ้จากเซียนน่า" : "Ask Sienna for a Hint"}
              </button>
            </div>

            {showHint && (
              <div className="bg-[#F5EFE6] border border-[#E5DEC9] rounded-2xl p-3.5 text-xs text-[#4A403C] flex items-start gap-2.5">
                <span className="text-base">🐱</span>
                <div>
                  <strong className="text-[#C86D51]">
                    {lang === "th" ? "เจ้าเหมียวเซียนน่ากระซิบใบ้ให้: " : "Sienna’s Cozy Hint: "}
                  </strong>
                  {currentQ.hintTh}
                </div>
              </div>
            )}

            {answerMode === "choice" ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {currentQ.choices.map((ch, idx) => {
                  const isChosen = selectedChoice === ch.word;
                  let style = "bg-[#FAF6F0] hover:bg-[#F5EFE6] text-[#2C2523] border-[#DFD6C7]";
                  if (status === "correct" && ch.isCorrect) {
                    style = "bg-[#6B8E78] text-white border-[#6B8E78] ring-2 ring-[#6B8E78]/30";
                  } else if (status === "wrong" && isChosen && !ch.isCorrect) {
                    style = "bg-[#C86D51]/15 text-[#A85035] border-[#C86D51]";
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectChoice(ch)}
                      className={`rounded-2xl p-4 border transition flex items-center justify-between gap-2 cursor-pointer ${style}`}
                    >
                      <div>
                        <span className="text-[11px] font-bold opacity-70 mr-1.5">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span className="font-serif text-base font-bold">{ch.word}</span>
                        <span className="block text-[11px] opacity-75 mt-0.5">({ch.pos})</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSpeak(ch.word, 0.95);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-white/80 hover:bg-white text-[#2C2523] text-xs font-semibold shrink-0 cursor-pointer"
                      >
                        🔊
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <form onSubmit={handleCheckTyped} className="space-y-3">
                <div className="text-xs text-[#6E6059]">
                  {lang === "th"
                    ? `พิมพ์คำศัพท์ภาษาอังกฤษ (ขึ้นต้นด้วย "${currentQ.word
                        .charAt(0)
                        .toUpperCase()}..." ความยาว ${currentQ.word.length} ตัวอักษร):`
                    : `Type the vocabulary word (Starts with "${currentQ.word
                        .charAt(0)
                        .toUpperCase()}..."):`}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={typedInput}
                    onChange={(e) => setTypedInput(e.target.value)}
                    placeholder={
                      lang === "th"
                        ? "พิมพ์คำศัพท์ภาษาอังกฤษที่นี่..."
                        : "Type the English word here..."
                    }
                    className="flex-1 bg-[#FAF6F0] border border-[#DFD6C7] rounded-2xl px-4 py-3 text-sm text-[#2C2523] focus:outline-none focus:border-[#C86D51]"
                  />
                  <button
                    type="submit"
                    className="bg-[#C86D51] hover:bg-[#B35B40] text-white px-5 py-3 rounded-2xl text-xs font-semibold transition cursor-pointer"
                  >
                    {lang === "th" ? "ส่งคำตอบ" : "Check Answer"}
                  </button>
                </div>
              </form>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#F2ECE1]">
              <button
                type="button"
                onClick={() => onSpeak(currentQ.word, 0.9)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5C524E] hover:text-[#2C2523] cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#C86D51]" />
                {lang === "th" ? "ฟังเสียงใบ้คำอ่าน (Audio Clue)" : "Hear Audio Clue"}
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2C2523] hover:bg-[#3F3633] text-[#FAF6F0] transition cursor-pointer"
              >
                {lang === "th" ? "คำถามข้อต่อไป" : "Next Question"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {status === "correct" && (
            <div className="bg-[#6B8E78]/15 border-2 border-[#6B8E78]/40 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎸🐱</span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#4B6B57]">
                    ✨ Gentle Praise from Noree & Sienna
                  </div>
                  <p className="text-sm font-bold text-[#2C2523]">{feedbackMsg}</p>
                </div>
              </div>

              <div className="bg-white/90 border border-[#6B8E78]/25 rounded-2xl p-4 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-base text-[#2C2523] mr-2">
                    “{currentQ.word}”
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#F2ECE1] text-[#7A6B63] mr-2">
                    {currentQ.pos}
                  </span>
                  <span className="font-semibold text-[#4B6B57]">= {currentQ.meaningTh}</span>
                </div>
                <p className="text-[#3D3532] leading-relaxed">
                  <strong className="text-[#C86D51]">เกร็ดภาษาจากน้องโนรี: </strong>
                  {currentQ.gentleTip}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onSpeak(currentQ.word, 1.0)}
                  className="bg-[#C86D51] text-white text-xs font-semibold px-3.5 py-2 rounded-xl cursor-pointer"
                >
                  🔊 ฟังคำศัพท์
                </button>
                <button
                  type="button"
                  onClick={() => onSpeak(currentQ.contextSentence, 1.0)}
                  className="bg-white border border-[#DFD6C7] text-[#2C2523] text-xs font-semibold px-3.5 py-2 rounded-xl cursor-pointer"
                >
                  🔊 ฟังประโยคตัวอย่าง
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onSavePhrase({
                      sentence: `${currentQ.word} (${currentQ.pos}) — ${currentQ.contextSentence}`,
                      rhythmGuide: currentQ.word.toUpperCase(),
                      focusPoint: `${currentQ.meaningTh} • ${currentQ.gentleTip}`,
                    })
                  }
                  className="flex items-center gap-1 bg-[#6B8E78] text-white text-xs font-semibold px-3.5 py-2 rounded-xl cursor-pointer"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" /> เก็บเข้าสมุดจด
                </button>
              </div>
            </div>
          )}

          {status === "wrong" && (
            <div className="bg-[#C86D51]/10 border border-[#C86D51]/35 rounded-3xl p-5 space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🐾☕</span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A85035]">
                    💛 Gentle Encouragement & Hint
                  </div>
                  <p className="text-xs font-semibold text-[#2C2523] leading-relaxed">
                    {feedbackMsg}
                  </p>
                </div>
              </div>
              <div className="bg-white/90 border border-[#C86D51]/25 rounded-2xl p-3 text-xs text-[#4A403C]">
                <strong className="text-[#C86D51]">คำใบ้เพิ่มเติม: </strong>
                {currentQ.hintTh}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini Dictionary Search Bar */}
      <div className="bg-[#F5EFE6] border border-[#E5DEC9] rounded-3xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-base font-bold text-[#2C2523]">
              🔍 พจนานุกรมมินิของน้องโนรี (Mini Dictionary Search)
            </h3>
            <p className="text-xs text-[#7A6B63]">
              พิมพ์คำศัพท์ภาษาอังกฤษ หรือ คำแปลภาษาไทย เพื่อดูความหมาย ชนิดของคำ และตัวอย่างประโยคได้ทันทีค่ะ
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {["cozy", "unwind", "melody", "savor", "routine", "peaceful"].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setDictQuery(w)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                  dictQuery.toLowerCase() === w
                    ? "bg-[#C86D51] text-white"
                    : "bg-white hover:bg-[#FAF6F0] text-[#5C524E] border border-[#DFD6C7]"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={dictQuery}
            onChange={(e) => setDictQuery(e.target.value)}
            placeholder="🔎 พิมพ์คำศัพท์ภาษาอังกฤษ หรือ คำแปลไทย ที่ต้องการค้นหา (เช่น cozy, chamomile, อบอุ่น)..."
            className="w-full bg-white border border-[#DFD6C7] focus:border-[#C86D51] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#2C2523] focus:outline-none"
          />
          {dictQuery && (
            <button
              type="button"
              onClick={() => setDictQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C7D75] hover:text-[#2C2523] px-1.5 py-0.5 rounded-lg bg-[#F5EFE6] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(BUILTIN_WORD_DICT)
            .filter((item) => {
              const q = dictQuery.trim().toLowerCase();
              if (!q) return true;
              return (
                item.word.toLowerCase().includes(q) ||
                item.meaningTh.toLowerCase().includes(q) ||
                item.exampleEn.toLowerCase().includes(q)
              );
            })
            .slice(0, 6)
            .map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E5DEC9] rounded-2xl p-3.5 space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-serif text-base font-bold text-[#2C2523] mr-1.5">
                      {item.word}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6B8E78]/15 text-[#4B6B57] border border-[#6B8E78]/30 font-semibold">
                      {POS_THAI_LABEL_MAP[item.pos] || item.pos}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSpeak(item.word, 0.95)}
                    className="px-2 py-1 rounded-lg bg-[#FAF6F0] hover:bg-[#E5DEC9] text-[#C86D51] text-xs font-semibold cursor-pointer"
                  >
                    🔊
                  </button>
                </div>
                <p className="text-xs font-semibold text-[#C86D51]">{item.meaningTh}</p>
                <div className="bg-[#FAF6F0] border border-[#E5DEC9] rounded-xl p-2.5 text-[11px] space-y-1">
                  <p className="font-medium text-[#2C2523] italic">“{item.exampleEn}”</p>
                  <p className="text-[#6E6059]">{item.exampleTh}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
