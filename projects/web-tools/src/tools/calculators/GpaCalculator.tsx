"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { gpaResult } from "@/lib/calc";
import { formatNum } from "@/lib/format";
import { Card, Note, Row, Stat } from "@/components/ui";

const GRADES: { letter: string; points: number }[] = [
  { letter: "A+", points: 4 },
  { letter: "A", points: 3.75 },
  { letter: "B+", points: 3.5 },
  { letter: "B", points: 3 },
  { letter: "C+", points: 2.5 },
  { letter: "C", points: 2 },
  { letter: "D+", points: 1.5 },
  { letter: "D", points: 1 },
  { letter: "F", points: 0 },
];

interface Row2 {
  credits: string;
  grade: string;
}

export default function GpaCalculator() {
  const { t } = useLang();
  const [rows, setRows] = useState<Row2[]>([
    { credits: "3", grade: "A" },
    { credits: "3", grade: "B+" },
    { credits: "2", grade: "A+" },
  ]);

  const parsed = rows.map((r) => ({
    credits: parseFloat(r.credits) || 0,
    points: GRADES.find((g) => g.letter === r.grade)?.points ?? 0,
  }));
  const res = gpaResult(parsed);

  const update = (i: number, patch: Partial<Row2>) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-start text-slate-500">
              <th className="pb-2 text-start font-semibold">
                {t({ ar: "الساعات المعتمدة", en: "Credit hours" })}
              </th>
              <th className="pb-2 text-start font-semibold">
                {t({ ar: "الدرجة", en: "Grade" })}
              </th>
              <th className="pb-2 text-start font-semibold">
                {t({ ar: "النقاط", en: "Points" })}
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="py-2 pe-2">
                  <input
                    className="inp"
                    type="number"
                    min={0}
                    value={r.credits}
                    onChange={(e) => update(i, { credits: e.target.value })}
                  />
                </td>
                <td className="py-2 pe-2">
                  <select
                    className="inp"
                    value={r.grade}
                    onChange={(e) => update(i, { grade: e.target.value })}
                  >
                    {GRADES.map((g) => (
                      <option key={g.letter} value={g.letter}>
                        {g.letter} ({g.points})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 text-slate-600">
                  {formatNum(parsed[i].points, 2)}
                </td>
                <td className="py-2 text-end">
                  <button
                    type="button"
                    className="btn btn-danger !px-3 !py-1.5"
                    onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}
                    aria-label="remove"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        className="btn btn-soft mt-4"
        onClick={() => setRows((prev) => [...prev, { credits: "3", grade: "B" }])}
      >
        + {t({ ar: "إضافة مادة", en: "Add course" })}
      </button>

      {res ? (
        <div className="mt-6">
          <Row cols={3}>
            <Stat accent label={{ ar: "المعدل التراكمي GPA", en: "GPA" }} value={formatNum(res.gpa, 2)} />
            <Stat label={{ ar: "مجموع الساعات", en: "Total credits" }} value={formatNum(res.totalCredits, 1)} />
            <Stat label={{ ar: "مجموع النقاط", en: "Total points" }} value={formatNum(res.totalPoints, 2)} />
          </Row>
        </div>
      ) : null}

      <div className="mt-6">
        <Note>
          {t({
            ar: "المعدل = مجموع (الساعات × النقاط) ÷ مجموع الساعات — على مقياس 4.0. يمكنك تعديل النقاط حسب نظام جامعتك.",
            en: "GPA = Σ(credits × points) ÷ Σ credits — on a 4.0 scale. Adjust the grade table if your university uses another scale.",
          })}
        </Note>
      </div>
    </Card>
  );
}
