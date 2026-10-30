import { NextRequest, NextResponse } from "next/server";

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

export interface ParsedStoryResult {
  id: string;
  title: string;
  rawText: string;
  summaryTh: string;
  segments: StorySegment[];
}

const LOCAL_VOCAB_DICT: Array<{
  pattern: RegExp;
  word: string;
  pos: string;
  meaningTh: string;
}> = [
  { pattern: /\bplay(?:ed|ing)? it by ear\b/i, word: "play it by ear", pos: "idiom", meaningTh: "ค่อยว่ากันตามสถานการณ์ / เล่นดนตรีโดยใช้หูฟัง" },
  { pattern: /\b(?:strike|struck|strikes|striking) a chord\b/i, word: "strike a chord", pos: "idiom", meaningTh: "โดนใจอย่างจัง / สะกิดความรู้สึกในใจ" },
  { pattern: /\b(?:lose|lost|losing) track of time\b/i, word: "lose track of time", pos: "idiom", meaningTh: "เพลินจนลืมเวลา" },
  { pattern: /\bstop(?:ped|ping|s)? by\b/i, word: "stop by", pos: "phr. v.", meaningTh: "แวะไปหา / แวะผ่านไปช่วงสั้นๆ" },
  { pattern: /\blow-key\b/i, word: "low-key", pos: "adj.", meaningTh: "ชิลๆ เรียบง่าย ไม่วุ่นวาย" },
  { pattern: /\bunwind(?:ing|s)?\b/i, word: "unwind", pos: "v.", meaningTh: "ผ่อนคลายความเหนื่อยล้า" },
  { pattern: /\bcozy\b/i, word: "cozy", pos: "adj.", meaningTh: "อบอุ่น น่านั่ง สบายใจ" },
  { pattern: /\bbrew(?:ed|ing|s)?\b/i, word: "brew", pos: "v.", meaningTh: "ชง (ชาหรือกาแฟ)" },
  { pattern: /\bstrum(?:med|ming|s)?\b/i, word: "strum", pos: "v.", meaningTh: "ดีดกีตาร์เป็นจังหวะคอร์ด" },
  { pattern: /\bmelody\b/i, word: "melody", pos: "n.", meaningTh: "ท่วงทำนองเพลง" },
  { pattern: /\bsavor(?:ed|ing|s)?\b/i, word: "savor", pos: "v.", meaningTh: "ค่อยๆ ลิ้มรสและดื่มด่ำกับช่วงเวลาดีๆ" },
  { pattern: /\bbreeze\b/i, word: "breeze", pos: "n.", meaningTh: "สายลมอ่อนๆ เย็นสบาย" },
  { pattern: /\bwander(?:ed|ing|s)?\b/i, word: "wander", pos: "v.", meaningTh: "เดินเล่นทอดน่องไปเรื่อยๆ" },
  { pattern: /\bwhisper(?:ed|ing|s)?\b/i, word: "whisper", pos: "v.", meaningTh: "กระซิบแผ่วเบา" },
  { pattern: /\bgrateful\b/i, word: "grateful", pos: "adj.", meaningTh: "ซาบซึ้งใจ / รู้สึกขอบคุณ" },
  { pattern: /\brealize(?:d|s|ing)?\b/i, word: "realize", pos: "v.", meaningTh: "ตระหนักรู้ / เข้าใจ" },
  { pattern: /\bpeaceful(?:ly)?\b/i, word: "peaceful", pos: "adj.", meaningTh: "เงียบสงบและร่มรื่นใจ" },
];

