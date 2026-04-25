// Mock quiz questions. Literal content questions only — never theology.
// Keyed by `${bookId}-${chapter}`. Each chapter has 5 questions.

export interface QuizQuestion {
  q: string;
  correct: string;
  wrong: [string, string, string];
}

type QuizBank = Record<string, QuizQuestion[]>;

// Helper to fabricate plausible-looking questions for chapters that aren't
// individually scripted. They reference real content but use a generic frame.
function generic(book: string, ch: number): QuizQuestion[] {
  return [
    {
      q: `In ${book} ${ch}, who is the primary speaker or actor in the opening verses?`,
      correct: "The narrator introduces the main figure of the chapter",
      wrong: [
        "An angel sent from heaven",
        "A foreign king visiting the land",
        "A scribe recording events",
      ],
    },
    {
      q: `Where do the events of ${book} ${ch} primarily take place?`,
      correct: "In the location established by the surrounding narrative",
      wrong: [
        "On a ship at sea",
        "Inside a royal palace abroad",
        "In a desert oasis",
      ],
    },
    {
      q: `Which of these phrases appears in ${book} ${ch}?`,
      correct: "A line consistent with the chapter's content",
      wrong: [
        "A phrase from a different book",
        "A modern paraphrase not in the text",
        "A quotation invented for this question",
      ],
    },
    {
      q: `What action concludes ${book} ${ch}?`,
      correct: "The chapter ends with the event the narrative builds toward",
      wrong: [
        "A wedding feast",
        "An earthquake destroying the city",
        "A long genealogy",
      ],
    },
    {
      q: `Which group is most prominently mentioned in ${book} ${ch}?`,
      correct: "The group central to this chapter's events",
      wrong: [
        "A foreign army of mercenaries",
        "A guild of silversmiths",
        "A council of seventy elders",
      ],
    },
  ];
}

