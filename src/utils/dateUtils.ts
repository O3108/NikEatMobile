/**
 * Парсит дату из формата DD.MM.YY HH:mm
 */
export const parseDate = (dateStr: string): Date => {
  const [datePart, timePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('.');
  const [hours, minutes] = timePart.split(':');
  return new Date(
    2000 + parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes)
  );
};

/**
 * Форматирует дату в формат DD.MM.YY HH:mm
 */
export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

/**
 * Вычисляет разницу в минутах между двумя датами
 */
export const getMinutesDiff = (date1: Date, date2: Date): number => {
  return Math.floor((date1.getTime() - date2.getTime()) / 60000);
};

/**
 * Форматирует время в формат "X ч Y мин"
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours} ч ${mins} мин`;
  }
  return `${mins} мин`;
};
