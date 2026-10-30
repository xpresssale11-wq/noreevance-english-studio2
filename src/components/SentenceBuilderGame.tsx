"use client";

import React, { useState, useEffect } from "react";
import { AppLanguage } from "@/lib/i18n";
import { ShadowingTarget } from "@/lib/persona";

export interface SentenceBuilderItem {
  id: string;
  category: string;
  th: string;
  en: string;
  tipTh: string;
}

export interface BuilderToken {
  id: string;
  word: string;
  clean: string;
}

export const SENTENCE_BUILDER_CATEGORIES = [
  { id: "all", icon: "✨", labelTh: "ทั้งหมด (150 ประโยค)", labelEn: "All 150 Sentences" },
  { id: "greetings", icon: "👋", labelTh: "ทักทาย & ทำความรู้จัก (30)", labelEn: "Greetings & Introductions (30)" },
  { id: "daily", icon: "☕", labelTh: "ชีวิตประจำวัน & การทำงาน (30)", labelEn: "Daily Life & Work (30)" },
  { id: "travel", icon: "🚲", labelTh: "การเดินทาง & สถานที่ (30)", labelEn: "Travel & Directions (30)" },
  { id: "shopping", icon: "🥐", labelTh: "ซื้อของ & ร้านอาหาร (30)", labelEn: "Shopping & Dining (30)" },
  { id: "emotions", icon: "🐱", labelTh: "ความรู้สึก & นิทานเซียนน่า (30)", labelEn: "Emotions & Sienna's Stories (30)" },
];

