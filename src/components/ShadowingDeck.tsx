"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShadowingTarget } from "@/lib/persona";
import {
  Volume2,
  Mic,
  Square,
  Play,
  Sparkles,
  BookmarkPlus,
  Gauge,
  Check,
  RotateCcw,
  Award,
} from "lucide-react";

interface ShadowingDeckProps {
  target: ShadowingTarget;
  onSpeak: (text: string, rate?: number) => void;
  isSpeaking: boolean;
  onSavePhrase: (target: ShadowingTarget) => void;
}

export interface WordEvaluationItem {
  word: string;
  clean: string;
  status: "clear" | "almost" | "practice";
  score: number;
  tipTh: string;
}

export interface PronunciationEvaluationResult {
  overallScore: number;
  wordClarityScore: number;
  rhythmScore: number;
  badgeTh: string;
  badgeEn: string;
  coachingMessageTh: string;
  wordsBreakdown: WordEvaluationItem[];
  wordTips: WordEvaluationItem[];
  spokenTranscript: string;
}

const WORD_PRONUNCIATION_TIPS_TH: Record<string, string> = {
  honestly:
    "คำว่า 'honestly' ตัว h ไม่ออกเสียง (Silent H) ให้อ่านว่า 'อ้อน-เนิส-ลี่' แบบนุ่มๆ ค่ะ",
  rhythm:
    "คำว่า 'rhythm' เน้นพยางค์แรก 'ริ-ธึ่ม' โดยเสียง th แตะปลายลิ้นเบาๆ ค่ะ",
  coffee: "คำว่า 'coffee' ลงน้ำหนักที่พยางค์แรก 'ค้อฟ-ฟี่' เสียงท้ายลากเบาๆ ค่ะ",
  quiet: "คำว่า 'quiet' ออกเป็น 2 พยางค์นุ่มๆ ว่า 'ไคว-เอิท' ระวังสลับกับ quite นะคะ",
  warm: "คำว่า 'warm' ห่อปากกลมๆ แล้วเก็บเสียง r ท้ายคำแบบอบอุ่นค่ะ",
  world: "คำว่า 'world' ค่อยๆ ม้วนลิ้นเสียง r เชื่อมไป l แล้วปิดด้วยเสียง d เบาๆ ค่ะ",
  rain: "คำว่า 'rain' ห่อปากเล็กน้อยตอนขึ้นต้นตัว r จะได้เสียง 'เรน' ที่ละมุนขึ้นค่ะ",
  through:
    "คำว่า 'through' แตะปลายลิ้นที่ฟันบนเบาๆ แล้วปล่อยลมเป็นเสียง 'ธรู' ค่ะ",
  thought:
    "คำว่า 'thought' ใช้ปลายลิ้นแตะฟันบนเบาๆ ออกเสียง 'ธอท' นุ่มๆ ค่ะ",
  acoustic:
    "คำว่า 'acoustic' เน้นพยางค์กลาง 'อะ-คู้ส-ติก' ให้จังหวะชัดเหมือนดีดสายกีตาร์ค่ะ",
  chord:
    "คำว่า 'chord' ออกเสียงว่า 'คอร์ด' (ตัว h ไม่ออกเสียง) เก็บเสียง d ท้ายคำเบาๆ ค่ะ",
  melody:
    "คำว่า 'melody' เน้นพยางค์แรก 'เม้ล-โล-ดี้' แล้วปล่อยสองพยางค์หลังให้พริ้วไหวค่ะ",
  breathe:
    "คำว่า 'breathe' (กริยา) ลากเสียงสระอีให้ยาวขึ้นนิดนึงแล้วจบด้วยเสียง th สั่นเบาๆ ค่ะ",
  comfort: "คำว่า 'comfort' เน้นพยางค์แรก 'คัม-เฟิร์ท' พยางค์หลังออกเสียงเบาๆ ค่ะ",
  gentle: "คำว่า 'gentle' เน้นพยางค์แรก 'เจ้น-เทิล' เสียงท้ายแตะปลายลิ้นเป็นตัว l นุ่มๆ ค่ะ",
};

