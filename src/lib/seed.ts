import { CLASSES } from './classes';

export function getInitialClassData() {
  const classes = [];
  for (const { grade, sections } of CLASSES) {
    for (const section of sections) {
      const id = `${grade}${section}`;
      classes.push({
        id,
        name: `Kelas ${id}`,
        grade,
        section,
      });
    }
  }
  return classes;
}
