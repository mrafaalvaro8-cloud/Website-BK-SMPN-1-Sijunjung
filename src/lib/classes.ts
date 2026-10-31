export const CLASSES = [
  { grade: 7, sections: ['A', 'B', 'C', 'D'] },
  { grade: 8, sections: ['A', 'B', 'C', 'D'] },
  { grade: 9, sections: ['A', 'B', 'C', 'D', 'E'] },
];

export function getAllClasses(): { id: string; name: string; grade: number; section: string }[] {
  return CLASSES.flatMap(({ grade, sections }) =>
    sections.map((s) => ({
      id: `${grade}${s}`,
      name: `Kelas ${grade}${s}`,
      grade,
      section: s,
    }))
  );
}

export function getClassLabel(id: string): string {
  const match = id.match(/^(\d)([A-E])$/);
  if (!match) return id;
  return `Kelas ${match[1]}${match[2]}`;
}

export function getClassesByGrade(grade: number): { id: string; name: string }[] {
  const cls = CLASSES.find((c) => c.grade === grade);
  if (!cls) return [];
  return cls.sections.map((s) => ({
    id: `${grade}${s}`,
    name: `Kelas ${grade}${s}`,
  }));
}
