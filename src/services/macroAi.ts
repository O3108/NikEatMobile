import { InferenceClient } from '@huggingface/inference';
import { MacroInfo } from '../types';

const hf = new InferenceClient(process.env.EXPO_PUBLIC_HF_API_KEY);

const HF_MODEL_ID = process.env.EXPO_PUBLIC_HF_MODEL_ID;

const systemPrompt = `
Ты нутрициолог. Для любого продукта оценивай содержание белков, жиров, углеводов и калорий на 100 г продукта.
Дополнительно оценивай примерный вес одной стандартной порции или штуки в граммах (portionWeight). Если у продукта нет стандартной штуки, ставь null.
Отвечай строго в формате JSON:
{
  "protein": number | null,
  "fat": number | null,
  "carbs": number | null,
  "calories": number | null,
  "portionWeight": number | null,
  "note": string
}
Если нет данных, ставь null.
`.trim();

const extractFloat = (value: unknown): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const normalized = Number(value.replace(',', '.').replace(/[^\d.-]/g, ''));
    return Number.isFinite(normalized) ? normalized : null;
  }
  return null;
};

const normalizeMessageContent = (content: unknown): string => {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((chunk) => {
        if (typeof chunk === 'string') {
          return chunk;
        }
        if (chunk && typeof chunk === 'object' && 'text' in chunk && typeof (chunk as any).text === 'string') {
          return (chunk as any).text;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n')
      .trim();
  }
  if (content && typeof content === 'object' && 'text' in content && typeof (content as any).text === 'string') {
    return (content as any).text;
  }
  return String(content ?? '').trim();
};

const parseContent = (content: string, providerLabel: string, modelName: string): MacroInfo => {
  const trimmed = content?.trim() ?? '';
  const jsonBlockMatch = trimmed.match(/```json([\s\S]*?)```/i);
  const rawJson = jsonBlockMatch ? jsonBlockMatch[1].trim() : trimmed;

  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    parsed = null;
  }

  if (parsed) {
    return {
      protein: extractFloat(parsed.protein),
      fat: extractFloat(parsed.fat),
      carbs: extractFloat(parsed.carbs),
      calories: extractFloat(parsed.calories),
      portionWeight: extractFloat(parsed.portionWeight),
      note: typeof parsed.note === 'string' ? parsed.note : undefined,
      sourceModel: typeof parsed.model === 'string' ? parsed.model : `${providerLabel} (${modelName})`,
      rawText: trimmed,
    };
  }

  return {
    protein: null,
    fat: null,
    carbs: null,
    calories: null,
    portionWeight: null,
    note: 'Не удалось распарсить ответ модели',
    sourceModel: providerLabel,
    rawText: trimmed,
  };
};

const buildUserPrompt = (productName: string) =>
  `Продукт: "${productName}". Оцени БЖУ и калории на 100 г по заданному JSON формату.`;

export const fetchMacroInfo = async (productName: string): Promise<MacroInfo> => {
  if (!productName.trim()) {
    throw new Error('Введите название продукта');
  }

  if (!hf) {
    throw new Error('Нет Hugging Face API ключа, используем заглушку');
  }

  // Используем модель, которая точно работает с text-generation
  const prompt = `${systemPrompt}\n\n${buildUserPrompt(productName)}`;

  try {
    const response = await hf.chatCompletion({
      model: HF_MODEL_ID,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const generatedText = normalizeMessageContent(response.choices?.[0]?.message?.content);

    // Удаляем промпт из ответа, если он там есть
    const cleanedText = generatedText.replace(prompt, '').trim();

    const parsed = parseContent(cleanedText, 'HuggingFace', HF_MODEL_ID);


    return {
      ...parsed,
      note: parsed.note ?? `Данные для "${productName}"`,
    };

  } catch (error: any) {
    throw new Error(`Ошибка при запросе к Hugging Face: ${error.message}`);
  }
};
