import { parseDate, getMinutesDiff } from './dateUtils';
import { ActiveInsulin } from '../types';

const ACTIVE_MINUTES = 120;
const ACTIVE_HOURS = 2;

/**
 * Вычисляет оставшийся активный инсулин
 */
export const calculateActiveInsulin = (activeInsulin: ActiveInsulin | null): number => {
  if (!activeInsulin) return 0;
  
  const now = new Date();
  const insulinDate = parseDate(activeInsulin.date);
  const diffMinutes = getMinutesDiff(now, insulinDate);
  
  if (diffMinutes >= ACTIVE_MINUTES) return 0;
  
  const leftMinutes = ACTIVE_MINUTES - diffMinutes;
  return Math.round((activeInsulin.value / ACTIVE_MINUTES) * leftMinutes * 10) / 10;
};

/**
 * Получает время, прошедшее с момента введения инсулина (в минутах)
 */
export const getPassedTime = (activeInsulin: ActiveInsulin | null): number => {
  if (!activeInsulin) return 0;
  
  const now = new Date();
  const insulinDate = parseDate(activeInsulin.date);
  return getMinutesDiff(now, insulinDate);
};

/**
 * Проверяет, активен ли инсулин
 */
export const isInsulinActive = (activeInsulin: ActiveInsulin | null): boolean => {
  if (!activeInsulin) return false;
  
  const now = new Date();
  const insulinDate = parseDate(activeInsulin.date);
  const diffHours = (now.getTime() - insulinDate.getTime()) / (1000 * 60 * 60);
  
  return diffHours < ACTIVE_HOURS;
};

/**
 * Вычисляет необходимую дозу инсулина
 */
export const calculateInsulinDose = (
  totalXE: number,
  currentGlucose: number,
  settingValue: number,
  activeInsulin: number,
  passedTime: number
): number => {
  const productsValue = totalXE * settingValue;
  const glucoseCorrection = currentGlucose > 7 ? (currentGlucose - 7) / 3 : 0;
  const activeInsulinCorrection = passedTime > 30 ? activeInsulin : 0;
  
  return Math.ceil(productsValue + glucoseCorrection - activeInsulinCorrection);
};
