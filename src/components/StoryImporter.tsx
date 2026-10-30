"use client";

import React, { useState, useRef } from "react";
import { ShadowingTarget } from "@/lib/persona";
import { AppLanguage } from "@/lib/i18n";
import {
  BookOpen,
  Sparkles,
  Volume2,
  Mic,
  Square,
  Play,
  BookmarkPlus,
  Check,
  Eye,
  EyeOff,
  Eraser,
  Headphones,
} from "lucide-react";

export interface StoryVocabItem {
  word: string;
  pos: string;
  meaningTh: string;
}

export interface StorySegment {
  id: string;
  sentence: string;
  thaiTranslation: string;
  rhythmGuide: string;
  vocab: StoryVocabItem[];
  gentleTip: string;
}

export interface ParsedStory {
  id: string;
  badge?: { th: string; en: string };
  title: string;
  rawText: string;
  summaryTh: string;
  segments: StorySegment[];
}

export const SAMPLE_STORIES: ParsedStory[] = [
  {
    id: "maple-guitar-shop",
    badge: {
      th: "🎸 นิทานสั้น: ร้านกีตาร์ถนนเมเปิล",
      en: "🎸 Short Story: Maple St. Guitar Shop",
    },
    title: "The Little Guitar Shop on Maple Street (ร้านกีตาร์เล็กๆ บนถนนเมเปิล)",
    rawText:
      "Every rainy afternoon, Clara stopped by a cozy vintage guitar shop on Maple Street to unwind after work. The friendly shopkeeper always brewed a pot of warm chamomile tea and encouraged her to play it by ear. As she gently strummed an old wooden acoustic guitar, the soft melody immediately struck a chord in her heart. Before she knew it, she would completely lose track of time while the rain tapped softly against the windowpane.",
    summaryTh:
      "นิทานสั้นบรรยากาศอบอุ่นเกี่ยวกับ Clara ที่แวะพักใจในร้านกีตาร์วินเทจทุกบ่ายวันฝนพรำ ได้จิบชาคาโมมายล์และลองดีดกีตาร์ไม้ตามความรู้สึก (play it by ear) จนเสียงเพลงช่วยเยียวยาหัวใจและทำให้เพลินจนลืมเวลา",
    segments: [
      {
        id: "seg-1",
        sentence:
          "Every rainy afternoon, Clara stopped by a cozy vintage guitar shop on Maple Street to unwind after work.",
        thaiTranslation:
          "ทุกๆ บ่ายวันฝนพรำ คลาร่ามักจะแวะไปที่ร้านกีตาร์วินเทจแสนอบอุ่นบนถนนเมเปิลเพื่อผ่อนคลายหลังเลิกงาน",
        rhythmGuide:
          "EV-ery RAIN-y af-ter-NOON, CLA-ra STOPPED BY a CO-zy VIN-tage gui-TAR SHOP on MA-ple STREET to un-WIND af-ter WORK.",
        vocab: [
          { word: "stop by", pos: "phr. v.", meaningTh: "แวะไปหา / แวะเยี่ยมเยียนช่วงสั้นๆ" },
          { word: "cozy", pos: "adj.", meaningTh: "อบอุ่น น่านั่ง สบายใจ" },
          { word: "vintage", pos: "adj.", meaningTh: "คลาสสิก ย้อนยุคแต่มีคุณค่า" },
          { word: "unwind", pos: "v.", meaningTh: "คลายความเหนื่อยล้า / พักผ่อนหย่อนใจ" },
        ],
        gentleTip:
          "สังเกตการใช้กริยาวลี 'stop by' (ช่อง 2 คือ stopped by) แทนคำว่า visit จะฟังดูเป็นธรรมชาติมากเวลาหมายถึงการ 'แวะผ่านไปแป๊บเดียว' ส่วนคำว่า 'to unwind after work' เป็นวลีที่เจ้าของภาษาใช้บ่อยที่สุดเวลาพูดถึงการพักผ่อนคลายเครียดหลังเลิกงานค่ะ!",
      },
      {
        id: "seg-2",
        sentence:
          "The friendly shopkeeper always brewed a pot of warm chamomile tea and encouraged her to play it by ear.",
        thaiTranslation:
          "เจ้าของร้านผู้เป็นมิตรมักจะชงชาคาโมมายล์อุ่นๆ เตรียมไว้เป็นกา และให้กำลังใจเธอให้ลองดีดเพลงตามความรู้สึกโดยไม่ต้องพึ่งโน้ต",
        rhythmGuide:
          "The FRIEND-ly SHOP-kee-per AL-ways BREWED a POT of WARM CHA-mo-mile TEA and en-COUR-aged her to PLAY it by EAR.",
        vocab: [
          { word: "shopkeeper", pos: "n.", meaningTh: "เจ้าของร้านค้า" },
          { word: "brew", pos: "v.", meaningTh: "ชง (ชาหรือกาแฟด้วยความพิถีพิถัน)" },
          { word: "chamomile", pos: "n.", meaningTh: "ดอกคาโมมายล์ (ออกเสียงว่า แคม-โม-ไมล์)" },
          {
            word: "play it by ear",
            pos: "idiom",
            meaningTh: "เล่นดนตรีโดยใช้หูฟัง / ค่อยว่ากันตามสถานการณ์หน้างาน",
          },
        ],
        gentleTip:
          "คำว่า 'chamomile' ตัว ch ออกเสียงเหมือนตัว K เป็น 'แคม-โม-ไมล์' นะคะ และในประโยคนี้ใช้สำนวน 'play it by ear' ที่เล่นคำได้อย่างไพเราะ เพราะหมายถึงทั้งการแกะเพลงด้วยหูฟังและการปล่อยใจสบายๆ ไม่ยึดติดกับกฎเกณฑ์ค่ะ",
      },
      {
        id: "seg-3",
        sentence:
          "As she gently strummed an old wooden acoustic guitar, the soft melody immediately struck a chord in her heart.",
        thaiTranslation:
          "ขณะที่เธอค่อยๆ ดีดกีตาร์โปร่งไม้ตัวเก่าอย่างแผ่วเบา ท่วงทำนองอันนุ่มนวลก็ไปสะกิดความรู้สึกในใจของเธออย่างจังทันที",
        rhythmGuide:
          "As she GENT-ly STRUMMED an OLD WOOD-en a-COUS-tic gui-TAR, the SOFT MEL-o-dy im-ME-di-ate-ly STRUCK a CHORD in her HEART.",
        vocab: [
          { word: "strum", pos: "v.", meaningTh: "ดีดกีตาร์ (ใช้นิ้วหรือปิ๊กปัดผ่านสายกีตาร์)" },
          { word: "melody", pos: "n.", meaningTh: "ท่วงทำนองเพลง" },
          { word: "immediately", pos: "adv.", meaningTh: "ในทันทีทันใด" },
          {
            word: "strike a chord",
            pos: "idiom",
            meaningTh: "โดนใจอย่างจัง / สะกิดความรู้สึกลึกซึ้งในใจ (ช่อง 2: struck a chord)",
          },
        ],
        gentleTip:
          "โครงสร้าง 'As she gently strummed..., the soft melody...' ใช้คำว่า 'As' เปิดประโยคเพื่อบอกเหตุการณ์ 2 อย่างที่เกิดขึ้นพร้อมกันอย่างละมุนละไม เวลาอ่านออกเสียงให้เว้นจังหวะหายใจนิดนึงตรงเครื่องหมายคอมม่า (,) แล้วเน้นเสียงที่ 'STRUCK a CHORD' ค่ะ",
      },
      {
        id: "seg-4",
        sentence:
          "Before she knew it, she would completely lose track of time while the rain tapped softly against the windowpane.",
        thaiTranslation:
          "รู้ตัวอีกที เธอก็มักจะเพลินจนลืมเวลาไปเสียสนิท ในขณะที่สายฝนโปรยปรายกระทบกระจกหน้าต่างอย่างแผ่วเบา",
        rhythmGuide:
          "Be-FORE she KNEW it, she would com-PLETE-ly LOSE TRACK of TIME while the RAIN TAPPED SOFT-ly a-GAINST the WIN-dow-pane.",
        vocab: [
          { word: "before she knew it", pos: "phr.", meaningTh: "รู้ตัวอีกที... / ไม่ทันไรเลย" },
          { word: "lose track of time", pos: "idiom", meaningTh: "เพลินจนลืมเวลา" },
          { word: "tap softly", pos: "v. phr.", meaningTh: "เคาะหรือตกกระทบเบาๆ" },
          { word: "windowpane", pos: "n.", meaningTh: "บานกระจกหน้าต่าง" },
        ],
        gentleTip:
          "วลีเปิดประโยค 'Before she knew it' แปลเป็นไทยได้ตรงกับคำว่า 'รู้ตัวอีกที...' เอาไปปรับใช้เล่าเรื่องตัวเองได้ง่ายมาก เช่น 'Before I knew it, it was already midnight!' ค่ะ",
      },
    ],
  },
  {
    id: "slow-morning-article",
    badge: {
      th: "☕ บทความสั้น: ศิลปะแห่งเช้าวันสบายๆ",
      en: "☕ Short Article: Art of a Slow Morning",
    },
    title: "The Art of a Slow Morning (ศิลปะแห่งการเริ่มต้นเช้าวันใหม่แบบไม่เร่งรีบ)",
    rawText:
      "In our fast-paced world, waking up just twenty minutes earlier can transform your entire mood for the day. Instead of checking your phone right away, try keeping your morning routine low-key and peaceful. Pour yourself a warm cup of coffee, step out onto the balcony, and savor the quiet morning breeze. When we give ourselves permission to start slowly, even the busiest schedule feels much easier to handle.",
    summaryTh:
      "บทความสั้นแนวพัฒนาตัวเองแบบอ่อนโยน ชวนให้ลองตื่นเช้าขึ้นสัก 20 นาทีเพื่อหลีกหนีความเร่งรีบ วางโทรศัพท์ลงชั่วคราว แล้วใช้เวลาดื่มด่ำกับกาแฟแก้วอุ่นและสายลมยามเช้า เพื่อเติมพลังใจก่อนเริ่มวันใหม่",
    segments: [
      {
        id: "art-1",
        sentence:
          "In our fast-paced world, waking up just twenty minutes earlier can transform your entire mood for the day.",
        thaiTranslation:
          "ในโลกที่หมุนไปอย่างเร่งรีบของเรา การตื่นนอนเร็วขึ้นเพียงยี่สิบนาทีก็สามารถเปลี่ยนอารมณ์ของคุณไปได้ตลอดทั้งวัน",
        rhythmGuide:
          "In our FAST-PACED WORLD, WA-king UP just TWEN-ty MIN-utes EAR-li-er can trans-FORM your en-TIRE MOOD for the DAY.",
        vocab: [
          { word: "fast-paced", pos: "adj.", meaningTh: "ที่หมุนไปอย่างรวดเร็ว / เร่งรีบ" },
          { word: "transform", pos: "v.", meaningTh: "เปลี่ยนแปลงไปในทางที่ดีขึ้นอย่างชัดเจน" },
          { word: "entire", pos: "adj.", meaningTh: "ทั้งหมด / ทั้งสิ้น" },
        ],
        gentleTip:
          "การนำคำกริยาเติม -ing ('waking up...') มาวางเป็นประธานของประโยค (Gerund) ช่วยให้ประโยคภาษาอังกฤษในบทความดูสละสลวยและเป็นธรรมชาติมากค่ะ",
      },
      {
        id: "art-2",
        sentence:
          "Instead of checking your phone right away, try keeping your morning routine low-key and peaceful.",
        thaiTranslation:
          "แทนที่จะหยิบโทรศัพท์ขึ้นมาเช็กในทันที ลองเปลี่ยนให้กิจวัตรยามเช้าของคุณเป็นไปอย่างเรียบง่าย ชิลๆ และเงียบสงบดูสิ",
        rhythmGuide:
          "In-STEAD of CHECK-ing your PHONE right a-WAY, TRY KEEP-ing your MOR-ning rou-TINE LOW-KEY and PEACE-ful.",
        vocab: [
          { word: "instead of", pos: "prep.", meaningTh: "แทนที่จะ..." },
          { word: "right away", pos: "phr.", meaningTh: "ในทันที / ทันใดนั้น" },
          { word: "routine", pos: "n.", meaningTh: "กิจวัตรประจำวัน (ออกเสียง รู-ทีน)" },
          { word: "low-key", pos: "adj.", meaningTh: "ชิลๆ เรียบง่าย ไม่วุ่นวาย" },
        ],
        gentleTip:
          "หลังคำว่า 'Instead of' คำกริยาจะต้องเติม -ing เสมอ ('Instead of checking...') และโครงสร้าง 'try + V.ing' มีความหมายนุ่มนวลว่า 'ลองทำ...ดูสิ' ค่ะ",
      },
      {
        id: "art-3",
        sentence:
          "Pour yourself a warm cup of coffee, step out onto the balcony, and savor the quiet morning breeze.",
        thaiTranslation:
          "รินกาแฟอุ่นๆ ให้ตัวเองสักแก้ว ก้าวออกไปที่ระเบียง แล้วค่อยๆ ดื่มด่ำกับสายลมยามเช้าอันเงียบสงบ",
        rhythmGuide:
          "POUR your-SELF a WARM cup of COF-fee, STEP OUT on-to the BAL-co-ny, and SA-vor the QUI-et MOR-ning BREEZE.",
        vocab: [
          { word: "pour", pos: "v.", meaningTh: "ริน / เท (เครื่องดื่ม)" },
          { word: "balcony", pos: "n.", meaningTh: "ระเบียงห้องหรือบ้าน" },
          { word: "savor", pos: "v.", meaningTh: "ค่อยๆ ลิ้มรสและดื่มด่ำกับช่วงเวลาดีๆ" },
          { word: "breeze", pos: "n.", meaningTh: "สายลมอ่อนๆ ที่พัดเย็นสบาย" },
        ],
        gentleTip:
          "ประโยคนี้ใช้เทคนิคการเรียงกริยา 3 ตัวต่อเนื่องกัน (Pour..., step out..., and savor...) เรียกว่า 'Rule of Three' ทำให้จังหวะการอ่านไหลลื่นและเห็นภาพชัดเจนค่ะ",
      },
      {
        id: "art-4",
        sentence:
          "When we give ourselves permission to start slowly, even the busiest schedule feels much easier to handle.",
        thaiTranslation:
          "เมื่อเราอนุญาตให้ตัวเองได้เริ่มต้นอย่างช้าๆ แม้แต่ตารางงานที่ยุ่งที่สุดก็ยังรู้สึกรับมือได้ง่ายขึ้นกว่าเดิมมาก",
        rhythmGuide:
          "When we GIVE our-SELVES per-MIS-sion to START SLOW-ly, E-ven the BUS-i-est SCHED-ule FEELS much EA-si-er to HAN-dle.",
        vocab: [
          { word: "give oneself permission", pos: "phr.", meaningTh: "อนุญาตให้ตัวเองได้ทำ..." },
          { word: "schedule", pos: "n.", meaningTh: "ตารางเวลา / ตารางงาน" },
          { word: "handle", pos: "v.", meaningTh: "รับมือ / จัดการกับภาระงาน" },
        ],
        gentleTip:
          "วลี 'give ourselves permission to...' เป็นสำนวนจิตวิทยาเชิงบวกที่อบอุ่นมาก แปลว่า 'อนุญาตให้ตัวเองได้พักหรือค่อยๆ เริ่มโดยไม่ต้องกดดันตัวเอง' ค่ะ",
      },
    ],
  },
];

