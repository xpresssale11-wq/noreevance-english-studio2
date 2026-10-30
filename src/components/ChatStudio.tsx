"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ConversationTopic,
  GentleCorrection,
  ShadowingTarget,
} from "@/lib/persona";
import {
  evaluateShadowPronunciation,
  PronunciationEvaluationResult,
} from "@/components/ShadowingDeck";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  Sparkles,
  HeartHandshake,
  Headphones,
  BookmarkPlus,
  Music,
  Coffee,
  MapPin,
  Play,
} from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "noree" | "user";
  text: string;
  mood?: string;
  correction?: GentleCorrection;
  shadowingTarget?: ShadowingTarget;
  audioUrl?: string;
  voiceEvaluation?: PronunciationEvaluationResult;
  timestamp: string;
}

interface ChatStudioProps {
  topics: ConversationTopic[];
  activeTopic: ConversationTopic;
  onSelectTopic: (topic: ConversationTopic) => void;
  messages: ChatMessage[];
  onSendMessage: (
    text: string,
    audioUrl?: string | null,
    voiceEvaluation?: PronunciationEvaluationResult | null
  ) => Promise<void>;
  isSending: boolean;
  inputDraft: string;
  setInputDraft: (val: string) => void;
  suggestions: string[];
  onSpeak: (text: string, rate?: number) => void;
  onSelectShadowTarget: (target: ShadowingTarget) => void;
  onSaveCorrection: (correction: GentleCorrection) => void;
}