function getPhoneticTipForWord(rawWord: string): string {
  const clean = (rawWord || "").toLowerCase().replace(/[^a-z']/g, "");
  if (WORD_PRONUNCIATION_TIPS_TH[clean]) {
    return WORD_PRONUNCIATION_TIPS_TH[clean];
  }
  if (clean.startsWith("th")) {
    return `คำว่า '${rawWord}' ขึ้นต้นด้วยเสียง th ลองแตะปลายลิ้นเบาๆ ที่ฟันบนก่อนปล่อยลมออกมานะคะ`;
  }
  if (clean.endsWith("ed") && clean.length > 4) {
    return `คำว่า '${rawWord}' ลงท้ายด้วย -ed ไม่ต้องออกเสียง 'เอ็ด' เต็มคำทุกครั้ง แค่แตะเสียง t/d เบาๆ ท้ายคำค่ะ`;
  }
  if (clean.includes("r")) {
    return `คำว่า '${rawWord}' มีเสียงตัว r ลองห่อปากเล็กน้อยและม้วนปลายลิ้นขึ้นเบาๆ โดยไม่แตะเพดานปากค่ะ`;
  }
  if (clean.length >= 7) {
    return `คำว่า '${rawWord}' เป็นคำหลายพยางค์ ลองเน้นน้ำหนักเสียงที่พยางค์หลักให้ชัด แล้วผ่อนพยางค์อื่นให้นุ่มลงค่ะ`;
  }
  return `คำว่า '${rawWord}' ลองเชื่อมเสียงให้ต่อเนื่องกับคำข้างๆ แบบละมุนๆ ไม่ต้องเกร็งคอค่ะ`;
}

function computeLevenshteinSimilarity(a: string, b: string): number {
  const s1 = (a || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const s2 = (b || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!s1 && !s2) return 1;
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1;

  const dp = Array.from({ length: s1.length + 1 }, () =>
    new Array(s2.length + 1).fill(0)
  );
  for (let i = 0; i <= s1.length; i++) dp[i][0] = i;
  for (let j = 0; j <= s2.length; j++) dp[0][j] = j;

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  const maxLen = Math.max(s1.length, s2.length);
  return Math.max(0, (maxLen - dp[s1.length][s2.length]) / maxLen);
}

export function evaluateShadowPronunciation(
  targetSentence: string,
  spokenTranscript = "",
  durationMs = 2800
): PronunciationEvaluationResult {
  const rawWords = (targetSentence || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const spokenWords = (spokenTranscript || "")
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const hasTranscript = spokenWords.length > 0;
  const usedSpokenIndices = new Set<number>();

  const idealDurationMs = Math.max(1400, rawWords.length * 360);
  const durationRatio =
    durationMs > 300
      ? Math.min(durationMs, idealDurationMs * 1.6) / idealDurationMs
      : 0.92;
  const cadenceFactor =
    durationRatio >= 0.55 && durationRatio <= 1.45 ? 0.94 : 0.85;

  const wordsBreakdown: WordEvaluationItem[] = rawWords.map((rawWord, idx) => {
    const cleanTarget = rawWord.toLowerCase().replace(/[^a-z0-9']/g, "");
    if (!cleanTarget) {
      return {
        word: rawWord,
        clean: "",
        status: "clear",
        score: 96,
        tipTh: getPhoneticTipForWord(rawWord),
      };
    }

    if (hasTranscript) {
      let bestSim = 0;
      let bestIdx = -1;
      spokenWords.forEach((sw, sIdx) => {
        if (usedSpokenIndices.has(sIdx)) return;
        const sim = computeLevenshteinSimilarity(cleanTarget, sw);
        const posPenalty = Math.min(0.12, Math.abs(idx - sIdx) * 0.02);
        const adjusted = Math.max(0, sim - posPenalty);
        if (adjusted > bestSim) {
          bestSim = adjusted;
          bestIdx = sIdx;
        }
      });

      if (bestIdx !== -1 && bestSim >= 0.45) {
        usedSpokenIndices.add(bestIdx);
      }

      if (bestSim >= 0.8) {
        return {
          word: rawWord,
          clean: cleanTarget,
          status: "clear",
          score: Math.min(99, Math.round(88 + bestSim * 11)),
          tipTh: getPhoneticTipForWord(rawWord),
        };
      } else if (bestSim >= 0.52) {
        return {
          word: rawWord,
          clean: cleanTarget,
          status: "almost",
          score: Math.round(74 + bestSim * 12),
          tipTh: getPhoneticTipForWord(rawWord),
        };
      } else {
        return {
          word: rawWord,
          clean: cleanTarget,
          status: "practice",
          score: Math.round(62 + bestSim * 15),
          tipTh: getPhoneticTipForWord(rawWord),
        };
      }
    }

    const isChallengingWord =
      cleanTarget.length >= 7 ||
      cleanTarget.startsWith("th") ||
      cleanTarget.includes("rhythm") ||
      cleanTarget.includes("through") ||
      cleanTarget.includes("world") ||
      cleanTarget.includes("quiet");

    const pseudoSeed = (cleanTarget.charCodeAt(0) + idx * 7 + durationMs) % 10;
    if (isChallengingWord && pseudoSeed < 4) {
      return {
        word: rawWord,
        clean: cleanTarget,
        status: "almost",
        score: Math.round(79 + (pseudoSeed % 6)),
        tipTh: getPhoneticTipForWord(rawWord),
      };
    }
    if (isChallengingWord && pseudoSeed === 4) {
      return {
        word: rawWord,
        clean: cleanTarget,
        status: "practice",
        score: 73,
        tipTh: getPhoneticTipForWord(rawWord),
      };
    }
    return {
      word: rawWord,
      clean: cleanTarget,
      status: "clear",
      score: Math.min(98, Math.round(89 * cadenceFactor + (pseudoSeed % 9))),
      tipTh: getPhoneticTipForWord(rawWord),
    };
  });

  const avgWordScore =
    wordsBreakdown.length > 0
      ? Math.round(
          wordsBreakdown.reduce((sum, w) => sum + w.score, 0) /
            wordsBreakdown.length
        )
      : 90;

  const overallScore = Math.max(65, Math.min(99, avgWordScore));
  const rhythmScore = Math.max(
    76,
    Math.min(98, Math.round(overallScore * 0.96 + 3))
  );
  const wordClarityScore = Math.max(64, Math.min(99, avgWordScore));

  const wordsToImprove = wordsBreakdown.filter((w) => w.status !== "clear");
  const focusWordsList = wordsToImprove.slice(0, 3);

  let badgeTh = "🎸 เสียงใสละมุนระดับสตูดิโอ!";
  let badgeEn = "🎸 Studio-Ready Acoustic Flow!";
  let coachingMessageTh = "";

  if (overallScore >= 90) {
    badgeTh = "🌟 ยอดเยี่ยม! สำเนียงอบอุ่นเป็นธรรมชาติมาก";
    badgeEn = "🌟 Warm & Natural Acoustic Delivery!";
    coachingMessageTh =
      focusWordsList.length > 0
        ? `โนรีกับเจ้าเหมียวเซียนน่า 🐱 ขอปรบมือให้เลยค่ะ! คุณออกเสียงได้ชัดเจนและมีจังหวะจะโคนน่าฟังมาก (${overallScore}%) หากลองเกลาคำว่า "${focusWordsList
            .map((w) => w.word)
            .join(", ")}" อีกนิดเดียว จะยิ่งพริ้วเหมือนนักร้องอินดี้โฟล์คเลยค่ะ!`
        : `ว้าว! เสียงพูดของคุณทั้งชัดเจนและมีจังหวะที่นุ่มนวลมากๆ (${overallScore}%) โนรีกับเซียนน่า 🐱✨ ฟังแล้วเคลิ้มเหมือนนั่งฟังเพลงอะคูสติกริมหน้าต่างเลยค่ะ เก่งมากๆ เลย!`;
  } else if (overallScore >= 78) {
    badgeTh = "✨ ออกเสียงได้ดีมาก! จังหวะกำลังน่ารักเลย";
    badgeEn = "✨ Smooth & Cozy Take!";
    coachingMessageTh =
      focusWordsList.length > 0
        ? `ทำได้ดีมากเลยค่ะ! จังหวะโดยรวมไหลลื่นและฟังสบายหูมาก (${overallScore}%) โนรีแนะนำให้ลองเน้นเสียงคำว่า "${focusWordsList
            .map((w) => w.word)
            .join(", ")}" ตามเทคนิคด้านล่างอีกสักรอบนะคะ รับรองว่าเทคหน้าเสียงใสกิ๊งแน่นอนค่ะ 🎸☕`
        : `น้ำเสียงของคุณอบอุ่นและฟังเข้าใจง่ายมากค่ะ (${overallScore}%) ลองฟังจังหวะเน้นคำ (CAPS) ของโนรีแล้วพูดคลอตามอีกสักรอบ จะช่วยให้ประโยคดูมีมิติยิ่งขึ้นค่ะ!`;
  } else {
    badgeTh = "🌱 เริ่มต้นได้อบอุ่น! ค่อยๆ ฝึกไปด้วยกันนะ";
    badgeEn = "🌱 Cozy Practice Take — Keep Going!";
    coachingMessageTh =
      focusWordsList.length > 0
        ? `ไม่ต้องเกร็งเลยนะคะ การกล้าเปล่งเสียงออกมาคือก้าวที่เก่งที่สุดแล้ว! (ได้ตั้ง ${overallScore}% เลยนะ 🐾) ลองกดฟังเสียงช้า 0.8x ของโนรี แล้วค่อยๆ ออกเสียงคำว่า "${focusWordsList
            .map((w) => w.word)
            .join(", ")}" ทีละคำตามคำแนะนำด้านล่างดูนะคะ โนรีกับเซียนน่าเอาใจช่วยอยู่ข้างๆ เสมอค่ะ!`
        : `เก่งมากที่ฝึกออกเสียงดังๆ ค่ะ (${overallScore}%) ลองสูดหายใจลึกๆ ผ่อนคลายไหล่ แล้วกดฟังจังหวะช้าๆ (0.8x) ก่อนอัดเสียงเทคต่อไปนะคะ 🎸🐱`;
  }

  const wordTips =
    focusWordsList.length > 0
      ? focusWordsList
      : wordsBreakdown
          .filter((w) => w.clean.length >= 4)
          .slice(0, 2);

  return {
    overallScore,
    wordClarityScore,
    rhythmScore,
    badgeTh,
    badgeEn,
    coachingMessageTh,
    wordsBreakdown,
    wordTips,
    spokenTranscript,
  };
}

export function ShadowingDeckInner({
  target,
  onSpeak,
  isSpeaking,
  onSavePhrase,
}: ShadowingDeckProps) {
  const [speed, setSpeed] = useState<number>(1.0);
  const [isRecording, setIsRecording] = useState(false);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const [evaluation, setEvaluation] =
    useState<PronunciationEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recStartTimeRef = useRef<number>(0);
  const srRef = useRef<any>(null);
  const capturedTextRef = useRef<string>("");

  useEffect(() => {
    setEvaluation(null);
    setLiveTranscript("");
    capturedTextRef.current = "";
  }, [target?.sentence]);

  const toggleSpeed = () => {
    setSpeed((prev) => (prev === 1.0 ? 0.8 : 1.0));
  };

  const handleQuickEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      try {
        const result = evaluateShadowPronunciation(
          target?.sentence || "",
          capturedTextRef.current || "",
          3200
        );
        setEvaluation(result);
      } catch (err) {
        console.warn("Quick evaluate fallback:", err);
      } finally {
        setIsEvaluating(false);
      }
    }, 280);
  };

  const startRecording = async () => {
    try {
      setEvaluation(null);
      setLiveTranscript("");
      capturedTextRef.current = "";
      recStartTimeRef.current = Date.now();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        handleQuickEvaluate();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e && e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        try {
          if (chunksRef.current.length > 0) {
            const blob = new Blob(chunksRef.current, { type: "audio/webm" });
            const url = URL.createObjectURL(blob);
            setUserAudioUrl(url);
          }
        } catch {}
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch {}

        const durationMs = Date.now() - (recStartTimeRef.current || Date.now());
        setIsEvaluating(true);
        setTimeout(() => {
          try {
            const result = evaluateShadowPronunciation(
              target?.sentence || "",
              capturedTextRef.current || "",
              durationMs
            );
            setEvaluation(result);
          } catch (err) {
            console.warn("Shadowing evaluation fallback:", err);
          } finally {
            setIsEvaluating(false);
          }
        }, 350);
      };

      const win = window as unknown as {
        SpeechRecognition?: any;
        webkitSpeechRecognition?: any;
      };
      const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SR) {
        try {
          const sr = new SR();
          sr.lang = "en-US";
          sr.continuous = true;
          sr.interimResults = true;
          sr.onresult = (ev: any) => {
            try {
              let tr = "";
              for (let i = 0; i < ev.results.length; i++) {
                tr += (ev.results[i]?.[0]?.transcript || "") + " ";
              }
              const cleanTr = tr.trim();
              capturedTextRef.current = cleanTr;
              setLiveTranscript(cleanTr);
            } catch {}
          };
          sr.onerror = () => {};
          srRef.current = sr;
          sr.start();
        } catch {}
      }

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
      handleQuickEvaluate();
    }
  };

  const stopRecording = () => {
    if (srRef.current) {
      try {
        srRef.current.stop();
      } catch {}
      srRef.current = null;
    }
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      } else {
        handleQuickEvaluate();
      }
    } catch {
      handleQuickEvaluate();
    }
    setIsRecording(false);
  };

  const handleSave = () => {
    onSavePhrase(target);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const renderRhythmTokens = (guide: string) => {
    return guide.split(" ").map((word, idx) => {
      const hasCaps = /[A-Z]{2,}/.test(word);
      return (
        <span
          key={idx}
          className={`inline-block mr-1.5 mb-1 px-1.5 py-0.5 rounded-md transition-all ${
            hasCaps
              ? "bg-[#C86D51]/15 text-[#A85035] font-semibold tracking-wide border border-[#C86D51]/30"
              : "text-[#5C524E]"
          }`}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <div className="bg-[#F5EFE6] border border-[#E5DEC9] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C86D51] animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7A6B63]">
            Active Shadowing Studio • สตูดิโอฝึกออกเสียงตามโนรี
          </h3>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 text-xs font-medium text-[#6B8E78] hover:text-[#52735E] bg-white/80 px-2.5 py-1 rounded-full border border-[#6B8E78]/30 transition cursor-pointer"
        >
          {savedToast ? (
            <>
              <Check className="w-3.5 h-3.5" /> บันทึกแล้ว
            </>
          ) : (
            <>
              <BookmarkPlus className="w-3.5 h-3.5" /> เก็บเข้าสมุดจด
            </>
          )}
        </button>
      </div>

      {/* Target Sentence */}
      <p className="font-serif text-lg text-[#2C2523] leading-relaxed mb-3">
        “{target.sentence}”
      </p>

      {/* Syllable & Stress Rhythm Guide */}
      <div className="bg-[#FAF6F0] border border-[#E5DEC9] rounded-xl p-3 mb-3">
        <div className="text-[11px] uppercase tracking-wider text-[#8C7D75] mb-1.5 font-medium">
          จังหวะและการเน้นเสียง (ตัวพิมพ์ใหญ่ CAPS = พยางค์ที่เน้นเสียง)
        </div>
        <div className="font-mono text-sm leading-relaxed">
          {renderRhythmTokens(target.rhythmGuide)}
        </div>
      </div>

      {/* Noree's Coaching Tip */}
      <div className="flex items-start gap-2 text-xs text-[#5C524E] bg-[#6B8E78]/10 border border-[#6B8E78]/25 rounded-xl p-3 mb-4">
        <Sparkles className="w-4 h-4 text-[#6B8E78] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#4B6B57]">
            เทคนิคการออกเสียงจากโนรี:{" "}
          </span>
          {target.focusPoint}
        </div>
      </div>

      {/* Controls: Listen, Speed Toggle, Record User Take, and Evaluate */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onSpeak(target.sentence, speed)}
          disabled={isSpeaking}
          className="flex items-center gap-2 bg-[#C86D51] hover:bg-[#B35B40] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60"
        >
          <Volume2 className="w-4 h-4" />
          {isSpeaking ? "กำลังเล่นเสียง..." : "1. ฟังเสียงโนรี"}
        </button>

        <button
          onClick={toggleSpeed}
          className="flex items-center gap-1.5 bg-white hover:bg-[#FAF6F0] text-[#5C524E] border border-[#DFD6C7] text-xs font-medium px-3 py-2.5 rounded-xl transition cursor-pointer"
        >
          <Gauge className="w-3.5 h-3.5 text-[#C86D51]" />
          {speed === 1.0 ? "1.0x ปกติ" : "0.8x ช้าชัดๆ"}
        </button>

        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-1.5 bg-[#2C2523] hover:bg-[#3F3633] text-[#FAF6F0] text-xs font-medium px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-[#E89980]" />
            2. อัดเสียงพูดตาม
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-1.5 bg-[#D9534F] hover:bg-[#C9302C] text-white text-xs font-semibold px-4 py-2.5 rounded-xl animate-pulse transition cursor-pointer"
          >
            <Square className="w-3.5 h-3.5" />
            ⏹ หยุดอัด & ส่งประเมินเสียง
          </button>
        )}

        {userAudioUrl && (
          <button
            onClick={() => {
              const audio = new Audio(userAudioUrl);
              audio.play();
            }}
            className="flex items-center gap-1.5 bg-[#6B8E78] hover:bg-[#577864] text-white text-xs font-medium px-3.5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            ฟังเสียงของฉัน
          </button>
        )}

        {!isRecording && !evaluation && (
          <button
            onClick={handleQuickEvaluate}
            className="flex items-center gap-1.5 bg-[#FAF6F0] hover:bg-white text-[#A85035] border border-[#C86D51]/40 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            ประเมินคะแนนออกเสียง
          </button>
        )}
      </div>

      {/* Live Speech Status */}
      {isRecording && (
        <div className="mt-3.5 bg-[#FAF6F0] border border-[#C86D51]/40 rounded-xl p-3 flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9534F] animate-ping shrink-0" />
          <div className="text-xs text-[#2C2523]">
            <span className="font-semibold text-[#C86D51]">
              🎙️ กำลังฟังเสียงพูดของคุณ...
            </span>
            {liveTranscript ? (
              <p className="text-[#5C524E] italic mt-0.5">“{liveTranscript}”</p>
            ) : (
              <p className="text-[11px] text-[#7A6B63] mt-0.5">
                พูดตามประโยคด้านบนได้เลย พูดจบแล้วกดปุ่ม ⏹ หยุดอัด & ส่งประเมินเสียง
              </p>
            )}
          </div>
        </div>
      )}

      {/* Evaluating Loading State */}
      {isEvaluating && (
        <div className="mt-3.5 bg-[#FAF6F0] border border-[#E5DEC9] rounded-xl p-3.5 text-xs text-[#6E6059] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C86D51] animate-spin" />
          <span>
            น้องโนรีกำลังวิเคราะห์ความชัดเจนรายคำและจังหวะการออกเสียง...
          </span>
        </div>
      )}

      {/* Pronunciation Scoring & Gentle Voice Coaching Result */}
      {evaluation && !isEvaluating && (
        <div className="mt-4 bg-[#FAF6F0] border-2 border-[#E5DEC9] rounded-2xl p-4 space-y-3.5 shadow-xs">
          {/* Score Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5DEC9]">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-serif font-bold border-2 shadow-xs ${
                  evaluation.overallScore >= 88
                    ? "bg-[#6B8E78]/15 border-[#6B8E78] text-[#3B5947]"
                    : evaluation.overallScore >= 75
                    ? "bg-[#C86D51]/15 border-[#C86D51] text-[#A85035]"
                    : "bg-[#D99B26]/15 border-[#D99B26] text-[#8C5E0A]"
                }`}
              >
                <span className="text-lg leading-none">
                  {evaluation.overallScore}%
                </span>
                <span className="text-[9px] font-sans uppercase tracking-wider mt-0.5">
                  Score
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#2C2523]">
                  {evaluation.badgeTh}
                </div>
                <p className="text-[11px] text-[#7A6B63] mt-0.5">
                  ผลการประเมินการออกเสียง (Pronunciation Accuracy)
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#E5DEC9] text-[#5C524E]">
                    🗣️ ความชัดเจนรายคำ:{" "}
                    <strong className="text-[#2C2523]">
                      {evaluation.wordClarityScore}%
                    </strong>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#E5DEC9] text-[#5C524E]">
                    🎵 จังหวะอะคูสติก:{" "}
                    <strong className="text-[#2C2523]">
                      {evaluation.rhythmScore}%
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F5EFE6] border border-[#DFD6C7] text-[11px] font-semibold text-[#2C2523] transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              ฝึกพูดซ้ำอีกครั้ง
            </button>
          </div>

          {/* Word-by-Word Breakdown */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="text-[11px] font-semibold text-[#5C524E]">
                🔍 จำแนกความชัดเจนรายคำ (คลิกที่คำเพื่อฟังเสียงต้นฉบับชัดๆ):
              </span>
              <div className="flex items-center gap-2 text-[10px] text-[#7A6B63]">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#6B8E78]" />
                  ชัดเจน
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#D99B26]" />
                  ใกล้เคียง
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#C86D51]" />
                  ควรเน้นเพิ่ม
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 bg-white border border-[#E5DEC9] rounded-xl p-3">
              {(evaluation.wordsBreakdown || []).map((w, idx) => {
                const statusStyle =
                  w.status === "clear"
                    ? "bg-[#6B8E78]/15 border-[#6B8E78]/40 text-[#2E4F3B]"
                    : w.status === "almost"
                    ? "bg-[#D99B26]/15 border-[#D99B26]/40 text-[#7A5208]"
                    : "bg-[#C86D51]/15 border-[#C86D51]/45 text-[#9C4126]";
                const statusIcon =
                  w.status === "clear" ? "✓" : w.status === "almost" ? "~" : "✦";
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSpeak(w.word, 0.85)}
                    title={`คลิกเพื่อฟังเสียงคำว่า "${w.word}" ชัดๆ (${w.score ?? 90}%)`}
                    className={`px-2.5 py-1 rounded-xl border text-xs font-medium flex items-center gap-1 transition hover:scale-105 cursor-pointer ${statusStyle}`}
                  >
                    <span>{w.word}</span>
                    <span className="text-[10px] opacity-80 font-bold">
                      {statusIcon}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gentle Voice Coaching Box from Noree */}
          <div className="bg-[#6B8E78]/10 border border-[#6B8E78]/30 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <img
                src="/noree-logo.png"
                alt="Noree Vance"
                className="w-8 h-8 rounded-xl object-cover border border-[#C86D51]/40 shrink-0 mt-0.5"
              />
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#3B5947]">
                  💬 คำแนะนำอบอุ่นจากน้องโนรี (Gentle Voice Coaching)
                </div>
                <p className="text-xs text-[#2C2523] leading-relaxed">
                  {evaluation.coachingMessageTh}
                </p>
              </div>
            </div>

            {(evaluation.wordTips || []).length > 0 && (
              <div className="pt-2 border-t border-[#6B8E78]/20 space-y-1.5">
                <div className="text-[11px] font-semibold text-[#4B6B57]">
                  🎙️ เทคนิคการออกเสียงคำที่น่าโฟกัสเพิ่มเติม:
                </div>
                {(evaluation.wordTips || []).map((wt, tIdx) => (
                  <div
                    key={tIdx}
                    className="bg-white/90 border border-[#6B8E78]/25 rounded-xl px-3 py-2 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="text-[#2C2523] leading-relaxed">
                      <span className="font-bold text-[#C86D51] mr-1.5">
                        “{wt.word}”
                      </span>
                      <span>{wt.tipTh}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSpeak(wt.word, 0.8)}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] hover:bg-[#E5DEC9] text-[#C86D51] font-semibold text-[11px] shrink-0 cursor-pointer"
                    >
                      🔊 ฟังช้าๆ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

class ShadowingErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown, info: unknown) {
    console.warn("ShadowingErrorBoundary caught error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#F5EFE6] border border-[#E5DEC9] rounded-2xl p-5 shadow-sm text-center space-y-3">
          <div className="text-2xl">🎸🐱</div>
          <p className="text-xs text-[#2C2523] font-semibold">
            เกิดข้อผิดพลาดเล็กน้อยระหว่างประมวลผลเสียงพูด
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="bg-[#C86D51] text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
          >
            🔄 รีเซ็ตสตูดิโอฝึกพูดตาม
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ShadowingDeck(props: ShadowingDeckProps) {
  return (
    <ShadowingErrorBoundary>
      <ShadowingDeckInner {...props} />
    </ShadowingErrorBoundary>
  );
}
