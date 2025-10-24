import { GoogleGenerativeAI } from '@google/generative-ai';
import { Framework, QualityBreakdown } from '@/types';
import { FRAMEWORKS } from './constants';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const BASE_SYSTEM_PROMPT = `You are PromptIQ's Legendary Prompt Architect, an expert AI that transforms simple user ideas into detailed, professional, immediately actionable prompts.

CRITICAL RULES:
- NO greetings, introductions, or pleasantries
- NO questions to the user or Socratic dialogue
- NO hypothetical scenarios or assumptions
- START IMMEDIATELY with the transformed prompt
- Output ONLY the final prompt, nothing else

YOUR TASK:
Take the user's input and DIRECTLY generate a comprehensive, detailed, legendary prompt that can be used immediately in AI tools (ChatGPT, Claude, Midjourney, etc).

OUTPUT STRUCTURE:
- Role: Define who the AI should act as
- Context: Provide background and constraints
- Task: Clearly state objectives with specifics
- Format: Specify exact output structure
- Examples: Include relevant examples when applicable
- Success Criteria: Define what good output looks like

LENGTH: 400-700 words
FORMAT: Professional markdown with clear sections
TONE: Authoritative, specific, actionable

Transform the user's input NOW. Output only the prompt.`;

function adjustSystemPromptForFramework(basePrompt: string, framework: Framework): string {
  const frameworkInfo = FRAMEWORKS[framework];
  
  let adjustment = '';
  
  switch (framework) {
    case 'chain-of-thought':
      adjustment = '\n\nFRAMEWORK ADJUSTMENT: Structure the prompt to include step-by-step reasoning. Add sections for "Thinking Process" and "Step-by-Step Approach".';
      break;
    case 'rice':
      adjustment = '\n\nFRAMEWORK ADJUSTMENT: Focus on RICE framework - Reach, Impact, Confidence, Effort. Structure the prompt to evaluate these four dimensions.';
      break;
    case 'creative-brief':
      adjustment = '\n\nFRAMEWORK ADJUSTMENT: Include sections for Brand Voice, Target Audience, Key Messages, Tone & Style, and Creative Direction.';
      break;
    case 'star':
      adjustment = '\n\nFRAMEWORK ADJUSTMENT: Structure as STAR - Situation (context), Task (objective), Action (steps), Result (expected outcome).';
      break;
    case 'socratic':
      adjustment = '\n\nFRAMEWORK ADJUSTMENT: Use Socratic questioning technique. Structure the prompt as a series of guiding questions that lead to deeper thinking.';
      break;
    case 'custom':
      adjustment = '\n\nFRAMEWORK ADJUSTMENT: Use a flexible, adaptable structure based on the user\'s specific needs.';
      break;
  }
  
  return basePrompt + adjustment;
}