export const SENTENCE_BUILDER_DECK_150: SentenceBuilderItem[] = [
  // 1. หมวดทักทายและทำความรู้จัก (Greetings & Introductions) - 30 ประโยค
  { id: "g-1", category: "greetings", th: "สวัสดีตอนเช้า วันนี้คุณเป็นอย่างไรบ้าง", en: "Good morning how are you doing today", tipTh: "How are you doing today? เป็นการถามไถ่สารทุกข์สุกดิบที่ฟังดูอบอุ่นและเป็นธรรมชาติมากค่ะ" },
  { id: "g-2", category: "greetings", th: "ยินดีที่ได้รู้จักคุณนะ", en: "It is very nice to meet you", tipTh: "It is very nice to meet you ใช้ทักทายเมื่อพบกันครั้งแรกได้อย่างสุภาพ" },
  { id: "g-3", category: "greetings", th: "ฉันชื่อโนรี และนี่คือแมวของฉันชื่อเซียนน่า", en: "My name is Noree and this is my cat Sienna", tipTh: "ใช้ this is... เวลาแนะนำคนหรือสัตว์เลี้ยงที่อยู่ข้างๆ เรา" },
  { id: "g-4", category: "greetings", th: "คุณมาจากที่ไหนหรือคะ", en: "Where are you originally from", tipTh: "การเติม originally ช่วยให้คำถามดูสุภาพและหมายถึงบ้านเกิดจริงๆ" },
  { id: "g-5", category: "greetings", th: "ฉันอาศัยอยู่ในเมืองเล็กๆ ที่เงียบสงบ", en: "I live in a quiet little town", tipTh: "เรียงคำคุณศัพท์บอกลักษณะ (quiet = เงียบสงบ, little = เล็กๆ) ไว้หน้าคำนาม town" },
  { id: "g-6", category: "greetings", th: "ช่วงนี้คุณสบายดีไหม", en: "How have you been lately", tipTh: "How have you been lately? ใช้ถามเพื่อนที่ไม่ได้เจอกันสักพักว่าช่วงนี้เป็นอย่างไรบ้าง" },
  { id: "g-7", category: "greetings", th: "ฉันดีใจมากที่ได้พบคุณอีกครั้ง", en: "I am so glad to see you again", tipTh: "glad to see you again แปลว่าดีใจที่ได้พบกันอีกครั้ง" },
  { id: "g-8", category: "greetings", th: "ขอให้วันนี้เป็นวันที่ดีสำหรับคุณนะ", en: "I hope you have a wonderful day", tipTh: "เป็นคำอวยพรที่อบอุ่นมากเวลาคุยกันเสร็จหรือก่อนแยกย้าย" },
  { id: "g-9", category: "greetings", th: "คุณชอบฟังเพลงแนวไหนหรือ", en: "What kind of music do you like", tipTh: "What kind of + คำนาม ใช้ถามถึงประเภทหรือแนวสิ่งที่ชอบ" },
  { id: "g-10", category: "greetings", th: "ฉันชอบฟังเพลงโฟล์คอะคูสติกเวลาฝนตก", en: "I love listening to acoustic folk music when it rains", tipTh: "love + กริยาเติม -ing (listening to) บอกสิ่งที่ชอบทำเป็นประจำ" },
  { id: "g-11", category: "greetings", th: "คุณทำงานอะไรหรือคะ", en: "What do you do for a living", tipTh: "What do you do for a living? เป็นสำนวนสุภาพที่ใช้ถามอาชีพ" },
  { id: "g-12", category: "greetings", th: "ฉันกำลังฝึกพูดภาษาอังกฤษทุกวัน", en: "I am practicing speaking English every single day", tipTh: "practice + กริยาเติม -ing (speaking) แปลว่าฝึกฝนทำสิ่งนั้น" },
  { id: "g-13", category: "greetings", th: "ช่วยพูดช้าลงอีกนิดได้ไหมคะ", en: "Could you please speak a little bit slower", tipTh: "Could you please... เป็นการขอร้องที่นุ่มนวลและสุภาพมาก" },
  { id: "g-14", category: "greetings", th: "ขอบคุณมากสำหรับความช่วยเหลือของคุณ", en: "Thank you so much for your kind help", tipTh: "Thank you so much for + คำนาม ใช้ขอบคุณสำหรับสิ่งดีๆ ที่ได้รับ" },
  { id: "g-15", category: "greetings", th: "ไม่เป็นไรเลย ยินดีช่วยเสมอค่ะ", en: "You are very welcome anytime", tipTh: "ใช้ตอบรับคำขอบคุณด้วยน้ำเสียงเป็นกันเอง" },
  { id: "g-16", category: "greetings", th: "วันหยุดสุดสัปดาห์ของคุณเป็นอย่างไรบ้าง", en: "How was your weekend", tipTh: "ใช้ How was... เพราะวันหยุดสุดสัปดาห์เพิ่งผ่านไปแล้ว (Past Tense)" },
  { id: "g-17", category: "greetings", th: "คุณมีสัตว์เลี้ยงที่บ้านไหม", en: "Do you have any pets at home", tipTh: "Do you have any...? ใช้ถามว่ามีสิ่งนั้นไหมในประโยคคำถาม" },
  { id: "g-18", category: "greetings", th: "ฉันมีแมวสีส้มตัวหนึ่งที่ชอบนอนอาบแดด", en: "I have an orange cat who loves sleeping in the sun", tipTh: "สามารถใช้ who แทนสัตว์เลี้ยงที่เรารักเหมือนสมาชิกในครอบครัวได้ค่ะ" },
  { id: "g-19", category: "greetings", th: "คุณพักอยู่แถวนี้มานานแค่ไหนแล้ว", en: "How long have you lived around here", tipTh: "How long have you + V.3 ใช้ถามเหตุการณ์ที่เริ่มในอดีตและยังดำเนินอยู่" },
  { id: "g-20", category: "greetings", th: "ฉันเพิ่งย้ายมาอยู่ที่นี่เมื่อเดือนที่แล้ว", en: "I just moved here last month", tipTh: "มีคำบอกเวลาอดีตชัดเจน (last month) จึงใช้กริยาช่อง 2 (moved)" },
  { id: "g-21", category: "greetings", th: "งานอดิเรกยามว่างของคุณคืออะไร", en: "What is your favorite hobby in your free time", tipTh: "in your free time แปลว่าในเวลาว่างของคุณ" },
  { id: "g-22", category: "greetings", th: "ฉันชอบอ่านหนังสือนิทานและเล่นกีตาร์โปร่ง", en: "I enjoy reading storybooks and playing acoustic guitar", tipTh: "หลัง enjoy ตามด้วยกริยาเติม -ing เสมอ (reading, playing)" },
  { id: "g-23", category: "greetings", th: "ขอโทษนะคะ ฉันขอถามอะไรหน่อยได้ไหม", en: "Excuse me may I ask you a quick question", tipTh: "a quick question ช่วยให้ผู้ฟังรู้สึกว่าคำถามไม่รบกวนเวลานาน" },
  { id: "g-24", category: "greetings", th: "ชื่อของคุณมีความหมายที่ไพเราะมาก", en: "Your name has a very lovely meaning", tipTh: "lovely meaning แปลว่าความหมายที่น่ารักหรือไพเราะ" },
  { id: "g-25", category: "greetings", th: "ไว้เราค่อยนัดดื่มกาแฟด้วยกันนะ", en: "Let us grab a cup of coffee together sometime", tipTh: "grab a cup of coffee เป็นสำนวนชวนไปดื่มกาแฟแบบสบายๆ" },
  { id: "g-26", category: "greetings", th: "ฉันต้องขอตัวกลับก่อนนะวันนี้", en: "I should probably get going now", tipTh: "get going เป็นสำนวนธรรมชาติเวลาจะขอตัวกลับ" },
  { id: "g-27", category: "greetings", th: "เดินทางกลับบ้านปลอดภัยนะคะ", en: "Have a safe trip back home", tipTh: "Have a safe trip ใช้บอกลาและอวยพรให้เดินทางปลอดภัย" },
  { id: "g-28", category: "greetings", th: "ฝากความคิดถึงไปบอกครอบครัวของคุณด้วยนะ", en: "Please say hello to your family for me", tipTh: "say hello to ... for me แปลว่าฝากทักทายหรือฝากความคิดถึงไปบอก" },
  { id: "g-29", category: "greetings", th: "ฉันดีใจที่ได้คุยกับคุณในวันนี้", en: "It was really lovely talking with you today", tipTh: "ใช้ปิดท้ายบทสนทนาเพื่อบอกว่าคุยสนุกและประทับใจมาก" },
  { id: "g-30", category: "greetings", th: "แล้วเจอกันใหม่พรุ่งนี้นะคะ", en: "See you again tomorrow morning", tipTh: "See you again + เวลา ใช้บอกลาอย่างเป็นกันเอง" },

  // 2. หมวดชีวิตประจำวันและการทำงาน (Daily Life & Work) - 30 ประโยค
  { id: "d-1", category: "daily", th: "ปกติฉันตื่นนอนเวลาเจ็ดโมงเช้าทุกวัน", en: "I usually wake up at seven every morning", tipTh: "usually (ปกติ) วางไว้หน้ากริยาหลัก wake up" },
  { id: "d-2", category: "daily", th: "ฉันชอบเริ่มต้นวันใหม่ด้วยชาอุ่นๆ สักแก้ว", en: "I like starting my day with a warm cup of tea", tipTh: "start my day with... แปลว่าเริ่มต้นวันของฉันด้วย..." },
  { id: "d-3", category: "daily", th: "เช้านี้ฉันต้องรีบไปทำงานแต่เช้า", en: "I have to head to work early this morning", tipTh: "head to work เป็นสำนวนธรรมชาติแปลว่ามุ่งหน้าไปทำงาน" },
  { id: "d-4", category: "daily", th: "วันนี้ฉันมีประชุมออนไลน์ตอนสิบโมงเช้า", en: "I have an online meeting at ten this morning", tipTh: "ใช้บุพบท at นำหน้าเวลาตามนาฬิกา เช่น at ten" },
  { id: "d-5", category: "daily", th: "ขอดูกำหนดการของสัปดาห์นี้หน่อยได้ไหม", en: "Could I see the schedule for this week", tipTh: "the schedule for this week = ตารางงานของสัปดาห์นี้" },
  { id: "d-6", category: "daily", th: "ฉันขอส่งอีเมลสรุปงานให้คุณภายในบ่ายนี้", en: "I will send you the summary email by this afternoon", tipTh: "by + เวลา แปลว่าภายในเวลานั้น (ไม่เกินบ่ายนี้)" },
  { id: "d-7", category: "daily", th: "วันนี้ฉันทำงานจากที่บ้านเพราะฝนตกหนัก", en: "I am working from home today because of the heavy rain", tipTh: "because of ตามด้วยกลุ่มคำนาม (the heavy rain)" },
  { id: "d-8", category: "daily", th: "เราพักเบรกดื่มกาแฟสักสิบนาทีดีไหม", en: "Shall we take a ten minute coffee break", tipTh: "take a break แปลว่าหยุดพักเบรก" },
  { id: "d-9", category: "daily", th: "ฉันกำลังตั้งใจเขียนรายงานชิ้นนี้อยู่", en: "I am focusing on writing this report right now", tipTh: "focus on + กริยาเติม -ing แปลว่าจดจ่ออยู่กับการทำสิ่งนั้น" },
  { id: "d-10", category: "daily", th: "ขอบคุณที่ช่วยตรวจทานเอกสารให้นะคะ", en: "Thank you for reviewing the document for me", tipTh: "Thank you for + V.-ing ใช้ขอบคุณที่ใครทำบางอย่างให้" },
  { id: "d-11", category: "daily", th: "ตอนเที่ยงนี้คุณอยากไปทานมื้อเที่ยงด้วยกันไหม", en: "Would you like to have lunch together today", tipTh: "Would you like to... เป็นการชวนอย่างสุภาพ" },
  { id: "d-12", category: "daily", th: "บ่ายนี้ฉันรู้สึกง่วงนอนนิดหน่อย", en: "I feel a little sleepy this afternoon", tipTh: "feel + คำคุณศัพท์ (sleepy = ง่วงนอน)" },
  { id: "d-13", category: "daily", th: "งานชิ้นนี้เสร็จเรียบร้อยทันเวลาพอดี", en: "This project was finished right on time", tipTh: "right on time แปลว่าตรงเวลาพอดีเป๊ะ" },
  { id: "d-14", category: "daily", th: "หลังเลิกงานฉันชอบเดินเล่นในสวนสาธารณะ", en: "After work I like taking a walk in the park", tipTh: "take a walk เป็นสำนวนแปลว่าเดินเล่นพักผ่อน" },
  { id: "d-15", category: "daily", th: "ฉันต้องแวะซื้อผักสดก่อนกลับบ้าน", en: "I need to buy some fresh vegetables before going home", tipTh: "before + V.-ing (going home) แปลว่าก่อนที่จะกลับบ้าน" },
  { id: "d-16", category: "daily", th: "เย็นนี้ฉันตั้งใจจะทำซุปอุ่นๆ ทานเอง", en: "I plan to cook warm soup for dinner tonight", tipTh: "plan to + กริยาช่อง 1 แปลว่าตั้งใจหรือวางแผนว่าจะทำ" },
  { id: "d-17", category: "daily", th: "ช่วยเปิดหน้าต่างรับลมเย็นๆ หน่อยได้ไหม", en: "Could you open the window for some fresh air", tipTh: "fresh air แปลว่าอากาศบริสุทธิ์หรือลมเย็นสดชื่น" },
  { id: "d-18", category: "daily", th: "เซียนน่าชอบมานั่งข้างๆ เวลาฉันอ่านหนังสือ", en: "Sienna likes sitting beside me when I read a book", tipTh: "beside me แปลว่าข้างๆ ฉัน" },
  { id: "d-19", category: "daily", th: "ฉันรดน้ำต้นไม้ที่ระเบียงทุกเช้า", en: "I water the plants on the balcony every morning", tipTh: "water เมื่อเป็นคำกริยาแปลว่ารดน้ำต้นไม้" },
  { id: "d-20", category: "daily", th: "วันเสาร์นี้ฉันจะทำความสะอาดห้องนั่งเล่น", en: "I am going to clean the living room this Saturday", tipTh: "be going to + กริยาช่อง 1 บอกความตั้งใจที่จะทำในอนาคตอันใกล้" },
  { id: "d-21", category: "daily", th: "แบตเตอรี่โทรศัพท์ของฉันใกล้จะหมดแล้ว", en: "My phone battery is almost running out", tipTh: "run out แปลว่าใกล้หมดหรือหมดลง" },
  { id: "d-22", category: "daily", th: "ฉันชอบจดบันทึกสิ่งดีๆ ที่เกิดขึ้นในแต่ละวัน", en: "I love writing down good things in my daily journal", tipTh: "write down แปลว่าจดบันทึกลงบนกระดาษหรือสมุด" },
  { id: "d-23", category: "daily", th: "คืนนี้ฉันอยากเข้านอนเร็วกว่าปกติ", en: "I want to go to bed earlier than usual tonight", tipTh: "earlier than usual แปลว่าเร็วกว่าปกติ" },
  { id: "d-24", category: "daily", th: "อย่าลืมตั้งนาฬิกาปลุกสำหรับพรุ่งนี้เช้านะ", en: "Do not forget to set your alarm for tomorrow morning", tipTh: "set an alarm แปลว่าตั้งนาฬิกาปลุก" },
  { id: "d-25", category: "daily", th: "อินเทอร์เน็ตที่บ้านวันนี้ค่อนข้างช้า", en: "The internet connection at home is quite slow today", tipTh: "quite slow แปลว่าค่อนข้างช้า" },
  { id: "d-26", category: "daily", th: "ฉันเพิ่งซักผ้าและตากผ้าเสร็จเมื่อกี้", en: "I just finished doing the laundry a moment ago", tipTh: "do the laundry เป็นสำนวนแปลว่าซักผ้า" },
  { id: "d-27", category: "daily", th: "คุณช่วยหรี่เสียงเพลงลงนิดนึงได้ไหม", en: "Could you turn down the music a little bit", tipTh: "turn down = หรี่เสียงลง ส่วน turn up = เร่งเสียงขึ้น" },
  { id: "d-28", category: "daily", th: "ฉันชอบแสงแดดอุ่นๆ ยามบ่ายในห้องทำงาน", en: "I love the warm afternoon sunlight in my studio", tipTh: "afternoon sunlight = แสงแดดยามบ่าย" },
  { id: "d-29", category: "daily", th: "พรุ่งนี้เป็นวันหยุดพักผ่อนของฉัน", en: "Tomorrow is my day off from work", tipTh: "day off แปลว่าวันหยุดพักงาน" },
  { id: "d-30", category: "daily", th: "ฉันพร้อมสำหรับเริ่มต้นสัปดาห์ใหม่แล้ว", en: "I am ready to start a brand new week", tipTh: "brand new เน้นความรู้สึกว่าใหม่เอี่ยมและสดใส" },

  // 3. หมวดการเดินทางและสถานที่ (Travel & Directions) - 30 ประโยค
  { id: "t-1", category: "travel", th: "ขอโทษนะคะ สถานีรถไฟที่ใกล้ที่สุดอยู่ที่ไหน", en: "Excuse me where is the nearest train station", tipTh: "the nearest + สถานที่ ใช้ถามหาสถานที่ที่อยู่ใกล้ที่สุด" },
  { id: "t-2", category: "travel", th: "เดินตรงไปตามถนนเส้นนี้แล้วเลี้ยวซ้าย", en: "Walk straight down this street and turn left", tipTh: "walk straight = เดินตรงไป, turn left = เลี้ยวซ้าย" },
  { id: "t-3", category: "travel", th: "จากที่นี่เดินไปร้านหนังสือใช้เวลาไกลไหม", en: "Is it far to walk to the bookshop from here", tipTh: "Is it far to... ใช้ถามว่าระยะทางไกลไหม" },
  { id: "t-4", category: "travel", th: "ใช้เวลาเดินเพียงแค่ห้านาทีเท่านั้นค่ะ", en: "It takes only five minutes on foot", tipTh: "on foot แปลว่าด้วยการเดินเท้า" },
  { id: "t-5", category: "travel", th: "ฉันขอซื้อตั๋วรถไฟไปกลับหนึ่งใบค่ะ", en: "I would like a round trip train ticket please", tipTh: "round trip ticket = ตั๋วไป-กลับ (ส่วนตั๋วเที่ยวเดียวคือ one-way ticket)" },
  { id: "t-6", category: "travel", th: "รถไฟขบวนถัดไปจะออกกี่โมงคะ", en: "What time does the next train leave", tipTh: "ตารางเวลาเดินรถใช้ Present Simple (does ... leave)" },
  { id: "t-7", category: "travel", th: "รถเมล์สายนี้วิ่งไปพิพิธภัณฑ์ศิลปะไหมคะ", en: "Does this bus go to the art museum", tipTh: "Does this bus go to... ใช้ถามว่ารถเมล์คันนี้ผ่านที่นั่นไหม" },
  { id: "t-8", category: "travel", th: "ช่วยบอกฉันหน่อยได้ไหมว่าต้องลงป้ายไหน", en: "Could you tell me which stop I should get off", tipTh: "get off ใช้กับการลงจากรถเมล์หรือรถไฟ" },
  { id: "t-9", category: "travel", th: "ร้านกาแฟอยู่ตรงข้ามกับสวนสาธารณะพอดี", en: "The coffee shop is right across from the park", tipTh: "across from แปลว่าอยู่ฝั่งตรงข้ามกับ..." },
  { id: "t-10", category: "travel", th: "ฉันชอบนั่งที่นั่งริมหน้าต่างบนรถไฟ", en: "I prefer a window seat on the train", tipTh: "window seat = ที่นั่งริมหน้าต่าง (ริมทางเดินคือ aisle seat)" },
  { id: "t-11", category: "travel", th: "เรากำลังวางแผนไปเที่ยวทะเลสาบสุดสัปดาห์นี้", en: "We are planning a trip to the lake this weekend", tipTh: "plan a trip to... แปลว่าวางแผนเดินทางไป..." },
  { id: "t-12", category: "travel", th: "วิวภูเขาจากหน้าต่างบานนี้สวยงามมาก", en: "The mountain view from this window is breathtaking", tipTh: "breathtaking แปลว่าสวยจนแทบลืมหายใจ" },
  { id: "t-13", category: "travel", th: "ฉันจองห้องพักไว้สองคืนในชื่อของโนรี", en: "I have a reservation for two nights under Noree", tipTh: "have a reservation under + ชื่อ ใช้แจ้งตอนเช็กอินโรงแรม" },
  { id: "t-14", category: "travel", th: "อาหารเช้าของโรงแรมเริ่มเสิร์ฟตั้งแต่กี่โมงคะ", en: "What time is breakfast served at the hotel", tipTh: "is breakfast served เป็นรูปประโยคสุภาพที่ใช้ถามเวลาอาหารเช้า" },
  { id: "t-15", category: "travel", th: "แถวนี้มีร้านเช่าจักรยานไหมคะ", en: "Is there a bicycle rental shop around here", tipTh: "Is there a ... around here? ใช้ถามว่าแถวนี้มีสถานที่นั้นไหม" },
  { id: "t-16", category: "travel", th: "ฉันชอบปั่นจักรยานเลียบแม่น้ำในตอนเย็น", en: "I love riding a bicycle along the river in the evening", tipTh: "along the river แปลว่าเลียบไปตามแนวแม่น้ำ" },
  { id: "t-17", category: "travel", th: "กรุณาช่วยถ่ายรูปให้พวกเราสักรูปได้ไหมคะ", en: "Could you please take a photo of us", tipTh: "take a photo of us = ถ่ายรูปให้พวกเรา" },
  { id: "t-18", category: "travel", th: "ห้องสมุดประชาชนเปิดทำการทุกวันยกเว้นวันจันทร์", en: "The public library is open every day except Monday", tipTh: "except แปลว่ายกเว้น" },
  { id: "t-19", category: "travel", th: "ฉันหลงทางนิดหน่อย ช่วยชี้ทางบนแผนที่ให้ทีค่ะ", en: "I am a bit lost could you show me on the map", tipTh: "I am a bit lost แปลว่าฉันหลงทางนิดหน่อย" },
  { id: "t-20", category: "travel", th: "สะพานไม้เก่าแก่อยู่ถัดจากหัวมุมถนนนั้น", en: "The old wooden bridge is just around the corner", tipTh: "just around the corner แปลว่าอยู่ถัดจากหัวมุมถนนไปนิดเดียว" },
  { id: "t-21", category: "travel", th: "อากาศบนยอดเขาค่อนข้างหนาวและมีลมแรง", en: "The weather on the hilltop is quite chilly and windy", tipTh: "chilly แปลว่าหนาวเย็นสบายๆ ส่วน windy แปลว่าลมแรง" },
  { id: "t-22", category: "travel", th: "อย่าลืมพกร่มไปด้วยนะเพราะเมฆเริ่มครึ้มแล้ว", en: "Remember to bring an umbrella because it looks cloudy", tipTh: "Remember to + กริยาช่อง 1 แปลว่าอย่าลืมที่จะทำสิ่งนั้น" },
  { id: "t-23", category: "travel", th: "ตลาดนัดยามเช้ามีผลไม้ท้องถิ่นสดๆ เยอะมาก", en: "The morning market has plenty of fresh local fruits", tipTh: "plenty of แปลว่ามีมากมายอุดมสมบูรณ์" },
  { id: "t-24", category: "travel", th: "พวกเราเดินตามทางเดินหินเล็กๆ ไปยังชายหาด", en: "We walked along the small stone path to the beach", tipTh: "stone path แปลว่าทางเดินที่ปูด้วยหิน" },
  { id: "t-25", category: "travel", th: "ประตูทางออกขึ้นเครื่องบินอยู่ที่หมายเลขห้า", en: "The boarding gate is at number five", tipTh: "boarding gate คือประตูทางออกขึ้นเครื่องบิน" },
  { id: "t-26", category: "travel", th: "กระเป๋าเดินทางใบสีน้ำตาลใบนั้นเป็นของฉัน", en: "That brown suitcase over there belongs to me", tipTh: "belong to me แปลว่าเป็นของฉัน" },
  { id: "t-27", category: "travel", th: "เมืองนี้เงียบสงบและผู้คนเป็นมิตรมาก", en: "This town is very peaceful and the people are friendly", tipTh: "peaceful = เงียบสงบ, friendly = เป็นมิตร" },
  { id: "t-28", category: "travel", th: "เราแวะพักชมพระอาทิตย์ตกดินที่จุดชมวิวกันเถอะ", en: "Let us stop to watch the sunset at the viewpoint", tipTh: "watch the sunset แปลว่าชมพระอาทิตย์ตกดิน" },
  { id: "t-29", category: "travel", th: "ค่าเข้าชมสวนพฤกษศาสตร์ราคาเท่าไหร่คะ", en: "How much is the entrance fee for the botanical garden", tipTh: "entrance fee แปลว่าค่าธรรมเนียมเข้าชมสถานที่" },
  { id: "t-30", category: "travel", th: "ฉันอยากกลับมาเที่ยวที่นี่อีกครั้งในฤดูใบไม้ร่วง", en: "I would love to visit this place again in autumn", tipTh: "would love to + กริยาช่อง 1 แปลว่าอยากจะทำสิ่งนั้นมากๆ" },

  // 4. หมวดการซื้อของและร้านอาหาร (Shopping & Dining) - 30 ประโยค
  { id: "s-1", category: "shopping", th: "ขอดูเมนูอาหารและเครื่องดื่มหน่อยได้ไหมคะ", en: "May I see the food and drink menu please", tipTh: "May I see... please เป็นคำขอที่สุภาพมากในร้านอาหาร" },
  { id: "s-2", category: "shopping", th: "ฉันขอสั่งลาเต้ร้อนหวานน้อยหนึ่งแก้วค่ะ", en: "I would like a hot latte with less sugar please", tipTh: "with less sugar แปลว่าหวานน้อย (ใส่น้ำตาลน้อยลง)" },
  { id: "s-3", category: "shopping", th: "คุณรับเป็นนมข้าวโอ๊ตแทนวัวไหมคะ", en: "Would you like oat milk instead of regular milk", tipTh: "instead of แปลว่าแทนที่..." },
  { id: "s-4", category: "shopping", th: "วันนี้ทางร้านมีเมนูพิเศษแนะนำไหมคะ", en: "Do you have any special dishes you recommend today", tipTh: "recommend แปลว่าแนะนำเมนูเด็ด" },
  { id: "s-5", category: "shopping", th: "ขนมปังอบใหม่ๆ ในร้านนี้กลิ่นหอมมาก", en: "The freshly baked bread in this bakery smells amazing", tipTh: "freshly baked bread = ขนมปังที่เพิ่งอบเสร็จใหม่ๆ" },
  { id: "s-6", category: "shopping", th: "ฉันขอครัวซองต์เนยสดสองชิ้นใส่ถุงกลับบ้านค่ะ", en: "Can I get two butter croissants to go please", tipTh: "to go แปลว่าสั่งกลับบ้าน (สำหรับที่นี่ใช้ for here)" },
  { id: "s-7", category: "shopping", th: "มีโต๊ะว่างสำหรับสองท่านริมหน้าต่างไหมคะ", en: "Do you have a table for two by the window", tipTh: "a table for two by the window = โต๊ะสำหรับ 2 คนริมหน้าต่าง" },
  { id: "s-8", category: "shopping", th: "อาหารจานนี้รสชาติเผ็ดเกินไปไหมคะ", en: "Is this dish too spicy to eat", tipTh: "too spicy แปลว่าเผ็ดเกินไป" },
  { id: "s-9", category: "shopping", th: "ฉันแพ้อาหารทะเล รบกวนไม่ใส่กุ้งนะคะ", en: "I am allergic to seafood so please no shrimp", tipTh: "allergic to + สิ่งที่แพ้ ใช้แจ้งพนักงานร้านอาหารเพื่อความปลอดภัย" },
  { id: "s-10", category: "shopping", th: "ขอน้ำเปล่าเพิ่มอีกหนึ่งแก้วได้ไหมคะ", en: "Could I have another glass of water please", tipTh: "another glass of water = น้ำเปล่าเพิ่มอีกหนึ่งแก้ว" },
  { id: "s-11", category: "shopping", th: "เค้กแครอทชิ้นนี้อร่อยและเนื้อนุ่มมาก", en: "This carrot cake is delicious and very soft", tipTh: "delicious = อร่อย, soft = เนื้อนุ่ม" },
  { id: "s-12", category: "shopping", th: "รบกวนคิดเงินด้วยค่ะ", en: "Could we have the check please", tipTh: "have the check please เป็นสำนวนขอดูบิลเก็บเงินในร้านอาหาร" },
  { id: "s-13", category: "shopping", th: "ฉันสามารถจ่ายด้วยบัตรเครดิตได้ไหมคะ", en: "Can I pay by credit card here", tipTh: "pay by credit card = จ่ายด้วยบัตรเครดิต (จ่ายเงินสดใช้ pay in cash)" },
  { id: "s-14", category: "shopping", th: "เสื้อไหมพรมตัวนี้ราคาเท่าไหร่คะ", en: "How much does this knitted sweater cost", tipTh: "How much does ... cost? ใช้ถามราคาสิ่งของหนึ่งชิ้น" },
  { id: "s-15", category: "shopping", th: "ฉันขอลองสวมเสื้อแจ็กเก็ตตัวนี้ได้ไหมคะ", en: "May I try on this jacket in the fitting room", tipTh: "try on = ลองสวมเสื้อผ้า, fitting room = ห้องลองชุด" },
  { id: "s-16", category: "shopping", th: "คุณมีเสื้อรุ่นนี้ไซส์กลางสีครีมไหมคะ", en: "Do you have this in a medium size in cream", tipTh: "in a medium size = ในขนาดไซส์ M" },
  { id: "s-17", category: "shopping", th: "สมุดโน้ตปกผ้าเล่มนี้เหมาะเป็นของขวัญมาก", en: "This fabric notebook would make a lovely gift", tipTh: "make a lovely gift แปลว่าเหมาะที่จะเป็นของขวัญที่น่ารักมาก" },
  { id: "s-18", category: "shopping", th: "รบกวนห่อของขวัญให้ฉันด้วยได้ไหมคะ", en: "Could you gift wrap this for me please", tipTh: "gift wrap เป็นคำกริยาแปลว่าห่อของขวัญ" },
  { id: "s-19", category: "shopping", th: "วันนี้ที่ร้านหนังสือมีโปรโมชั่นลดราคาพิเศษ", en: "The bookstore is having a special sale today", tipTh: "have a sale แปลว่าจัดโปรโมชั่นลดราคา" },
  { id: "s-20", category: "shopping", th: "ฉันพกถุงผ้ามาเอง ไม่รับถุงพลาสติกค่ะ", en: "I brought my own tote bag so no plastic bag please", tipTh: "tote bag คือถุงผ้าพกพา" },
  { id: "s-21", category: "shopping", th: "แอปเปิลสีแดงพวกนี้ดูสดและกรอบน่าทานมาก", en: "These red apples look very fresh and crispy", tipTh: "crispy ใช้บรรยายผลไม้ที่กรอบอร่อย" },
  { id: "s-22", category: "shopping", th: "ฉันกำลังมองหาเทียนหอมกลิ่นวานิลลาและไม้สน", en: "I am looking for a scented candle with vanilla and pine", tipTh: "scented candle แปลว่าเทียนหอม" },
  { id: "s-23", category: "shopping", th: "ขอโทษนะคะ ตอนนี้ฉันแค่เดินดูของเฉยๆ ค่ะ", en: "Thank you I am just browsing right now", tipTh: "I am just browsing ใช้ตอบพนักงานขายอย่างสุภาพเมื่อเราแค่อยากเดินดูของ" },
  { id: "s-24", category: "shopping", th: "ซุปฟักทองถ้วยนี้เสิร์ฟมาอุ่นกำลังดีเลย", en: "This bowl of pumpkin soup is served nice and warm", tipTh: "nice and warm แปลว่าอุ่นกำลังดี" },
  { id: "s-25", category: "shopping", th: "เราแบ่งกันจ่ายค่าอาหารคนละครึ่งนะ", en: "Let us split the bill evenly between us", tipTh: "split the bill แปลว่าหารค่าอาหารกัน" },
  { id: "s-26", category: "shopping", th: "มื้อนี้ฉันขอเป็นคนเลี้ยงกาแฟคุณเองนะ", en: "Let me treat you to coffee this time", tipTh: "treat someone to... แปลว่าเลี้ยงอาหารหรือเครื่องดื่ม" },
  { id: "s-27", category: "shopping", th: "ชาคาโมมายล์ถ้วยนี้ช่วยให้ผ่อนคลายก่อนนอน", en: "This cup of chamomile tea helps me relax before sleep", tipTh: "help + คน + กริยาช่อง 1 (relax) แปลว่าช่วยให้ผ่อนคลาย" },
  { id: "s-28", category: "shopping", th: "คุกกี้ข้าวโอ๊ตโฮมเมดไม่หวานจนเกินไป", en: "These homemade oatmeal cookies are not too sweet", tipTh: "not too sweet = ไม่หวานจนเกินไป" },
  { id: "s-29", category: "shopping", th: "อย่าลืมเก็บใบเสร็จไว้เผื่อต้องการเปลี่ยนสินค้า", en: "Please keep the receipt in case you need an exchange", tipTh: "in case แปลว่าเผื่อไว้ในกรณีที่..." },
  { id: "s-30", category: "shopping", th: "บรรยากาศในคาเฟ่เล็กๆ แห่งนี้อบอุ่นเหมือนอยู่บ้าน", en: "The atmosphere in this little cafe feels just like home", tipTh: "feels just like home แปลว่าให้ความรู้สึกอบอุ่นเหมือนอยู่บ้าน" },

  // 5. หมวดความรู้สึกและอารมณ์จากนิทานของเซียนน่า (Emotions & Stories) - 30 ประโยค
  { id: "e-1", category: "emotions", th: "น้องเซียนน่าขดตัวหลับอยู่บนพรมข้างกีตาร์โปร่ง", en: "Sienna curled up asleep on the rug beside the acoustic guitar", tipTh: "curl up แปลว่าขดตัวกลมๆ อย่างอบอุ่นเหมือนแมวนอน" },
  { id: "e-2", category: "emotions", th: "เสียงฝนกระทบหน้าต่างทำให้หัวใจของฉันสงบลง", en: "The sound of rain on the window calms my heart", tipTh: "calm someone's heart แปลว่าทำให้จิตใจสงบและผ่อนคลาย" },
  { id: "e-3", category: "emotions", th: "วันนี้ฉันรู้สึกภูมิใจในความพยายามเล็กๆ ของตัวเอง", en: "Today I feel proud of my small daily progress", tipTh: "feel proud of... แปลว่ารู้สึกภูมิใจใน..." },
  { id: "e-4", category: "emotions", th: "ไม่เป็นไรเลยที่จะค่อยๆ เรียนรู้ทีละก้าวอย่างช้าๆ", en: "It is completely okay to learn slowly step by step", tipTh: "step by step แปลว่าค่อยๆ ก้าวไปทีละก้าว" },
  { id: "e-5", category: "emotions", th: "เซียนน่าส่งเสียงครางเบาๆ เมื่อโนรีเกาคางให้", en: "Sienna purred softly when Noree scratched her chin", tipTh: "purr คือเสียงครางในลำคอของแมวเวลาเขามีความสุข" },
  { id: "e-6", category: "emotions", th: "ทุกครั้งที่ได้ฟังเพลงนี้ ฉันจะนึกถึงความทรงจำที่อบอุ่น", en: "Every time I hear this song it brings back warm memories", tipTh: "bring back memories แปลว่าชวนให้นึกถึงความทรงจำเก่าๆ" },
  { id: "e-7", category: "emotions", th: "แสงไฟสีส้มจากโคมไฟช่วยให้ห้องดูละมุนขึ้น", en: "The amber glow from the lantern makes the room feel cozy", tipTh: "amber glow แปลว่าแสงสีส้มอมเหลืองที่อบอุ่น" },
  { id: "e-8", category: "emotions", th: "ฉันรู้สึกขอบคุณสำหรับมิตรภาพที่แสนดีของคุณ", en: "I am deeply grateful for your kind friendship", tipTh: "grateful for... แปลว่ารู้สึกซาบซึ้งและขอบคุณสำหรับ..." },
  { id: "e-9", category: "emotions", th: "แม้ในวันที่เหนื่อยล้า รอยยิ้มเล็กๆ ก็ช่วยเติมพลังได้", en: "Even on tired days a gentle smile can brighten the heart", tipTh: "brighten the heart แปลว่าทำให้หัวใจสดใสและมีพลังขึ้น" },
  { id: "e-10", category: "emotions", th: "เซียนน่าชอบจ้องมองผีเสื้อที่บินอยู่ในสวนดอกไม้", en: "Sienna loves watching butterflies dancing in the flower garden", tipTh: "ใช้ dancing เปรียบเปรยผีเสื้อที่โบยบินอย่างเริงร่า" },
  { id: "e-11", category: "emotions", th: "ความผิดพลาดเป็นเพียงส่วนหนึ่งของการเรียนรู้สิ่งใหม่", en: "Mistakes are simply a natural part of learning something new", tipTh: "เป็นประโยคให้กำลังใจที่เตือนว่าความผิดพลาดคือเรื่องธรรมชาติของการเรียนรู้" },
  { id: "e-12", category: "emotions", th: "สายลมยามเย็นพัดพากลิ่นหอมของดอกมะลิเข้ามา", en: "The evening breeze carried the sweet scent of jasmine", tipTh: "evening breeze = สายลมเบาๆ ยามเย็น" },
  { id: "e-13", category: "emotions", th: "ฉันรู้สึกตื่นเต้นที่ได้เริ่มต้นเขียนนิทานบทใหม่", en: "I feel excited to start writing a new story chapter", tipTh: "feel excited to + V.1 แปลว่ารู้สึกตื่นเต้นที่จะได้ทำ..." },
  { id: "e-14", category: "emotions", th: "เมื่อเซียนน่าได้ยินเสียงกีตาร์ เธอก็เดินเข้ามาหาทันที", en: "Whenever Sienna hears the guitar she walks right over", tipTh: "Whenever แปลว่าเมื่อไหร่ก็ตามที่..." },
  { id: "e-15", category: "emotions", th: "บางครั้งความสุขก็ซ่อนอยู่ในเรื่องธรรมดาๆ รอบตัวเรา", en: "Sometimes happiness hides in simple little moments around us", tipTh: "simple little moments = ช่วงเวลาเล็กๆ ที่เรียบง่าย" },
  { id: "e-16", category: "emotions", th: "ฉันสูดหายใจเข้าลึกๆ และปล่อยวางความกังวลลง", en: "I took a deep breath and let go of my worries", tipTh: "take a deep breath = สูดหายใจลึกๆ, let go of = ปล่อยวาง" },
  { id: "e-17", category: "emotions", th: "เสียงเพลงอะคูสติกเป็นเหมือนผ้าห่มอุ่นๆ ในคืนฤดูหนาว", en: "Acoustic music feels like a warm blanket on a winter night", tipTh: "feels like a warm blanket เปรียบเสียงเพลงเหมือนผ้าห่มอุ่นๆ" },
  { id: "e-18", category: "emotions", th: "เซียนน่าเอาอุ้งเท้าเล็กๆ แตะที่มือของฉันเบาๆ", en: "Sienna gently touched my hand with her soft little paw", tipTh: "paw แปลว่าอุ้งเท้าของแมวหรือสุนัข" },
  { id: "e-19", category: "emotions", th: "ฉันเชื่อมั่นว่าพรุ่งนี้จะเป็นวันที่สดใสยิ่งกว่าเดิม", en: "I truly believe that tomorrow will be a brighter day", tipTh: "a brighter day แปลว่าวันที่สดใสยิ่งขึ้นกว่าเดิม" },
  { id: "e-20", category: "emotions", th: "การแบ่งปันเรื่องราวดีๆ ทำให้ความสุขเพิ่มขึ้นเป็นสองเท่า", en: "Sharing a good story doubles the joy in our hearts", tipTh: "double the joy แปลว่าเพิ่มความสุขเป็นสองเท่า" },
  { id: "e-21", category: "emotions", th: "ดวงดาวนับพันดวงส่องแสงระยิบระยับอยู่บนท้องฟ้า", en: "Thousands of stars are twinkling softly in the night sky", tipTh: "twinkle แปลว่าส่องแสงระยิบระยับ (ใช้กับดวงดาว)" },
  { id: "e-22", category: "emotions", th: "โนรีแต่งทำนองเพลงนี้ให้กับวันที่ฝนตกพรำๆ", en: "Noree wrote this gentle melody for a rainy afternoon", tipTh: "gentle melody แปลว่าท่วงทำนองเพลงที่อ่อนโยน" },
  { id: "e-23", category: "emotions", th: "ความใจดีต่อตัวเองคือจุดเริ่มต้นของความมั่นใจ", en: "Being kind to yourself is the beginning of confidence", tipTh: "Being kind to yourself (การใจดีกับตัวเอง) ทำหน้าที่เป็นประธานของประโยค" },
  { id: "e-24", category: "emotions", th: "เซียนน่าซ่อนตัวอยู่ในกล่องกระดาษใบโปรดของเธอ", en: "Sienna hid inside her favorite cardboard box", tipTh: "cardboard box แปลว่ากล่องกระดาษลังที่แมวชอบเข้าไปซ่อน" },
  { id: "e-25", category: "emotions", th: "ฉันรู้สึกอบอุ่นใจทุกครั้งที่ได้กลับถึงบ้าน", en: "My heart feels warm every time I return home", tipTh: "return home แปลว่าเดินทางกลับถึงบ้าน" },
  { id: "e-26", category: "emotions", th: "จดหมายที่เขียนด้วยลายมือให้ความรู้สึกพิเศษเสมอ", en: "A handwritten letter always feels extra special", tipTh: "handwritten letter = จดหมายที่เขียนด้วยลายมือ" },
  { id: "e-27", category: "emotions", th: "พวกเรานั่งฟังเสียงคลื่นกระทบฝั่งด้วยกันอย่างเงียบสงบ", en: "We sat quietly listening to the waves touching the shore", tipTh: "shore แปลว่าชายฝั่งทะเลหรือริมฝั่งน้ำ" },
  { id: "e-28", category: "emotions", th: "คำพูดให้กำลังใจเพียงประโยคเดียวสามารถเปลี่ยนทั้งวันได้", en: "One kind word of encouragement can change the whole day", tipTh: "word of encouragement แปลว่าคำพูดให้กำลังใจ" },
  { id: "e-29", category: "emotions", th: "เซียนน่าหาวหวอดใหญ่ก่อนจะหลับตาลงอย่างมีความสุข", en: "Sienna gave a big yawn before closing her eyes happily", tipTh: "give a big yawn เป็นสำนวนแปลว่าหาวหวอดใหญ่" },
  { id: "e-30", category: "emotions", th: "ขอบคุณที่มาฝึกภาษาอังกฤษด้วยกันกับโนรีและเซียนน่านะคะ", en: "Thank you for practicing English with Noree and Sienna today", tipTh: "ขอบคุณที่มาเรียงประโยคและเรียนรู้ด้วยกันอย่างอบอุ่นนะคะ 🐱🎸" },
];

