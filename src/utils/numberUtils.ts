/**
 * Парсит число из строки, заменяя запятую на точку
 * Работает корректно с iPhone клавиатурой, которая вводит запятую
 * 
 * @param value - строка с числом (может содержать запятую или точку)
 * @returns число или 0 если парсинг не удался
 * 
 * @example
 * parseNumber('1.5')  // 1.5
 * parseNumber('1,5')  // 1.5
 * parseNumber('10')   // 10
 * parseNumber('')     // 0
 * parseNumber('abc')  // 0
 */
export const parseNumber = (value: string): number => {
  if (!value || value.trim() === '') {
    return 0;
  }
  
  // Заменяем запятую на точку для корректного парсинга
  const normalizedValue = value.replace(',', '.');
  const parsed = parseFloat(normalizedValue);
  
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Форматирует число для отображения с учетом локали
 * 
 * @param value - число для форматирования
 * @param decimals - количество знаков после запятой (по умолчанию 1)
 * @returns отформатированная строка
 * 
 * @example
 * formatNumber(1.5)     // '1.5'
 * formatNumber(1.5, 2)  // '1.50'
 * formatNumber(10)      // '10'
 */
export const formatNumber = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals).replace(/\.?0+$/, '');
};
