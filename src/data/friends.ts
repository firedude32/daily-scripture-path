// Curated editorial list of partner organizations. Real, not filler.
export interface Resource {
  name: string;
  initials: string;
  description: string;
  url: string;
}

export const RESOURCES: Resource[] = [
  { name: "9Marks", initials: "9M", description: "Practical resources for healthy church life.", url: "https://www.9marks.org" },
  { name: "The Bible Project", initials: "BP", description: "Animated explorations of the biblical story.", url: "https://bibleproject.com" },
  { name: "Ligonier Ministries", initials: "LM", description: "Teaching that helps you grow in your knowledge of God.", url: "https://www.ligonier.org" },
  { name: "Crossway", initials: "CR", description: "Trusted Christian books and study resources.", url: "https://www.crossway.org" },
  { name: "Desiring God", initials: "DG", description: "God-centered resources from John Piper and friends.", url: "https://www.desiringgod.org" },
];