const SIENNA_BUILDER_CHEERS_TH = [
  "เมี้ยว~ 🐱✨ เรียงประโยคได้ถูกต้องเป๊ะเลยค่ะ! น้องเซียนน่ากระดิกหางปรบมือให้รัวๆ เลย 🎸💛",
  "เก่งมากเลยค่ะ! 🐾🌿 โครงสร้างประโยคไหลลื่นและเป็นธรรมชาติมากๆ โนรีภูมิใจในตัวคุณนะคะ",
  "เพอร์เฟกต์ที่สุด! 🐱☕ น้องเซียนน่าส่งเสียงเพอร์เบาๆ ชื่นชมความตั้งใจของคุณค่ะ",
  "ยอดเยี่ยมมากค่ะ! ✨🎶 เรียงคำได้แม่นยำตามหลักไวยากรณ์เป๊ะเลย ลองฟังเสียงอ่านแล้วพูดตามดูนะคะ",
  "อบอุ่นและถูกต้องที่สุด! 🐾🎸 ก้าวเล็กๆ ในแต่ละประโยคทำให้คุณเก่งขึ้นทุกวันเลยค่ะ",
];

const SIENNA_BUILDER_HINTS_TH = [
  "เมี้ยว~ 🐾 อีกนิดเดียวเท่านั้นค่ะ! ลองสังเกตตำแหน่งประธาน (Subject) และกริยา (Verb) อีกครั้งนะคะ เซียนน่าเอาใจช่วยอยู่ข้างๆ ค่ะ 💛",
  "ไม่ต้องรีบนะคะ ☕ ลองดูคำใบ้ไวยากรณ์ด้านล่าง หรือกดปุ่ม '💡 ช่วยใบ้คำถัดไป' ให้โนรีช่วยวางคำให้ดูได้เลยค่ะ",
  "เกือบถูกแล้วค่ะ! 🌿 ลองสลับตำแหน่งคำในช่องคำตอบอีกนิดนึงนะคะ คุณทำได้แน่นอน!",
];

function playCozySuccessChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.36);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.38);
    });
  } catch {
    // ignore audio context restrictions
  }
}

export function tokenizeSentenceForBuilder(sentenceEn: string): {
  targetWords: string[];
  shuffledTokens: BuilderToken[];
} {
  const words = String(sentenceEn || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const tokens: BuilderToken[] = words.map((word, index) => ({
    id: `tok-${index}-${word.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    word,
    clean: word.toLowerCase().replace(/[^a-z0-9']/g, ""),
  }));
  const shuffled = [...tokens];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  if (shuffled.length > 1 && shuffled.map((t) => t.word).join(" ") === words.join(" ")) {
    const first = shuffled.shift()!;
    shuffled.push(first);
  }
  return { targetWords: words, shuffledTokens: shuffled };
}

interface SentenceBuilderGameProps {
  lang: AppLanguage;
  onSpeak: (text: string, rate?: number) => void;
  onSavePhrase?: (target: ShadowingTarget) => void;
}

export default function SentenceBuilderGame({
  lang,
  onSpeak,
  onSavePhrase,
}: SentenceBuilderGameProps) {
  const [sbCategory, setSbCategory] = useState("all");
  const [sbShuffledDeck, setSbShuffledDeck] = useState<SentenceBuilderItem[]>(
    () => SENTENCE_BUILDER_DECK_150
  );
  const [sbIndex, setSbIndex] = useState(0);
  const [sbBankTokens, setSbBankTokens] = useState<BuilderToken[]>([]);
  const [sbAnswerTokens, setSbAnswerTokens] = useState<BuilderToken[]>([]);
  const [sbStatus, setSbStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [sbFeedbackMsg, setSbFeedbackMsg] = useState("");
  const [sbScore, setSbScore] = useState(0);
  const [sbStreak, setSbStreak] = useState(0);
  const [sbCompletedIds, setSbCompletedIds] = useState<string[]>([]);
  const [sbDragItem, setSbDragItem] = useState<{
    source: "bank" | "answer";
    token: BuilderToken;
    index: number;
  } | null>(null);

  const sbFilteredDeck =
    sbCategory === "all"
      ? sbShuffledDeck
      : sbShuffledDeck.filter((item) => item.category === sbCategory);

  const currentSbItem =
    sbFilteredDeck[sbIndex] || sbFilteredDeck[0] || SENTENCE_BUILDER_DECK_150[0];

  const initRound = (item: SentenceBuilderItem) => {
    if (!item) return;
    const { shuffledTokens } = tokenizeSentenceForBuilder(item.en);
    setSbBankTokens(shuffledTokens);
    setSbAnswerTokens([]);
    setSbStatus("idle");
    setSbFeedbackMsg("");
  };

  useEffect(() => {
    if (currentSbItem) {
      initRound(currentSbItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sbCategory, sbIndex, sbShuffledDeck]);

  const handleSelectBankToken = (token: BuilderToken) => {
    if (sbStatus === "correct") return;
    setSbBankTokens((prev) => prev.filter((t) => t.id !== token.id));
    setSbAnswerTokens((prev) => [...prev, token]);
    if (sbStatus === "wrong") {
      setSbStatus("idle");
      setSbFeedbackMsg("");
    }
  };

  const handleRemoveAnswerToken = (token: BuilderToken) => {
    if (sbStatus === "correct") return;
    setSbAnswerTokens((prev) => prev.filter((t) => t.id !== token.id));
    setSbBankTokens((prev) => [...prev, token]);
    if (sbStatus === "wrong") {
      setSbStatus("idle");
      setSbFeedbackMsg("");
    }
  };

  const handleReset = () => {
    if (!currentSbItem) return;
    initRound(currentSbItem);
  };

  const handleHint = () => {
    if (!currentSbItem || sbStatus === "correct") return;
    const { targetWords } = tokenizeSentenceForBuilder(currentSbItem.en);
    let mismatchIdx = 0;
    while (
      mismatchIdx < sbAnswerTokens.length &&
      sbAnswerTokens[mismatchIdx].clean ===
        targetWords[mismatchIdx].toLowerCase().replace(/[^a-z0-9']/g, "")
    ) {
      mismatchIdx++;
    }
    if (mismatchIdx >= targetWords.length) return;

    const keptAnswer = sbAnswerTokens.slice(0, mismatchIdx);
    const returnedToBank = sbAnswerTokens.slice(mismatchIdx);
    const availablePool = [...sbBankTokens, ...returnedToBank];

    const neededClean = targetWords[mismatchIdx]
      .toLowerCase()
      .replace(/[^a-z0-9']/g, "");
    const matchingToken =
      availablePool.find((t) => t.clean === neededClean) || availablePool[0];

    if (matchingToken) {
      const nextBank = availablePool.filter((t) => t.id !== matchingToken.id);
      setSbAnswerTokens([...keptAnswer, matchingToken]);
      setSbBankTokens(nextBank);
      setSbStatus("idle");
      setSbFeedbackMsg("");
    }
  };

  const handleCheckAnswer = () => {
    if (!currentSbItem || sbAnswerTokens.length === 0) return;
    const { targetWords } = tokenizeSentenceForBuilder(currentSbItem.en);
    const norm = (w: string) =>
      String(w || "")
        .toLowerCase()
        .replace(/[^a-z0-9']/g, "");
    const userNorm = sbAnswerTokens.map((t) => norm(t.word)).join(" ");
    const targetNorm = targetWords.map((w) => norm(w)).join(" ");

    if (userNorm === targetNorm) {
      setSbStatus("correct");
      setSbScore((p) => p + 1);
      setSbStreak((p) => p + 1);
      setSbCompletedIds((prev) =>
        prev.includes(currentSbItem.id) ? prev : [...prev, currentSbItem.id]
      );
      const cheer =
        SIENNA_BUILDER_CHEERS_TH[
          Math.floor(Math.random() * SIENNA_BUILDER_CHEERS_TH.length)
        ];
      setSbFeedbackMsg(cheer);
      playCozySuccessChime();
      onSpeak(currentSbItem.en, 1.0);
    } else {
      setSbStatus("wrong");
      setSbStreak(0);
      const hint =
        SIENNA_BUILDER_HINTS_TH[
          Math.floor(Math.random() * SIENNA_BUILDER_HINTS_TH.length)
        ];
      setSbFeedbackMsg(hint);
    }
  };

  const handleNext = () => {
    if (sbFilteredDeck.length === 0) return;
    setSbIndex((prev) => (prev + 1) % sbFilteredDeck.length);
  };

  const handlePrev = () => {
    if (sbFilteredDeck.length === 0) return;
    setSbIndex(
      (prev) => (prev - 1 + sbFilteredDeck.length) % sbFilteredDeck.length
    );
  };

  const handleShuffleDeck = () => {
    const shuffled = [...SENTENCE_BUILDER_DECK_150].sort(
      () => Math.random() - 0.5
    );
    setSbShuffledDeck(shuffled);
    setSbIndex(0);
  };

  const handleDragStart = (
    e: React.DragEvent,
    source: "bank" | "answer",
    token: BuilderToken,
    index: number
  ) => {
    setSbDragItem({ source, token, index });
    try {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", token.id);
    } catch {
      // ignore
    }
  };

  const handleDropOnAnswer = (
    e: React.DragEvent,
    targetIndex: number | null = null
  ) => {
    e.preventDefault();
    if (!sbDragItem || sbStatus === "correct") return;
    const { source, token, index: fromIndex } = sbDragItem;

    if (source === "bank") {
      setSbBankTokens((prev) => prev.filter((t) => t.id !== token.id));
      setSbAnswerTokens((prev) => {
        const copy = [...prev];
        if (targetIndex === null || targetIndex >= copy.length) {
          copy.push(token);
        } else {
          copy.splice(targetIndex, 0, token);
        }
        return copy;
      });
    } else if (
      source === "answer" &&
      targetIndex !== null &&
      fromIndex !== targetIndex
    ) {
      setSbAnswerTokens((prev) => {
        const copy = [...prev];
        const [moved] = copy.splice(fromIndex, 1);
        copy.splice(targetIndex, 0, moved);
        return copy;
      });
    }
    setSbDragItem(null);
    if (sbStatus === "wrong") setSbStatus("idle");
  };

  const handleDropOnBank = (e: React.DragEvent) => {
    e.preventDefault();
    if (!sbDragItem || sbStatus === "correct") return;
    const { source, token } = sbDragItem;
    if (source === "answer") {
      setSbAnswerTokens((prev) => prev.filter((t) => t.id !== token.id));
      setSbBankTokens((prev) => [...prev, token]);
    }
    setSbDragItem(null);
    if (sbStatus === "wrong") setSbStatus("idle");
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-[#F5EFE6] border border-[#E5DEC9] rounded-3xl p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] border border-[#E5DEC9] flex items-center justify-center text-2xl shrink-0">
              🧩🐱
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C86D51]/15 text-[#A85035] border border-[#C86D51]/30">
                  🐱🎸 Sienna’s Sentence Studio • 150 Curated Sentences
                </span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#6B8E78]/15 text-[#4A6B56]">
                  สำเร็จแล้ว {sbCompletedIds.length} / 150 ประโยค
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2523]">
                {lang === "th"
                  ? "เกมเรียงคำแต่งประโยคกับน้องเซียนน่า (Sentence Builder)"
                  : "Sienna’s Cozy Sentence Builder (150 Sentences)"}
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6059] leading-relaxed">
                {lang === "th"
                  ? "แตะเลือกคำศัพท์ หรือลากคำศัพท์จากคลังด้านล่าง มาเรียงต่อกันเป็นประโยคภาษาอังกฤษที่ถูกต้องตามโจทย์ภาษาไทย โดยมีน้องเซียนน่า 🐱 และโนรีคอยเชียร์อยู่ข้างๆ ค่ะ"
                  : "Tap or drag words from the Word Bank into the Answer Box in grammatically correct order. Sienna the Studio Cat & Noree are cheering you on!"}
              </p>
            </div>
          </div>

          {/* Score & Streak */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-2xl bg-[#FAF6F0] border border-[#E5DEC9] text-center min-w-[78px]">
              <div className="text-[10px] uppercase tracking-wider text-[#8C7D75]">
                {lang === "th" ? "คะแนนรวม" : "Score"}
              </div>
              <div className="font-serif text-lg font-bold text-[#6B8E78]">
                ⭐ {sbScore}
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-[#FAF6F0] border border-[#E5DEC9] text-center min-w-[78px]">
              <div className="text-[10px] uppercase tracking-wider text-[#8C7D75]">
                {lang === "th" ? "ต่อเนื่อง" : "Streak"}
              </div>
              <div className="font-serif text-lg font-bold text-[#C86D51]">
                🔥 {sbStreak}
              </div>
            </div>
            <button
              onClick={handleShuffleDeck}
              className="px-3.5 py-2.5 rounded-2xl bg-[#FAF6F0] hover:bg-[#EBE3D5] text-[#2C2523] border border-[#D5CBB8] text-xs font-semibold transition cursor-pointer"
            >
              🔀 {lang === "th" ? "สุ่มโจทย์" : "Shuffle"}
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="pt-3 border-t border-[#E5DEC9]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A6B63] mb-2">
            📂{" "}
            {lang === "th"
              ? "เลือกหมวดหมู่ประโยค (5 หมวดหมู่ • 150 ประโยค):"
              : "Select Sentence Category (5 Categories • 150 Sentences):"}
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {SENTENCE_BUILDER_CATEGORIES.map((cat) => {
              const isSelected = sbCategory === cat.id;
              const count =
                cat.id === "all"
                  ? SENTENCE_BUILDER_DECK_150.length
                  : SENTENCE_BUILDER_DECK_150.filter(
                      (s) => s.category === cat.id
                    ).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSbCategory(cat.id);
                    setSbIndex(0);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#2C2523] text-[#FAF6F0]"
                      : "bg-[#FAF6F0] text-[#5C504A] hover:bg-[#EBE3D5] border border-[#E5DEC9]"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{lang === "th" ? cat.labelTh : cat.labelEn}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#E5DEC9]/70 text-[#6E6059]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Builder Card */}
      {currentSbItem && (
        <div className="bg-[#FAF6F0] border-2 border-[#E5DEC9] rounded-3xl p-4 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5DEC9]">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#C86D51]/15 text-[#A85035] border border-[#C86D51]/30 text-xs font-bold">
                {(() => {
                  const catObj = SENTENCE_BUILDER_CATEGORIES.find(
                    (c) => c.id === currentSbItem.category
                  );
                  return catObj
                    ? `${catObj.icon} ${
                        lang === "th" ? catObj.labelTh : catObj.labelEn
                      }`
                    : "🧩 Sentence";
                })()}
              </span>
              <span className="text-xs font-semibold text-[#7A6B63]">
                {lang === "th"
                  ? `ข้อที่ ${sbIndex + 1} / ${sbFilteredDeck.length}`
                  : `Sentence ${sbIndex + 1} of ${sbFilteredDeck.length}`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl bg-[#F2ECE1] hover:bg-[#E5DEC9] text-[#2C2523] text-xs font-semibold transition cursor-pointer"
              >
                ← {lang === "th" ? "ก่อนหน้า" : "Prev"}
              </button>
              <button
                onClick={handleNext}
                className="px-3 py-1.5 rounded-xl bg-[#F2ECE1] hover:bg-[#E5DEC9] text-[#2C2523] text-xs font-semibold transition cursor-pointer"
              >
                {lang === "th" ? "ข้าม / ข้อถัดไป" : "Skip / Next"} →
              </button>
            </div>
          </div>

          {/* Thai Sentence Prompt */}
          <div className="bg-[#F5EFE6] border border-[#E5DEC9] rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C86D51]">
                🎯{" "}
                {lang === "th"
                  ? "โจทย์ประโยคภาษาไทย (เรียงเป็นภาษาอังกฤษ)"
                  : "Thai Sentence Prompt"}
              </span>
              <button
                onClick={() => onSpeak(currentSbItem.en, 1.0)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EBE3D5] text-[#2C2523] border border-[#D5CBB8] text-xs font-semibold transition cursor-pointer"
              >
                🔊 {lang === "th" ? "ฟังเสียงใบ้" : "Listen Audio"}
              </button>
            </div>
            <p className="font-serif text-lg sm:text-2xl font-bold text-[#2C2523]">
              “{currentSbItem.th}”
            </p>
          </div>

          {/* Answer Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5C504A]">
                ✍️{" "}
                {lang === "th"
                  ? "ช่องเรียงคำตอบของคุณ (แตะที่คำเพื่อเอาออก หรือลากสลับตำแหน่งได้)"
                  : "Your Answer Box (Tap word to remove or drag to reorder)"}
              </label>
              <span className="text-[11px] text-[#8C7D75]">
                {sbAnswerTokens.length} /{" "}
                {sbAnswerTokens.length + sbBankTokens.length}{" "}
                {lang === "th" ? "คำ" : "words"}
              </span>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnAnswer(e, null)}
              className={`min-h-[96px] p-3.5 sm:p-4 rounded-2xl border-2 border-dashed transition flex flex-wrap items-center gap-2 ${
                sbStatus === "correct"
                  ? "bg-[#6B8E78]/12 border-[#6B8E78]"
                  : sbStatus === "wrong"
                  ? "bg-[#D9534F]/10 border-[#D9534F]"
                  : sbAnswerTokens.length > 0
                  ? "bg-white border-[#C86D51]/60"
                  : "bg-white/70 border-[#D5CBB8]"
              }`}
            >
              {sbAnswerTokens.length === 0 ? (
                <div className="w-full text-center py-4 text-xs sm:text-sm text-[#8C7D75]">
                  🐾{" "}
                  {lang === "th"
                    ? "แตะเลือกคำศัพท์จากคลังด้านล่าง หรือลากมาวางที่นี่เพื่อเรียงเป็นประโยค..."
                    : "Tap words from the Word Bank below or drag them here to build the sentence..."}
                </div>
              ) : (
                sbAnswerTokens.map((token, idx) => (
                  <button
                    key={token.id}
                    type="button"
                    draggable={sbStatus !== "correct"}
                    onDragStart={(e) => handleDragStart(e, "answer", token, idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.stopPropagation();
                      handleDropOnAnswer(e, idx);
                    }}
                    onClick={() => handleRemoveAnswerToken(token)}
                    className={`px-3.5 py-2.5 rounded-xl font-serif text-base sm:text-lg font-bold transition cursor-pointer ${
                      sbStatus === "correct"
                        ? "bg-[#6B8E78] text-white"
                        : "bg-[#2C2523] hover:bg-[#C86D51] text-[#FAF6F0]"
                    }`}
                  >
                    {token.word}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Word Bank */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5C504A]">
                🧩{" "}
                {lang === "th"
                  ? "คลังคำศัพท์ (Word Bank - แตะหรือลากไปวางด้านบน)"
                  : "Word Bank (Tap or drag words to the Answer Box)"}
              </label>
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropOnBank}
              className="min-h-[84px] p-3.5 sm:p-4 rounded-2xl bg-[#F2ECE1] border border-[#E5DEC9] flex flex-wrap items-center gap-2"
            >
              {sbBankTokens.length === 0 ? (
                <div className="w-full text-center py-2 text-xs text-[#6B8E78] font-semibold">
                  ✨{" "}
                  {lang === "th"
                    ? "วางคำศัพท์ครบทุกคำแล้ว! กดปุ่ม 'ตรวจคำตอบ' ได้เลยค่ะ"
                    : "All words placed! Click 'Check Answer' below."}
                </div>
              ) : (
                sbBankTokens.map((token, idx) => (
                  <button
                    key={token.id}
                    type="button"
                    draggable={sbStatus !== "correct"}
                    onDragStart={(e) => handleDragStart(e, "bank", token, idx)}
                    onClick={() => handleSelectBankToken(token)}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF6F0] text-[#2C2523] border-2 border-[#D5CBB8] hover:border-[#C86D51] font-serif text-base sm:text-lg font-bold transition cursor-pointer"
                  >
                    {token.word}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 rounded-2xl bg-[#F2ECE1] hover:bg-[#E5DEC9] text-[#2C2523] border border-[#D5CBB8] text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                🔄 {lang === "th" ? "เริ่มเรียงใหม่ (Reset)" : "Reset"}
              </button>
              <button
                type="button"
                onClick={handleHint}
                disabled={sbStatus === "correct"}
                className="px-4 py-3 rounded-2xl bg-[#FAF6F0] hover:bg-[#EBE3D5] disabled:opacity-45 text-[#A85035] border border-[#C86D51]/40 text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                💡 {lang === "th" ? "ช่วยใบ้คำถัดไป (Hint)" : "Hint Next Word"}
              </button>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {sbStatus !== "correct" ? (
                <button
                  type="button"
                  onClick={handleCheckAnswer}
                  disabled={sbAnswerTokens.length === 0}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#C86D51] hover:bg-[#B55B3F] disabled:opacity-45 text-white text-sm font-bold transition cursor-pointer"
                >
                  ✅ {lang === "th" ? "ตรวจคำตอบ (Check Answer)" : "Check Answer"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#6B8E78] hover:bg-[#587864] text-white text-sm font-bold transition cursor-pointer"
                >
                  {lang === "th"
                    ? "ประโยคถัดไป (Next Sentence) →"
                    : "Next Sentence →"}
                </button>
              )}
            </div>
          </div>

          {/* Feedback Banner */}
          {sbStatus === "correct" && (
            <div className="bg-[#6B8E78]/12 border-2 border-[#6B8E78]/45 rounded-3xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#6B8E78]/40 flex items-center justify-center text-2xl shrink-0">
                    🐱🎉
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#3F634D]">
                      🌟 Sienna & Noree Celebration!
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#2C2523]">
                      {sbFeedbackMsg}
                    </p>
                  </div>
                </div>
                {onSavePhrase && (
                  <button
                    onClick={() =>
                      onSavePhrase({
                        phrase: currentSbitem.en,
                        rhythmGuide: currentSbitem.en,
                        tip: `${currentSbitem.th} — ${currentSbitem.tipTh}`,
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-white text-[#C86D51] border border-[#E5DEC9] text-xs font-semibold cursor-pointer"
                  >
                    + {lang === "th" ? "บันทึกประโยค" : "Save"}
                  </button>
                )}
              </div>
              <div className="bg-white/95 border border-[#E5DEC9] rounded-2xl p-4 space-y-1.5">
                <p className="font-serif text-lg font-bold text-[#2C2523]">
                  “{currentSbItem.en}”
                </p>
                <p className="text-xs text-[#6E6059]">
                  💡 <strong className="text-[#C86D51]">เกร็ดไวยากรณ์จากโนรี:</strong>{" "}
                  {currentSbItem.tipTh}
                </p>
              </div>
            </div>
          )}

          {sbStatus === "wrong" && (
            <div className="bg-[#C86D51]/12 border-2 border-[#C86D51]/40 rounded-3xl p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white border border-[#C86D51]/40 flex items-center justify-center text-2xl shrink-0">
                  🐾💛
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A85035]">
                    น้องเซียนน่าให้กำลังใจ (Try Again Gently)
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#2C2523]">
                    {sbFeedbackMsg}
                  </p>
                </div>
              </div>
              <div className="bg-white/90 border border-[#C86D51]/25 rounded-2xl p-3 text-xs text-[#4A403C]">
                <strong className="text-[#C86D51]">💡 คำใบ้โครงสร้างประโยค: </strong>
                {currentSbItem.tipTh}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