export function calculateQualityScore(prompt: string): QualityBreakdown {
  const suggestions: string[] = [];
  
  // Structure score (0-2.5)
  let structureScore = 0;
  if (prompt.includes('##') || prompt.includes('**')) {
    structureScore = 2.5;
  } else if (prompt.includes('#') || prompt.includes('*')) {
    structureScore = 1.5;
    suggestions.push('Add more clear section headers for better structure');
  } else {
    structureScore = 0.5;
    suggestions.push('Use markdown headers to organize sections');
  }
  
  // Clarity score (0-2.5)
  let clarityScore = 0;
  const hasRole = prompt.toLowerCase().includes('role:') || 
                  prompt.toLowerCase().includes('act as') ||
                  prompt.toLowerCase().includes('you are');
  const hasTask = prompt.toLowerCase().includes('task:') || 
                  prompt.toLowerCase().includes('objective:') ||
                  prompt.toLowerCase().includes('goal:');
  
  if (hasRole && hasTask) {
    clarityScore = 2.5;
  } else if (hasRole || hasTask) {
    clarityScore = 1.5;
    if (!hasRole) suggestions.push('Define a clear role for the AI');
    if (!hasTask) suggestions.push('State the objective more explicitly');
  } else {
    clarityScore = 0.5;
    suggestions.push('Add role definition and clear objectives');
  }
  
  // Examples score (0-2.5)
  let examplesScore = 0;
  const exampleCount = (prompt.match(/example|e\.g\.|for instance|such as/gi) || []).length;
  if (exampleCount >= 2) {
    examplesScore = 2.5;
  } else if (exampleCount === 1) {
    examplesScore = 1.5;
    suggestions.push('Add more concrete examples');
  } else {
    examplesScore = 0.5;
    suggestions.push('Include relevant examples to illustrate expectations');
  }
  
  // Specificity score (0-2.5)
  let specificityScore = 0;
  const wordCount = prompt.split(/\s+/).length;
  const hasConstraints = prompt.toLowerCase().includes('constraint') || 
                         prompt.toLowerCase().includes('limitation') ||
                         prompt.toLowerCase().includes('requirement');
  const hasFormat = prompt.toLowerCase().includes('format:') || 
                    prompt.toLowerCase().includes('output:') ||
                    prompt.toLowerCase().includes('structure:');
  
  if (wordCount >= 400 && hasConstraints && hasFormat) {
    specificityScore = 2.5;
  } else if (wordCount >= 300 || hasConstraints || hasFormat) {
    specificityScore = 1.5;
    if (wordCount < 400) suggestions.push('Add more detail and specificity');
    if (!hasConstraints) suggestions.push('Define constraints and limitations');
    if (!hasFormat) suggestions.push('Specify the desired output format');
  } else {
    specificityScore = 0.5;
    suggestions.push('Significantly expand with more details, constraints, and format specifications');
  }
  
  const total = Math.min(
    Math.round((structureScore + clarityScore + examplesScore + specificityScore) * 10) / 10,
    10
  );
  
  return {
    structure: Math.round(structureScore * 10) / 10,
    clarity: Math.round(clarityScore * 10) / 10,
    examples: Math.round(examplesScore * 10) / 10,
    specificity: Math.round(specificityScore * 10) / 10,
    total,
    suggestions: suggestions.slice(0, 3), // Limit to top 3 suggestions
  };
}

export async function generatePrompt(
  input: string,
  framework: Framework
): Promise<{ output: string; qualityScore: QualityBreakdown }> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const adjustedPrompt = adjustSystemPromptForFramework(BASE_SYSTEM_PROMPT, framework);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: adjustedPrompt,
    });

    const result = await model.generateContent(input);
    const output = result.response.text();
    
    if (!output || output.trim().length === 0) {
      throw new Error('Generated prompt is empty');
    }

    const qualityScore = calculateQualityScore(output);

    return { output, qualityScore };
  } catch (error: any) {
    console.error('Error generating prompt:', error);
    throw new Error(error.message || 'Failed to generate prompt');
  }
}

export async function refinePrompt(
  originalPrompt: string,
  refinementRequest: string,
  framework: Framework
): Promise<{ output: string; qualityScore: QualityBreakdown }> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const adjustedPrompt = adjustSystemPromptForFramework(BASE_SYSTEM_PROMPT, framework);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: adjustedPrompt,
    });

    const refinementPrompt = `Here is the current prompt:\n\n${originalPrompt}\n\nUser refinement request: ${refinementRequest}\n\nGenerate an improved version of the prompt based on this feedback. Output only the refined prompt.`;

    const result = await model.generateContent(refinementPrompt);
    const output = result.response.text();
    
    if (!output || output.trim().length === 0) {
      throw new Error('Refined prompt is empty');
    }

    const qualityScore = calculateQualityScore(output);

    return { output, qualityScore };
  } catch (error: any) {
    console.error('Error refining prompt:', error);
    throw new Error(error.message || 'Failed to refine prompt');
  }
}