interface StoryImporterProps {
  lang: AppLanguage;
  apiKey: string;
  onSpeak: (text: string, rate?: number) => void;
  onSelectShadowTarget: (target: ShadowingTarget) => void;
  onSavePhrase: (target: ShadowingTarget) => void;
  onStoryParsed?: (story: ParsedStory) => void;
  onOpenPictureQuiz?: () => void;
}

export default function StoryImporter({
  lang,
  apiKey,
  onSpeak,
  onSelectShadowTarget,
  onSavePhrase,
  onStoryParsed,
  onOpenPictureQuiz,
}: StoryImporterProps) {
  const [titleDraft, setTitleDraft] = useState(SAMPLE_STORIES[0].title);
  const [textDraft, setTextDraft] = useState(SAMPLE_STORIES[0].rawText);
  const [parsedStory, setParsedStory] = useState<ParsedStory>(SAMPLE_STORIES[0]);
  const [isParsing, setIsParsing] = useState(false);
  const [showThaiTranslation, setShowThaiTranslation] = useState(true);
  const [activeSegId, setActiveSegId] = useState<string | null>(
    SAMPLE_STORIES[0].segments[0]?.id || null
  );
  const [recordingSegId, setRecordingSegId] = useState<string | null>(null);
  const [segmentTakes, setSegmentTakes] = useState<Record<string, string>>({});
  const [savedToastId, setSavedToastId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleLoadSample = (sample: ParsedStory) => {
    setTitleDraft(sample.title);
    setTextDraft(sample.rawText);
    setParsedStory(sample);
    onStoryParsed?.(sample);
    setActiveSegId(sample.segments[0]?.id || null);
  };

  const handleParseAndLearn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textDraft.trim() || isParsing) return;

    const matchedSample = SAMPLE_STORIES.find(
      (s) => s.rawText.trim().toLowerCase() === textDraft.trim().toLowerCase()
    );
    if (matchedSample && !apiKey) {
      setParsedStory(matchedSample);
      onStoryParsed?.(matchedSample);
      setActiveSegId(matchedSample.segments[0]?.id || null);
      return;
    }

    setIsParsing(true);
    try {
      const res = await fetch("/api/story-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textDraft,
          title: titleDraft,
          apiKey,
        }),
      });
      const data = await res.json();
      if (data.story) {
        setParsedStory(data.story);
        onStoryParsed?.(data.story);
        setActiveSegId(data.story.segments?.[0]?.id || null);
      }
    } catch (err) {
      console.error("Failed to parse story:", err);
    } finally {
      setIsParsing(false);
    }
  };

  const startRecordingSegment = async (segId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setSegmentTakes((prev) => ({ ...prev, [segId]: url }));
        stream.getTracks().forEach((tr) => tr.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecordingSegId(segId);
    } catch {
      alert(
        lang === "th"
          ? "กรุณาอนุญาตการใช้ไมโครโฟนในเบราว์เซอร์เพื่ออัดเสียงฝึกพูดตามครับ"
          : "Please allow microphone access in your browser to record your shadowing take."
      );
    }
  };

  const stopRecordingSegment = () => {
    if (mediaRecorderRef.current && recordingSegId) {
      mediaRecorderRef.current.stop();
      setRecordingSegId(null);
    }
  };

  const handleSaveSeg = (seg: StorySegment) => {
    onSavePhrase({
      sentence: seg.sentence,
      rhythmGuide: seg.rhythmGuide,
      focusPoint: `${seg.thaiTranslation} • ${seg.gentleTip}`,
    });
    setSavedToastId(seg.id);
    setTimeout(() => setSavedToastId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Story & Article Importer Box */}
      <div className="bg-white border border-[#E5DEC9] rounded-3xl p-6 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C86D51]/15 text-[#A85035] border border-[#C86D51]/30">
                <BookOpen className="w-3.5 h-3.5" /> Story & Article Importer
              </span>
              <span className="text-xs text-[#7A6B63]">
                {lang === "th"
                  ? "ย่อยนิทานและบทความภาษาอังกฤษเป็นประโยคสั้นๆ พร้อมคำแนะนำภาษาไทย"
                  : "Split stories into bite-sized shadowing & vocabulary cards"}
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#2C2523]">
              {lang === "th"
                ? "วางนิทานหรือบทความสั้นภาษาอังกฤษ (Story & Article Importer)"
                : "Story & Article Importer — Parse & Shadow Step by Step"}
            </h2>
            <p className="text-xs text-[#6E6059]">
              {lang === "th"
                ? "วางนิทานหรือบทความภาษาอังกฤษยาวๆ ที่คัดลอกมา แล้วกดปุ่ม Parse & Learn เพื่อให้น้องโนรีช่วยตัดแบ่งประโยค สรุปคำศัพท์ และอธิบายคำแนะนำ (gentleTip) เป็นภาษาไทยทีละท่อนค่ะ"
                : "Paste any English story or article below and click Parse & Learn. Noree will split it into sentence cards with Thai vocabulary notes and gentle tips."}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A6B63]">
              {lang === "th" ? "✨ ลองเลือกนิทาน/บทความตัวอย่าง:" : "✨ Try a Cozy Sample Story:"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_STORIES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleLoadSample(sample)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    parsedStory.id === sample.id && textDraft === sample.rawText
                      ? "bg-[#C86D51] text-white shadow-2xs"
                      : "bg-[#F5EFE6] hover:bg-[#E5DEC9]/70 text-[#4A403C] border border-[#DFD6C7]"
                  }`}
                >
                  {sample.badge ? sample.badge[lang] : sample.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleParseAndLearn} className="space-y-4">
          <div className="grid sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-[#5C524E] mb-1.5">
                {lang === "th"
                  ? "📌 ชื่อเรื่อง / หัวข้อบทความ (ไม่บังคับ):"
                  : "📌 Story or Article Title (Optional):"}
              </label>
              <input
                type="text"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                placeholder={
                  lang === "th"
                    ? "เช่น The Little Guitar Shop..."
                    : "e.g., The Little Guitar Shop on Maple Street..."
                }
                className="w-full bg-[#FAF6F0] border border-[#DFD6C7] rounded-2xl px-4 py-2.5 text-sm text-[#2C2523] focus:outline-none focus:border-[#C86D51]"
              />
            </div>
            <div className="sm:col-span-4 flex items-end justify-end">
              <button
                type="button"
                onClick={() => {
                  setTitleDraft("");
                  setTextDraft("");
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-[#F5EFE6] hover:bg-[#E5DEC9] text-[#5C524E] border border-[#DFD6C7] transition cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5" />
                {lang === "th" ? "ล้างข้อความ" : "Clear Text"}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#5C524E]">
                {lang === "th"
                  ? "📝 ช่องวางข้อความ (วางนิทานหรือบทความภาษาอังกฤษยาวๆ ที่นี่):"
                  : "📝 Paste Your English Story or Article Below:"}
              </label>
              <span className="text-[11px] text-[#8C7D75]">
                {textDraft.trim() ? `${textDraft.trim().split(/\s+/).length} words` : "0 words"}
              </span>
            </div>
            <textarea
              rows={5}
              value={textDraft}
              onChange={(e) => setTextDraft(e.target.value)}
              placeholder={
                lang === "th"
                  ? "วางนิทานหรือบทความภาษาอังกฤษยาวๆ ที่คัดลอกมาลงในกล่องนี้ได้เลยครับ..."
                  : "Paste your English story or article here..."
              }
              className="w-full bg-[#FAF6F0] border border-[#DFD6C7] rounded-2xl p-4 text-sm text-[#2C2523] leading-relaxed focus:outline-none focus:border-[#C86D51] focus:bg-white transition"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs text-[#7A6B63]">
              {lang === "th"
                ? "💡 ระบบจะตัดแบ่งเนื้อหาเป็นประโยคสั้นๆ (Segment) สรุปคำศัพท์ และอธิบายคำแนะนำ (gentleTip) เป็นภาษาไทยให้อ่านเข้าใจง่าย"
                : "💡 Noree splits your text into sentence segments with Thai vocabulary & gentle tips."}
            </p>
            <button
              type="submit"
              disabled={!textDraft.trim() || isParsing}
              className="flex items-center gap-2 bg-[#C86D51] hover:bg-[#B35B40] disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-2xs transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {isParsing
                ? lang === "th"
                  ? "น้องโนรีกำลังย่อยเนื้อหาและสรุปคำศัพท์..."
                  : "Noree is parsing your story..."
                : lang === "th"
                ? "ประมวลผล & สร้างการ์ดบทเรียน (Parse & Learn)"
                : "Parse & Learn with Noree"}
            </button>
          </div>
        </form>
      </div>

      {/* Parsed Story Summary & Segment Cards */}
      <div className="space-y-5">
        <div className="bg-[#F5EFE6] border border-[#E5DEC9] rounded-3xl p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#6B8E78]" />
              <h3 className="font-serif text-xl font-bold text-[#2C2523]">
                {parsedStory.title}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-[#6B8E78] border border-[#E5DEC9]">
                {parsedStory.segments.length} {lang === "th" ? "ประโยค (Segments)" : "Segments"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {onOpenPictureQuiz && (
                <button
                  type="button"
                  onClick={onOpenPictureQuiz}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#6B8E78] hover:bg-[#5A7A66] text-white transition cursor-pointer"
                >
                  {lang === "th"
                    ? "🖼️ เล่นเกมทายภาพคำศัพท์จากเรื่องนี้ →"
                    : "🖼️ Play Picture Quiz with This Story →"}
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowThaiTranslation((v) => !v)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#FAF6F0] text-[#5C524E] border border-[#DFD6C7] transition cursor-pointer"
              >
                {showThaiTranslation ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    {lang === "th" ? "ซ่อนคำแปลภาษาไทย" : "Hide Thai Translation"}
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    {lang === "th" ? "แสดงคำแปลภาษาไทย" : "Show Thai Translation"}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  const full = parsedStory.segments.map((s) => s.sentence).join(" ");
                  onSpeak(full, 0.95);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2C2523] hover:bg-[#3F3633] text-[#FAF6F0] transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#C86D51]" />
                {lang === "th" ? "ฟังน้องโนรีอ่านทั้งเรื่อง" : "Listen to Full Story"}
              </button>
            </div>
          </div>

          <div className="bg-white/90 border border-[#E5DEC9] rounded-2xl p-4 text-xs text-[#3D3532] leading-relaxed">
            <strong className="text-[#C86D51]">
              {lang === "th"
                ? "📖 สรุปเนื้อหาและบรรยากาศเรื่อง (Story Summary): "
                : "📖 Story Summary (Thai): "}
            </strong>
            {parsedStory.summaryTh}
          </div>
        </div>

        {/* Sentence Segment Cards */}
        <div className="space-y-4">
          {parsedStory.segments.map((seg, idx) => {
            const isSelected = activeSegId === seg.id;
            const isRecordingThis = recordingSegId === seg.id;
            const myTakeUrl = segmentTakes[seg.id];
            const isSaved = savedToastId === seg.id;

            return (
              <div
                key={seg.id}
                onClick={() => setActiveSegId(seg.id)}
                className={`bg-white border rounded-3xl p-6 transition shadow-2xs space-y-4 ${
                  isSelected
                    ? "border-[#C86D51] ring-2 ring-[#C86D51]/20"
                    : "border-[#E5DEC9] hover:border-[#C86D51]/50"
                }`}
              >
                {/* Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F2ECE1]">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#C86D51] text-white">
                      {lang === "th"
                        ? `ท่อนที่ ${String(idx + 1).padStart(2, "0")}`
                        : `Segment ${String(idx + 1).padStart(2, "0")}`}
                    </span>
                    <span className="text-xs text-[#7A6B63]">
                      {lang === "th"
                        ? "กดฟังเสียงทีละท่อน หรืออัดเสียงพูดตาม (Shadowing) ได้เลย"
                        : "Listen, practice rhythm, or shadow out loud"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectShadowTarget({
                          sentence: seg.sentence,
                          rhythmGuide: seg.rhythmGuide,
                          focusPoint: seg.gentleTip,
                        });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F5EFE6] hover:bg-[#E5DEC9] text-[#5C524E] border border-[#DFD6C7] transition cursor-pointer"
                    >
                      <Headphones className="w-3.5 h-3.5 text-[#C86D51]" />
                      {lang === "th" ? "ส่งไปหน้า Shadowing Studio" : "Open in Shadowing Deck"}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveSeg(seg);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#6B8E78]/15 hover:bg-[#6B8E78]/25 text-[#4B6B57] border border-[#6B8E78]/30 transition cursor-pointer"
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          {lang === "th" ? "บันทึกลงสมุดจดแล้ว" : "Saved"}
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          {lang === "th" ? "เก็บเข้าสมุดจด" : "Save Phrase"}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sentence & Thai Translation */}
                <div className="space-y-2.5">
                  <p className="font-serif text-xl font-bold text-[#2C2523] leading-relaxed">
                    “{seg.sentence}”
                  </p>
                  {showThaiTranslation && (
                    <div className="bg-[#FAF6F0] border border-[#E5DEC9] rounded-2xl px-4 py-3 text-sm text-[#4A403C]">
                      <span className="font-semibold text-[#C86D51] mr-1.5">
                        {lang === "th" ? "คำแปลไทย:" : "Thai Translation:"}
                      </span>
                      {seg.thaiTranslation}
                    </div>
                  )}
                </div>

                {/* Audio & Shadowing Controls */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSegId(seg.id);
                      onSpeak(seg.sentence, 1.0);
                    }}
                    className="flex items-center gap-1.5 bg-[#C86D51] hover:bg-[#B35B40] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {lang === "th" ? "ฟังเสียงน้องโนรี (1.0x)" : "Listen to Noree (1.0x)"}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSegId(seg.id);
                      onSpeak(seg.sentence, 0.8);
                    }}
                    className="bg-[#FAF6F0] hover:bg-[#F2ECE1] text-[#5C524E] border border-[#DFD6C7] text-xs font-semibold px-3.5 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    {lang === "th" ? "🐢 ฟังช้าชัดๆ (0.8x)" : "🐢 Slow Acoustic (0.8x)"}
                  </button>

                  {!isRecordingThis ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startRecordingSegment(seg.id);
                      }}
                      className="flex items-center gap-1.5 bg-[#2C2523] hover:bg-[#3F3633] text-[#FAF6F0] text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5 text-[#C86D51]" />
                      {lang === "th" ? "อัดเสียงฝึกพูดตาม (Shadow)" : "Shadow Out Loud"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        stopRecordingSegment();
                      }}
                      className="flex items-center gap-1.5 bg-[#D9534F] text-white text-xs font-semibold px-4 py-2.5 rounded-xl animate-pulse cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5" />
                      {lang === "th" ? "หยุดอัดเสียง" : "Stop Recording"}
                    </button>
                  )}

                  {myTakeUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        new Audio(myTakeUrl).play();
                      }}
                      className="flex items-center gap-1.5 bg-[#6B8E78] hover:bg-[#5A7A66] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      {lang === "th" ? "ฟังเสียงพูดของฉัน" : "Play My Take"}
                    </button>
                  )}
                </div>

                {/* Rhythm Guide */}
                <div className="bg-[#FAF6F0] border border-[#E5DEC9] rounded-2xl p-3.5">
                  <div className="text-[11px] uppercase tracking-wider text-[#8C7D75] mb-1.5 font-semibold">
                    {lang === "th"
                      ? "🎵 จังหวะการเน้นเสียงสำหรับฝึก Shadowing (ตัวพิมพ์ใหญ่ CAPS = พยางค์ที่ลงน้ำหนักเสียง):"
                      : "🎵 Acoustic Rhythm & Stress Guide (CAPS = Strong Beat):"}
                  </div>
                  <div className="font-mono text-xs sm:text-sm leading-relaxed">
                    {seg.rhythmGuide.split(" ").map((w, i) => {
                      const isCap = /[A-Z]{2,}/.test(w);
                      return (
                        <span
                          key={i}
                          className={`inline-block mr-1.5 mb-1 px-1.5 py-0.5 rounded-md ${
                            isCap
                              ? "bg-[#C86D51]/15 text-[#A85035] font-semibold border border-[#C86D51]/30"
                              : "text-[#5C524E]"
                          }`}
                        >
                          {w}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Grid: Vocab + Gentle Tip */}
                <div className="grid md:grid-cols-12 gap-4 pt-1">
                  <div className="md:col-span-6 bg-[#F5EFE6]/70 border border-[#E5DEC9] rounded-2xl p-4 space-y-2.5">
                    <div className="text-xs font-bold text-[#2C2523]">
                      📚{" "}
                      {lang === "th"
                        ? "คำศัพท์และสำนวนที่น่าสนใจ (Vocabulary & Idioms)"
                        : "Key Vocabulary & Idioms"}
                    </div>
                    {seg.vocab && seg.vocab.length > 0 ? (
                      <div className="grid gap-2">
                        {seg.vocab.map((v, vIdx) => (
                          <div
                            key={vIdx}
                            className="bg-white border border-[#E5DEC9] rounded-xl px-3 py-2 flex items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <span className="font-bold text-[#2C2523] mr-1.5">{v.word}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F2ECE1] text-[#7A6B63] mr-1.5">
                                {v.pos}
                              </span>
                              <span className="text-[#4A403C]">— {v.meaningTh}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSpeak(v.word, 0.95);
                              }}
                              className="px-2 py-1 rounded-lg bg-[#FAF6F0] hover:bg-[#E5DEC9] text-[#C86D51] font-semibold shrink-0 cursor-pointer"
                            >
                              🔊
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#7A6B63]">
                        {lang === "th"
                          ? "ประโยคนี้ใช้คำศัพท์พื้นฐานที่เข้าใจง่าย เหมาะสำหรับฝึกเชื่อมเสียงพูดให้ลื่นไหลค่ะ"
                          : "Simple everyday words—great for practicing smooth connected speech!"}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-6 bg-[#6B8E78]/10 border border-[#6B8E78]/30 rounded-2xl p-4 flex flex-col justify-between space-y-2">
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-[#4B6B57]">
                        ✨{" "}
                        {lang === "th"
                          ? "คำแนะนำจากน้องโนรี (Gentle Tip • ภาษาไทย)"
                          : "Noree’s Gentle Tip (Thai Explanation)"}
                      </div>
                      <p className="text-xs text-[#2C2523] leading-relaxed">{seg.gentleTip}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
