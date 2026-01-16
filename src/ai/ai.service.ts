// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-return */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// // /* eslint-disable @typescript-eslint/no-unsafe-argument */
// // /* eslint-disable @typescript-eslint/no-unsafe-return */
// // /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// // /* eslint-disable @typescript-eslint/no-unsafe-call */
// // /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// @Injectable()
// export class AiService {
//   private genAI;
//   private model;
//   private codeReviewModel;

//   constructor(private configService: ConfigService) {
//     // Get API key from env
//     const apiKey = this.configService.get<string>('GOOGLE_GEMINI_KEY');
//     if (!apiKey) {
//       throw new Error('GOOGLE_GEMINI_KEY is not defined in .env');
//     }

//     // Initialize Google AI
//     this.genAI = new GoogleGenerativeAI(apiKey);
//     this.model = this.genAI.getGenerativeModel({
//       model: 'gemini-2.5-flash',
//       systemInstruction: `
// AI System Instruction: Universal Interview Question & Answer Generator

// Role:
// You generate interview questions WITH answers for ANY job position.

// Rules:
// - Output MUST be valid JSON only.
// - No markdown, no backticks, no explanations.
// - Structure:
// {
//   "position": "",
//   "level": "",
//   "topic": "",
//   "questions": [
//     {
//       "question": "",
//       "answer": "",
//       "hint": "",
//       "difficulty": "Easy|Medium|Hard"
//     }
//   ]
// }

// User may provide:
// - position (required)
// - level (required)
// - number of questions (required)
// - topic (optional)
//       `,
//     });
//   }

//   private extractJSON(text: string) {
//     const cleaned = text
//       .replace(/```json/gi, '')
//       .replace(/```/g, '')
//       .trim();
//     const match = cleaned.match(/\{[\s\S]*\}/);
//     if (!match) throw new Error('No JSON found in AI response');
//     return JSON.parse(match[0]);
//   }

//   private async retry(fn: () => Promise<any>, retries = 3, delay = 1200) {
//     try {
//       return await fn();
//     } catch (err) {
//       if (retries === 0) throw err;
//       await new Promise((res) => setTimeout(res, delay));
//       return this.retry(fn, retries - 1, delay);
//     }
//   }

//   async generateQuestions({
//     position,
//     level,
//     questionNumber,
//     topic,
//   }: {
//     position: string;
//     level: string;
//     questionNumber: number;
//     topic?: string;
//   }) {
//     if (!position || !level || !questionNumber) {
//       throw new Error('position, level, and questionNumber are required');
//     }

//     const prompt = `
// Generate ${questionNumber} interview questions with answers
// for position: ${position}
// level: ${level}
// ${topic ? `topic: ${topic}` : ''}
// Return ONLY valid JSON.
//     `;

//     const result = await this.retry(() => this.model.generateContent(prompt));
//     const text = result.response.text();
//     return this.extractJSON(text);
//   }
// }

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI;
  private questionModel;
  private codeReviewModel;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_GEMINI_KEY');
    if (!apiKey) throw new Error('GOOGLE_GEMINI_KEY is not defined in .env');
    console.log(
      'GOOGLE_GEMINI_KEY:',
      process.env.GOOGLE_GEMINI_KEY ? 'OK' : 'MISSING',
    );
    this.genAI = new GoogleGenerativeAI(apiKey);

    /* ===============================
       Interview Question Generator
       (UNCHANGED)
    ================================ */
    this.questionModel = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `
AI System Instruction: Universal Interview Question & Answer Generator

Role:
You generate interview questions WITH answers for ANY job position.

Rules:
- Output MUST be valid JSON only.
- No markdown, no backticks, no explanations.
- Structure:
{
  "position": "",
  "level": "",
  "topic": "",
  "questions": [
    {
      "question": "",
      "answer": "",
      "hint": "",
      "difficulty": "Easy|Medium|Hard"
    }
  ]
}
      `,
    });

    /* ===============================
       Code Review Model
       (YOUR ORIGINAL PROMPT)
    ================================ */
    this.codeReviewModel = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `
AI System Instruction: Senior Code Reviewer (7+ Years of Experience)

Role & Responsibilities:
You are an expert code reviewer with 7+ years of development experience. Your role is to analyze, review, and improve code written by developers.

Focus on:
• Code Quality
• Best Practices
• Efficiency & Performance
• Error Detection
• Security Risks
• Scalability
• Readability & Maintainability

Guidelines:
1. Provide constructive feedback
2. Suggest refactored code where possible
3. Detect performance bottlenecks
4. Ensure security compliance (XSS, SQL Injection, CSRF)
5. Promote consistency & clean architecture
6. Follow DRY & SOLID principles
7. Identify unnecessary complexity
8. Verify test coverage
9. Ensure proper documentation
10. Encourage modern practices

Tone:
- Precise, concise, professional
- Balance strictness with encouragement

Rules:
- NO markdown
- NO backticks
- Output MUST be valid JSON only
      `,
    });
  }

  /* ===============================
     Helpers
  ================================ */
  private extractJSON(text: string) {
    const cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON found in AI response');

    return JSON.parse(match[0]);
  }

  private async retry(fn: () => Promise<any>, retries = 3, delay = 1200) {
    try {
      return await fn();
    } catch (err) {
      if (retries === 0) throw err;
      await new Promise((res) => setTimeout(res, delay));
      return this.retry(fn, retries - 1, delay);
    }
  }

  /* ===============================
     Interview Questions (UNCHANGED)
  ================================ */
  async generateQuestions({
    position,
    level,
    questionNumber,
    topic,
  }: {
    position: string;
    level: string;
    questionNumber: number;
    topic?: string;
  }) {
    if (!position || !level || !questionNumber) {
      throw new Error('position, level, and questionNumber are required');
    }

    const prompt = `
Generate ${questionNumber} interview questions with answers
for position: ${position}
level: ${level}
${topic ? `topic: ${topic}` : ''}
Return ONLY valid JSON.
    `;

    const result = await this.retry(() =>
      this.questionModel.generateContent(prompt),
    );

    return this.extractJSON(result.response.text());
  }

  /* ===============================
     Code Review
  ================================ */
  async reviewCode(code: string) {
    if (!code) throw new Error('code is required');

    const prompt = `
Analyze and review the following code:

${code}

Return ONLY valid JSON with:
- issues
- fixes
- improvements
    `;

    const result = await this.retry(() =>
      this.codeReviewModel.generateContent(prompt),
    );

    return this.extractJSON(result.response.text());
  }
}
