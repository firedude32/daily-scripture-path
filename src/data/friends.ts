export interface Friend {
  id: string;
  name: string;
  initials: string;
  streak: number;
  weeklyChapters: number;
  rank: string;
  booksCompleted: number;
}

export const FRIENDS: Friend[] = [
  { id: "f1", name: "Hannah Ruiz", initials: "HR", streak: 41, weeklyChapters: 18, rank: "Disciple", booksCompleted: 9 },
  { id: "f2", name: "Marcus Lee", initials: "ML", streak: 12, weeklyChapters: 7, rank: "Student", booksCompleted: 3 },
  { id: "f3", name: "Priya Anand", initials: "PA", streak: 87, weeklyChapters: 21, rank: "Steadfast", booksCompleted: 24 },
  { id: "f4", name: "Caleb Werner", initials: "CW", streak: 5, weeklyChapters: 4, rank: "Seeker", booksCompleted: 1 },
  { id: "f5", name: "Naomi Park", initials: "NP", streak: 156, weeklyChapters: 28, rank: "Scholar", booksCompleted: 47 },
  { id: "f6", name: "Jonas Albright", initials: "JA", streak: 22, weeklyChapters: 11, rank: "Faithful", booksCompleted: 7 },
];

export interface Group {
  id: string;
  name: string;
  members: { name: string; initials: string; weeklyChapters: number; streak: number }[];
}

export const GROUPS: Group[] = [
  {
    id: "g1",
    name: "Tuesday Night Youth",
    members: [
      { name: "You", initials: "YO", weeklyChapters: 14, streak: 23 },
      { name: "Hannah Ruiz", initials: "HR", weeklyChapters: 18, streak: 41 },
      { name: "Priya Anand", initials: "PA", weeklyChapters: 21, streak: 87 },
      { name: "Marcus Lee", initials: "ML", weeklyChapters: 7, streak: 12 },
      { name: "Caleb Werner", initials: "CW", weeklyChapters: 4, streak: 5 },
      { name: "Jonas Albright", initials: "JA", weeklyChapters: 11, streak: 22 },
      { name: "Sara Mendez", initials: "SM", weeklyChapters: 9, streak: 14 },
      { name: "Theo Park", initials: "TP", weeklyChapters: 6, streak: 8 },
    ],
  },
];

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
  { name: "Daily Disciple", initials: "DD", description: "Short reflections to start your morning.", url: "#" },
  { name: "Crossway", initials: "CR", description: "Trusted Christian books and study resources.", url: "https://www.crossway.org" },
  { name: "Desiring God", initials: "DG", description: "God-centered resources from John Piper and friends.", url: "https://www.desiringgod.org" },
];
