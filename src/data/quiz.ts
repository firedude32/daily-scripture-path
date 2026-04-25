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
      q: "How does Jude describe himself in the opening of the letter?",
      correct: "A servant of Jesus Christ and a brother of James",
      wrong: [
        "An apostle of Jesus Christ",
        "A teacher of the gospel",
        "A bondservant of God and a brother of John",
      ],
    },
    {
      q: "What does Jude say he originally wanted to write about, before changing his focus?",
      correct: "Their common salvation",
      wrong: [
        "The return of Christ",
        "The lives of the apostles",
        "The persecution of the church",
      ],
    },
    {
      q: "Which Old Testament event does Jude use as an example of judgment, where people were destroyed despite being delivered earlier?",
      correct: "The Lord saving a people out of Egypt and later destroying those who did not believe",
      wrong: [
        "The flood in the days of Noah",
        "The destruction of Jericho",
        "The fall of the northern kingdom of Israel",
      ],
    },
    {
      q: "Jude refers to a dispute between the archangel Michael and the devil. What were they disputing about?",
      correct: "The body of Moses",
      wrong: [
        "The throne of heaven",
        "The fate of the angels",
        "The tablets of the law",
      ],
    },
    {
      q: "How does Jude end the letter — what does he ascribe to God?",
      correct: "Glory, majesty, dominion, and authority",
      wrong: [
        "Power, wisdom, and eternal praise",
        "Honor, blessing, and everlasting joy",
        "Mercy, peace, and steadfast love",
      ],
    },
  ],
  "psa-1": [
    {
      q: "Psalm 1 contrasts two kinds of people. How does it describe the blessed person's relationship with the wicked?",
      correct: "The blessed person does not walk, stand, or sit with the wicked, sinners, or mockers",
      wrong: [
        "The blessed person rebukes the wicked and turns them from their ways",
        "The blessed person prays for the wicked and pleads for their salvation",
        "The blessed person warns the wicked of the coming judgment",
      ],
    },
    {
      q: "What does Psalm 1 say the blessed person does day and night?",
      correct: "Meditates on the law of the Lord",
      wrong: [
        "Prays for the people of God",
        "Sings songs of thanksgiving",
        "Studies the deeds of the ancestors",
      ],
    },
    {
      q: "What is the righteous person compared to in Psalm 1?",
      correct: "A tree planted by streams of water",
      wrong: [
        "A lamp burning in a dark place",
        "A house built on a strong foundation",
        "A vineyard tended by the Lord",
      ],
    },
    {
      q: "What is the wicked compared to in Psalm 1?",
      correct: "Chaff that the wind drives away",
      wrong: [
        "A house that collapses in the storm",
        "A field that yields no harvest",
        "A road that leads nowhere",
      ],
    },
    {
      q: "How does Psalm 1 describe the final outcome of the righteous and the wicked?",
      correct: "The Lord watches over the way of the righteous, but the way of the wicked will perish",
      wrong: [
        "The righteous will be blessed in this life and the next, but the wicked will be cursed",
        "The righteous will rule with the Lord, but the wicked will serve them",
        "The righteous will live in peace, but the wicked will live in fear",
      ],
    },
  ],
  "psa-23": [
    {
      q: "How does Psalm 23 begin — what does the psalmist say the Lord is to him?",
      correct: "His shepherd",
      wrong: ["His refuge", "His strength", "His rock"],
    },
    {
      q: "What does the Lord do for the psalmist's soul, according to Psalm 23?",
      correct: "He restores it",
      wrong: ["He purifies it", "He delivers it", "He awakens it"],
    },
    {
      q: "Even when walking through what does the psalmist say he will fear no evil?",
      correct: "The valley of the shadow of death",
      wrong: [
        "The land of his enemies",
        "The fire of judgment",
        "The depths of the sea",
      ],
    },
    {
      q: "What two things does the Lord do for the psalmist in the presence of his enemies?",
      correct: "He prepares a table and anoints his head with oil",
      wrong: [
        "He raises a banner and gives him a sword",
        "He builds a wall and sets a watchman",
        "He sends an angel and shields him from arrows",
      ],
    },
    {
      q: "How does Psalm 23 end — where does the psalmist say he will dwell?",
      correct: "In the house of the Lord forever",
      wrong: [
        "In the city of the Lord all his days",
        "In the courts of the Lord every morning",
        "In the presence of the Lord without ceasing",
      ],
    },
  ],
  "psa-51": [
    {
      q: "What does the psalmist appeal to first when asking for mercy in Psalm 51?",
      correct: "God's steadfast love and abundant mercy",
      wrong: [
        "God's holy name and faithfulness",
        "God's covenant with his fathers",
        "God's promises to the righteous",
      ],
    },
    {
      q: "Against whom does the psalmist say he has sinned, in Psalm 51?",
      correct: "Against God, and God only",
      wrong: [
        "Against God and his neighbor",
        "Against God and the king",
        "Against God and his own soul",
      ],
    },
    {
      q: "What does the psalmist ask God to create in him?",
      correct: "A clean heart and a right spirit",
      wrong: [
        "A pure mind and a humble heart",
        "A new heart and a willing soul",
        "A righteous heart and a faithful spirit",
      ],
    },
    {
      q: "What does the psalmist say God does NOT delight in or take pleasure from, according to Psalm 51?",
      correct: "Sacrifice and burnt offerings",
      wrong: [
        "Vows and solemn promises",
        "The prayers of the proud",
        "Empty words of devotion",
      ],
    },
    {
      q: "According to Psalm 51, what kind of sacrifice will God not despise?",
      correct: "A broken and contrite heart",
      wrong: [
        "A heart that fears the Lord",
        "A spirit that turns from evil",
        "A soul that thirsts for God",
      ],
    },
  ],
  "psa-100": [
    {
      q: "How does Psalm 100 say all the earth should approach the Lord?",
      correct: "With joy and gladness",
      wrong: [
        "With humility and reverence",
        "With sorrow and repentance",
        "With wonder and silence",
      ],
    },
    {
      q: "What does Psalm 100 say about who made us?",
      correct: "It is the Lord who made us, and we did not make ourselves",
      wrong: [
        "It is the Lord who chose us, and we did not choose him first",
        "It is the Lord who called us, and we did not call on him first",
        "It is the Lord who knew us, and we did not know him first",
      ],
    },
    {
      q: "Psalm 100 calls God's people the sheep of what?",
      correct: "His pasture",
      wrong: ["His covenant", "His promise", "His blessing"],
    },
    {
      q: "Psalm 100 instructs us to enter God's gates and courts in what manner?",
      correct: "With thanksgiving and praise",
      wrong: [
        "With offerings and vows",
        "With humility and silence",
        "With trembling and awe",
      ],
    },
    {
      q: "What three qualities of the Lord does Psalm 100 give as the reason for praise?",
      correct: "He is good, his love endures, and his faithfulness continues",
      wrong: [
        "He is holy, his power is great, and his name is exalted",
        "He is just, his ways are righteous, and his throne is eternal",
        "He is merciful, his patience is long, and his promises are sure",
      ],
    },
  ],
  "psa-117": [
    {
      q: "Who does Psalm 117 call to praise the Lord?",
      correct: "All nations and all peoples",
      wrong: [
        "All Israel and all the righteous",
        "All who fear the Lord and all who love him",
        "All who serve in his temple and all who worship at his courts",
      ],
    },
    {
      q: "What two qualities of the Lord does Psalm 117 give as the reason to praise him?",
      correct: "His love and his faithfulness",
      wrong: [
        "His power and his glory",
        "His justice and his mercy",
        "His holiness and his truth",
      ],
    },
    {
      q: "How does Psalm 117 describe the Lord's love toward us?",
      correct: "It is great",
      wrong: ["It is patient", "It is gentle", "It is hidden"],
    },
    {
      q: "How long does Psalm 117 say the Lord's faithfulness lasts?",
      correct: "Forever",
      wrong: [
        "From sunrise to sunset",
        "Through every season",
        "For a thousand generations",
      ],
    },
    {
      q: "How does Psalm 117 both open and close?",
      correct: "With a call to praise the Lord",
      wrong: [
        "With a declaration of God's righteousness",
        "With a prayer for help",
        "With a promise of God's deliverance",
      ],
    },
  ],
  "psa-150": [
    {
      q: "Where does Psalm 150 begin its call to praise God?",
      correct: "In his sanctuary, and in the heavens",
      wrong: [
        "In the gates of the city, and on the mountain",
        "In the assembly of the saints, and in the home",
        "In the courts of the king, and in the temple",
      ],
    },
    {
      q: "Psalm 150 says to praise God for his mighty acts and what else?",
      correct: "His surpassing greatness",
      wrong: [
        "His everlasting kindness",
        "His perfect righteousness",
        "His unending patience",
      ],
    },
    {
      q: "What is the main way Psalm 150 says to praise God throughout the chapter?",
      correct: "With many different musical instruments",
      wrong: [
        "With songs of remembrance",
        "With offerings and incense",
        "With words of testimony",
      ],
    },
    {
      q: "Along with instruments, what other form of praise does Psalm 150 mention?",
      correct: "Dancing",
      wrong: ["Bowing", "Marching", "Kneeling"],
    },
    {
      q: "How does Psalm 150 — and the entire book of Psalms — end?",
      correct: "Let everything that has breath praise the Lord",
      wrong: [
        "Let the saints rejoice in their God forever",
        "Let the heavens declare his glory in song",
        "Let all who love the Lord lift up their voices",
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

