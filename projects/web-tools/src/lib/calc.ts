export type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

export interface BmiResult {
  value: number;
  category: BmiCategory;
  minHealthyWeight: number;
  maxHealthyWeight: number;
}

export function bmiResult(heightCm: number, weightKg: number): BmiResult | null {
  if (!(heightCm > 0) || !(weightKg > 0)) return null;
  const h = heightCm / 100;
  const value = weightKg / (h * h);
  const category: BmiCategory =
    value < 18.5 ? "underweight" : value < 25 ? "normal" : value < 30 ? "overweight" : "obese";
  return {
    value,
    category,
    minHealthyWeight: 18.5 * h * h,
    maxHealthyWeight: 24.9 * h * h,
  };
}

export interface GpaRow {
  credits: number;
  points: number;
}

export interface GpaResult {
  gpa: number;
  totalCredits: number;
  totalPoints: number;
}

export function gpaResult(rows: GpaRow[]): GpaResult | null {
  let credits = 0;
  let points = 0;
  for (const r of rows) {
    if (!(r.credits > 0)) continue;
    if (!Number.isFinite(r.points)) continue;
    credits += r.credits;
    points += r.credits * r.points;
  }
  if (credits <= 0) return null;
  return { gpa: points / credits, totalCredits: credits, totalPoints: points };
}

export interface LoanResult {
  monthly: number;
  totalPayment: number;
  totalInterest: number;
}

export function loanResult(
  principal: number,
  annualRatePct: number,
  months: number
): LoanResult | null {
  if (!(principal > 0) || !(months > 0) || annualRatePct < 0) return null;
  const r = annualRatePct / 100 / 12;
  const monthly =
    r === 0 ? principal / months : (principal * r) / (1 - Math.pow(1 + r, -months));
  const totalPayment = monthly * months;
  return { monthly, totalPayment, totalInterest: totalPayment - principal };
}

export function carInstallmentResult(
  price: number,
  downPayment: number,
  annualRatePct: number,
  months: number
): (LoanResult & { financed: number }) | null {
  if (!(price > 0) || !(months > 0)) return null;
  const financed = price - Math.max(0, Math.min(downPayment, price));
  const l = loanResult(financed, annualRatePct, months);
  if (!l) return null;
  return { ...l, financed };
}

export interface SalaryInput {
  basic: number;
  housingPct: number;
  transport: number;
  otherAllowances: number;
  gosiPct: number;
  otherDeductions: number;
}

export interface SalaryResult {
  housing: number;
  totalAllowances: number;
  gross: number;
  gosi: number;
  totalDeductions: number;
  net: number;
}

export function salaryResult(i: SalaryInput): SalaryResult {
  const basic = Math.max(0, i.basic);
  const housing = (basic * Math.max(0, i.housingPct)) / 100;
  const totalAllowances = housing + Math.max(0, i.transport) + Math.max(0, i.otherAllowances);
  const gross = basic + totalAllowances;
  const gosi = (basic * clampPct(i.gosiPct)) / 100;
  const totalDeductions = gosi + Math.max(0, i.otherDeductions);
  return {
    housing,
    totalAllowances,
    gross,
    gosi,
    totalDeductions,
    net: gross - totalDeductions,
  };
}

function clampPct(p: number): number {
  return Math.max(0, Math.min(100, p || 0));
}

export interface ZakatInput {
  cash: number;
  goldValue: number;
  silverValue: number;
  inventory: number;
  receivables: number;
  debts: number;
  nisabValue: number;
}

export interface ZakatResult {
  base: number;
  due: number;
  belowNisab: boolean;
}

export function zakatResult(i: ZakatInput): ZakatResult {
  const assets =
    Math.max(0, i.cash) +
    Math.max(0, i.goldValue) +
    Math.max(0, i.silverValue) +
    Math.max(0, i.inventory) +
    Math.max(0, i.receivables);
  const base = assets - Math.max(0, i.debts);
  const belowNisab = base < Math.max(0, i.nisabValue);
  return { base: Math.max(0, base), due: belowNisab ? 0 : Math.max(0, base) * 0.025, belowNisab };
}