function buildRhythmGuide(sentence: string): string {
  const stopWords = new Set([
    "a", "an", "the", "to", "of", "in", "on", "at", "by", "for", "with", "from", "into", "onto",
    "and", "or", "but", "yet", "so", "as", "if", "when", "while", "that", "than", "is", "am",
    "are", "was", "were", "be", "been", "has", "have", "had", "would", "could", "should", "can",
    "he", "she", "it", "they", "we", "you", "i", "his", "her", "their", "our", "your", "my",
  ]);
  return sentence
    .split(/\s+/)
    .map((token, idx, arr) => {
      const clean = token.replace(/[^a-zA-Z'-]/g, "").toLowerCase();
      if (!clean) return token;
      if (!stopWords.has(clean) && (clean.length >= 4 || idx === 0 || idx === arr.length - 1)) {
        return token.toUpperCase();
      }
      return token;
    })
    .join(" ");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text = "", title = "", apiKey: clientApiKey } = body;
    const rawText = String(text).trim();
    if (!rawText) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `คุณคือ Noree Vance เพื่อนฝึกภาษาอังกฤษสไตล์อินดี้โฟล์คที่อบอุ่นและใจดี (Gentle Framework)
กรุณาช่วยย่อยนิทานหรือบทความภาษาอังกฤษต่อไปนี้ออกเป็นประโยคสั้นๆ ทีละท่อน (Segments) เพื่อให้ผู้เรียนคนไทยฝึกอ่าน ฝึกออกเสียง (Shadowing) และเรียนรู้คำศัพท์:

ชื่อเรื่อง (ถ้ามี): "${title || "Auto-detect"}"
เนื้อหาภาษาอังกฤษ:
"""
${rawText}
"""

คำสั่งสำคัญ:
1. ตัดแบ่งเนื้อหาออกเป็นประโยคสั้นๆ ทีละประโยค (segments) ตามลำดับเนื้อเรื่องจริง
2. ในแต่ละประโยค ให้ระบุ:
   - sentence: ประโยคภาษาอังกฤษต้นฉบับ
   - thaiTranslation: คำแปลภาษาไทยที่สละสลวยและเข้าใจง่าย
   - rhythmGuide: ประโยคภาษาอังกฤษที่เขียนคำหรือพยางค์ที่ต้องเน้นเสียงหนักด้วยตัวพิมพ์ใหญ่ (ALL-CAPS) เพื่อใช้ฝึก Shadowing
   - vocab: สกัดคำศัพท์หรือสำนวนที่น่าสนใจในประโยคนั้น 2-4 คำ พร้อมระบุ pos (เช่น n., v., adj., adv., idiom, phr. v.) และ meaningTh (ความหมายภาษาไทยที่เข้าใจง่าย)
   - gentleTip: คำแนะนำจากน้องโนรีเป็น "ภาษาไทย" อธิบายโครงสร้างประโยค สำนวน หรือเทคนิคการออกเสียง/การเชื่อมคำของประโยคนั้นอย่างอบอุ่นและเข้าใจง่าย
3. สรุปภาพรวมของนิทาน/บทความใน summaryTh เป็นภาษาไทยสั้นๆ 2-3 ประโยค`;

        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.4,
                responseMimeType: "application/json",
                responseSchema: {
                  type: "OBJECT",
                  properties: {
                    title: { type: "STRING" },
                    summaryTh: { type: "STRING" },
                    segments: {
                      type: "ARRAY",
                      items: {
                        type: "OBJECT",
                        properties: {
                          sentence: { type: "STRING" },
                          thaiTranslation: { type: "STRING" },
                          rhythmGuide: { type: "STRING" },
                          vocab: {
                            type: "ARRAY",
                            items: {
                              type: "OBJECT",
                              properties: {
                                word: { type: "STRING" },
                                pos: { type: "STRING" },
                                meaningTh: { type: "STRING" },
                              },
                              required: ["word", "pos", "meaningTh"],
                            },
                          },
                          gentleTip: { type: "STRING" },
                        },
                        required: ["sentence", "thaiTranslation", "rhythmGuide", "vocab", "gentleTip"],
                      },
                    },
                  },
                  required: ["title", "summaryTh", "segments"],
                },
              },
            }),
          }
        );

        if (resp.ok) {
          const data = await resp.json();
          const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawJson) {
            const parsed = JSON.parse(rawJson);
            return NextResponse.json({
              story: {
                id: `story-${Date.now()}`,
                title: title || parsed.title || "Story & Article Studio Note",
                rawText,
                summaryTh: parsed.summaryTh,
                segments: (parsed.segments || []).map((seg: StorySegment, idx: number) => ({
                  ...seg,
                  id: `seg-${Date.now()}-${idx}`,
                })),
              },
            });
          }
        }
      } catch (e) {
        console.warn("Gemini story parser fallback:", e);
      }
    }

    // Fallback offline parser
    const sentences = rawText
      .replace(/\r\n/g, "\n")
      .split(/(?<=[.!?])\s+(?=[A-Z"“‘'])/g)
      .flatMap((chunk) => chunk.split(/\n+/))
      .map((s) => s.trim())
      .filter((s) => s.length > 1);

    const segments: StorySegment[] = (sentences.length > 0 ? sentences : [rawText]).map((sentence, idx) => {
      const vocab: StoryVocabItem[] = [];
      for (const entry of LOCAL_VOCAB_DICT) {
        if (entry.pattern.test(sentence)) {
          vocab.push({ word: entry.word, pos: entry.pos, meaningTh: entry.meaningTh });
        }
      }
      return {
        id: `fallback-seg-${Date.now()}-${idx}`,
        sentence,
        thaiTranslation: "ประโยคฝึกอ่านจากเนื้อเรื่อง (คุณสามารถใส่ Gemini API Key เพื่อให้ระบบแปลภาษาไทยแบบละเอียดในทุกประโยคได้ค่ะ)",
        rhythmGuide: buildRhythmGuide(sentence),
        vocab,
        gentleTip:
          "เวลาฝึกออกเสียงตาม (Shadowing) ประโยคนี้ ให้เน้นน้ำหนักเสียงที่คำตัวพิมพ์ใหญ่ (CAPS) และพูดเชื่อมคำเล็กๆ ด้วยจังหวะที่นุ่มนวลเหมือนฮัมเพลงอะคูสติกค่ะ",
      };
    });

    return NextResponse.json({
      story: {
        id: `local-story-${Date.now()}`,
        title: title || `Story & Article Lesson (${segments.length} ท่อน)`,
        rawText,
        summaryTh: `น้องโนรีช่วยตัดแบ่งเนื้อหาออกเป็น ${segments.length} ประโยคสั้นๆ พร้อมเตรียมจังหวะการออกเสียงและสรุปคำศัพท์ให้เรียบร้อยแล้วค่ะ`,
        segments,
      },
    });
  } catch (err) {
    console.error("Story import error:", err);
    return NextResponse.json({ error: "Failed to parse story" }, { status: 500 });
  }
}
