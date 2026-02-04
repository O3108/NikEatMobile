export type Product = {
  name: string;
  value: number;
  id: number;
};

export type Settings = {
  id: number;
  longMorning: number;
  longEvening: number;
  longDay: number;
  breakfast: number;
  lunch: number;
  dinner: number;
};

export type Glucose = {
  day: {
    id: number;
    date: string;
    value: number;
    highCount: number;
    lowCount: number;
    totalGlucose: number;
  };
  night: {
    id: number;
    date: string;
    value: number;
    highCount: number;
    lowCount: number;
    totalGlucose: number;
  };
  allDay?: {
    id: number;
    date: string;
    value: number;
    highCount: number;
    lowCount: number;
    totalGlucose: number;
  };
};

export type ActiveInsulin = {
  id: number;
  date: string;
  value: number;
};

export type MacroInfo = {
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  calories: number | null;
  portionWeight: number | null;
  note?: string;
  sourceModel?: string;
  rawText?: string;
};