export default function ChatStudio({
  topics,
  activeTopic,
  onSelectTopic,
  messages,
  onSendMessage,
  isSending,
  inputDraft,
  setInputDraft,
  suggestions,
  onSpeak,
  onSelectShadowTarget,
  onSaveCorrection,
}: ChatStudioProps) {
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [isEvaluatingMic, setIsEvaluatingMic] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [pendingAudioUrl, setPendingAudioUrl] = useState<string | null>(null);
  const [pendingEvaluation, setPendingEvaluation] =
    useState<PronunciationEvaluationResult | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recStartTimeRef = useRef<number>(0);
  const capturedTextRef = useRef<string>("");
  const autoSendOnStopRef = useRef<boolean>(false);
  const isListeningMicRef = useRef<boolean>(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const finalizeMicEvaluation = (
    recordedUrl: string | null,
    durationMs: number,
    autoSend = false
  ) => {
    setIsEvaluatingMic(true);
    setTimeout(async () => {
      try {
        const spokenOrTyped = (capturedTextRef.current || inputDraft || "").trim();
        const fallbackText =
          spokenOrTyped ||
          suggestions?.[0] ||
          activeTopic.openingShadow.sentence ||
          "I really enjoy listening to cozy acoustic music.";
        if (!spokenOrTyped) {
          setInputDraft(fallbackText);
        }
        const evalResult = evaluateShadowPronunciation(
          fallbackText,
          spokenOrTyped,
          durationMs || 3200
        );
        setPendingEvaluation(evalResult);
        if (recordedUrl) {
          setPendingAudioUrl(recordedUrl);
        }
        if (autoSend) {
          setInputDraft("");
          setLiveTranscript("");
          setPendingAudioUrl(null);
          setPendingEvaluation(null);
          await onSendMessage(fallbackText, recordedUrl, evalResult);
        }
      } catch (err) {
        console.warn("Chat mic evaluation fallback:", err);
      } finally {
        setIsEvaluatingMic(false);
      }
    }, 280);
  };

  const startVoiceRecording = async () => {
    try {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setPendingAudioUrl(null);
      setPendingEvaluation(null);
      setLiveTranscript("");
      capturedTextRef.current = inputDraft ? inputDraft.trim() : "";
      recStartTimeRef.current = Date.now();
      autoSendOnStopRef.current = false;
      isListeningMicRef.current = true;
      setIsListeningMic(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        try {
          const recognition = new SR();
          recognition.lang = "en-US";
          recognition.interimResults = true;
          recognition.continuous = true;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          recognition.onresult = (event: any) => {
            try {
              let transcript = "";
              for (let i = 0; i < event.results.length; i++) {
                transcript += (event.results[i]?.[0]?.transcript || "") + " ";
              }
              const cleanTr = transcript.trim();
              if (cleanTr) {
                capturedTextRef.current = cleanTr;
                setLiveTranscript(cleanTr);
                setInputDraft(cleanTr);
              }
            } catch {
              // ignore
            }
          };

          recognition.onerror = () => {};
          recognition.onend = () => {
            if (!mediaRecorderRef.current && isListeningMicRef.current) {
              isListeningMicRef.current = false;
              setIsListeningMic(false);
              const dur = Date.now() - (recStartTimeRef.current || Date.now());
              finalizeMicEvaluation(null, dur, autoSendOnStopRef.current);
            }
          };

          recognitionRef.current = recognition;
          recognition.start();
        } catch {
          // ignore SR start errors
        }
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          audioChunksRef.current = [];
          recorder.ondataavailable = (ev) => {
            if (ev.data && ev.data.size > 0) audioChunksRef.current.push(ev.data);
          };
          recorder.onstop = () => {
            let recordedUrl: string | null = null;
            try {
              if (audioChunksRef.current.length > 0) {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                recordedUrl = URL.createObjectURL(blob);
              }
            } catch {
              // ignore
            }
            try {
              stream.getTracks().forEach((tr) => tr.stop());
            } catch {
              // ignore
            }
            mediaRecorderRef.current = null;
            const durationMs = Date.now() - (recStartTimeRef.current || Date.now());
            finalizeMicEvaluation(recordedUrl, durationMs, autoSendOnStopRef.current);
          };
          mediaRecorderRef.current = recorder;
          recorder.start();
        } catch {
          if (!SR) {
            isListeningMicRef.current = false;
            setIsListeningMic(false);
            finalizeMicEvaluation(null, 3200, false);
          }
        }
      } else if (!SR) {
        isListeningMicRef.current = false;
        setIsListeningMic(false);
        finalizeMicEvaluation(null, 3200, false);
      }
    } catch {
      isListeningMicRef.current = false;
      setIsListeningMic(false);
      finalizeMicEvaluation(null, 3200, false);
    }
  };

  const stopVoiceRecording = (autoSend = false) => {
    autoSendOnStopRef.current = Boolean(autoSend);
    isListeningMicRef.current = false;
    setIsListeningMic(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      } else {
        const dur = Date.now() - (recStartTimeRef.current || Date.now());
        finalizeMicEvaluation(null, dur, autoSend);
      }
    } catch {
      finalizeMicEvaluation(null, 3200, autoSend);
    }
  };

  const toggleVoiceInput = () => {
    if (isListeningMic) {
      stopVoiceRecording(false);
    } else {
      startVoiceRecording();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isListeningMic) {
      stopVoiceRecording(true);
      return;
    }
    if (!inputDraft.trim() || isSending) return;
    const text = inputDraft.trim();
    const audioToAttach = pendingAudioUrl;
    const evalToAttach = pendingEvaluation;
    setInputDraft("");
    setLiveTranscript("");
    setPendingAudioUrl(null);
    setPendingEvaluation(null);
    await onSendMessage(text, audioToAttach, evalToAttach);
  };

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case "Guitar":
        return <Music className="w-3.5 h-3.5" />;
      case "Coffee":
        return <Coffee className="w-3.5 h-3.5" />;
      case "MapPin":
        return <MapPin className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex flex-col bg-white border border-[#E5DEC9] rounded-3xl shadow-xs overflow-hidden h-[660px]">
      {/* Topic Bar */}
      <div className="bg-[#F5EFE6] border-b border-[#E5DEC9] px-4 py-3 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A6B63] shrink-0 mr-1">
          Cozy Topics:
        </span>
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition cursor-pointer ${
              activeTopic.id === topic.id
                ? "bg-[#C86D51] text-white shadow-xs"
                : "bg-white/80 text-[#5C524E] hover:bg-white border border-[#E5DEC9]"
            }`}
          >
            {getTopicIcon(topic.icon)}
            {topic.title}
          </button>
        ))}
      </div>

      {/* Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-[#FAF6F0]/60 to-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            {/* Sender Label */}
            <div className="flex items-center gap-2 mb-1 px-1">
              {msg.role === "noree" ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#C86D51]" />
                  <span className="text-xs font-serif font-semibold text-[#2C2523]">
                    Noree Vance
                  </span>
                  {msg.mood && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5EFE6] text-[#7A6B63] border border-[#E5DEC9]">
                      {msg.mood}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs font-medium text-[#7A6B63]">You</span>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed ${
                msg.role === "noree"
                  ? "bg-[#FAF6F0] border border-[#E5DEC9] text-[#2C2523] rounded-tl-xs"
                  : "bg-[#2C2523] text-[#FAF6F0] rounded-tr-xs"
              }`}
            >
              <p>{msg.text}</p>

              {msg.role === "user" && (msg.audioUrl || msg.voiceEvaluation) && (
                <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2 border-t border-white/15 text-xs">
                  {msg.audioUrl && (
                    <button
                      type="button"
                      onClick={() => new Audio(msg.audioUrl).play()}
                      className="px-2.5 py-1 rounded-xl bg-[#6B8E78] hover:bg-[#587864] text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3" /> ฟังเสียงของฉัน (Play Voice)
                    </button>
                  )}
                  {msg.voiceEvaluation && (
                    <span className="px-2.5 py-1 rounded-xl bg-white/15 text-[#FAF6F0] font-semibold text-[11px]">
                      🎯 คะแนนออกเสียง {msg.voiceEvaluation.overallScore}%
                    </span>
                  )}
                </div>
              )}

              {msg.role === "noree" && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-[#E5DEC9]/80">
                  <button
                    onClick={() => onSpeak(msg.text, 1.0)}
                    className="flex items-center gap-1 text-xs font-medium text-[#C86D51] hover:text-[#A65238] transition cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen
                  </button>
                  <button
                    onClick={() => onSpeak(msg.text, 0.82)}
                    className="flex items-center gap-1 text-xs text-[#7A6B63] hover:text-[#2C2523] transition cursor-pointer"
                  >
                    • 0.8x Slow
                  </button>
                  {msg.shadowingTarget && (
                    <button
                      onClick={() => onSelectShadowTarget(msg.shadowingTarget!)}
                      className="flex items-center gap-1 text-xs font-medium text-[#6B8E78] hover:text-[#4E6E5A] ml-auto transition cursor-pointer"
                    >
                      <Headphones className="w-3.5 h-3.5" /> Load into Shadowing Deck
                    </button>
                  )}
                </div>
              )}
            </div>

            {msg.role === "user" && msg.voiceEvaluation && (
              <div className="max-w-[85%] mt-2 bg-[#FAF6F0] border border-[#E5DEC9] rounded-2xl p-3.5 text-xs space-y-2 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#6B8E78]/15 border border-[#6B8E78]/40 text-[#3B5947] font-bold">
                      🎙️ {msg.voiceEvaluation.overallScore}%
                    </span>
                    <span className="font-bold text-[#2C2523]">
                      {msg.voiceEvaluation.badgeTh}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#7A6B63]">
                    <span>
                      🗣️ ความชัด: <strong>{msg.voiceEvaluation.wordClarityScore}%</strong>
                    </span>
                    <span>•</span>
                    <span>
                      🎵 จังหวะ: <strong>{msg.voiceEvaluation.rhythmScore}%</strong>
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 bg-white border border-[#E5DEC9] rounded-xl p-2.5">
                  {msg.voiceEvaluation.wordsBreakdown.map((w, wIdx) => {
                    const stClass =
                      w.status === "clear"
                        ? "bg-[#6B8E78]/15 border-[#6B8E78]/40 text-[#2E4F3B]"
                        : w.status === "almost"
                        ? "bg-[#D99B26]/15 border-[#D99B26]/40 text-[#7A5208]"
                        : "bg-[#C86D51]/15 border-[#C86D51]/45 text-[#9C4126]";
                    const stIcon =
                      w.status === "clear" ? "✓" : w.status === "almost" ? "~" : "✦";
                    return (
                      <button
                        key={wIdx}
                        type="button"
                        onClick={() => onSpeak(w.word, 0.85)}
                        className={`px-2 py-0.5 rounded-lg border text-[11px] font-medium flex items-center gap-1 cursor-pointer ${stClass}`}
                      >
                        <span>{w.word}</span>
                        <span className="text-[9px] font-bold">{stIcon}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-[#4B5950] leading-relaxed">
                  💬 <strong className="text-[#3B5947]">คำแนะนำการออกเสียงจากโนรี:</strong>{" "}
                  {msg.voiceEvaluation.coachingMessageTh}
                </p>
              </div>
            )}

            {/* Gentle Correction Card (Rendered beneath the user's message or Noree's response) */}
            {msg.correction && (
              <div className="max-w-[85%] mt-2.5 bg-[#6B8E78]/10 border border-[#6B8E78]/30 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-semibold text-[#4B6B57]">
                    <HeartHandshake className="w-4 h-4 text-[#6B8E78]" />
                    {msg.correction.hasCorrection
                      ? "A Gentle Tune-Up from Noree"
                      : "Natural Flow & Vibe Check"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSpeak(msg.correction!.naturalPhrasing, 0.95)}
                      className="flex items-center gap-1 text-[11px] bg-white/90 hover:bg-white text-[#2C2523] px-2.5 py-1 rounded-full border border-[#6B8E78]/30 transition cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3 text-[#C86D51]" /> Hear Natural
                    </button>
                    <button
                      onClick={() => onSaveCorrection(msg.correction!)}
                      className="flex items-center gap-1 text-[11px] bg-white/90 hover:bg-white text-[#4B6B57] px-2.5 py-1 rounded-full border border-[#6B8E78]/30 transition cursor-pointer"
                    >
                      <BookmarkPlus className="w-3 h-3" /> Save
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-2 pt-1">
                  <div className="bg-white/80 rounded-xl p-2.5 border border-[#6B8E78]/20">
                    <div className="text-[10px] uppercase tracking-wider text-[#6B8E78] font-semibold mb-0.5">
                      Natural Warm Phrasing
                    </div>
                    <p className="text-xs font-medium text-[#2C2523]">
                      “{msg.correction.naturalPhrasing}”
                    </p>
                  </div>
                  <div className="bg-white/80 rounded-xl p-2.5 border border-[#6B8E78]/20">
                    <div className="text-[10px] uppercase tracking-wider text-[#C86D51] font-semibold mb-0.5">
                      Casual Indie Friend Vibe
                    </div>
                    <p className="text-xs font-medium text-[#2C2523]">
                      “{msg.correction.alternativeCasual}”
                    </p>
                  </div>
                </div>

                <p className="text-[#4B5950] leading-relaxed pt-0.5">
                  <span className="font-semibold">Why it works: </span>
                  {msg.correction.gentleTip}
                </p>
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-[#7A6B63] italic px-2">
            <span className="w-2 h-2 rounded-full bg-[#C86D51] animate-ping" />
            Noree is strumming a chord and thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Clickable Prompt Starters (Lowers speaking anxiety when stuck) */}
      {suggestions.length > 0 && (
        <div className="bg-[#FAF6F0] border-t border-[#E5DEC9] px-4 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7D75] mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C86D51]" /> Need a spark? Click a phrase to try or edit:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInputDraft(sug)}
                className="text-left text-xs bg-white hover:bg-[#F5EFE6] text-[#4A403C] border border-[#DFD6C7] rounded-xl px-3 py-1.5 transition cursor-pointer"
              >
                “{sug}”
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Recording & Evaluation Banner */}
      {isListeningMic && (
        <div className="bg-[#FAF6F0] border-t-2 border-[#C86D51]/50 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#D9534F] animate-ping shrink-0" />
            <div className="text-xs text-[#2C2523]">
              <div className="font-bold text-[#C86D51]">
                🎙️ กำลังอัดเสียงพูดของคุณ... (พูดภาษาอังกฤษได้เลยค่ะ)
              </div>
              {liveTranscript ? (
                <p className="text-[#4A403C] italic mt-0.5">“{liveTranscript}”</p>
              ) : (
                <p className="text-[11px] text-[#7A6B63] mt-0.5">
                  พูดตามประโยคตัวอย่างหรือพูดคุยอิสระได้เลย เมื่อพูดจบกดปุ่ม หยุดอัด & ส่งประเมินเสียง
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => stopVoiceRecording(false)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F2ECE1] text-[#2C2523] border border-[#D5CBB8] text-xs font-semibold transition cursor-pointer"
            >
              ⏹ หยุดอัด & ตรวจทาน
            </button>
            <button
              type="button"
              onClick={() => stopVoiceRecording(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#D9534F] hover:bg-[#C9302C] text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              🚀 หยุดอัด & ส่งประเมินเสียงทันที
            </button>
          </div>
        </div>
      )}

      {isEvaluatingMic && (
        <div className="bg-[#FAF6F0] border-t border-[#E5DEC9] px-4 py-2.5 text-xs text-[#6E6059] flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-[#C86D51]" />
          <span>น้องโนรีกำลังวิเคราะห์เสียงพูดและประเมินคะแนนการออกเสียงของคุณ...</span>
        </div>
      )}

      {!isListeningMic && !isEvaluatingMic && (pendingEvaluation || pendingAudioUrl) && (
        <div className="bg-[#6B8E78]/12 border-t border-[#6B8E78]/35 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-[#6B8E78] text-white font-bold text-[11px]">
              🎯 ประเมินเสียงพร้อมส่ง: {pendingEvaluation?.overallScore ?? 88}%
            </span>
            {pendingAudioUrl && (
              <button
                type="button"
                onClick={() => new Audio(pendingAudioUrl).play()}
                className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FAF6F0] text-[#2C2523] border border-[#6B8E78]/40 font-semibold text-[11px] cursor-pointer"
              >
                ▶️ ฟังเสียงที่อัดไว้
              </button>
            )}
            <span className="text-[11px] text-[#4B5950]">
              ตรวจสอบข้อความด้านล่างแล้วกดปุ่ม Send ได้เลยค่ะ
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setPendingAudioUrl(null);
              setPendingEvaluation(null);
            }}
            className="text-[11px] text-[#8C7D75] hover:text-[#D9534F] cursor-pointer"
          >
            ✕ ล้างเสียง
          </button>
        </div>
      )}

      {/* Voice + Text Composer */}
      <form
        onSubmit={handleSubmit}
        className="p-3.5 bg-[#F5EFE6] border-t border-[#E5DEC9] flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleVoiceInput}
          className={`px-3.5 py-3 rounded-2xl transition shrink-0 cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
            isListeningMic
              ? "bg-[#D9534F] text-white animate-pulse"
              : "bg-white hover:bg-[#FAF6F0] text-[#C86D51] border border-[#DFD6C7]"
          }`}
          title="Speak to Noree using your microphone"
        >
          {isListeningMic ? (
            <>
              <MicOff className="w-4 h-4" />
              <span className="hidden sm:inline">หยุดอัด</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">พูดไมค์</span>
            </>
          )}
        </button>

        <input
          type="text"
          value={inputDraft}
          onChange={(e) => setInputDraft(e.target.value)}
          placeholder={
            isListeningMic
              ? "Listening to your voice... speak naturally!"
              : "Chat with Noree in English (or tap the mic to speak)..."
          }
          className="flex-1 bg-white border border-[#DFD6C7] rounded-2xl px-4 py-3 text-sm text-[#2C2523] placeholder:text-[#9A8B82] focus:outline-none focus:border-[#C86D51]"
        />

        <button
          type="submit"
          disabled={(!inputDraft.trim() && !isListeningMic) || isSending}
          className="bg-[#C86D51] hover:bg-[#B35B40] disabled:opacity-50 text-white px-5 py-3 rounded-2xl font-medium text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          {isListeningMic ? "ส่งเสียงพูด" : "Send"}
        </button>
      </form>
    </div>
  );
}