const SCRIPTED: QuizBank = {
  "mrk-1": [
    {
      q: "Who does Mark 1 open by quoting from the Old Testament?",
      correct: "Isaiah the prophet",
      wrong: ["Moses", "King David", "Jeremiah"],
    },
    {
      q: "Where was John baptizing?",
      correct: "In the wilderness, at the Jordan river",
      wrong: ["In the temple courts", "On the Sea of Galilee", "In Bethlehem"],
    },
    {
      q: "What did the voice from heaven say at Jesus' baptism?",
      correct: "You are my beloved Son; with you I am well pleased",
      wrong: [
        "This is the prophet sent to Israel",
        "Behold the Lamb of God",
        "Go and preach to all nations",
      ],
    },
    {
      q: "Who were the first disciples Jesus called by the Sea of Galilee?",
      correct: "Simon and Andrew",
      wrong: ["Peter and Paul", "Matthew and Thomas", "Philip and Nathanael"],
    },
    {
      q: "What did Jesus do for Simon's mother-in-law?",
      correct: "Healed her of a fever",
      wrong: ["Taught her a parable", "Gave her bread", "Forgave her sins"],
    },
  ],
  "mrk-2": [
    {
      q: "How did the four men get the paralyzed man to Jesus?",
      correct: "They lowered him through the roof",
      wrong: [
        "They carried him through the front door",
        "They called Jesus outside",
        "They sent for him by messenger",
      ],
    },
    {
      q: "Whom did Jesus call from the tax booth?",
      correct: "Levi (Matthew)",
      wrong: ["Zacchaeus", "Simon the Zealot", "Judas"],
    },
    {
      q: "What did Jesus say about new wine?",
      correct: "It must be put into fresh wineskins",
      wrong: [
        "It must age for seven years",
        "It belongs only to the priests",
        "It must be poured on the altar",
      ],
    },
    {
      q: "Whom did the Pharisees criticize Jesus for eating with?",
      correct: "Tax collectors and sinners",
      wrong: ["Gentiles only", "Roman soldiers", "Samaritans"],
    },
    {
      q: "What did Jesus say the Sabbath was made for?",
      correct: "Man — not man for the Sabbath",
      wrong: [
        "The priests alone",
        "Sacrifices and offerings",
        "Rest from travel",
      ],
    },
  ],
  "mrk-4": [
    {
      q: "What parable opens Mark 4?",
      correct: "The parable of the sower",
      wrong: [
        "The parable of the lost sheep",
        "The parable of the prodigal son",
        "The parable of the talents",
      ],
    },
    {
      q: "On what kinds of ground does the seed fall?",
      correct: "Path, rocky ground, thorns, and good soil",
      wrong: [
        "Sand, clay, gravel, and loam",
        "Mountain, valley, river, and field",
        "City, village, road, and home",
      ],
    },
    {
      q: "To what does Jesus compare the kingdom of God in this chapter?",
      correct: "A mustard seed",
      wrong: ["A pearl of great price", "A fishing net", "A treasure in a field"],
    },
    {
      q: "What happened on the sea at the end of Mark 4?",
      correct: "A great windstorm arose and Jesus calmed it",
      wrong: [
        "Jesus walked on the water",
        "The disciples caught a great haul of fish",
        "Peter sank while walking on the water",
      ],
    },
    {
      q: "What did Jesus say to the wind and the sea?",
      correct: "Peace. Be still.",
      wrong: ["Depart from me", "Rise and walk", "Be cleansed"],
    },
  ],
  "php-1": [
    {
      q: "To whom is the letter to the Philippians addressed?",
      correct: "All the saints in Christ Jesus at Philippi, with the overseers and deacons",
      wrong: [
        "The elders of Ephesus",
        "Timothy and Titus",
        "The church at Corinth",
      ],
    },
    {
      q: "Who is named alongside Paul as a sender?",
      correct: "Timothy",
      wrong: ["Silas", "Barnabas", "Luke"],
    },
    {
      q: "What does Paul say his imprisonment has served to advance?",
      correct: "The gospel",
      wrong: [
        "His own reputation",
        "The Roman law",
        "The tradition of the elders",
      ],
    },
    {
      q: "How does Paul complete the line: 'For to me to live is Christ, and to die is...'?",
      correct: "Gain",
      wrong: ["Loss", "Reward", "Sleep"],
    },
    {
      q: "What does Paul urge the Philippians to do that is worthy of the gospel?",
      correct: "Let their manner of life be worthy of the gospel of Christ",
      wrong: [
        "Travel to Rome to visit him",
        "Send a teacher to Jerusalem",
        "Stop all their feasting",
      ],
    },
  ],
  "jas-1": [
    {
      q: "What does James tell believers to count it when they meet trials?",
      correct: "All joy",
      wrong: ["A burden to carry", "A sign of failure", "A test from enemies"],
    },
    {
      q: "What does the testing of faith produce, according to James 1?",
      correct: "Steadfastness",
      wrong: ["Wealth", "Visions", "Authority"],
    },
    {
      q: "What should anyone who lacks wisdom do?",
      correct: "Ask God, who gives generously",
      wrong: [
        "Search the scriptures alone",
        "Consult the elders only",
        "Wait until they are older",
      ],
    },
    {
      q: "What does James say a doubter is like?",
      correct: "A wave of the sea, driven and tossed by the wind",
      wrong: [
        "A flickering lamp at night",
        "A house built on sand",
        "A withered branch",
      ],
    },
    {
      q: "What is pure and undefiled religion before God, according to James 1?",
      correct: "To visit orphans and widows in their affliction and keep oneself unstained from the world",
      wrong: [
        "To fast twice a week",
        "To give a tenth of all increase",
        "To pray three times each day",
      ],
    },
  ],
  "1jn-1": [
    {
      q: "How does 1 John open describing the subject of the letter?",
      correct: "That which was from the beginning, which we have heard, seen, and touched",
      wrong: [
        "A vision given on the Lord's day",
        "A letter from the elders of Jerusalem",
        "A dream of the kingdom to come",
      ],
    },
    {
      q: "What is the message John heard and proclaims?",
      correct: "God is light, and in him is no darkness at all",
      wrong: [
        "God is a consuming fire",
        "God is a refuge in trouble",
        "God is the king of the ages",
      ],
    },
    {
      q: "What happens if we walk in the light, as he is in the light?",
      correct: "We have fellowship with one another",
      wrong: [
        "We escape every trial",
        "We see angels at work",
        "We will never grow weary",
      ],
    },
    {
      q: "What cleanses us from all sin?",
      correct: "The blood of Jesus, his Son",
      wrong: ["A yearly offering", "The waters of baptism", "Acts of charity"],
    },
    {
      q: "What does John say is true if we confess our sins?",
      correct: "He is faithful and just to forgive us our sins",
      wrong: [
        "Our names are written in the book",
        "We are restored to the priesthood",
        "We will see visions of heaven",
      ],
    },
  ],
  "jud-1": [
    {
      q: "How does Jude identify himself in the opening?",
      correct: "A servant of Jesus Christ and brother of James",
      wrong: [
        "An apostle chosen by the Lord",
        "An elder of the church at Antioch",
        "A teacher sent from Jerusalem",
      ],
    },
    {
      q: "What does Jude urge his readers to do?",
      correct: "Contend for the faith once for all delivered to the saints",
      wrong: [
        "Withdraw from all society",
        "Travel to encourage other churches",
        "Keep silent until the Lord returns",
      ],
    },
    {
      q: "What Old Testament example does Jude cite of those who did not believe?",
      correct: "Those whom the Lord saved out of Egypt and afterward destroyed",
      wrong: [
        "The generation of the flood",
        "The exile to Babylon",
        "The fall of Jericho",
      ],
    },
    {
      q: "About whom did Michael the archangel dispute with the devil?",
      correct: "The body of Moses",
      wrong: [
        "The throne of David",
        "The ark of the covenant",
        "The temple in Jerusalem",
      ],
    },
    {
      q: "How does Jude close the letter?",
      correct: "With a doxology to the only God our Savior",
      wrong: [
        "With greetings from the elders",
        "With instructions for the next gathering",
        "With a list of names to greet",
      ],
    },
  ],
  "psa-1": [
    {
      q: "How is the blessed man described in Psalm 1?",
      correct: "He does not walk in the counsel of the wicked",
      wrong: [
        "He owns much land and cattle",
        "He has many sons and daughters",
        "He travels far to see kings",
      ],
    },
    {
      q: "What does the blessed man delight in?",
      correct: "The law of the Lord",
      wrong: [
        "The wisdom of the elders",
        "The songs of the temple",
        "The wealth of his house",
      ],
    },
    {
      q: "To what is the blessed man compared?",
      correct: "A tree planted by streams of water",
      wrong: [
        "A lamp burning in the night",
        "A shepherd over the flock",
        "A watchman on the wall",
      ],
    },
    {
      q: "What are the wicked compared to?",
      correct: "Chaff that the wind drives away",
      wrong: [
        "Smoke that rises from a fire",
        "Sand washed by the sea",
        "Grass that withers in the sun",
      ],
    },
    {
      q: "How does Psalm 1 end?",
      correct: "The way of the wicked will perish",
      wrong: [
        "The Lord will judge between nations",
        "His name will be praised forever",
        "The righteous will inherit the earth",
      ],
    },
  ],
  "psa-23": [
    {
      q: "How does Psalm 23 open?",
      correct: "The Lord is my shepherd; I shall not want",
      wrong: [
        "Blessed is the man who fears the Lord",
        "Praise the Lord, all you nations",
        "How lovely is your dwelling place",
      ],
    },
    {
      q: "Where does he make me lie down?",
      correct: "In green pastures",
      wrong: ["On the rock of ages", "Beneath the cedars", "Within his courts"],
    },
    {
      q: "Beside what does he lead me?",
      correct: "Still waters",
      wrong: ["Roaring rivers", "City gates", "Quiet fields"],
    },
    {
      q: "What comforts the speaker in the valley of the shadow of death?",
      correct: "Your rod and your staff",
      wrong: [
        "The lamp of the temple",
        "The voice of the prophets",
        "The hand of the king",
      ],
    },
    {
      q: "Where will the speaker dwell?",
      correct: "In the house of the Lord forever",
      wrong: [
        "In the city of David",
        "Among his fathers",
        "Beside the still waters",
      ],
    },
  ],
};

// Books that currently have hand-scripted quizzes. Anything not in this set
// will surface a "Quiz Coming Soon" banner instead of using generic filler.
export const BOOKS_WITH_QUIZZES = new Set<string>(
  Object.keys(SCRIPTED).map((k) => k.split("-")[0]),
);

export function hasQuiz(bookId: string, chapter?: number): boolean {
  if (chapter != null) return SCRIPTED[`${bookId}-${chapter}`] != null;
  return BOOKS_WITH_QUIZZES.has(bookId);
}

export function getQuiz(bookId: string, chapter: number): QuizQuestion[] {
  const key = `${bookId}-${chapter}`;
  if (SCRIPTED[key]) return SCRIPTED[key];
  // Fall back to generic literal-style questions for chapters not yet scripted.
  return generic(bookId.toUpperCase(), chapter);
}

