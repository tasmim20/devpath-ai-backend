/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/ai/ai.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('get-questions')
  async getQuestions(
    @Body()
    body: {
      position: string;
      level: string;
      questionNumber: number;
      topic?: string;
    },
  ) {
    const { position, level, questionNumber, topic } = body;

    if (!position || !level || !questionNumber) {
      throw new BadRequestException(
        'position, level, and questionNumber are required',
      );
    }

    try {
      const result = await this.aiService.generateQuestions({
        position,
        level,
        questionNumber,
        topic,
      });

      return result;
    } catch (err) {
      return {
        message: 'Failed to generate interview questions',
        error: err.message,
      };
    }
  }
  // NEW: Code Review Endpoint
  @Post('code-review')
  async codeReview(@Body() body: { code: string }) {
    if (!body.code) {
      throw new BadRequestException('code is required');
    }

    return this.aiService.reviewCode(body.code);
  }
}
