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
  "mat-1": [
    {
      q: "In the genealogy of Jesus, how many generations are listed from the Babylonian deportation to the Christ?",
      correct: "Fourteen",
      wrong: [
        "Twelve",
        "Forty",
        "Seven",
      ],
    },
    {
      q: "Who is listed as the father of Joseph, the husband of Mary?",
      correct: "Jacob",
      wrong: [
        "Heli",
        "Matthan",
        "Eleazar",
      ],
    },
    {
      q: "When Mary was found to be with child, what did Joseph resolve to do before the angel appeared to him?",
      correct: "Divorce her quietly",
      wrong: [
        "Have her stoned according to the law",
        "Send her away to live with her relatives",
        "Flee with her to Egypt immediately",
      ],
    },
    {
      q: "According to the angel's message to Joseph, what does the name 'Emmanuel' mean?",
      correct: "God with us",
      wrong: [
        "He will save his people",
        "The anointed one",
        "Son of the Most High",
      ],
    },
    {
      q: "What did Joseph do immediately after waking up from his dream where the angel spoke to him?",
      correct: "He did as the angel commanded and took Mary as his wife",
      wrong: [
        "He went to the temple to offer a sacrifice",
        "He went to Bethlehem to register for the census",
        "He told Mary's family about the vision",
      ],
    },
  ],
  "mat-2": [
    {
      q: "Where did the wise men go first to ask about the one born king of the Jews?",
      correct: "Jerusalem",
      wrong: [
        "Bethlehem",
        "Nazareth",
        "Capernaum",
      ],
    },
    {
      q: "What warning did the wise men receive in a dream after seeing Jesus?",
      correct: "Not to return to Herod",
      wrong: [
        "Not to travel by night",
        "To leave their gifts at the temple",
        "To flee to Egypt with the family",
      ],
    },
    {
      q: "When Joseph fled to Egypt with Mary and Jesus, how long did the angel tell him to remain there?",
      correct: "Until the angel told him to leave",
      wrong: [
        "For three years",
        "Until Jesus was twelve years old",
        "Until the census was completed",
      ],
    },
    {
      q: "To fulfill what was spoken by the prophet Jeremiah, a voice was heard in Ramah weeping and loud lamentation. Who was weeping for her children?",
      correct: "Rachel",
      wrong: [
        "Leah",
        "Sarah",
        "Rebekah",
      ],
    },
    {
      q: "Why did Joseph withdraw to the district of Galilee and settle in Nazareth rather than staying in Judea upon his return from Egypt?",
      correct: "He heard Archelaus was reigning over Judea in place of his father Herod",
      wrong: [
        "The angel told him Nazareth was safer from the Romans",
        "Mary's family requested they return to Galilee",
        "He could not find work as a carpenter in Judea",
      ],
    },
  ],
  "mat-3": [
    {
      q: "What did John the Baptist wear while preaching in the wilderness of Judea?",
      correct: "A garment of camel's hair and a leather belt",
      wrong: [
        "Fine linen clothing from the temple",
        "A woolen tunic with a purple sash",
        "A robe of woven sheepskin",
      ],
    },
    {
      q: "What did John the Baptist eat while in the wilderness?",
      correct: "Locusts and wild honey",
      wrong: [
        "Unleavened bread and fish",
        "Figs and dates",
        "Manna and quail",
      ],
    },
    {
      q: "What did John the Baptist call the Pharisees and Sadducees when he saw them coming to his baptism?",
      correct: "A brood of vipers",
      wrong: [
        "Hypocrites and blind guides",
        "White-washed tombs",
        "Children of the devil",
      ],
    },
    {
      q: "John the Baptist said that while he baptizes with water for repentance, the one coming after him will baptize with what?",
      correct: "The Holy Spirit and fire",
      wrong: [
        "Living water",
        "The blood of the new covenant",
        "Grace and truth",
      ],
    },
    {
      q: "When Jesus came from Galilee to the Jordan to be baptized, what was John's initial response?",
      correct: "He prevented him, saying he needed to be baptized by Jesus",
      wrong: [
        "He rejoiced and baptized him immediately",
        "He asked for a sign that Jesus was the Son of God",
        "He told the crowds to watch the Lamb of God",
      ],
    },
  ],
  "mat-4": [
    {
      q: "In the first temptation in the wilderness, what did the tempter tell Jesus to command the stones to become?",
      correct: "Loaves of bread",
      wrong: [
        "Pure gold",
        "Bread from heaven",
        "Wine for a feast",
      ],
    },
    {
      q: "When the devil took Jesus to the pinnacle of the temple, what did he challenge Jesus to do?",
      correct: "Throw himself down",
      wrong: [
        "Declare himself king to the crowds below",
        "Turn the temple into a palace",
        "Call fire down from heaven",
      ],
    },
    {
      q: "After leaving Nazareth, where did Jesus go and live, which was located by the sea in the territory of Zebulun and Naphtali?",
      correct: "Capernaum",
      wrong: [
        "Bethsaida",
        "Chorazin",
        "Magdala",
      ],
    },
    {
      q: "Who were the first two brothers Jesus called to follow him while walking by the Sea of Galilee?",
      correct: "Simon (Peter) and Andrew",
      wrong: [
        "James and John",
        "Philip and Bartholomew",
        "Thomas and Matthew",
      ],
    },
    {
      q: "What were James the son of Zebedee and his brother John doing when Jesus called them?",
      correct: "Mending their nets in the boat with their father",
      wrong: [
        "Casting a net into the sea",
        "Counting the fish they had caught",
        "Washing their nets on the shore",
      ],
    },
  ],
  "mat-5": [
    {
      q: "In the Beatitudes, what is promised to the meek?",
      correct: "They shall inherit the earth",
      wrong: [
        "They shall see God",
        "They shall be called sons of God",
        "Theirs is the kingdom of heaven",
      ],
    },
    {
      q: "Jesus says that if your right eye causes you to sin, you should tear it out and throw it away. What reason does he give for this?",
      correct: "It is better to lose one of your members than that your whole body be thrown into hell",
      wrong: [
        "It is better to be blind in this life and see in the next",
        "The eye is the lamp of the body and must be kept pure",
        "God prefers a maimed body to a sinful soul",
      ],
    },
    {
      q: "Regarding oaths, Jesus commands his listeners to let their 'yes' be yes and their 'no' be no. What does he say anything more than this comes from?",
      correct: "The evil one",
      wrong: [
        "A deceitful heart",
        "The traditions of men",
        "A lack of faith",
      ],
    },
    {
      q: "How does Jesus command his followers to respond to someone who slaps them on the right cheek?",
      correct: "Turn to him the other also",
      wrong: [
        "Flee from him immediately",
        "Rebuke him in the name of the Lord",
        "Forgive him seventy times seven times",
      ],
    },
    {
      q: "Why does Jesus say his followers should love their enemies and pray for those who persecute them?",
      correct: "So that they may be sons of their Father who is in heaven",
      wrong: [
        "Because vengeance belongs only to the Lord",
        "So that their enemies will repent and be saved",
        "Because the Law of Moses commands it",
      ],
    },
  ],
  "mat-6": [
    {
      q: "When giving to the needy, what does Jesus say you should not let your left hand know?",
      correct: "What your right hand is doing",
      wrong: [
        "Who you are giving the money to",
        "How much you have in your purse",
        "That you are giving out of your poverty",
      ],
    },
    {
      q: "In the Lord's Prayer, what condition is attached to the request, 'forgive us our debts'?",
      correct: "As we also have forgiven our debtors",
      wrong: [
        "According to your great mercy",
        "As we repent of our sins",
        "Because we know not what we do",
      ],
    },
    {
      q: "When fasting, what does Jesus instruct his followers to do so that their fasting may not be seen by others?",
      correct: "Anoint your head and wash your face",
      wrong: [
        "Wear your normal clothing and speak cheerfully",
        "Go into your room and shut the door",
        "Eat a small piece of bread in secret",
      ],
    },
    {
      q: "Where does Jesus say thieves break in and steal?",
      correct: "Where treasures are laid up on earth",
      wrong: [
        "In the houses of the rich and powerful",
        "Where men trust in their own wealth",
        "In the markets and the temples",
      ],
    },
    {
      q: "According to Jesus, what two masters can you not serve simultaneously?",
      correct: "God and money",
      wrong: [
        "The law and grace",
        "Your flesh and the Spirit",
        "The world and the kingdom",
      ],
    },
  ],
  "mat-7": [
    {
      q: "Why does Jesus say you should first take the log out of your own eye?",
      correct: "So that you will see clearly to take the speck out of your brother's eye",
      wrong: [
        "Because the log will cause you to stumble in the dark",
        "So that the Father will forgive your own sins",
        "Because the hypocrites judge others while blind",
      ],
    },
    {
      q: "What does Jesus say will happen if you throw your pearls before pigs?",
      correct: "They will trample them underfoot and turn to attack you",
      wrong: [
        "They will eat them and choke on them",
        "They will leave them in the mud and ignore them",
        "They will ruin the pearls and demand food",
      ],
    },
    {
      q: "In the Sermon on the Mount, what teaching does Jesus explicitly say 'is the Law and the Prophets'?",
      correct: "Whatever you wish that others would do to you, do also to them",
      wrong: [
        "You shall love the Lord your God with all your heart",
        "To do justice, and to love kindness, and to walk humbly",
        "Love your neighbor as yourself",
      ],
    },
    {
      q: "How does Jesus describe the gate and the way that leads to life?",
      correct: "The gate is narrow and the way is hard",
      wrong: [
        "The gate is hidden and the way is steep",
        "The gate is small and the way is lonely",
        "The gate is guarded and the way is long",
      ],
    },
    {
      q: "To whom does Jesus compare everyone who hears his words and does not do them?",
      correct: "A foolish man who built his house on the sand",
      wrong: [
        "A servant who hid his talent in the ground",
        "A branch that bears no fruit and is thrown into the fire",
        "A builder who did not calculate the cost of the tower",
      ],
    },
  ],
  "mat-8": [
    {
      q: "What did Jesus do immediately before saying to the leper, 'I will; be clean'?",
      correct: "He stretched out his hand and touched him",
      wrong: [
        "He looked up to heaven and sighed",
        "He spat on the ground and made mud",
        "He asked the man if he believed",
      ],
    },
    {
      q: "Where was Jesus when a centurion came forward to him, appealing to him for his paralyzed servant?",
      correct: "Capernaum",
      wrong: [
        "Nazareth",
        "Bethsaida",
        "Jerusalem",
      ],
    },
    {
      q: "What did Peter's mother-in-law do immediately after Jesus touched her hand and the fever left her?",
      correct: "She rose and began to serve him",
      wrong: [
        "She fell at his feet and worshipped him",
        "She went to the market to buy food",
        "She went out and proclaimed the healing to the town",
      ],
    },
    {
      q: "What did Jesus say to his disciples before he stood up and rebuked the winds and the sea?",
      correct: "Why are you afraid, O you of little faith?",
      wrong: [
        "Do you still not understand?",
        "Peace, be still.",
        "Where is your faith?",
      ],
    },
    {
      q: "When Jesus encountered the two demon-possessed men in the country of the Gadarenes, what did the demons beg Jesus to do?",
      correct: "Send them into the herd of pigs",
      wrong: [
        "Send them into the abyss",
        "Allow them to remain in the region",
        "Not torment them before the time",
      ],
    },
  ],
  "mat-9": [
    {
      q: "What did the scribes say to themselves when Jesus told the paralytic, 'Take heart, my son; your sins are forgiven'?",
      correct: "This man is blaspheming.",
      wrong: [
        "Who can forgive sins but God alone?",
        "He speaks with authority.",
        "By what power does he do this?",
      ],
    },
    {
      q: "Where was Matthew sitting when Jesus saw him and said, 'Follow me'?",
      correct: "At the tax booth",
      wrong: [
        "In the synagogue",
        "By the Sea of Galilee",
        "Under a fig tree",
      ],
    },
    {
      q: "Who came to Jesus asking, 'Why do we and the Pharisees fast, but your disciples do not fast?'",
      correct: "The disciples of John",
      wrong: [
        "The Pharisees themselves",
        "The scribes from Jerusalem",
        "The chief priests",
      ],
    },
    {
      q: "How long had the woman who touched the fringe of Jesus' garment suffered from a discharge of blood?",
      correct: "Twelve years",
      wrong: [
        "Eighteen years",
        "Ten years",
        "Seven years",
      ],
    },
    {
      q: "According to Jesus, why should the disciples pray earnestly to the Lord of the harvest?",
      correct: "To send out laborers into his harvest",
      wrong: [
        "To provide rain for the crops",
        "To protect the sheep from wolves",
        "To gather the wheat into his barn",
      ],
    },
  ],
  "mat-10": [
    {
      q: "When Jesus listed the names of the twelve apostles, who was named first?",
      correct: "Simon (who is called Peter)",
      wrong: [
        "James the son of Zebedee",
        "John the brother of James",
        "Andrew the brother of Simon",
      ],
    },
    {
      q: "Where did Jesus command the twelve apostles NOT to go when he sent them out?",
      correct: "Among the Gentiles or any town of the Samaritans",
      wrong: [
        "Into the wilderness or the regions of the Decapolis",
        "To the chief priests or the scribes",
        "Into the region of Judea or the city of Jerusalem",
      ],
    },
    {
      q: "What does Jesus say the disciples should do when they are persecuted in one town?",
      correct: "Flee to the next",
      wrong: [
        "Stand firm and preach boldly",
        "Shake the dust off their feet",
        "Rejoice and be glad",
      ],
    },
    {
      q: "Whom did Jesus tell his disciples they should fear?",
      correct: "Him who can destroy both soul and body in hell",
      wrong: [
        "Those who kill the body but cannot kill the soul",
        "The rulers of the synagogues",
        "The scribes and Pharisees",
      ],
    },
    {
      q: "What reward does Jesus say is guaranteed for whoever gives one of these little ones even a cup of cold water because he is a disciple?",
      correct: "He will by no means lose his reward",
      wrong: [
        "He will receive a prophet's reward",
        "He will be called great in the kingdom of heaven",
        "He will inherit eternal life",
      ],
    },
  ],
  "mat-11": [
    {
      q: "Where was John the Baptist when he heard about the deeds of the Christ and sent word by his disciples?",
      correct: "In prison",
      wrong: [
        "In the wilderness of Judea",
        "At the Jordan River",
        "In the region of Galilee",
      ],
    },
    {
      q: "When speaking to the crowds about John, what did Jesus ask if they had gone out into the wilderness to see?",
      correct: "A reed shaken by the wind",
      wrong: [
        "A prophet greater than Moses",
        "A man speaking in tongues",
        "A voice crying in the wilderness",
      ],
    },
    {
      q: "Which city did Jesus say would be brought down to Hades, even though it was exalted to heaven?",
      correct: "Capernaum",
      wrong: [
        "Chorazin",
        "Bethsaida",
        "Jerusalem",
      ],
    },
    {
      q: "What does Jesus invite those who labor and are heavy laden to take upon themselves?",
      correct: "His yoke",
      wrong: [
        "His cross",
        "His spirit",
        "His law",
      ],
    },
    {
      q: "How does Jesus describe his yoke and his burden?",
      correct: "His yoke is easy, and his burden is light",
      wrong: [
        "His yoke is truth, and his burden is grace",
        "His yoke is heavy, but his burden gives life",
        "His yoke is righteous, and his burden is just",
      ],
    },
  ],
  "mat-12": [
    {
      q: "What did Jesus' disciples do on the Sabbath that caused the Pharisees to say they were doing what is not lawful?",
      correct: "They plucked heads of grain and ate them",
      wrong: [
        "They carried their sleeping mats",
        "They drew water from a well",
        "They healed a man with a withered hand",
      ],
    },
    {
      q: "When asked if it is lawful to heal on the Sabbath, what animal did Jesus use in his example to the Pharisees?",
      correct: "A sheep that falls into a pit",
      wrong: [
        "An ox that wanders away",
        "A donkey tied to a post",
        "A dove sold in the temple",
      ],
    },
    {
      q: "By whom did the Pharisees claim Jesus cast out demons?",
      correct: "Beelzebul, the prince of demons",
      wrong: [
        "The spirit of divination",
        "The ruler of this world",
        "Satan, the adversary",
      ],
    },
    {
      q: "What is the only sign Jesus said would be given to an evil and adulterous generation?",
      correct: "The sign of the prophet Jonah",
      wrong: [
        "The sign of the son of man in heaven",
        "The sign of bread from heaven",
        "The sign of a voice from the clouds",
      ],
    },
    {
      q: "While Jesus was still speaking to the people, who did he say is his brother and sister and mother?",
      correct: "Whoever does the will of his Father in heaven",
      wrong: [
        "Those who hear the word of God and keep it",
        "Whoever believes in the Son of Man",
        "His disciples who followed him from Galilee",
      ],
    },
  ],
  "mat-13": [
    {
      q: "In the parable of the sower, what happened to the seeds that fell along the path?",
      correct: "The birds came and devoured them",
      wrong: [
        "The sun rose and scorched them",
        "The thorns grew up and choked them",
        "The wind blew them away",
      ],
    },
    {
      q: "Whose prophecy did Jesus say was fulfilled in the people who hear but never understand, and see but never perceive?",
      correct: "Isaiah",
      wrong: [
        "Jeremiah",
        "Ezekiel",
        "Daniel",
      ],
    },
    {
      q: "In the parable of the weeds, why did the master tell his servants not to gather the weeds before the harvest?",
      correct: "Lest in gathering the weeds they root up the wheat along with them",
      wrong: [
        "Because the weeds were too deeply rooted in the soil",
        "Because the harvest time had not yet been proclaimed",
        "Lest the enemy return and sow more seeds in the night",
      ],
    },
    {
      q: "In the parable of the leaven, to how much flour did the woman add leaven until it was all leavened?",
      correct: "Three measures",
      wrong: [
        "Seven measures",
        "Ten measures",
        "Two measures",
      ],
    },
    {
      q: "In the parable of the pearl of great value, what did the merchant do upon finding it?",
      correct: "He went and sold all that he had and bought it",
      wrong: [
        "He hid it in a field and rejoiced",
        "He gathered his friends to show them his treasure",
        "He traded his other fine pearls for it",
      ],
    },
  ],
  "mat-14": [
    {
      q: "Why did Herod originally hesitate to put John the Baptist to death?",
      correct: "He feared the people, because they held him to be a prophet",
      wrong: [
        "He liked to listen to John's preaching",
        "He feared his wife Herodias",
        "He was warned in a dream not to harm him",
      ],
    },
    {
      q: "How much food did the disciples say they had before Jesus fed the five thousand?",
      correct: "Five loaves and two fish",
      wrong: [
        "Seven loaves and a few small fish",
        "Two loaves and five fish",
        "Three loaves and a piece of honeycomb",
      ],
    },
    {
      q: "During what part of the night did Jesus come to the disciples, walking on the sea?",
      correct: "In the fourth watch of the night",
      wrong: [
        "In the second watch of the night",
        "At the midnight hour",
        "At the breaking of dawn",
      ],
    },
    {
      q: "What caused Peter to become afraid and begin to sink while walking on the water toward Jesus?",
      correct: "He saw the wind",
      wrong: [
        "He saw the waves crashing over the boat",
        "He looked down at the dark water",
        "He heard thunder in the distance",
      ],
    },
    {
      q: "When the men of Gennesaret brought all who were sick to Jesus, what did they beg him to let them touch?",
      correct: "Only the fringe of his garment",
      wrong: [
        "The hem of his cloak",
        "His hands and his feet",
        "The staff in his hand",
      ],
    },
  ],
  "mat-15": [
    {
      q: "Why did Jesus rebuke the Pharisees and scribes from Jerusalem regarding the tradition of the elders?",
      correct: "Because they broke the commandment of God for the sake of their tradition",
      wrong: [
        "Because they washed the outside of the cup but left the inside dirty",
        "Because they neglected justice and mercy while tithing mint and dill",
        "Because they made broad their phylacteries and loved the best seats",
      ],
    },
    {
      q: "According to Jesus, what actually defiles a person?",
      correct: "What comes out of the mouth",
      wrong: [
        "Eating with unwashed hands",
        "Failing to observe the Sabbath rest",
        "What goes into the mouth",
      ],
    },
    {
      q: "How did the Canaanite woman reply when Jesus said, 'It is not right to take the children's bread and throw it to the dogs'?",
      correct: "Yes, Lord, yet even the dogs eat the crumbs that fall from their masters' table.",
      wrong: [
        "Lord, you have the words of eternal life.",
        "Even the dogs are cared for by the Good Shepherd.",
        "Lord, I am not worthy to have you come under my roof.",
      ],
    },
    {
      q: "Before feeding the four thousand, how many loaves of bread did the disciples tell Jesus they had?",
      correct: "Seven, and a few small fish",
      wrong: [
        "Five, and two fish",
        "Three loaves and a piece of honeycomb",
        "Twelve, one for each tribe of Israel",
      ],
    },
    {
      q: "After the crowd of four thousand ate and were satisfied, how many baskets of broken pieces were collected?",
      correct: "Seven",
      wrong: [
        "Twelve",
        "Ten",
        "Three",
      ],
    },
  ],
  "mat-16": [
    {
      q: "When the Pharisees and Sadducees asked Jesus to show them a sign from heaven, what sign did Jesus say would be given to them?",
      correct: "The sign of Jonah",
      wrong: [
        "The sign of the Son of Man",
        "The sign of Elijah",
        "The sign of the temple rebuilt in three days",
      ],
    },
    {
      q: "What did Jesus mean when he warned his disciples to beware of the 'leaven of the Pharisees and Sadducees'?",
      correct: "The teaching of the Pharisees and Sadducees",
      wrong: [
        "The bread baked by the Pharisees and Sadducees",
        "The hypocrisy of the Pharisees and Sadducees",
        "The wealth of the Pharisees and Sadducees",
      ],
    },
    {
      q: "When Jesus asked his disciples, 'Who do people say that the Son of Man is?', which of the following was NOT an answer they reported?",
      correct: "Moses",
      wrong: [
        "John the Baptist",
        "Elijah",
        "Jeremiah",
      ],
    },
    {
      q: "After Peter confessed that Jesus is the Christ, the Son of the living God, what did Jesus promise to give him?",
      correct: "The keys of the kingdom of heaven",
      wrong: [
        "A crown of righteousness",
        "The sword of the Spirit",
        "A throne next to his own",
      ],
    },
    {
      q: "What did Jesus say a person must do if they want to come after him?",
      correct: "Deny himself and take up his cross and follow him",
      wrong: [
        "Sell all his possessions and give to the poor",
        "Leave his father and mother and hate his own life",
        "Keep the commandments and love his neighbor",
      ],
    },
  ],
  "mat-17": [
    {
      q: "Which disciples did Jesus take with him up the high mountain where he was transfigured?",
      correct: "Peter, James, and John his brother",
      wrong: [
        "Peter, Andrew, and Philip",
        "James, John, and Matthew",
        "Peter, Thomas, and Judas Iscariot",
      ],
    },
    {
      q: "Who appeared to the disciples, talking with Jesus during the transfiguration?",
      correct: "Moses and Elijah",
      wrong: [
        "Abraham and Isaac",
        "Enoch and Elijah",
        "David and Solomon",
      ],
    },
    {
      q: "Why did Jesus say the disciples could not cast the demon out of the epileptic boy?",
      correct: "Because of their little faith",
      wrong: [
        "Because this kind never comes out except by prayer and fasting",
        "Because they had not yet received the Holy Spirit",
        "Because the boy's father doubted",
      ],
    },
    {
      q: "Where did Jesus tell Peter he would find the shekel to pay the two-drachma temple tax?",
      correct: "In the mouth of the first fish he caught",
      wrong: [
        "In the money bag carried by Judas",
        "Hidden under a stone near the sea",
        "In the folds of his own cloak",
      ],
    },
    {
      q: "When Jesus told his disciples in Galilee that the Son of Man is about to be delivered into the hands of men and killed, what was their reaction?",
      correct: "They were greatly distressed",
      wrong: [
        "They did not understand what he meant",
        "Peter rebuked him saying 'Far be it from you, Lord!'",
        "They argued about who would be the greatest",
      ],
    },
  ],
  "mat-18": [
    {
      q: "According to Jesus, who is the greatest in the kingdom of heaven?",
      correct: "Whoever humbles himself like this child",
      wrong: [
        "Whoever keeps these commandments and teaches others to do the same",
        "Whoever serves the least of these brothers",
        "Whoever gives up his life for the sake of the gospel",
      ],
    },
    {
      q: "What is the first step Jesus commands a person to take if their brother sins against them?",
      correct: "Go and tell him his fault, between you and him alone",
      wrong: [
        "Take one or two others along with you to witness",
        "Tell it to the church immediately",
        "Forgive him seventy-seven times without speaking of it",
      ],
    },
    {
      q: "In the parable of the unforgiving servant, how much did the first servant owe the king?",
      correct: "Ten thousand talents",
      wrong: [
        "A hundred denarii",
        "Fifty shekels",
        "Five hundred talents",
      ],
    },
    {
      q: "What did the fellow servant, who owed a hundred denarii, do when he was seized and choked by the first servant?",
      correct: "Fell down and pleaded, 'Have patience with me, and I will pay you'",
      wrong: [
        "Promised to sell his wife and children to pay the debt",
        "Fled from the city to avoid being thrown into prison",
        "Cried out to the king for mercy",
      ],
    },
    {
      q: "What does Jesus declare will happen 'if two of you agree on earth about anything they ask'?",
      correct: "It will be done for them by my Father in heaven",
      wrong: [
        "An angel will be sent to fulfill their request",
        "The Holy Spirit will grant them power",
        "They shall receive the keys of the kingdom",
      ],
    },
  ],
  "mat-19": [
    {
      q: "When the Pharisees asked Jesus about divorce, what was the only reason Jesus gave that permits a man to divorce his wife and remarry without committing adultery?",
      correct: "Sexual immorality",
      wrong: [
        "Abandonment",
        "Hardness of heart",
        "Barrenness",
      ],
    },
    {
      q: "What did Jesus say to the disciples when they rebuked the people for bringing little children to him?",
      correct: "Let the little children come to me and do not hinder them, for to such belongs the kingdom of heaven.",
      wrong: [
        "Do not forbid them, for out of the mouth of infants God has perfected praise.",
        "Unless you turn and become like children, you will never enter the kingdom of heaven.",
        "Whoever receives one such child in my name receives me.",
      ],
    },
    {
      q: "What was the rich young man's response when Jesus told him to sell his possessions, give to the poor, and follow him?",
      correct: "He went away sorrowful, for he had great possessions.",
      wrong: [
        "He promised to give half of his goods to the poor.",
        "He asked, 'Who then can be saved?'",
        "He rejoiced and immediately began selling his property.",
      ],
    },
    {
      q: "What animal did Jesus use in a comparison to illustrate how hard it is for a rich person to enter the kingdom of heaven?",
      correct: "A camel going through the eye of a needle",
      wrong: [
        "A sheep caught in a thicket",
        "A dove flying against the wind",
        "An ox bearing a heavy yoke",
      ],
    },
    {
      q: "What did Jesus promise the apostles that they would do in the new world, when the Son of Man sits on his glorious throne?",
      correct: "Sit on twelve thrones, judging the twelve tribes of Israel",
      wrong: [
        "Rule over the nations with a rod of iron",
        "Become the foundation stones of the new Jerusalem",
        "Eat and drink at his table in his kingdom",
      ],
    },
  ],
  "mat-20": [
    {
      q: "In the parable of the laborers in the vineyard, what wage did the master agree upon with the workers he hired early in the morning?",
      correct: "A denarius a day",
      wrong: [
        "Whatever is right",
        "Two denarii a day",
        "A talent a week",
      ],
    },
    {
      q: "Why did the first group of laborers grumble against the master of the house when they were paid?",
      correct: "Because the master paid the same wage to those who worked only one hour",
      wrong: [
        "Because the master refused to pay them for the time they rested",
        "Because the master paid them less than what was originally agreed",
        "Because the master paid them in different, lesser coins",
      ],
    },
    {
      q: "What did the mother of the sons of Zebedee ask Jesus to do for her sons?",
      correct: "To let them sit at his right and left hand in his kingdom",
      wrong: [
        "To allow them to walk on water as Peter did",
        "To make them the greatest of all the apostles",
        "To protect them from the coming persecution in Jerusalem",
      ],
    },
    {
      q: "According to Jesus, whoever would be great among his disciples must be what?",
      correct: "Your servant",
      wrong: [
        "Like a little child",
        "A teacher of the law",
        "Your master",
      ],
    },
    {
      q: "When two blind men sitting by the roadside heard Jesus passing by, what did they cry out?",
      correct: "Lord, have mercy on us, Son of David!",
      wrong: [
        "Lord, if you will, you can make us see!",
        "Jesus, Master, have pity on us!",
        "Hosanna to the Son of David!",
      ],
    },
  ],
  "mat-21": [
    {
      q: "When approaching Jerusalem, what did Jesus tell two disciples to go into the village and find?",
      correct: "A donkey tied, and a colt with her",
      wrong: [
        "A man carrying a jar of water",
        "An unblemished lamb for the Passover",
        "A guest room that was furnished and ready",
      ],
    },
    {
      q: "What did Jesus do upon entering the temple in Jerusalem?",
      correct: "He drove out all who sold and bought in the temple and overturned tables",
      wrong: [
        "He immediately sat down opposite the treasury and watched the people",
        "He went up to the pinnacle and preached to the crowds below",
        "He offered a sacrifice at the altar for the sins of the people",
      ],
    },
    {
      q: "What happened to the fig tree when Jesus said to it, 'May no fruit ever come from you again!'?",
      correct: "The fig tree withered at once",
      wrong: [
        "Its leaves immediately turned brown and fell to the ground",
        "Its roots dried up, but the branches remained green for a day",
        "The tree split in two from the roots to the branches",
      ],
    },
    {
      q: "In the parable of the two sons, what did the first son do after his father told him to go and work in the vineyard?",
      correct: "He answered, 'I will not,' but afterward he changed his mind and went.",
      wrong: [
        "He answered, 'I go, sir,' but did not go.",
        "He demanded his share of the inheritance instead.",
        "He went to the vineyard but slept in the shade of the vines.",
      ],
    },
    {
      q: "In the parable of the tenants, what did the tenants finally do to the master's son when he was sent to them?",
      correct: "They took him and threw him out of the vineyard and killed him",
      wrong: [
        "They beat him, treated him shamefully, and sent him away empty-handed",
        "They bound him and held him for ransom",
        "They mocked him and forced him to work alongside them",
      ],
    },
  ],
  "mat-22": [
    {
      q: "In the parable of the wedding feast, what did the king do to the man who was not wearing a wedding garment?",
      correct: "Bound him hand and foot and cast him into outer darkness",
      wrong: [
        "Banished him from the city",
        "Made him a servant at the feast",
        "Fined him ten talents of silver",
      ],
    },
    {
      q: "When the Pharisees plotted to entangle Jesus in his words regarding taxes, whose likeness and inscription were on the coin Jesus asked to see?",
      correct: "Caesar's",
      wrong: [
        "Herod's",
        "Pilate's",
        "The high priest's",
      ],
    },
    {
      q: "In the scenario presented by the Sadducees regarding the resurrection, how many brothers married the same woman sequentially?",
      correct: "Seven",
      wrong: [
        "Three",
        "Five",
        "Twelve",
      ],
    },
    {
      q: "When asked by a lawyer which is the great commandment in the Law, which of the following did Jesus state as the first and great commandment?",
      correct: "You shall love the Lord your God with all your heart and with all your soul and with all your mind",
      wrong: [
        "You shall love your neighbor as yourself",
        "You shall have no other gods before me",
        "Remember the Sabbath day, to keep it holy",
      ],
    },
    {
      q: "What question did Jesus ask the Pharisees about the Christ that silenced them and stopped anyone from asking him any more questions?",
      correct: "If David then calls him Lord, how is he his son?",
      wrong: [
        "Why do you seek to kill me when I speak the truth?",
        "Has not Moses given you the law, yet none of you keeps it?",
        "Are you the teachers of Israel and yet you do not understand this?",
      ],
    },
  ],
  "mat-23": [
    {
      q: "What specific practice does Jesus mention the scribes and Pharisees do to make themselves look righteous before others?",
      correct: "They make their phylacteries broad and their fringes long",
      wrong: [
        "They wash their hands in the temple pool daily",
        "They weave their garments with gold and purple thread",
        "They hide their faces under their cloaks in false humility",
      ],
    },
    {
      q: "What title does Jesus instruct his followers not to be called, because they have one teacher and are all brothers?",
      correct: "Rabbi",
      wrong: [
        "Master",
        "Father",
        "Instructor",
      ],
    },
    {
      q: "Jesus criticizes the blind guides who say it means nothing to swear by the gold of the temple. According to Jesus, what actually makes the gold sacred?",
      correct: "The temple that has made the gold sacred",
      wrong: [
        "The altar that holds the gold",
        "The high priest who blesses the gold",
        "The sacrifice offered beside the gold",
      ],
    },
    {
      q: "What three spices did the scribes and Pharisees tithe while neglecting the weightier matters of the law?",
      correct: "Mint and dill and cumin",
      wrong: [
        "Wheat and barley and oil",
        "Olives and figs and grapes",
        "Silver and gold and copper",
      ],
    },
    {
      q: "What animal imagery does Jesus use when lamenting over Jerusalem and his desire to gather her children together?",
      correct: "A hen gathering her brood under her wings",
      wrong: [
        "A shepherd seeking his lost sheep",
        "A lion defending its cubs",
        "An eagle stirring up its nest",
      ],
    },
  ],
  "mat-24": [
    {
      q: "When Jesus left the temple, what did he prophesy concerning its buildings?",
      correct: "There will not be left here one stone upon another that will not be thrown down",
      wrong: [
        "It will be rebuilt in three days by the hands of angels",
        "The glory of the latter house shall be greater than the former",
        "The Gentiles will tread its courts underfoot for forty-two months",
      ],
    },
    {
      q: "Jesus warns that false christs and false prophets will arise and perform great signs and wonders, so as to lead astray, if possible, whom?",
      correct: "Even the elect",
      wrong: [
        "The rulers of the synagogues",
        "The children of Israel",
        "The very angels in heaven",
      ],
    },
    {
      q: "How does Jesus describe the coming of the Son of Man?",
      correct: "As the lightning comes from the east and shines as far as the west",
      wrong: [
        "Like a thief in the night without warning",
        "Like the dawn rising over the mountains of Judea",
        "With the sound of a trumpet echoing through the valleys",
      ],
    },
    {
      q: "In the lesson of the fig tree, what does the tree putting out its leaves indicate?",
      correct: "That summer is near",
      wrong: [
        "That the harvest is ready",
        "That the rainy season has ended",
        "That the master is returning",
      ],
    },
    {
      q: "Concerning the day and hour of the coming of the Son of Man, who does Jesus say knows when it will happen?",
      correct: "Only the Father",
      wrong: [
        "The Father and the Son",
        "The angels in heaven",
        "The prophets of old",
      ],
    },
  ],
  "mat-25": [
    {
      q: "In the parable of the ten virgins, what did the foolish virgins fail to take with them?",
      correct: "Flasks of oil with their lamps",
      wrong: [
        "Extra wicks for their lamps",
        "Wedding garments for the feast",
        "Gifts for the bridegroom",
      ],
    },
    {
      q: "What was the bridegroom's response when the foolish virgins finally arrived and asked him to open the door?",
      correct: "Truly, I say to you, I do not know you.",
      wrong: [
        "Depart from me, you workers of lawlessness.",
        "The feast has already ended.",
        "You were not invited to the wedding.",
      ],
    },
    {
      q: "In the parable of the talents, what did the servant who received one talent do with his money?",
      correct: "He dug in the ground and hid his master's money",
      wrong: [
        "He spent it on riotous living in a far country",
        "He put it in the bank to earn interest",
        "He traded with it but lost it all",
      ],
    },
    {
      q: "What did the master call the servant who hid his single talent?",
      correct: "You wicked and slothful servant!",
      wrong: [
        "You foolish and blind guide!",
        "You hypocrite and thief!",
        "You faithless and perverse generation!",
      ],
    },
    {
      q: "When the Son of Man comes in his glory, how will he separate the people of all nations?",
      correct: "As a shepherd separates the sheep from the goats",
      wrong: [
        "As a farmer separates the wheat from the weeds",
        "As a fisherman sorts the good fish from the bad",
        "As a winnower separates the grain from the chaff",
      ],
    },
  ],
  "mat-26": [
    {
      q: "In whose palace did the chief priests and elders gather to plot Jesus' arrest and death?",
      correct: "Caiaphas",
      wrong: [
        "Annas",
        "Pilate",
        "Herod",
      ],
    },
    {
      q: "When the woman poured the alabaster flask of expensive ointment on Jesus' head in Bethany, what did the disciples say the ointment could have been used for?",
      correct: "Sold for a large sum and given to the poor",
      wrong: [
        "Used to anoint the high priest",
        "Kept for his burial day",
        "Offered as a sacrifice in the temple",
      ],
    },
    {
      q: "What was Jesus' response when Judas asked, 'Is it I, Rabbi?' during the Last Supper?",
      correct: "You have said so.",
      wrong: [
        "It is the one dipping his hand in the dish with me.",
        "What you are going to do, do quickly.",
        "Woe to that man by whom the Son of Man is betrayed!",
      ],
    },
    {
      q: "How many times did Jesus go away to pray in Gethsemane, finding his disciples sleeping each time he returned?",
      correct: "Three times",
      wrong: [
        "Two times",
        "Four times",
        "Seven times",
      ],
    },
    {
      q: "What did the high priest do immediately after Jesus said they would see the Son of Man seated at the right hand of Power and coming on the clouds of heaven?",
      correct: "He tore his robes",
      wrong: [
        "He struck Jesus across the face",
        "He ordered the guards to blindfold him",
        "He spat in Jesus' face",
      ],
    },
  ],
  "mat-27": [
    {
      q: "What did the chief priests buy with the thirty pieces of silver that Judas returned to them?",
      correct: "The potter's field as a burial place for strangers",
      wrong: [
        "A new veil for the temple",
        "Spices and ointments for the burial of the poor",
        "A herd of sheep for the Passover sacrifices",
      ],
    },
    {
      q: "Who was the notorious prisoner that Pilate offered to release to the crowd instead of Jesus?",
      correct: "Barabbas",
      wrong: [
        "Dismas",
        "Gestas",
        "Simon of Cyrene",
      ],
    },
    {
      q: "What did the soldiers offer Jesus to drink when they came to a place called Golgotha?",
      correct: "Wine mixed with gall",
      wrong: [
        "Vinegar mixed with myrrh",
        "Water drawn from a nearby well",
        "Sour wine on a hyssop branch",
      ],
    },
    {
      q: "What miraculous event occurred in the temple at the moment Jesus yielded up his spirit?",
      correct: "The curtain of the temple was torn in two, from top to bottom",
      wrong: [
        "The altar of incense split in half",
        "The veil of the Holy of Holies caught fire",
        "The pillars of the temple shook and cracked",
      ],
    },
    {
      q: "Who asked Pilate for the body of Jesus and laid it in his own new tomb?",
      correct: "Joseph, a rich man from Arimathea",
      wrong: [
        "Nicodemus, a ruler of the Jews",
        "Simon of Cyrene",
        "Mary Magdalene's brother Lazarus",
      ],
    },
  ],
  "mat-28": [
    {
      q: "Who rolled back the stone from the door of the tomb and sat on it?",
      correct: "An angel of the Lord who descended from heaven",
      wrong: [
        "Two men in dazzling apparel",
        "Jesus himself after he awoke",
        "A great earthquake moved the stone",
      ],
    },
    {
      q: "What did the angel tell the women to go quickly and tell the disciples?",
      correct: "That he has risen from the dead, and is going before you to Galilee",
      wrong: [
        "That he will meet them in the upper room in Jerusalem",
        "That they must wait for the promise of the Holy Spirit",
        "That he ascends to his Father and their Father",
      ],
    },
    {
      q: "What did the chief priests give the soldiers, instructing them to say that Jesus' disciples stole him away while they were asleep?",
      correct: "A sufficient sum of money",
      wrong: [
        "Immunity from the governor's punishment",
        "A promise of promotion in the guard",
        "Thirty pieces of silver",
      ],
    },
    {
      q: "Where did the eleven disciples go to meet Jesus as he had directed them?",
      correct: "To Galilee, to the mountain",
      wrong: [
        "To Bethany, near the Mount of Olives",
        "To the Sea of Tiberias",
        "To the upper room in Jerusalem",
      ],
    },
    {
      q: "In the Great Commission, in whose name did Jesus command the disciples to baptize?",
      correct: "In the name of the Father and of the Son and of the Holy Spirit",
      wrong: [
        "In the name of Jesus Christ for the forgiveness of sins",
        "In the name of the Lord of Hosts",
        "In the name of the Most High God",
      ],
    },
  ],
  "mrk-1": [
    {
      q: "According to the prophecy quoted in Mark 1, what will the messenger sent ahead do?",
      correct: "Prepare your way",
      wrong: [
        "Preach repentance",
        "Baptize with water",
        "Make the rough places plain",
      ],
    },
    {
      q: "What was John the Baptist clothed with?",
      correct: "Camel's hair with a leather belt around his waist",
      wrong: [
        "Rough linen and a purple sash",
        "Sheep's clothing",
        "A woven tunic",
      ],
    },
    {
      q: "Immediately after his baptism, what drove Jesus out into the wilderness?",
      correct: "The Spirit",
      wrong: [
        "The devil",
        "A voice from heaven",
        "The crowds",
      ],
    },
    {
      q: "When Jesus saw Simon and Andrew casting a net into the sea, what did he say to them?",
      correct: "\"Follow me, and I will make you become fishers of men.\"",
      wrong: [
        "\"Repent, for the kingdom of God is at hand.\"",
        "\"Leave your nets and follow me.\"",
        "\"Come and see.\"",
      ],
    },
    {
      q: "What did Jesus do early in the morning, while it was still dark, after healing many in Capernaum?",
      correct: "He departed and went out to a desolate place, and there he prayed.",
      wrong: [
        "He gathered his disciples to teach them.",
        "He went to the synagogue to read the scroll.",
        "He crossed over to the other side of the sea.",
      ],
    },
  ],
  "mrk-2": [
    {
      q: "How did the four men bring the paralytic to Jesus when they could not get near him because of the crowd?",
      correct: "They removed the roof above him and let down the bed.",
      wrong: [
        "They waited until evening when the crowd dispersed.",
        "They carried him through a back window.",
        "They asked the disciples to part the crowd for them.",
      ],
    },
    {
      q: "When Jesus saw the faith of the men carrying the paralytic, what did he say to the paralytic first?",
      correct: "\"Son, your sins are forgiven.\"",
      wrong: [
        "\"I say to you, rise, pick up your bed, and go home.\"",
        "\"Do you believe I can heal you?\"",
        "\"Your faith has made you well.\"",
      ],
    },
    {
      q: "Whose house was Jesus dining in when many tax collectors and sinners were reclining with him and his disciples?",
      correct: "Levi's house",
      wrong: [
        "Simon Peter's house",
        "Jairus's house",
        "Zacchaeus's house",
      ],
    },
    {
      q: "According to Jesus, what happens if someone puts new wine into old wineskins?",
      correct: "The wine will burst the skins, and the wine is destroyed, and so are the skins.",
      wrong: [
        "The old wine is better, so the new wine is wasted.",
        "The skins will stretch and the wine will turn sour.",
        "The wine will leak out slowly over time.",
      ],
    },
    {
      q: "What did David and those who were with him eat when they were in need and hungry, according to Jesus' response to the Pharisees?",
      correct: "The bread of the Presence",
      wrong: [
        "Unleavened bread from the Passover",
        "Manna that had been kept in a jar",
        "Grain gleaned from the edges of a field",
      ],
    },
  ],
  "mrk-3": [
    {
      q: "In the synagogue, what did Jesus ask the people before healing the man with a withered hand on the Sabbath?",
      correct: "\"Is it lawful on the Sabbath to do good or to do harm, to save life or to kill?\"",
      wrong: [
        "\"Does not the law permit healing on the Sabbath day?\"",
        "\"Which of you, having a sheep fall into a pit, will not lift it out?\"",
        "\"Who among you is without sin to judge this man?\"",
      ],
    },
    {
      q: "What did Jesus strictly order the unclean spirits not to do when they fell down before him and cried out, \"You are the Son of God!\"?",
      correct: "Make him known",
      wrong: [
        "Enter into the herd of pigs",
        "Speak to his disciples",
        "Return to the people they had possessed",
      ],
    },
    {
      q: "Why did Jesus go up on the mountain and call to him those whom he desired, appointing twelve?",
      correct: "So that they might be with him and he might send them out to preach and have authority to cast out demons.",
      wrong: [
        "So that they could help him feed the multitude.",
        "To teach them the secrets of the kingdom away from the crowds.",
        "To establish them as judges over the twelve tribes.",
      ],
    },
    {
      q: "What did the scribes who came down from Jerusalem claim was the source of Jesus' power to cast out demons?",
      correct: "By the ruler of demons, Beelzebul",
      wrong: [
        "By the spirit of Elijah",
        "By magic learned in Egypt",
        "By an angel of light",
      ],
    },
    {
      q: "When told that his mother and brothers were outside seeking him, who did Jesus say are his mother and brothers?",
      correct: "Whoever does the will of God",
      wrong: [
        "Those who hear the word of God and keep it",
        "His disciples who followed him from the beginning",
        "Those who believe in the Son of Man",
      ],
    },
  ],
  "mrk-4": [
    {
      q: "In the parable of the sower, what happened to the seed that fell on rocky ground?",
      correct: "It sprang up quickly, but when the sun rose it was scorched and withered away because it had no root.",
      wrong: [
        "The birds came and devoured it before it could sprout.",
        "The thorns grew up and choked it, yielding no grain.",
        "It grew but yielded a small harvest because the soil was poor.",
      ],
    },
    {
      q: "According to Jesus' explanation of the sower parable, what are the \"thorns\" that choke the word?",
      correct: "The cares of the world, the deceitfulness of riches, and the desires for other things",
      wrong: [
        "The persecutions and tribulations that arise on account of the word",
        "Satan coming to take away the word that is sown",
        "The false prophets who deceive many",
      ],
    },
    {
      q: "What did Jesus say happens to a lamp that is brought in?",
      correct: "It is put on a stand, not under a basket or a bed.",
      wrong: [
        "It gives light to all who are in the house.",
        "It burns until the oil is gone and then must be refilled.",
        "It is carefully guarded against the wind.",
      ],
    },
    {
      q: "In the parable of the growing seed, what does the earth produce by itself?",
      correct: "The blade, then the ear, then the full grain in the ear",
      wrong: [
        "A great tree in which the birds can nest",
        "Thirtyfold, sixtyfold, and a hundredfold",
        "Weeds among the wheat until the harvest",
      ],
    },
    {
      q: "When a great windstorm arose on the sea, where was Jesus and what was he doing?",
      correct: "He was in the stern, asleep on the cushion.",
      wrong: [
        "He was standing at the bow, praying.",
        "He was teaching the disciples inside the boat.",
        "He was walking on the water toward them.",
      ],
    },
  ],
  "mrk-5": [
    {
      q: "What was the name of the unclean spirit possessing the man in the country of the Gerasenes?",
      correct: "Legion",
      wrong: [
        "Beelzebul",
        "Abaddon",
        "Apollyon",
      ],
    },
    {
      q: "About how many pigs were in the great herd that rushed down the steep bank into the sea and drowned?",
      correct: "Two thousand",
      wrong: [
        "Five thousand",
        "One hundred",
        "Five hundred",
      ],
    },
    {
      q: "What was the position of Jairus, who came to Jesus pleading for his little daughter?",
      correct: "One of the rulers of the synagogue",
      wrong: [
        "A centurion of the Roman guard",
        "A chief tax collector",
        "A Pharisee from Jerusalem",
      ],
    },
    {
      q: "What did Jesus say to the woman who had a discharge of blood for twelve years after she touched his garment and was healed?",
      correct: "\"Daughter, your faith has made you well; go in peace, and be healed of your disease.\"",
      wrong: [
        "\"Woman, great is your faith! Be it done for you as you desire.\"",
        "\"Take heart, daughter; your sins are forgiven.\"",
        "\"Rise and go your way; your faith has saved you.\"",
      ],
    },
    {
      q: "What did Jesus say to the people weeping and wailing loudly at Jairus's house?",
      correct: "\"Why are you making a commotion and weeping? The child is not dead but sleeping.\"",
      wrong: [
        "\"Do not weep, for she will rise again at the last day.\"",
        "\"Have faith, and she will be restored to you.\"",
        "\"Make way, for the Son of Man has power over death.\"",
      ],
    },
  ],
  "mrk-6": [
    {
      q: "What trade did the people of Jesus' hometown associate him with when he taught in their synagogue?",
      correct: "Carpenter",
      wrong: [
        "Fisherman",
        "Tentmaker",
        "Stonemason",
      ],
    },
    {
      q: "When Jesus sent out the Twelve, what was the only thing he instructed them to take for their journey?",
      correct: "A staff",
      wrong: [
        "Bread",
        "A bag",
        "Money in their belts",
      ],
    },
    {
      q: "What did Herod promise the daughter of Herodias after she danced for him?",
      correct: "Whatever she asked, up to half his kingdom",
      wrong: [
        "The head of John the Baptist on a platter",
        "Ten thousand talents of silver",
        "To make her queen in place of her mother",
      ],
    },
    {
      q: "How did the people sit down when Jesus fed the five thousand?",
      correct: "In groups, by hundreds and by fifties",
      wrong: [
        "In circles around the disciples",
        "In rows of twelve",
        "Families together by tribe",
      ],
    },
    {
      q: "About what time of night did Jesus come to the disciples walking on the sea?",
      correct: "The fourth watch of the night",
      wrong: [
        "The second watch of the night",
        "Midnight",
        "Just after sunset",
      ],
    },
  ],
  "mrk-7": [
    {
      q: "The Pharisees and all the Jews do not eat unless they wash their hands in a specific way, holding to the tradition of whom?",
      correct: "The elders",
      wrong: [
        "The priests",
        "Moses",
        "The prophets",
      ],
    },
    {
      q: "Jesus criticized the Pharisees for saying a man does not have to help his parents if his resources are 'Corban'. According to the text, what does 'Corban' mean?",
      correct: "Given to God",
      wrong: [
        "Dedicated to the temple",
        "Sworn by the altar",
        "Set apart for the priests",
      ],
    },
    {
      q: "The woman who asked Jesus to cast a demon out of her daughter was of what nationality?",
      correct: "Syrophoenician by birth",
      wrong: [
        "Samaritan by birth",
        "Egyptian by birth",
        "Canaanite by birth",
      ],
    },
    {
      q: "In the region of the Decapolis, they brought to Jesus a man who was deaf and had what other condition?",
      correct: "He had a speech impediment",
      wrong: [
        "He was blind from birth",
        "He was paralyzed",
        "He had a withered hand",
      ],
    },
    {
      q: "When Jesus healed the deaf man, he looked up to heaven, sighed, and said 'Ephphatha,' which means what?",
      correct: "Be opened",
      wrong: [
        "Be healed",
        "Rise up",
        "Go in peace",
      ],
    },
  ],
  "mrk-8": [
    {
      q: "After feeding the four thousand, how many baskets full of broken pieces were taken up?",
      correct: "Seven",
      wrong: [
        "Twelve",
        "Five",
        "Ten",
      ],
    },
    {
      q: "When the Pharisees came seeking a sign from heaven, what was Jesus' response?",
      correct: "He sighed deeply and said no sign would be given to this generation",
      wrong: [
        "He showed them the sign of Jonah",
        "He told them to look at the sky to read the weather",
        "He healed a blind man in front of them",
      ],
    },
    {
      q: "When Jesus healed the blind man at Bethsaida, what did the man say people looked like when his sight was first partially restored?",
      correct: "Trees walking",
      wrong: [
        "Shadows moving",
        "Men carrying lamps",
        "Angels ascending",
      ],
    },
    {
      q: "When Jesus asked his disciples, 'But who do you say that I am?', who answered and what did he say?",
      correct: "Peter answered, 'You are the Christ.'",
      wrong: [
        "John answered, 'You are the Son of God.'",
        "James answered, 'You are the Prophet.'",
        "Andrew answered, 'You are the Holy One of Israel.'",
      ],
    },
    {
      q: "Why did Jesus rebuke Peter, saying 'Get behind me, Satan!'?",
      correct: "Because Peter was not setting his mind on the things of God, but on the things of man",
      wrong: [
        "Because Peter denied that Jesus would suffer",
        "Because Peter drew his sword",
        "Because Peter fell asleep while Jesus prayed",
      ],
    },
  ],
  "mrk-9": [
    {
      q: "During the Transfiguration, what did Peter suggest they make?",
      correct: "Three tents",
      wrong: [
        "Three altars",
        "Three fires",
        "Three stone pillars",
      ],
    },
    {
      q: "What symptom did the father describe when the spirit seized his son?",
      correct: "It throws him down, and he foams and grinds his teeth and becomes rigid",
      wrong: [
        "He falls into the fire and into the water",
        "He cries out and tears his clothes",
        "He wanders in the tombs and cuts himself",
      ],
    },
    {
      q: "What did the father of the boy with the unclean spirit immediately cry out after Jesus said all things are possible for one who believes?",
      correct: "'I believe; help my unbelief!'",
      wrong: [
        "'Lord, have mercy on my son!'",
        "'If it is your will, you can make him clean!'",
        "'Command the spirit to leave him!'",
      ],
    },
    {
      q: "What had the disciples been arguing about on the way to Capernaum?",
      correct: "Who was the greatest",
      wrong: [
        "When the kingdom would come",
        "Who would sit at his right hand",
        "Why they could not cast out the demon",
      ],
    },
    {
      q: "Jesus says that whoever gives you a cup of water to drink because you belong to Christ will by no means lose what?",
      correct: "His reward",
      wrong: [
        "His salvation",
        "The kingdom of heaven",
        "His soul",
      ],
    },
  ],
  "mrk-10": [
    {
      q: "Jesus taught that whoever divorces his wife and marries another commits adultery. What group initially came up and tested him by asking whether it was lawful for a man to divorce his wife?",
      correct: "Pharisees",
      wrong: [
        "Sadducees",
        "Scribes",
        "Herodians",
      ],
    },
    {
      q: "What was the one thing Jesus told the rich man he lacked?",
      correct: "Go, sell all that you have and give to the poor, and you will have treasure in heaven; and come, follow me",
      wrong: [
        "Believe in the Son of Man and be baptized",
        "Keep the commandments from your youth",
        "Love the Lord your God with all your heart",
      ],
    },
    {
      q: "Which disciples came to Jesus and asked, 'Teacher, we want you to do for us whatever we ask of you'?",
      correct: "James and John, the sons of Zebedee",
      wrong: [
        "Peter and Andrew, the brothers",
        "Philip and Bartholomew",
        "Thomas and Matthew",
      ],
    },
    {
      q: "What was the name of the blind beggar sitting by the roadside as Jesus was leaving Jericho?",
      correct: "Bartimaeus",
      wrong: [
        "Zacchaeus",
        "Alphaeus",
        "Cleopas",
      ],
    },
    {
      q: "What did the blind man do when Jesus called for him?",
      correct: "He threw off his cloak, sprang up and came to Jesus",
      wrong: [
        "He fell to his knees and worshipped",
        "He cried out louder 'Son of David, have mercy'",
        "He asked the crowd to lead him to Jesus",
      ],
    },
  ],
  "mrk-11": [
    {
      q: "What specific detail did Jesus give his two disciples about the colt they were to find in the village?",
      correct: "It had never been ridden",
      wrong: [
        "It belonged to a man named Simon",
        "It would be tied next to a jar of water",
        "It was a white colt with no blemish",
      ],
    },
    {
      q: "Why did Jesus find nothing but leaves on the fig tree when he went to see if it had fruit?",
      correct: "Because it was not the season for figs",
      wrong: [
        "Because the tree was withered from the roots",
        "Because the birds of the air had eaten the fruit",
        "Because the owner had already harvested it",
      ],
    },
    {
      q: "When Jesus cleansed the temple, what specific action did he not allow anyone to do?",
      correct: "Carry anything through the temple",
      wrong: [
        "Sit in the seats of the scribes",
        "Speak a word against the priests",
        "Bring unblemished lambs into the court",
      ],
    },
    {
      q: "What was Peter's reaction when he noticed the fig tree Jesus had cursed the previous day?",
      correct: "He pointed out that the tree had withered away",
      wrong: [
        "He asked Jesus if he could also curse trees",
        "He mourned because the tree had borne no fruit",
        "He picked a withered leaf and showed it to the disciples",
      ],
    },
    {
      q: "When the chief priests, scribes, and elders asked Jesus by what authority he did these things, what condition did Jesus set for answering them?",
      correct: "They had to answer his question about the baptism of John",
      wrong: [
        "They had to admit that he cast out demons by the Spirit of God",
        "They had to go and learn what 'I desire mercy, not sacrifice' means",
        "They had to show him a denarius with Caesar's inscription",
      ],
    },
  ],
  "mrk-12": [
    {
      q: "In the parable of the tenants, what did the tenants do to the first servant the owner sent?",
      correct: "They took him and beat him and sent him away empty-handed",
      wrong: [
        "They struck him on the head and treated him shamefully",
        "They killed him and threw his body out of the vineyard",
        "They bound him hand and foot and cast him out",
      ],
    },
    {
      q: "What reason did Jesus give the Sadducees for why they were wrong about marriage in the resurrection?",
      correct: "They knew neither the Scriptures nor the power of God",
      wrong: [
        "They did not understand the traditions of the elders",
        "They only believed in the writings of Moses, not the prophets",
        "They loved the praise of men more than the praise of God",
      ],
    },
    {
      q: "According to the scribe who agreed with Jesus about the greatest commandment, loving God and neighbor is much more than what?",
      correct: "All whole burnt offerings and sacrifices",
      wrong: [
        "All the tithes of mint, dill, and cumin",
        "Keeping the Sabbath day holy",
        "Fasting twice a week and giving to the poor",
      ],
    },
    {
      q: "How did Jesus describe the scribes who like to walk around in long robes and have the best seats?",
      correct: "They devour widows' houses and for a pretense make long prayers",
      wrong: [
        "They shut the kingdom of heaven in people's faces",
        "They cross sea and land to make a single proselyte",
        "They wash the outside of the cup but are full of greed",
      ],
    },
    {
      q: "Exactly how much did the poor widow put into the offering box?",
      correct: "Two small copper coins, which make a penny",
      wrong: [
        "One silver denarius",
        "A handful of copper mites",
        "Half a shekel of silver",
      ],
    },
  ],
  "mrk-13": [
    {
      q: "Which four disciples asked Jesus privately on the Mount of Olives about when the temple would be destroyed?",
      correct: "Peter, James, John, and Andrew",
      wrong: [
        "Peter, James, John, and Philip",
        "Peter, Andrew, James, and Matthew",
        "James, John, Thomas, and Judas",
      ],
    },
    {
      q: "What does Jesus instruct the person who is on the housetop to do when they see the abomination of desolation?",
      correct: "Not go down or enter his house to take anything out",
      wrong: [
        "Pray that it does not happen in winter",
        "Hide in the upper room until the distress passes",
        "Blow a trumpet to warn the rest of the city",
      ],
    },
    {
      q: "What will happen to the sun, moon, and stars in those days, after that tribulation?",
      correct: "The sun will be darkened, the moon will not give its light, and the stars will be falling",
      wrong: [
        "The sun will turn to blood, the moon to sackcloth, and the stars will fall",
        "The sun will shine seven times brighter, and the moon like the sun",
        "The sun will stand still, the moon will pause, and the stars will hide",
      ],
    },
    {
      q: "What will the Son of Man send the angels to do when he comes in clouds with great power and glory?",
      correct: "Gather his elect from the four winds",
      wrong: [
        "Blow the seven trumpets of judgment",
        "Separate the sheep from the goats",
        "Cast the lawless into the fiery furnace",
      ],
    },
    {
      q: "In illustrating the need to stay awake, what specific times does Jesus mention the master of the house might come?",
      correct: "In the evening, or at midnight, or when the rooster crows, or in the morning",
      wrong: [
        "At the first watch, the second watch, or the third watch",
        "At the break of dawn, at noon, or at the setting of the sun",
        "In the spring, the summer, the autumn, or the winter",
      ],
    },
  ],
  "mrk-14": [
    {
      q: "What kind of ointment did the woman pour on Jesus' head at the house of Simon the leper?",
      correct: "Pure nard",
      wrong: [
        "Frankincense and myrrh",
        "Spiced olive oil",
        "Balm of Gilead",
      ],
    },
    {
      q: "What sign were the two disciples told to look for when they went into the city to prepare the Passover?",
      correct: "A man carrying a jar of water",
      wrong: [
        "A servant sweeping the steps of a large upper room",
        "A priest leading a lamb without blemish",
        "A man wearing a linen cloth over his head",
      ],
    },
    {
      q: "In Gethsemane, Jesus fell on the ground and prayed that, if it were possible, what might pass from him?",
      correct: "The hour",
      wrong: [
        "The cup of wrath",
        "The sword of the executioner",
        "The shadow of death",
      ],
    },
    {
      q: "When Jesus was seized in Gethsemane, what happened to the young man who was following him?",
      correct: "They seized him, but he left his linen cloth and ran away naked",
      wrong: [
        "He drew his sword and struck the high priest's servant",
        "He hid among the olive trees until the crowd passed",
        "He was arrested along with Jesus and taken to the courtyard",
      ],
    },
    {
      q: "What did Peter do immediately after the rooster crowed a second time and he remembered Jesus' words?",
      correct: "He broke down and wept",
      wrong: [
        "He ran out of the courtyard into the night",
        "He threw himself at the feet of the servant girl",
        "He tore his clothes and cried out in agony",
      ],
    },
  ],
  "mrk-15": [
    {
      q: "Who was Simon of Cyrene, the man compelled to carry Jesus' cross, the father of?",
      correct: "Alexander and Rufus",
      wrong: [
        "James and John",
        "Philip and Bartholomew",
        "Joses and Salome",
      ],
    },
    {
      q: "What was the exact wording of the inscription of the charge written against Jesus?",
      correct: "The King of the Jews",
      wrong: [
        "Jesus of Nazareth, the King of the Jews",
        "He claimed to be the Son of God",
        "The Prophet of Galilee",
      ],
    },
    {
      q: "At the ninth hour, Jesus cried out 'Eloi, Eloi, lema sabachthani?' Some of the bystanders misunderstood this and thought he was calling whom?",
      correct: "Elijah",
      wrong: [
        "God the Father",
        "Moses",
        "An angel",
      ],
    },
    {
      q: "What did the Roman centurion, who stood facing Jesus, say when he saw that in this way he breathed his last?",
      correct: "Truly this man was the Son of God!",
      wrong: [
        "Certainly this man was innocent!",
        "Indeed, he was the King of the Jews!",
        "Father, forgive them, for they know not what they do!",
      ],
    },
    {
      q: "How is Joseph of Arimathea, who asked Pilate for the body of Jesus, described?",
      correct: "A respected member of the council, who was also himself looking for the kingdom of God",
      wrong: [
        "A rich ruler of the synagogue, who secretly followed Jesus",
        "A Pharisee and a teacher of the law, who believed the prophets",
        "A friend of Pilate, who had wealth and lands in Judea",
      ],
    },
  ],
  "mrk-16": [
    {
      q: "Who brought spices to anoint Jesus when the Sabbath was past?",
      correct: "Mary Magdalene, Mary the mother of James, and Salome",
      wrong: [
        "Mary Magdalene, Joanna, and Mary the mother of Jesus",
        "Mary and Martha of Bethany, and Salome",
        "Mary Magdalene and the other Mary",
      ],
    },
    {
      q: "When the women entered the tomb, who did they see sitting on the right side?",
      correct: "A young man dressed in a white robe",
      wrong: [
        "Two men in dazzling apparel",
        "An angel of the Lord descending from heaven",
        "The gardener, weeping by the stone",
      ],
    },
    {
      q: "What did the young man at the tomb tell the women to do?",
      correct: "Tell his disciples and Peter that he is going before you to Galilee",
      wrong: [
        "Wait in Jerusalem until they are clothed with power from on high",
        "Go and tell his brothers to meet him on the mountain in Judea",
        "Rejoice and be glad, for he has risen as he said",
      ],
    },
    {
      q: "What was the women's immediate reaction as they went out and fled from the tomb?",
      correct: "They said nothing to anyone, for they were afraid",
      wrong: [
        "They ran with great joy to tell the disciples",
        "They fell at his feet and took hold of him",
        "They wept loudly because they did not understand",
      ],
    },
    {
      q: "When Jesus appeared to the eleven as they were reclining at table, what did he rebuke them for?",
      correct: "Their unbelief and hardness of heart",
      wrong: [
        "Their fear of the Jews and their locked doors",
        "Their arguing about who was the greatest",
        "Their abandoning him in the garden",
      ],
    },
  ],
  "luk-1": [
    {
      q: "Who was king of Judea when Zechariah was serving as priest?",
      correct: "Herod",
      wrong: [
        "Caesar Augustus",
        "Quirinius",
        "Pontius Pilate",
      ],
    },
    {
      q: "What division of the priesthood did Zechariah belong to?",
      correct: "The division of Abijah",
      wrong: [
        "The division of Eleazar",
        "The division of Kohath",
        "The division of Asaph",
      ],
    },
    {
      q: "What physical consequence happened to Zechariah because he did not believe Gabriel's words?",
      correct: "He became silent and unable to speak",
      wrong: [
        "He became completely blind",
        "He was struck with a fever",
        "He lost his hearing",
      ],
    },
    {
      q: "In Mary's song, she says God has filled the hungry with good things. What does she say God has done to the rich?",
      correct: "Sent them away empty",
      wrong: [
        "Brought them down from their thrones",
        "Scattered them in their proud thoughts",
        "Given them over to their wealth",
      ],
    },
    {
      q: "How long did Mary remain with Elizabeth before returning to her home?",
      correct: "About three months",
      wrong: [
        "Six months",
        "Until the child was born",
        "About forty days",
      ],
    },
  ],
  "luk-2": [
    {
      q: "Who was governor of Syria when the first registration (census) took place?",
      correct: "Quirinius",
      wrong: [
        "Pontius Pilate",
        "Herod the Great",
        "Archelaus",
      ],
    },
    {
      q: "What sign did the angel give the shepherds to find the Savior?",
      correct: "A baby wrapped in swaddling cloths and lying in a manger",
      wrong: [
        "A star resting over a house in Bethlehem",
        "A baby surrounded by angels singing",
        "A baby being presented in the temple by his parents",
      ],
    },
    {
      q: "Simeon had received a revelation from the Holy Spirit that he would not see death before what happened?",
      correct: "He had seen the Lord's Christ",
      wrong: [
        "He had seen the consolation of Israel begin",
        "He prophesied over the Savior",
        "He watched the redemption of Jerusalem",
      ],
    },
    {
      q: "Anna the prophetess was the daughter of Phanuel. What tribe was she from?",
      correct: "Asher",
      wrong: [
        "Judah",
        "Levi",
        "Benjamin",
      ],
    },
    {
      q: "When Jesus was twelve and his parents found him in the temple, what was he doing?",
      correct: "Sitting among the teachers, listening to them and asking them questions",
      wrong: [
        "Reading from the scroll of the prophet Isaiah",
        "Sacrificing a lamb at the altar",
        "Debating the law with the Pharisees",
      ],
    },
  ],
  "luk-3": [
    {
      q: "According to Luke 3, in what year of the reign of Tiberius Caesar did the word of God come to John in the wilderness?",
      correct: "The fifteenth year",
      wrong: [
        "The tenth year",
        "The twelfth year",
        "The twentieth year",
      ],
    },
    {
      q: "What did John the Baptist tell the tax collectors to do when they asked, 'Teacher, what shall we do?'",
      correct: "Collect no more than you are authorized to do",
      wrong: [
        "Give half of your collections to the poor",
        "Abandon your booths and follow the Lord",
        "Extort money from no one by threats",
      ],
    },
    {
      q: "Why was John the Baptist locked up in prison by Herod the tetrarch?",
      correct: "Because John reproved him for Herodias, his brother's wife, and for all the evil things he had done",
      wrong: [
        "Because John claimed to be the Messiah and threatened Herod's rule",
        "Because John refused to pay the temple tax",
        "Because John incited a riot against the Roman soldiers",
      ],
    },
    {
      q: "About how old was Jesus when he began his ministry?",
      correct: "About thirty years of age",
      wrong: [
        "About thirty-three years of age",
        "About twenty-five years of age",
        "About forty years of age",
      ],
    },
    {
      q: "In the genealogy of Jesus recorded in Luke, who is listed as the father of Joseph?",
      correct: "Heli",
      wrong: [
        "Jacob",
        "Matthan",
        "David",
      ],
    },
  ],
  "luk-4": [
    {
      q: "In the wilderness, the devil told Jesus he would give him all the authority and glory of the kingdoms of the world if Jesus did what?",
      correct: "Worshiped him",
      wrong: [
        "Turned a stone into bread",
        "Threw himself down from the temple",
        "Commanded the angels to serve him",
      ],
    },
    {
      q: "In the synagogue at Nazareth, whose scroll was handed to Jesus to read?",
      correct: "The prophet Isaiah",
      wrong: [
        "The prophet Jeremiah",
        "The law of Moses",
        "The psalms of David",
      ],
    },
    {
      q: "Which two Old Testament figures did Jesus mention in the synagogue at Nazareth, causing the people to become filled with wrath?",
      correct: "Elijah and Elisha",
      wrong: [
        "Moses and Abraham",
        "David and Solomon",
        "Jacob and Joseph",
      ],
    },
    {
      q: "When Jesus commanded the unclean demon to come out of the man in the synagogue at Capernaum, what did the demon do before coming out?",
      correct: "Threw the man down in their midst without doing him any harm",
      wrong: [
        "Shrieked loudly and caused the man to convulse",
        "Pled with Jesus not to send it to the abyss",
        "Cried out that Jesus was the Holy One of God",
      ],
    },
    {
      q: "When Simon's mother-in-law was ill with a high fever, how did Jesus heal her?",
      correct: "He stood over her and rebuked the fever",
      wrong: [
        "He took her by the hand and raised her up",
        "He laid his hands on her head",
        "He commanded her to rise and walk",
      ],
    },
  ],
  "luk-5": [
    {
      q: "While Jesus was teaching the crowds from Simon's boat, what did he tell Simon to do when he had finished speaking?",
      correct: "Put out into the deep and let down your nets for a catch",
      wrong: [
        "Cast your net on the right side of the boat",
        "Leave your nets here and follow me",
        "Row to the other side of the lake",
      ],
    },
    {
      q: "How did the leper make his request to Jesus?",
      correct: "He fell on his face and begged him, 'Lord, if you will, you can make me clean.'",
      wrong: [
        "He cried out from a distance, 'Jesus, Master, have mercy on me!'",
        "He reached out to touch the fringe of Jesus' garment.",
        "He brought a sacrifice to Jesus and asked for healing.",
      ],
    },
    {
      q: "When Jesus saw the faith of the men who let the paralytic down through the roof, what were his first words to the paralyzed man?",
      correct: "Man, your sins are forgiven you.",
      wrong: [
        "I say to you, rise, pick up your bed and go home.",
        "Your faith has made you well.",
        "Take heart, my son; your sins are forgiven.",
      ],
    },
    {
      q: "What profession was Levi practicing when Jesus said to him, 'Follow me'?",
      correct: "He was a tax collector sitting at the tax booth",
      wrong: [
        "He was a fisherman mending his nets",
        "He was a centurion overseeing soldiers",
        "He was a scribe copying the law",
      ],
    },
    {
      q: "What did Jesus say happens when someone puts new wine into old wineskins?",
      correct: "The new wine will burst the skins and it will be spilled, and the skins will be destroyed",
      wrong: [
        "The old wineskins will stretch and ruin the taste of the wine",
        "The old wine will mix with the new and become sour",
        "The skins will absorb the wine and it will be wasted",
      ],
    },
  ],
  "luk-6": [
    {
      q: "What did Jesus say the Son of Man is lord of?",
      correct: "The Sabbath",
      wrong: [
        "The temple",
        "The harvest",
        "The angels",
      ],
    },
    {
      q: "Before choosing his twelve apostles, what did Jesus do all night?",
      correct: "He went out to the mountain to pray",
      wrong: [
        "He healed the sick who gathered around him",
        "He debated with the scribes and Pharisees",
        "He taught the crowds from a boat",
      ],
    },
    {
      q: "In Luke's account, Jesus says 'Blessed are you who are poor.' What does he say to the rich?",
      correct: "Woe to you who are rich, for you have received your consolation.",
      wrong: [
        "Woe to you who are rich, for it is easier for a camel to go through the eye of a needle.",
        "Woe to you who are rich, for where your treasure is, there your heart will be also.",
        "Woe to you who are rich, for you store up treasures on earth.",
      ],
    },
    {
      q: "According to Jesus, what measure will be used back to you?",
      correct: "The measure you use",
      wrong: [
        "The measure of your faith",
        "The measure of the Father's mercy",
        "The measure of the law",
      ],
    },
    {
      q: "What happens to the house built by the man who hears Jesus' words but does not do them?",
      correct: "The stream breaks against it, and immediately it falls, and the ruin of that house is great",
      wrong: [
        "The winds blow and beat against it, and it collapses on the sand",
        "The rain falls and floods the foundation, washing it away",
        "The sun rises and scorches it because it has no root",
      ],
    },
  ],
  "luk-7": [
    {
      q: "Who did the centurion send to Jesus first to ask him to come and heal his servant?",
      correct: "Elders of the Jews",
      wrong: [
        "His own family members",
        "His closest friends",
        "Soldiers from his regiment",
      ],
    },
    {
      q: "What did Jesus do immediately before saying 'Young man, I say to you, arise' in the town of Nain?",
      correct: "He came up and touched the bier",
      wrong: [
        "He took the young man by the hand",
        "He told the mother not to weep",
        "He looked up to heaven and sighed",
      ],
    },
    {
      q: "To what does Jesus compare the people of this generation?",
      correct: "Children sitting in the marketplace calling to one another",
      wrong: [
        "Sheep wandering without a shepherd",
        "A tree that produces no good fruit",
        "Blind guides leading the blind into a pit",
      ],
    },
    {
      q: "In the parable Jesus told Simon the Pharisee, how much did the two debtors owe the moneylender?",
      correct: "Five hundred denarii and fifty",
      wrong: [
        "Ten thousand talents and a hundred denarii",
        "A thousand shekels and ten",
        "One hundred talents and fifty denarii",
      ],
    },
    {
      q: "What did Jesus say Simon the Pharisee failed to do for him, which the sinful woman did?",
      correct: "Give him water for his feet, a kiss, and oil for his head",
      wrong: [
        "Wash his hands, offer him wine, and give him bread",
        "Greet him at the door, take his cloak, and wash his face",
        "Provide a basin, offer a towel, and seat him at the table",
      ],
    },
  ],
  "luk-8": [
    {
      q: "Who was the wife of Chuza, Herod's household manager, who provided for Jesus out of her means?",
      correct: "Joanna",
      wrong: [
        "Susanna",
        "Mary Magdalene",
        "Salome",
      ],
    },
    {
      q: "In the parable of the sower, what happens to the seed that falls on the rock?",
      correct: "They receive the word with joy, but fall away in time of testing",
      wrong: [
        "They hear the word, but the devil takes it from their hearts",
        "They are choked by the cares and riches of life",
        "They are trampled underfoot and devoured by birds",
      ],
    },
    {
      q: "When the people of the surrounding country came to see what happened to the demon-possessed man of the Gerasenes, in what condition did they find him?",
      correct: "Sitting at Jesus' feet, clothed and in his right mind",
      wrong: [
        "Sleeping peacefully by the edge of the lake",
        "Preaching the word of God in the synagogues",
        "Weeping and begging to follow Jesus",
      ],
    },
    {
      q: "For how long had the woman in the crowd suffered from a discharge of blood before she touched the fringe of Jesus' garment?",
      correct: "Twelve years",
      wrong: [
        "Eighteen years",
        "Ten years",
        "Seven years",
      ],
    },
    {
      q: "Which three disciples did Jesus allow to enter the house with him when he went to heal Jairus's daughter?",
      correct: "Peter, John, and James",
      wrong: [
        "Peter, Andrew, and Philip",
        "James, John, and Matthew",
        "Peter, Thomas, and Judas",
      ],
    },
  ],
  "luk-9": [
    {
      q: "Before feeding the five thousand, what instruction did Jesus give the disciples regarding how to seat the crowd?",
      correct: "Have them sit down in groups of about fifty each",
      wrong: [
        "Have them sit in rows by their families",
        "Have them arrange themselves in hundreds",
        "Have them sit closely together on the green grass",
      ],
    },
    {
      q: "During the transfiguration, what did Moses and Elijah speak to Jesus about?",
      correct: "His departure, which he was about to accomplish at Jerusalem",
      wrong: [
        "The building of the kingdom of God on earth",
        "The law of Moses and the prophecies of old",
        "The coming of the Holy Spirit upon the disciples",
      ],
    },
    {
      q: "How did Jesus respond when an argument arose among the disciples as to which of them was the greatest?",
      correct: "He put a child by his side and said whoever receives this child receives him",
      wrong: [
        "He washed their feet to show them how to be a servant",
        "He told them the first shall be last and the last shall be first",
        "He rebuked them for seeking earthly power and glory",
      ],
    },
    {
      q: "When a Samaritan village did not receive Jesus, what did James and John ask if they could do?",
      correct: "Tell fire to come down from heaven and consume them",
      wrong: [
        "Shake the dust off their feet as a testimony against them",
        "Call upon a legion of angels to drive the Samaritans out",
        "Curse the village so that it would bear no fruit",
      ],
    },
    {
      q: "According to Jesus' response to the man who wanted to say farewell to those at his home, who is not fit for the kingdom of God?",
      correct: "No one who puts his hand to the plow and looks back",
      wrong: [
        "No one who loves father or mother more than him",
        "No one who refuses to take up his cross daily",
        "No one who buries his talent in the ground",
      ],
    },
  ],
  "luk-10": [
    {
      q: "What items did Jesus explicitly tell the seventy-two NOT to carry when he sent them out?",
      correct: "A moneybag, a knapsack, or sandals",
      wrong: [
        "A staff, bread, or a copper coin",
        "An extra tunic, a sword, or a shield",
        "A walking stick, a water jar, or a tent",
      ],
    },
    {
      q: "Which two cities did Jesus say would have repented long ago in sackcloth and ashes if the mighty works done in Chorazin and Bethsaida had been done in them?",
      correct: "Tyre and Sidon",
      wrong: [
        "Sodom and Gomorrah",
        "Nineveh and Babylon",
        "Jericho and Ai",
      ],
    },
    {
      q: "When the seventy-two returned with joy saying the demons were subject to them, what did Jesus tell them they should actually rejoice about?",
      correct: "That their names are written in heaven",
      wrong: [
        "That the Father has given them the Holy Spirit",
        "That the kingdom of God has drawn near",
        "That Satan has fallen like lightning from heaven",
      ],
    },
    {
      q: "In the parable of the Good Samaritan, how much money did the Samaritan initially give the innkeeper to care for the injured man?",
      correct: "Two denarii",
      wrong: [
        "Five shekels",
        "One talent",
        "Ten silver pieces",
      ],
    },
    {
      q: "Why did Martha complain to Jesus about her sister Mary?",
      correct: "Because Mary was sitting at the Lord's feet listening while Martha was distracted with much serving",
      wrong: [
        "Because Mary refused to draw water from the well for the guests",
        "Because Mary had spilled the expensive perfume on Jesus' feet",
        "Because Mary had left the house to follow the crowds",
      ],
    },
  ],
  "luk-11": [
    {
      q: "In the parable of the friend at midnight, why does the man finally get up and give his friend the three loaves of bread?",
      correct: "Because of his impudence/persistence",
      wrong: [
        "Because they had been friends since childhood",
        "Because the law commands hospitality to strangers",
        "Because he was afraid the friend would wake his children",
      ],
    },
    {
      q: "Jesus asked, 'What father among you, if his son asks for a fish, will instead of a fish give him a serpent; or if he asks for an egg, will give him...' what?",
      correct: "A scorpion",
      wrong: [
        "A stone",
        "A viper",
        "A handful of dust",
      ],
    },
    {
      q: "When an unclean spirit leaves a person, passes through waterless places, and returns to find the house swept and put in order, what does it do next?",
      correct: "It brings seven other spirits more evil than itself, and they enter and dwell there",
      wrong: [
        "It finds the house guarded by angels and flees in terror",
        "It wanders back into the desert, seeking a herd of pigs",
        "It begs the master of the house to let it rest on the threshold",
      ],
    },
    {
      q: "How did Jesus respond when a woman in the crowd called the womb that bore him and the breasts that nursed him blessed?",
      correct: "Blessed rather are those who hear the word of God and keep it",
      wrong: [
        "Whoever does the will of my Father in heaven is my brother and sister and mother",
        "Blessed indeed is she who believed that there would be a fulfillment",
        "The flesh is of no avail; the words that I have spoken to you are spirit and life",
      ],
    },
    {
      q: "For what practice did Jesus pronounce a woe upon the Pharisees, noting that while they did this, they neglected justice and the love of God?",
      correct: "Tithing mint and rue and every herb",
      wrong: [
        "Washing the outside of the cup and the dish",
        "Making their phylacteries broad and their fringes long",
        "Fasting twice a week and praying in the synagogues",
      ],
    },
  ],
  "luk-12": [
    {
      q: "What did Jesus define as the 'leaven of the Pharisees' which his disciples must beware of?",
      correct: "Hypocrisy",
      wrong: [
        "Greed",
        "False teaching",
        "Pride",
      ],
    },
    {
      q: "In the parable of the rich fool, what did the rich man decide to do when he realized he had nowhere to store his crops?",
      correct: "Tear down his barns and build larger ones",
      wrong: [
        "Sell the excess grain and buy more land",
        "Distribute the extra crops to the poor of his city",
        "Store the goods in his house and hire more servants",
      ],
    },
    {
      q: "How did Jesus command his disciples to be ready for action when waiting for their master's return?",
      correct: "Stay dressed for action and keep your lamps burning",
      wrong: [
        "Keep watch in the night and do not sleep",
        "Gather your belongings and wait by the door",
        "Fast and pray until the master arrives",
      ],
    },
    {
      q: "According to Jesus, what is the difference in punishment between the servant who knew his master's will and disobeyed, and the one who did not know and did what deserved a beating?",
      correct: "The one who knew will receive a severe beating, the one who did not will receive a light beating",
      wrong: [
        "The one who knew will be cast out, the one who did not will be forgiven",
        "The one who knew will pay back double, the one who did not will pay back what he owes",
        "The one who knew will be bound hand and foot, the one who did not will be demoted",
      ],
    },
    {
      q: "What weather sign did Jesus say the crowds used to predict a coming shower?",
      correct: "A cloud rising in the west",
      wrong: [
        "A red sky in the morning",
        "A south wind blowing",
        "A mist coming up from the earth",
      ],
    },
  ],
  "luk-13": [
    {
      q: "Who does Jesus mention whose blood Pilate had mingled with their sacrifices?",
      correct: "Galileans",
      wrong: [
        "Judeans",
        "Samaritans",
        "Romans",
      ],
    },
    {
      q: "In the parable of the barren fig tree, how many years did the man say he had come seeking fruit without finding any?",
      correct: "Three years",
      wrong: [
        "Seven years",
        "One year",
        "Five years",
      ],
    },
    {
      q: "How long had the woman in the synagogue had a disabling spirit that left her bent over?",
      correct: "Eighteen years",
      wrong: [
        "Twelve years",
        "Thirty-eight years",
        "Ten years",
      ],
    },
    {
      q: "When someone asked Jesus, 'Lord, will those who are saved be few?', what was his immediate instruction?",
      correct: "Strive to enter through the narrow door.",
      wrong: [
        "Seek first the kingdom of God.",
        "Repent and believe the gospel.",
        "Follow me and I will give you rest.",
      ],
    },
    {
      q: "What animal does Jesus compare Herod to when some Pharisees tell him to flee?",
      correct: "A fox",
      wrong: [
        "A wolf",
        "A viper",
        "A dog",
      ],
    },
  ],
  "luk-14": [
    {
      q: "When Jesus healed the man with dropsy on the Sabbath, what question did he ask the lawyers and Pharisees?",
      correct: "Which of you, having a son or an ox that has fallen into a well on a Sabbath day, will not immediately pull him out?",
      wrong: [
        "Is it lawful to heal on the Sabbath, or not?",
        "Who among you is without sin to judge this man?",
        "Does not the law permit doing good on the Sabbath day?",
      ],
    },
    {
      q: "In the parable of the wedding feast, what should an invited guest do instead of taking the place of honor?",
      correct: "Go and sit in the lowest place",
      wrong: [
        "Wait for the host to seat them",
        "Stand by the door until invited",
        "Offer to wash the feet of the other guests",
      ],
    },
    {
      q: "In the parable of the great banquet, which of the following is one of the excuses given by an invited guest?",
      correct: "I have bought five yoke of oxen, and I go to examine them.",
      wrong: [
        "I must bury my father today.",
        "I have hired a servant and must give him orders.",
        "I am ill and cannot leave my bed.",
      ],
    },
    {
      q: "According to Jesus, what does a king do before going out to encounter another king in war?",
      correct: "Sits down first and deliberates whether he is able with ten thousand to meet him who comes against him with twenty thousand",
      wrong: [
        "Sends messengers to sue for peace immediately before the battle begins",
        "Prays and fasts for three days and nights to seek the Lord's favor",
        "Gathers his generals and sacrifices a burnt offering",
      ],
    },
    {
      q: "What does Jesus say happens to salt if it has lost its taste?",
      correct: "It is of no use either for the soil or for the manure pile; it is thrown away",
      wrong: [
        "It is trodden under foot by men in the streets",
        "It is kept in the jar but loses its value",
        "It is given to the animals in the field",
      ],
    },
  ],
  "luk-15": [
    {
      q: "In the parable of the lost sheep, where does the shepherd leave the ninety-nine sheep to go after the one that is lost?",
      correct: "In the open country",
      wrong: [
        "In the sheepfold",
        "In the care of the hired hands",
        "In the valley",
      ],
    },
    {
      q: "In the parable of the lost coin, what does the woman do when she loses one of her ten silver coins?",
      correct: "Lights a lamp and sweeps the house and seeks diligently until she finds it",
      wrong: [
        "Fasts and prays until God reveals where it is",
        "Goes to the market to earn another to replace it",
        "Calls her neighbors to help her look immediately",
      ],
    },
    {
      q: "In the parable of the prodigal son, what job did the younger son take when a severe famine arose in the country?",
      correct: "Feeding pigs in the fields",
      wrong: [
        "Tending sheep in the hills",
        "Harvesting grain for a wealthy landowner",
        "Drawing water for the village",
      ],
    },
    {
      q: "What did the father order his servants to bring for the returning younger son?",
      correct: "The best robe, a ring for his hand, and shoes for his feet",
      wrong: [
        "A clean tunic, a staff, and sandals",
        "A basin of water to wash his feet and fresh clothing",
        "A crown of flowers and a new cloak",
      ],
    },
    {
      q: "Why was the older brother angry when he came near the house?",
      correct: "He heard music and dancing and learned his father killed the fattened calf for his returning brother",
      wrong: [
        "Because his brother had returned to demand the rest of the inheritance",
        "Because his father had divided the remaining property between them",
        "He realized his father never gave him a sheep to celebrate with his friends",
      ],
    },
  ],
  "luk-16": [
    {
      q: "In the parable of the dishonest manager, what did the manager tell the debtor who owed a hundred measures of oil to write on his bill?",
      correct: "Fifty",
      wrong: [
        "Eighty",
        "Twenty",
        "Seventy",
      ],
    },
    {
      q: "According to Jesus, no servant can serve two masters. You cannot serve God and what?",
      correct: "Money",
      wrong: [
        "The world",
        "The flesh",
        "The law",
      ],
    },
    {
      q: "Why did the Pharisees scoff at Jesus after he spoke about serving two masters?",
      correct: "Because they were lovers of money",
      wrong: [
        "Because they believed only the law of Moses was master",
        "Because they thought he was a glutton and a drunkard",
        "Because they held strictly to the traditions of the elders",
      ],
    },
    {
      q: "In the story of the rich man and Lazarus, what was Lazarus covered with as he laid at the rich man's gate?",
      correct: "Sores",
      wrong: [
        "Rags",
        "Dirt",
        "Leprosy",
      ],
    },
    {
      q: "What did the rich man in Hades beg Abraham to send Lazarus to do for him?",
      correct: "Dip the end of his finger in water and cool his tongue",
      wrong: [
        "Bring him a crumb of bread from the banquet table",
        "Escort him across the great chasm",
        "Go back and warn his five brothers before they die",
      ],
    },
  ],
  "luk-17": [
    {
      q: "What does Jesus say it would be better to have happen than to cause one of these little ones to sin?",
      correct: "To have a millstone tied around your neck and be cast into the sea",
      wrong: [
        "To have your right hand cut off",
        "To be beaten with many blows",
        "To be thrown into the outer darkness",
      ],
    },
    {
      q: "How many times in a day does Jesus say you must forgive a brother who sins against you and turns to you saying, 'I repent'?",
      correct: "Seven times",
      wrong: [
        "Seventy times seven",
        "Three times",
        "Twelve times",
      ],
    },
    {
      q: "When ten lepers were cleansed by Jesus, what was unique about the only one who turned back to praise God?",
      correct: "He was a Samaritan",
      wrong: [
        "He was a Roman centurion",
        "He was a priest",
        "He was a tax collector",
      ],
    },
    {
      q: "When the Pharisees asked Jesus when the kingdom of God would come, how did he respond?",
      correct: "The kingdom of God is not coming in ways that can be observed",
      wrong: [
        "No one knows the day or hour, not even the Son",
        "It will come like a thief in the night",
        "When the Son of Man is revealed from heaven",
      ],
    },
    {
      q: "Whose wife did Jesus tell his disciples to remember when speaking about the days of the Son of Man?",
      correct: "Lot's wife",
      wrong: [
        "Noah's wife",
        "Abraham's wife",
        "David's wife",
      ],
    },
  ],
  "luk-18": [
    {
      q: "In the parable of the persistent widow, why does the unjust judge finally agree to give the widow justice?",
      correct: "Because she kept bothering him and he did not want her to beat him down by her continual coming",
      wrong: [
        "Because he realized he had sinned against God and sought repentance",
        "Because she offered him a small bribe from her inheritance",
        "Because the townspeople began to protest outside his house",
      ],
    },
    {
      q: "In the parable of the Pharisee and the tax collector, how often does the Pharisee say he fasts?",
      correct: "Twice a week",
      wrong: [
        "Once a month",
        "Three times a week",
        "Every Sabbath",
      ],
    },
    {
      q: "When the rich ruler asks Jesus what he must do to inherit eternal life, which of the following commandments does Jesus NOT list?",
      correct: "Do not covet",
      wrong: [
        "Do not commit adultery",
        "Do not steal",
        "Honor your father and mother",
      ],
    },
    {
      q: "Why did the twelve disciples fail to understand when Jesus told them he would be mocked, scourged, and killed, and rise on the third day?",
      correct: "This saying was hidden from them, and they did not grasp what was said",
      wrong: [
        "They were distracted by the crowds gathering around Jericho",
        "They refused to believe that the Son of Man could suffer",
        "They thought he was speaking a parable about the temple's destruction",
      ],
    },
    {
      q: "What did those who were in front do to the blind beggar near Jericho when he cried out to the Son of David?",
      correct: "They rebuked him, telling him to be silent",
      wrong: [
        "They brought him to Jesus immediately",
        "They gave him alms to quiet him",
        "They threw their cloaks over his head",
      ],
    },
  ],
  "luk-19": [
    {
      q: "What kind of tree did Zacchaeus climb in order to see Jesus?",
      correct: "A sycamore tree",
      wrong: [
        "An olive tree",
        "A fig tree",
        "A palm tree",
      ],
    },
    {
      q: "Why did Jesus proceed to tell the parable of the ten minas as he was nearing Jerusalem?",
      correct: "Because they supposed that the kingdom of God was to appear immediately",
      wrong: [
        "Because the chief priests were plotting to kill him there",
        "Because the disciples were arguing about who was the greatest",
        "Because Zacchaeus had given half his goods to the poor",
      ],
    },
    {
      q: "In the parable of the ten minas, where did the wicked servant keep his master's mina?",
      correct: "Laid away in a handkerchief",
      wrong: [
        "Buried in a field",
        "Hidden in a clay jar",
        "Given to the bankers",
      ],
    },
    {
      q: "As Jesus approached Bethphage and Bethany, he sent two disciples to untie a colt. What did he tell them to say if anyone asked why they were untying it?",
      correct: "The Lord has need of it.",
      wrong: [
        "The Master sent us to retrieve it.",
        "It is for the Son of David.",
        "The Prophet of Nazareth requires it.",
      ],
    },
    {
      q: "When Jesus drew near and wept over Jerusalem, what did he say the enemies would do because the city did not know the time of its visitation?",
      correct: "Set up a barricade, surround it, hem it in, and tear it down to the ground",
      wrong: [
        "Burn its gates with fire and lead its people into exile",
        "Desecrate the temple and stop the daily sacrifices",
        "Plunder its wealth and scatter its children among the nations",
      ],
    },
  ],
  "luk-20": [
    {
      q: "When the chief priests and scribes asked Jesus by what authority he was doing these things, what condition did Jesus give before he would answer?",
      correct: "They must tell him whether the baptism of John was from heaven or from man",
      wrong: [
        "They must declare whether the Christ is the son of David or the Son of God",
        "They must first show him a denarius and tell him whose likeness it bears",
        "They must agree to let the people judge his response",
      ],
    },
    {
      q: "In the parable of the wicked tenants, what did the tenants do to the third servant the owner sent?",
      correct: "They wounded him and cast him out",
      wrong: [
        "They beat him and sent him away empty-handed",
        "They treated him shamefully and struck him on the head",
        "They threw him out of the vineyard and killed him",
      ],
    },
    {
      q: "Why did the scribes and chief priests send spies pretending to be sincere to ask Jesus about paying taxes to Caesar?",
      correct: "So that they might catch him in something he said, to deliver him to the governor's authority",
      wrong: [
        "So that the crowds would turn against him for supporting Roman taxation",
        "So that they could prove he was a zealot inciting a rebellion",
        "So that they could find a reason to ban him from teaching in the temple",
      ],
    },
    {
      q: "How does Jesus answer the Sadducees regarding marriage and the resurrection?",
      correct: "Those considered worthy to attain that age do not marry, for they cannot die anymore and are equal to angels",
      wrong: [
        "In the resurrection, a woman returns to the husband of her youth",
        "Marriage is an earthly covenant that God dissolves entirely at the final judgment",
        "The righteous will inherit the new earth, but the wicked will not rise to marry",
      ],
    },
    {
      q: "What book does Jesus cite when asking how they can say the Christ is David's son, if David calls him 'Lord'?",
      correct: "The Book of Psalms",
      wrong: [
        "The Book of Isaiah",
        "The Law of Moses",
        "The Chronicles of the Kings",
      ],
    },
  ],
  "luk-21": [
    {
      q: "When Jesus looked up and saw the rich putting gifts into the offering box, how much did the poor widow put in?",
      correct: "Two small copper coins",
      wrong: [
        "A single silver denarius",
        "Five shekels",
        "Two silver mites",
      ],
    },
    {
      q: "What were some people speaking about regarding the temple before Jesus predicted its destruction?",
      correct: "How it was adorned with noble stones and offerings",
      wrong: [
        "How the gold of its altar shined in the sun",
        "How the veil of the sanctuary was woven with fine linen",
        "How the courts were filled with the faithful singing psalms",
      ],
    },
    {
      q: "According to Jesus, what will happen to his followers BEFORE the great earthquakes, famines, and terrors from heaven?",
      correct: "They will lay their hands on them and persecute them, delivering them to synagogues and prisons",
      wrong: [
        "The gospel will first be proclaimed to all nations as a testimony",
        "False christs will arise and perform great signs to deceive them",
        "Jerusalem will be surrounded by armies and brought to desolation",
      ],
    },
    {
      q: "What does Jesus say you should do when you see Jerusalem surrounded by armies?",
      correct: "Let those who are in Judea flee to the mountains",
      wrong: [
        "Let those who are in the city barricade the gates",
        "Gather provisions and hide in the temple courts",
        "Go out to meet the enemy and seek terms of peace",
      ],
    },
    {
      q: "In the lesson of the fig tree, what do you know when they come out in leaf?",
      correct: "That summer is already near",
      wrong: [
        "That the time of harvest has passed",
        "That the master of the vineyard is returning",
        "That rain will soon fall on the earth",
      ],
    },
  ],
  "luk-22": [
    {
      q: "What happened to Judas called Iscariot just before he went to confer with the chief priests and officers?",
      correct: "Satan entered into him",
      wrong: [
        "He became greedy for thirty pieces of silver",
        "He was angered by a woman pouring ointment on Jesus",
        "He feared the crowds would turn against the disciples",
      ],
    },
    {
      q: "Which two disciples did Jesus send to prepare the Passover meal?",
      correct: "Peter and John",
      wrong: [
        "James and John",
        "Peter and Andrew",
        "Philip and Thomas",
      ],
    },
    {
      q: "During the Last Supper, what dispute arose among the disciples?",
      correct: "Which of them was to be regarded as the greatest",
      wrong: [
        "Who would be the one to betray him",
        "Where they would flee when the authorities came",
        "Who should wash the others' feet",
      ],
    },
    {
      q: "How far did Jesus withdraw from the disciples to pray on the Mount of Olives?",
      correct: "About a stone's throw",
      wrong: [
        "About a Sabbath day's journey",
        "To the edge of the olive grove",
        "To the very peak of the mount",
      ],
    },
    {
      q: "In the courtyard of the high priest, how much time passed between Peter's second denial and the third person insisting he was with Jesus?",
      correct: "An interval of about an hour",
      wrong: [
        "Almost immediately",
        "About three hours",
        "Just before the rooster crowed a second time",
      ],
    },
  ],
  "luk-23": [
    {
      q: "Why was Herod very glad when he saw Jesus?",
      correct: "He had long desired to see him, hoping to see some sign done by him",
      wrong: [
        "He wanted to sentence him to death personally",
        "He hoped Jesus would prophesy about his reign",
        "He wanted Jesus to explain the teachings of John the Baptist",
      ],
    },
    {
      q: "What did Jesus say to the women who were mourning and lamenting for him as he was led away?",
      correct: "Daughters of Jerusalem, do not weep for me, but weep for yourselves and for your children",
      wrong: [
        "Weep not for the Son of Man, but for the city that has rejected its king",
        "Blessed are those who mourn, for they shall be comforted in paradise",
        "Tear your garments and put on ashes, for the days of vengeance have come",
      ],
    },
    {
      q: "What did the criminal who rebuked the other criminal ask of Jesus on the cross?",
      correct: "Jesus, remember me when you come into your kingdom.",
      wrong: [
        "Lord, forgive me of my sins before I die.",
        "Save yourself and us, if you are the Christ!",
        "Master, have mercy on me, a sinner.",
      ],
    },
    {
      q: "For how long was there darkness over the whole land while Jesus was on the cross?",
      correct: "From the sixth hour to the ninth hour",
      wrong: [
        "From the third hour to the sixth hour",
        "From noon until the sun set",
        "For three full days",
      ],
    },
    {
      q: "After preparing spices and ointments for Jesus' body, what did the women do on the Sabbath?",
      correct: "They rested according to the commandment",
      wrong: [
        "They went to the tomb to keep a vigil outside the stone",
        "They gathered with the disciples in a locked room to mourn",
        "They wept openly in the temple courts",
      ],
    },
  ],
  "luk-24": [
    {
      q: "When the women found the stone rolled away and entered the tomb, what did the two men in dazzling apparel say to them?",
      correct: "Why do you seek the living among the dead?",
      wrong: [
        "He is not here; he is going before you to Galilee.",
        "Do not be alarmed; you seek Jesus of Nazareth, who was crucified.",
        "Whom are you looking for? The Son of Man has risen.",
      ],
    },
    {
      q: "How far was the village of Emmaus from Jerusalem?",
      correct: "About seven miles",
      wrong: [
        "About three miles",
        "About twelve miles",
        "About a day's journey",
      ],
    },
    {
      q: "At what exact moment were the eyes of the two disciples on the road to Emmaus opened so that they recognized Jesus?",
      correct: "When he took the bread and blessed and broke it and gave it to them",
      wrong: [
        "When he explained the Scriptures concerning himself to them",
        "When they urged him strongly to stay with them because it was toward evening",
        "When he showed them his hands and his feet",
      ],
    },
    {
      q: "When Jesus appeared to the disciples in Jerusalem and they thought they were seeing a spirit, what did he eat to prove he was physical?",
      correct: "A piece of broiled fish",
      wrong: [
        "A piece of honeycomb",
        "A loaf of bread",
        "A few roasted figs",
      ],
    },
    {
      q: "Where did Jesus lead his disciples out to before he blessed them and parted from them into heaven?",
      correct: "As far as Bethany",
      wrong: [
        "The Mount of Olives",
        "The Sea of Galilee",
        "The pinnacle of the temple",
      ],
    },
  ],
  "jhn-1": [
    {
      q: "Who did the Jews send from Jerusalem to ask John, 'Who are you?'",
      correct: "Priests and Levites",
      wrong: [
        "Pharisees and Scribes",
        "Sadducees and elders",
        "Roman guards and centurions",
      ],
    },
    {
      q: "When John saw Jesus coming toward him, what did he declare?",
      correct: "Behold, the Lamb of God, who takes away the sin of the world!",
      wrong: [
        "Behold, the Son of David, who comes in the name of the Lord!",
        "Behold, the Prophet who is to come into the world!",
        "Behold, the Light of the World, who overcomes the darkness!",
      ],
    },
    {
      q: "Who was one of the two who heard John speak and followed Jesus, and then first found his own brother Simon?",
      correct: "Andrew",
      wrong: [
        "Philip",
        "James",
        "John",
      ],
    },
    {
      q: "When Jesus looked at Simon, what name did he say Simon would be called?",
      correct: "Cephas",
      wrong: [
        "Boanerges",
        "Didymus",
        "Iscariot",
      ],
    },
    {
      q: "What was Nathanael's initial response when Philip told him they had found the one of whom Moses and the prophets wrote, Jesus of Nazareth?",
      correct: "Can anything good come out of Nazareth?",
      wrong: [
        "Is he not the carpenter's son?",
        "How can the Christ come from Galilee?",
        "Show me a sign, that I may believe.",
      ],
    },
  ],
  "jhn-2": [
    {
      q: "On what day was there a wedding at Cana in Galilee?",
      correct: "On the third day",
      wrong: [
        "On the seventh day",
        "On the Sabbath",
        "On the day of preparation",
      ],
    },
    {
      q: "How many stone water jars were standing there for the Jewish rites of purification?",
      correct: "Six",
      wrong: [
        "Seven",
        "Twelve",
        "Three",
      ],
    },
    {
      q: "What did Jesus use to drive the sheep and oxen out of the temple?",
      correct: "A whip of cords",
      wrong: [
        "A wooden staff",
        "A leather belt",
        "A rod of iron",
      ],
    },
    {
      q: "How long did the Jews say it had taken to build the temple, when Jesus said he would raise it up in three days?",
      correct: "Forty-six years",
      wrong: [
        "Forty years",
        "Fifty years",
        "Thirty-eight years",
      ],
    },
    {
      q: "Why did Jesus not entrust himself to the many who believed in his name in Jerusalem at the Passover feast?",
      correct: "Because he knew all people and needed no one to bear witness about man",
      wrong: [
        "Because their faith was built only on the signs they saw",
        "Because his hour had not yet come",
        "Because the Pharisees were already seeking to arrest him",
      ],
    },
  ],
  "jhn-3": [
    {
      q: "When did Nicodemus, a ruler of the Jews, come to Jesus?",
      correct: "By night",
      wrong: [
        "At the sixth hour",
        "During the festival of booths",
        "On the Sabbath morning",
      ],
    },
    {
      q: "Jesus told Nicodemus that unless one is born of what, he cannot enter the kingdom of God?",
      correct: "Water and the Spirit",
      wrong: [
        "Flesh and blood",
        "Truth and light",
        "Repentance and faith",
      ],
    },
    {
      q: "To what Old Testament event does Jesus compare the necessity of the Son of Man being lifted up?",
      correct: "Moses lifting up the serpent in the wilderness",
      wrong: [
        "Elijah being taken up in a whirlwind",
        "Abraham raising his knife over Isaac",
        "David raising the ark of the covenant",
      ],
    },
    {
      q: "Where was John baptizing because water was plentiful there?",
      correct: "At Aenon near Salim",
      wrong: [
        "At Bethany across the Jordan",
        "At the pool of Siloam",
        "At the Sea of Tiberias",
      ],
    },
    {
      q: "How does John the Baptist describe the one who stands and hears the bridegroom?",
      correct: "The friend of the bridegroom",
      wrong: [
        "The best man",
        "The servant of the feast",
        "The invited guest",
      ],
    },
  ],
  "jhn-4": [
    {
      q: "About what hour was it when Jesus, wearied from his journey, sat beside Jacob's well?",
      correct: "About the sixth hour",
      wrong: [
        "About the third hour",
        "About the ninth hour",
        "About the twelfth hour",
      ],
    },
    {
      q: "How many husbands did Jesus tell the Samaritan woman she had had?",
      correct: "Five",
      wrong: [
        "Three",
        "Seven",
        "None",
      ],
    },
    {
      q: "When the disciples returned to the well, what did they urge Jesus to do?",
      correct: "Rabbi, eat.",
      wrong: [
        "Rabbi, drink the water.",
        "Rabbi, let us leave this place.",
        "Rabbi, speak to the crowds.",
      ],
    },
    {
      q: "How long did Jesus stay with the Samaritans in the town of Sychar after they asked him to stay?",
      correct: "Two days",
      wrong: [
        "Three days",
        "Seven days",
        "One day",
      ],
    },
    {
      q: "At what exact hour did the official's servants tell him his son's fever had left?",
      correct: "The seventh hour",
      wrong: [
        "The sixth hour",
        "The third hour",
        "The ninth hour",
      ],
    },
  ],
  "jhn-5": [
    {
      q: "How long had the invalid man at the pool of Bethesda been there in his illness?",
      correct: "Thirty-eight years",
      wrong: [
        "Twelve years",
        "Eighteen years",
        "Forty years",
      ],
    },
    {
      q: "Why did the Jews tell the healed man it was not lawful for him to take up his bed?",
      correct: "Because it was the Sabbath",
      wrong: [
        "Because he had not yet shown himself to the priest",
        "Because the bed was unclean",
        "Because he was near the temple courts",
      ],
    },
    {
      q: "Why did the Jews seek all the more to kill Jesus after the healing at the pool?",
      correct: "Because he not only was breaking the Sabbath, but he was even calling God his own Father",
      wrong: [
        "Because he claimed he could rebuild the temple in three days",
        "Because he forgave the man's sins, which only God can do",
        "Because he told the crowds not to pay taxes to Caesar",
      ],
    },
    {
      q: "According to Jesus in chapter 5, to whom has the Father given all judgment?",
      correct: "The Son",
      wrong: [
        "The twelve apostles",
        "The angels in heaven",
        "The Spirit of truth",
      ],
    },
    {
      q: "Which Old Testament figure did Jesus say wrote of him, and on whom the Jews set their hope, but who would actually accuse them?",
      correct: "Moses",
      wrong: [
        "Abraham",
        "David",
        "Elijah",
      ],
    },
  ],
  "jhn-6": [
    {
      q: "When Jesus saw the large crowd coming toward him, which disciple did he test by asking, 'Where are we to buy bread, so that these people may eat?'",
      correct: "Philip",
      wrong: [
        "Andrew",
        "Thomas",
        "Judas Iscariot",
      ],
    },
    {
      q: "Which disciple pointed out the boy who had five barley loaves and two fish?",
      correct: "Andrew",
      wrong: [
        "Philip",
        "Peter",
        "John",
      ],
    },
    {
      q: "How far had the disciples rowed across the sea toward Capernaum when they saw Jesus walking on the sea?",
      correct: "Three or four miles",
      wrong: [
        "One or two miles",
        "Five or six miles",
        "Half a mile",
      ],
    },
    {
      q: "When the crowd asked for a sign, what did they say their fathers ate in the wilderness?",
      correct: "Manna",
      wrong: [
        "Quail",
        "Unleavened bread",
        "Honey from the rock",
      ],
    },
    {
      q: "What happened when Jesus taught 'whoever feeds on my flesh and drinks my blood has eternal life'?",
      correct: "Many of his disciples turned back and no longer walked with him",
      wrong: [
        "The Jews picked up stones to throw at him",
        "The twelve apostles questioned whether they should stay",
        "The crowds tried to take him by force to make him king",
      ],
    },
  ],
  "jhn-7": [
    {
      q: "Why did Jesus' brothers urge him to leave Galilee and go to Judea for the Feast of Booths?",
      correct: "So that his disciples also may see the works he was doing",
      wrong: [
        "Because it was required by the law of Moses",
        "To present himself to the chief priests",
        "To escape the plotting of Herod",
      ],
    },
    {
      q: "At what point during the feast did Jesus go up into the temple and begin teaching?",
      correct: "About the middle of the feast",
      wrong: [
        "On the first day of the feast",
        "On the last day of the feast",
        "On the day of preparation",
      ],
    },
    {
      q: "When Jesus asked the crowd 'Why do you seek to kill me?', how did the crowd respond?",
      correct: "You have a demon! Who is seeking to kill you?",
      wrong: [
        "Because you make yourself equal with God!",
        "Because you break the Sabbath!",
        "No one seeks to kill you, teacher.",
      ],
    },
    {
      q: "On the last day of the feast, what did Jesus say would flow from the heart of whoever believes in him?",
      correct: "Rivers of living water",
      wrong: [
        "A spring of eternal life",
        "The bread of heaven",
        "The light of the world",
      ],
    },
    {
      q: "Which Pharisee defended Jesus by asking, 'Does our law judge a man without first giving him a hearing and learning what he does?'",
      correct: "Nicodemus",
      wrong: [
        "Caiaphas",
        "Annas",
        "Joseph of Arimathea",
      ],
    },
  ],
  "jhn-8": [
    {
      q: "When the scribes and Pharisees brought a woman caught in adultery to Jesus, what did Jesus do first before answering them?",
      correct: "Bent down and wrote with his finger on the ground",
      wrong: [
        "Looked up to heaven and prayed for her",
        "Asked the woman where her accusers were",
        "Sighed deeply and told them to release her",
      ],
    },
    {
      q: "Jesus said, 'I am the light of the world.' In what specific part of the temple was he teaching when he said this?",
      correct: "In the treasury",
      wrong: [
        "In Solomon's Colonnade",
        "Near the altar of incense",
        "In the Court of the Gentiles",
      ],
    },
    {
      q: "Jesus told the Jews, 'If you abide in my word, you are truly my disciples, and you will know the truth, and the truth will set you free.' What was their immediate response?",
      correct: "We are offspring of Abraham and have never been enslaved to anyone.",
      wrong: [
        "We are disciples of Moses and follow the Law.",
        "How can you set us free from the Romans?",
        "We are not illegitimate children.",
      ],
    },
    {
      q: "Jesus told the Jews that they were of their father the devil, who was a murderer from the beginning. What else did he call the devil?",
      correct: "A liar and the father of lies",
      wrong: [
        "A roaring lion seeking to devour",
        "The prince of the power of the air",
        "The accuser of our brothers",
      ],
    },
    {
      q: "At the end of chapter 8, why did the Jews pick up stones to throw at Jesus?",
      correct: "Because he said, 'Before Abraham was, I am.'",
      wrong: [
        "Because he healed a man on the Sabbath.",
        "Because he claimed to be the Son of David.",
        "Because he told them their father was the devil.",
      ],
    },
  ],
  "jhn-9": [
    {
      q: "When his disciples asked why a man was born blind, what was Jesus' answer?",
      correct: "It was not that this man sinned, or his parents, but that the works of God might be displayed in him.",
      wrong: [
        "It was the sin of his parents that caused his blindness.",
        "It was a test of faith for the man and his family.",
        "He was cursed by the rulers of the synagogue.",
      ],
    },
    {
      q: "How did Jesus heal the blind man in chapter 9?",
      correct: "He spat on the ground, made mud, anointed the man's eyes, and told him to wash in the pool of Siloam.",
      wrong: [
        "He laid his hands on the man's eyes and prayed.",
        "He told the man, 'Your faith has made you well, receive your sight.'",
        "He commanded the darkness to leave the man's eyes.",
      ],
    },
    {
      q: "What did the blind man's parents say when the Pharisees asked them how their son could now see?",
      correct: "We know that this is our son and that he was born blind, but how he now sees we do not know... Ask him; he is of age.",
      wrong: [
        "We know that this man Jesus is a prophet, for he opened his eyes.",
        "He went to the pool of Siloam and washed, and came back seeing.",
        "We were not there when it happened, so we cannot testify to it.",
      ],
    },
    {
      q: "What did the Pharisees do to the healed man after he argued with them, saying 'If this man were not from God, he could do nothing'?",
      correct: "They cast him out.",
      wrong: [
        "They ordered him to be flogged.",
        "They brought him before the high priest.",
        "They forbade him from speaking the name of Jesus.",
      ],
    },
    {
      q: "After finding the healed man who had been cast out, what did Jesus ask him?",
      correct: "Do you believe in the Son of Man?",
      wrong: [
        "Do you know who healed you?",
        "Will you take up your cross and follow me?",
        "Do you see clearly now?",
      ],
    },
  ],
  "jhn-10": [
    {
      q: "In the parable of the sheepfold, for whom does the gatekeeper open the gate?",
      correct: "The shepherd of the sheep",
      wrong: [
        "The owner of the field",
        "The hired hand",
        "The lost sheep",
      ],
    },
    {
      q: "Jesus says, 'I am the good shepherd.' What does he say the good shepherd does?",
      correct: "Lays down his life for the sheep",
      wrong: [
        "Leads his sheep to green pastures",
        "Keeps his sheep from the wolves",
        "Knows his sheep by name",
      ],
    },
    {
      q: "What does Jesus say the hired hand does when he sees the wolf coming?",
      correct: "He leaves the sheep and flees",
      wrong: [
        "He fights the wolf but is overpowered",
        "He calls to the shepherd for help",
        "He gathers the sheep into the pen",
      ],
    },
    {
      q: "During what feast did the Jews gather around Jesus in Solomon's Colonnade, asking him to tell them plainly if he is the Christ?",
      correct: "The Feast of Dedication",
      wrong: [
        "The Feast of Booths",
        "The Passover",
        "The Feast of Unleavened Bread",
      ],
    },
    {
      q: "Jesus said, 'I give them eternal life, and they will never perish.' What did he add next regarding his sheep?",
      correct: "And no one will snatch them out of my hand.",
      wrong: [
        "And they shall dwell in the house of the Lord forever.",
        "And no thief can break in and steal them.",
        "And they will find pasture.",
      ],
    },
  ],
  "jhn-11": [
    {
      q: "What did Jesus say when he first heard that Lazarus was ill?",
      correct: "This illness does not lead to death. It is for the glory of God, so that the Son of God may be glorified through it.",
      wrong: [
        "Let us go to Judea again, for our friend has fallen asleep.",
        "If you believed, you would see the glory of God.",
        "Do not fear, only believe.",
      ],
    },
    {
      q: "How long did Jesus stay in the place where he was after hearing that Lazarus was ill?",
      correct: "Two days",
      wrong: [
        "Three days",
        "One day",
        "Four days",
      ],
    },
    {
      q: "When Jesus finally arrived in Bethany, how long had Lazarus already been in the tomb?",
      correct: "Four days",
      wrong: [
        "Three days",
        "Two days",
        "Five days",
      ],
    },
    {
      q: "When Jesus told Martha, 'Your brother will rise again,' how did she initially interpret this?",
      correct: "I know that he will rise again in the resurrection on the last day.",
      wrong: [
        "I know that whatever you ask from God, God will give you.",
        "I believe that you are the Christ, the Son of God.",
        "Lord, if you had been here, my brother would not have died.",
      ],
    },
    {
      q: "After the raising of Lazarus, Caiaphas prophesied that it was better for one man to die for the people than the whole nation perish. What was his position that year?",
      correct: "He was high priest",
      wrong: [
        "He was governor of Judea",
        "He was ruler of the synagogue",
        "He was head of the Sanhedrin",
      ],
    },
  ],
  "jhn-12": [
    {
      q: "Six days before the Passover, they gave a dinner for Jesus in Bethany. What was Lazarus doing at this dinner?",
      correct: "Reclining at table with him",
      wrong: [
        "Serving the guests",
        "Sitting at Jesus' feet",
        "Washing the disciples' feet",
      ],
    },
    {
      q: "Why did Judas Iscariot object to Mary anointing Jesus' feet with costly ointment?",
      correct: "He said the money should have been given to the poor, but he said this because he was a thief and in charge of the moneybag",
      wrong: [
        "He believed the ointment was unclean because it was not purchased at the temple",
        "He thought it was inappropriate for a woman to touch the Teacher's feet",
        "He said the money should have been given to the priests for a sacrifice",
      ],
    },
    {
      q: "The crowd took branches of palm trees and cried out, 'Hosanna! Blessed is he who comes in the name of the Lord...' What else did they call him?",
      correct: "Even the King of Israel!",
      wrong: [
        "The Son of David!",
        "The Prophet of Nazareth!",
        "The Lamb of God!",
      ],
    },
    {
      q: "Among those who went up to worship at the feast were some Greeks. Who did they approach first with the request, 'Sir, we wish to see Jesus'?",
      correct: "Philip",
      wrong: [
        "Andrew",
        "Peter",
        "John",
      ],
    },
    {
      q: "Jesus said, 'And I, when I am lifted up from the earth, will draw all people to myself.' What did he say this to show?",
      correct: "By what kind of death he was going to die",
      wrong: [
        "That he was ascending to the Father in heaven",
        "That he would be glorified before the crowds",
        "That the temple would be destroyed and raised up",
      ],
    },
  ],
  "jhn-13": [
    {
      q: "During the supper, when Jesus came to Simon Peter to wash his feet, what was Peter's initial reaction?",
      correct: "He said, 'Lord, do you wash my feet?' and 'You shall never wash my feet.'",
      wrong: [
        "He said, 'Lord, wash not my feet only but also my hands and my head!'",
        "He said, 'Lord, let me wash your feet instead.'",
        "He said, 'Lord, I am a sinful man, depart from me.'",
      ],
    },
    {
      q: "Jesus told his disciples, 'A new commandment I give to you...' What was this commandment?",
      correct: "That you love one another: just as I have loved you, you also are to love one another.",
      wrong: [
        "That you wash one another's feet, just as I have washed yours.",
        "That you go into all the world and proclaim the gospel.",
        "That you bear much fruit and prove to be my disciples.",
      ],
    },
    {
      q: "When the disciples asked who it was that would betray Jesus, how did Jesus identify him?",
      correct: "It is he to whom I will give this morsel of bread when I have dipped it.",
      wrong: [
        "It is the one who dips his hand in the dish with me.",
        "The one who leaves this table before the rooster crows.",
        "He who sits at my left hand.",
      ],
    },
    {
      q: "What did Jesus say to Judas immediately after giving him the morsel of bread?",
      correct: "What you are going to do, do quickly.",
      wrong: [
        "Woe to that man by whom the Son of Man is betrayed.",
        "Go and collect your pieces of silver.",
        "Your hour has come, as it is written.",
      ],
    },
    {
      q: "Jesus told Peter that the rooster would not crow until Peter had denied him how many times?",
      correct: "Three times",
      wrong: [
        "Two times",
        "Until the morning",
        "Before the sun rises",
      ],
    },
  ],
  "jhn-14": [
    {
      q: "Jesus says, 'In my Father's house are many rooms. If it were not so, would I have told you that...' what?",
      correct: "I go to prepare a place for you",
      wrong: [
        "I will return to bring you home",
        "There is room enough for all who believe",
        "You know the way to where I am going",
      ],
    },
    {
      q: "When Thomas asks, 'Lord, we do not know where you are going. How can we know the way?', what is Jesus' reply?",
      correct: "I am the way, and the truth, and the life. No one comes to the Father except through me.",
      wrong: [
        "I am the gate for the sheep. Whoever enters through me will be saved.",
        "I am the light of the world. Whoever follows me will not walk in darkness.",
        "I am the bread of life; whoever comes to me shall not hunger.",
      ],
    },
    {
      q: "Which disciple said to Jesus, 'Lord, show us the Father, and it is enough for us'?",
      correct: "Philip",
      wrong: [
        "Thomas",
        "Peter",
        "Judas (not Iscariot)",
      ],
    },
    {
      q: "Jesus promises to ask the Father to give the disciples 'another Helper, to be with you forever.' Who is this Helper?",
      correct: "The Spirit of truth",
      wrong: [
        "The Angel of the Lord",
        "The Comforter of Zion",
        "The Spirit of wisdom",
      ],
    },
    {
      q: "Jesus said, 'Peace I leave with you; my peace I give to you.' How does he say he does NOT give it?",
      correct: "As the world gives",
      wrong: [
        "As the prophets spoke",
        "As the law demands",
        "As a temporary comfort",
      ],
    },
  ],
  "jhn-15": [
    {
      q: "In the metaphor of the vine, what does the Father do to every branch that DOES bear fruit?",
      correct: "He prunes it, that it may bear more fruit",
      wrong: [
        "He waters it with living water",
        "He grafts it into a new tree",
        "He leaves it alone until the harvest",
      ],
    },
    {
      q: "Jesus says, 'Greater love has no one than this...' What is the greatest love according to this verse?",
      correct: "That someone lay down his life for his friends",
      wrong: [
        "That someone forgives his enemies seventy times seven times",
        "That someone gives all he has to the poor",
        "That someone keeps all the commandments of the Father",
      ],
    },
    {
      q: "What reason does Jesus give for why the world hates the disciples?",
      correct: "Because they are not of the world, but Jesus chose them out of the world",
      wrong: [
        "Because they preach repentance to a wicked generation",
        "Because they do not follow the traditions of the elders",
        "Because they belong to the light and the world loves darkness",
      ],
    },
    {
      q: "Jesus said the world would not have been guilty of sin if he had not done what among them?",
      correct: "Done the works that no one else did",
      wrong: [
        "Spoken the truth in love",
        "Raised the dead to life",
        "Brought the law of Moses to fulfillment",
      ],
    },
    {
      q: "When the Helper comes, whom Jesus will send from the Father, what will he do?",
      correct: "He will bear witness about Jesus",
      wrong: [
        "He will bring fire upon the earth",
        "He will judge the twelve tribes of Israel",
        "He will cast out the ruler of this world",
      ],
    },
  ],
  "jhn-16": [
    {
      q: "Why did Jesus say he was saying these things to the disciples?",
      correct: "To keep them from falling away",
      wrong: [
        "So they would know the time of his return",
        "To prepare them for the destruction of the temple",
        "So they could write them down for the next generation",
      ],
    },
    {
      q: "Jesus says it is to the disciples' advantage that he goes away. Why?",
      correct: "Because if he does not go away, the Helper will not come to them",
      wrong: [
        "Because he must go to prepare a place for them",
        "Because the Father has commanded him to return to heaven",
        "Because the world cannot bear his presence any longer",
      ],
    },
    {
      q: "When the Spirit of truth comes, regarding what three things will he convict the world?",
      correct: "Concerning sin and righteousness and judgment",
      wrong: [
        "Concerning truth and love and peace",
        "Concerning the law and the prophets and the psalms",
        "Concerning life and death and resurrection",
      ],
    },
    {
      q: "What metaphor does Jesus use to describe the disciples' sorrow turning into joy?",
      correct: "A woman in labor who rejoices when her baby is born",
      wrong: [
        "A farmer weeping as he sows but rejoicing at the harvest",
        "A blind man seeing the sun for the first time",
        "A lost sheep being found by the shepherd",
      ],
    },
    {
      q: "At the end of chapter 16, why does Jesus tell his disciples to take heart?",
      correct: "Because he has overcome the world",
      wrong: [
        "Because the Holy Spirit is with them",
        "Because the Father loves them",
        "Because their names are written in heaven",
      ],
    },
  ],
  "jhn-17": [
    {
      q: "In his prayer, how does Jesus define 'eternal life'?",
      correct: "That they know you, the only true God, and Jesus Christ whom you have sent",
      wrong: [
        "That they may dwell in the house of the Lord forever",
        "That they believe in the resurrection of the dead",
        "That they keep the commandments and love their neighbors",
      ],
    },
    {
      q: "Jesus says he kept the disciples in the Father's name, and none of them was lost EXCEPT whom?",
      correct: "The son of destruction",
      wrong: [
        "The one who loved the world",
        "The thief who held the moneybag",
        "The false prophet",
      ],
    },
    {
      q: "Jesus asks the Father to sanctify the disciples in the truth. What does he say IS truth?",
      correct: "Your word is truth",
      wrong: [
        "The Spirit is truth",
        "The light is truth",
        "My commandments are truth",
      ],
    },
    {
      q: "For whom does Jesus say he is NOT praying in this chapter?",
      correct: "The world",
      wrong: [
        "The Pharisees and scribes",
        "Those who will crucify him",
        "The Roman authorities",
      ],
    },
    {
      q: "Jesus prays not only for the disciples present, but also for whom?",
      correct: "Those who will believe in him through their word",
      wrong: [
        "The lost sheep of the house of Israel",
        "The Gentiles who seek the light",
        "The future generations of prophets",
      ],
    },
  ],
  "jhn-18": [
    {
      q: "When the band of soldiers and officers said they were seeking Jesus of Nazareth, what happened when Jesus replied, 'I am he'?",
      correct: "They drew back and fell to the ground",
      wrong: [
        "They immediately seized him and bound his hands",
        "Judas stepped forward and kissed him on the cheek",
        "The captain of the guard struck him with a spear",
      ],
    },
    {
      q: "Who was the father-in-law of Caiaphas, the high priest that year, to whom Jesus was led first?",
      correct: "Annas",
      wrong: [
        "Nicodemus",
        "Alexander",
        "Joseph of Arimathea",
      ],
    },
    {
      q: "What was the name of the high priest's servant whose right ear Peter cut off?",
      correct: "Malchus",
      wrong: [
        "Rufus",
        "Barabbas",
        "Cleopas",
      ],
    },
    {
      q: "When Pilate asked Jesus, 'Are you the King of the Jews?', what did Jesus say his kingdom is NOT?",
      correct: "Of this world",
      wrong: [
        "From the lineage of David",
        "A kingdom of flesh and blood",
        "An earthly inheritance",
      ],
    },
    {
      q: "What crime had Barabbas, the man the Jews asked Pilate to release, committed according to John's Gospel?",
      correct: "He was a robber",
      wrong: [
        "He was a murderer",
        "He was an insurrectionist",
        "He was a zealot",
      ],
    },
  ],
  "jhn-19": [
    {
      q: "What did the soldiers twist together and put on Jesus' head?",
      correct: "A crown of thorns",
      wrong: [
        "A wreath of olive branches",
        "A purple turban",
        "A band of woven reeds",
      ],
    },
    {
      q: "What inscription did Pilate write and put on the cross?",
      correct: "Jesus of Nazareth, the King of the Jews",
      wrong: [
        "This is Jesus, the King of the Jews",
        "Jesus, the Son of God",
        "The King of Israel",
      ],
    },
    {
      q: "When the soldiers crucified Jesus, how many parts did they divide his garments into?",
      correct: "Four parts, one for each soldier",
      wrong: [
        "Two parts",
        "Three parts",
        "Twelve parts",
      ],
    },
    {
      q: "What were the last words of Jesus on the cross according to the Gospel of John?",
      correct: "'It is finished.'",
      wrong: [
        "'Father, into your hands I commit my spirit.'",
        "'My God, my God, why have you forsaken me?'",
        "'Truly, I say to you, today you will be with me in paradise.'",
      ],
    },
    {
      q: "Who brought a mixture of myrrh and aloes, about seventy-five pounds in weight, to Jesus' burial?",
      correct: "Nicodemus",
      wrong: [
        "Joseph of Arimathea",
        "Mary Magdalene",
        "John the beloved disciple",
      ],
    },
  ],
  "jhn-20": [
    {
      q: "Who was the first person to come to the tomb early on the first day of the week, while it was still dark?",
      correct: "Mary Magdalene",
      wrong: [
        "Peter",
        "John",
        "Mary the mother of James",
      ],
    },
    {
      q: "Which disciple outran Peter and reached the tomb first?",
      correct: "The other disciple, whom Jesus loved",
      wrong: [
        "Andrew",
        "James",
        "Thomas",
      ],
    },
    {
      q: "When Mary first saw Jesus standing outside the tomb, who did she suppose him to be?",
      correct: "The gardener",
      wrong: [
        "An angel",
        "The Roman guard",
        "A traveler from Emmaus",
      ],
    },
    {
      q: "What did Jesus do when he appeared to the disciples behind locked doors and said, 'Receive the Holy Spirit'?",
      correct: "He breathed on them",
      wrong: [
        "He laid his hands on their heads",
        "He broke bread and gave it to them",
        "He poured water over their feet",
      ],
    },
    {
      q: "What did Thomas say he needed to see and touch before he would believe Jesus had risen?",
      correct: "The mark of the nails in his hands and his side",
      wrong: [
        "The wounds on his back and the crown of thorns",
        "The scars on his feet and hands",
        "The empty tomb and the linen cloths",
      ],
    },
  ],
  "jhn-21": [
    {
      q: "When Jesus appeared by the Sea of Tiberias, what did he tell the disciples to do after they had caught nothing all night?",
      correct: "Cast the net on the right side of the boat, and you will find some.",
      wrong: [
        "Put out into the deep and let down your nets for a catch.",
        "Leave your nets and come ashore, for breakfast is ready.",
        "Cast the net once more in the name of the Father.",
      ],
    },
    {
      q: "How many large fish were in the net when Peter hauled it ashore?",
      correct: "153",
      wrong: [
        "144",
        "120",
        "70",
      ],
    },
    {
      q: "When Jesus had breakfast with the disciples, how many times did he ask Simon Peter, 'Do you love me?'",
      correct: "Three times",
      wrong: [
        "Two times",
        "Seven times",
        "Once",
      ],
    },
    {
      q: "What kind of death was Jesus indicating Peter would die when he said another would dress him and carry him where he did not want to go?",
      correct: "A death to glorify God",
      wrong: [
        "A death by the sword",
        "A death in exile on an island",
        "A death by stoning",
      ],
    },
    {
      q: "When Peter saw the disciple whom Jesus loved following them, what did he ask Jesus?",
      correct: "'Lord, what about this man?'",
      wrong: [
        "'Lord, will he also die a martyr?'",
        "'Lord, is he the one who will betray you?'",
        "'Lord, should he come with us?'",
      ],
    },
  ],
  "act-1": [
    {
      q: "How many days did Jesus present himself alive to the apostles after his suffering before he ascended?",
      correct: "Forty days",
      wrong: [
        "Three days",
        "Seven days",
        "Fifty days",
      ],
    },
    {
      q: "What were the apostles commanded not to depart from while waiting for the promise of the Father?",
      correct: "Jerusalem",
      wrong: [
        "Galilee",
        "The Mount of Olives",
        "The upper room",
      ],
    },
    {
      q: "What was the field bought with the reward of Judas's wickedness called in their own language?",
      correct: "Akeldama",
      wrong: [
        "Golgotha",
        "Gethsemane",
        "Gabbatha",
      ],
    },
    {
      q: "Which two men were put forward to take the place of Judas in the apostolic ministry?",
      correct: "Joseph called Barsabbas and Matthias",
      wrong: [
        "Justus called Matthias and Barnabas",
        "Joseph called Barsabbas and Stephen",
        "Silas and Matthias",
      ],
    },
    {
      q: "How did the apostles make the final choice between the two men proposed to replace Judas?",
      correct: "They prayed and cast lots",
      wrong: [
        "They fasted and laid hands on them",
        "Peter chose by the Spirit's leading",
        "The congregation voted",
      ],
    },
  ],
  "act-2": [
    {
      q: "When the day of Pentecost arrived, what sound came from heaven?",
      correct: "A sound like a mighty rushing wind",
      wrong: [
        "A sound like a great trumpet blast",
        "A sound like rushing water",
        "A sound of a great earthquake",
      ],
    },
    {
      q: "What did the mockers accuse the believers of being filled with when they spoke in tongues?",
      correct: "New wine",
      wrong: [
        "Evil spirits",
        "Madness",
        "Old wine",
      ],
    },
    {
      q: "Which prophet did Peter quote to explain what was happening on the day of Pentecost?",
      correct: "Joel",
      wrong: [
        "Isaiah",
        "Jeremiah",
        "Ezekiel",
      ],
    },
    {
      q: "What did Peter explicitly say about the patriarch David during his sermon?",
      correct: "That he died, was buried, and his tomb is with them to this day",
      wrong: [
        "That he ascended into the heavens like his Lord",
        "That his body did not see corruption",
        "That he was a prophet who foresaw the temple's destruction",
      ],
    },
    {
      q: "About how many souls were added to the believers on the day of Pentecost?",
      correct: "Three thousand",
      wrong: [
        "Five thousand",
        "One hundred and twenty",
        "Five hundred",
      ],
    },
  ],
  "act-3": [
    {
      q: "At what hour of the day were Peter and John going up to the temple when they met the lame man?",
      correct: "The ninth hour",
      wrong: [
        "The third hour",
        "The sixth hour",
        "The twelfth hour",
      ],
    },
    {
      q: "What was the name of the temple gate where the lame man was laid daily?",
      correct: "The Beautiful Gate",
      wrong: [
        "The Sheep Gate",
        "The Water Gate",
        "The Eastern Gate",
      ],
    },
    {
      q: "What did Peter tell the lame man he did not have to give him?",
      correct: "Silver and gold",
      wrong: [
        "Food and clothing",
        "A place to stay",
        "A sacrifice for the temple",
      ],
    },
    {
      q: "Where did the astounded people run together to see Peter, John, and the healed man?",
      correct: "The portico called Solomon's",
      wrong: [
        "The Court of the Gentiles",
        "The Mount of Olives",
        "The upper room",
      ],
    },
    {
      q: "In his speech, Peter accused the people of asking for a murderer to be granted to them while they killed whom?",
      correct: "The Author of life",
      wrong: [
        "The King of the Jews",
        "The Son of David",
        "The Lamb of God",
      ],
    },
  ],
  "act-4": [
    {
      q: "Which group of people came upon Peter and John, greatly annoyed because they were proclaiming in Jesus the resurrection from the dead?",
      correct: "The priests, the captain of the temple, and the Sadducees",
      wrong: [
        "The Pharisees, the scribes, and the elders",
        "The Roman guards and the centurion",
        "The Hellenists and the Hebrews",
      ],
    },
    {
      q: "After Peter and John were arrested, the number of the men who believed came to about how many?",
      correct: "Five thousand",
      wrong: [
        "Three thousand",
        "Seven thousand",
        "One hundred and twenty",
      ],
    },
    {
      q: "What did the council recognize about Peter and John when they saw their boldness and realized they were uneducated, common men?",
      correct: "That they had been with Jesus",
      wrong: [
        "That they had been filled with the Holy Spirit",
        "That they were from Galilee",
        "That they possessed the power of Elijah",
      ],
    },
    {
      q: "What physical event happened immediately after the believers prayed for boldness to speak the word?",
      correct: "The place in which they were gathered together was shaken",
      wrong: [
        "Tongues of fire appeared over them again",
        "An angel opened the prison doors",
        "A bright light shone from heaven",
      ],
    },
    {
      q: "What did the apostles surname Joseph, a Levite and native of Cyprus?",
      correct: "Barnabas",
      wrong: [
        "Barsabbas",
        "Justus",
        "Silas",
      ],
    },
  ],
  "act-5": [
    {
      q: "What was the name of Ananias's wife, who also lied about the proceeds of the land?",
      correct: "Sapphira",
      wrong: [
        "Tabitha",
        "Priscilla",
        "Lydia",
      ],
    },
    {
      q: "How much time passed between the death of Ananias and the arrival of his wife?",
      correct: "About three hours",
      wrong: [
        "About an hour",
        "The next morning",
        "Until evening",
      ],
    },
    {
      q: "In the hope of being healed, the people even carried out the sick into the streets so that what might fall on them?",
      correct: "Peter's shadow",
      wrong: [
        "John's cloak",
        "Drops of oil from the apostles",
        "The dust from their feet",
      ],
    },
    {
      q: "Who opened the prison doors by night and brought the apostles out?",
      correct: "An angel of the Lord",
      wrong: [
        "A sympathetic centurion",
        "Barnabas",
        "A secretly believing Pharisee",
      ],
    },
    {
      q: "Which Pharisee and teacher of the law stood up in the council and advised them to keep away from the apostles?",
      correct: "Gamaliel",
      wrong: [
        "Nicodemus",
        "Joseph of Arimathea",
        "Saul",
      ],
    },
  ],
  "act-6": [
    {
      q: "Why did the Hellenists arise with a complaint against the Hebrews?",
      correct: "Their widows were being neglected in the daily distribution",
      wrong: [
        "They were not allowed to teach in the temple",
        "They were being taxed unfairly by the council",
        "Their men were excluded from the breaking of bread",
      ],
    },
    {
      q: "How many men of good repute, full of the Spirit and of wisdom, were chosen to serve tables?",
      correct: "Seven",
      wrong: [
        "Twelve",
        "Ten",
        "Seventy",
      ],
    },
    {
      q: "Who among the chosen men was described as a proselyte of Antioch?",
      correct: "Nicolaus",
      wrong: [
        "Parmenas",
        "Timon",
        "Nicanor",
      ],
    },
    {
      q: "Members of which synagogue secretly instigated men to say they heard Stephen speak blasphemous words against Moses and God?",
      correct: "The synagogue of the Freedmen",
      wrong: [
        "The synagogue of the Hebrews",
        "The synagogue of the Hellenists",
        "The synagogue of the Alexandrians",
      ],
    },
    {
      q: "When the council gazed at Stephen during his trial, what did his face look like?",
      correct: "The face of an angel",
      wrong: [
        "The face of Moses coming down from the mountain",
        "The face of a lion",
        "Shining like the sun",
      ],
    },
  ],
  "act-7": [
    {
      q: "In his defense, Stephen states that God appeared to Abraham when he was in Mesopotamia, before he lived where?",
      correct: "Haran",
      wrong: [
        "Ur of the Chaldeans",
        "Egypt",
        "Canaan",
      ],
    },
    {
      q: "How long did Stephen say Abraham's offspring would be enslaved and afflicted in a foreign land?",
      correct: "Four hundred years",
      wrong: [
        "Four hundred and thirty years",
        "Seventy years",
        "Forty years",
      ],
    },
    {
      q: "According to Stephen, how old was Moses when it came into his heart to visit his brothers, the children of Israel?",
      correct: "Forty years old",
      wrong: [
        "Thirty years old",
        "Eighty years old",
        "Twelve years old",
      ],
    },
    {
      q: "What did Stephen accuse the council of being, regarding their hearts and ears?",
      correct: "Stiff-necked, uncircumcised in heart and ears",
      wrong: [
        "Blind guides, hypocrites in heart and ears",
        "Brood of vipers, hardened in heart and ears",
        "Whitewashed tombs, deaf in heart and ears",
      ],
    },
    {
      q: "As Stephen was being stoned, what did the witnesses do with their garments?",
      correct: "Laid them at the feet of a young man named Saul",
      wrong: [
        "Tore them in grief and repentance",
        "Put them over Stephen's head to muffle his voice",
        "Threw them into the fire outside the city",
      ],
    },
  ],
  "act-8": [
    {
      q: "What did Saul do to the church in Jerusalem immediately after Stephen's death?",
      correct: "He ravaged the church by entering house after house, dragging off men and women to prison",
      wrong: [
        "He stood before the high priest and demanded the execution of all the apostles",
        "He ordered the Roman guards to seize the property of all who believed",
        "He debated the Hellenists daily in the synagogue of the Freedmen",
      ],
    },
    {
      q: "What was the occupation of Simon before Philip came to Samaria?",
      correct: "He practiced magic and amazed the people, claiming to be someone great",
      wrong: [
        "He was a silversmith who made shrines for the local deities",
        "He was a Roman centurion stationed in the city",
        "He was a scribe who taught the law of Moses",
      ],
    },
    {
      q: "What did Simon the magician offer Peter and John money for?",
      correct: "The power that anyone on whom he laid hands might receive the Holy Spirit",
      wrong: [
        "The power to heal the sick and cast out unclean spirits",
        "The authority to be an apostle in the church at Jerusalem",
        "The secret to interpreting the scrolls of the prophets",
      ],
    },
    {
      q: "Which prophet was the Ethiopian eunuch reading when Philip approached his chariot?",
      correct: "Isaiah",
      wrong: [
        "Jeremiah",
        "Ezekiel",
        "Daniel",
      ],
    },
    {
      q: "Where did Philip find himself after the Spirit of the Lord carried him away from the eunuch?",
      correct: "Azotus",
      wrong: [
        "Caesarea",
        "Joppa",
        "Lydda",
      ],
    },
  ],
  "act-9": [
    {
      q: "To the synagogues in which city did Saul ask the high priest for letters, so he might arrest followers of the Way?",
      correct: "Damascus",
      wrong: [
        "Antioch",
        "Tarsus",
        "Ephesus",
      ],
    },
    {
      q: "For how many days was Saul without sight after his encounter on the road?",
      correct: "Three days",
      wrong: [
        "Seven days",
        "Twelve days",
        "Forty days",
      ],
    },
    {
      q: "Who took Saul and brought him to the apostles in Jerusalem when they were all afraid of him?",
      correct: "Barnabas",
      wrong: [
        "Ananias",
        "Silas",
        "Philip",
      ],
    },
    {
      q: "How long had Aeneas been bedridden with paralysis before Peter healed him in Lydda?",
      correct: "Eight years",
      wrong: [
        "Twelve years",
        "Three years",
        "Eighteen years",
      ],
    },
    {
      q: "What did the widows show Peter when he arrived in the upper room where the body of Dorcas lay?",
      correct: "Tunics and other garments she had made while she was with them",
      wrong: [
        "Alms and coins she had gathered for the poor",
        "Scrolls of the law she had faithfully copied",
        "Jars of oil and spices she had prepared for her burial",
      ],
    },
  ],
  "act-10": [
    {
      q: "In what cohort was Cornelius a centurion?",
      correct: "The Italian Cohort",
      wrong: [
        "The Augustan Cohort",
        "The Praetorian Guard",
        "The Syrian Cohort",
      ],
    },
    {
      q: "At what hour of the day did Cornelius clearly see an angel of God in a vision?",
      correct: "About the ninth hour",
      wrong: [
        "About the third hour",
        "About the sixth hour",
        "At midnight",
      ],
    },
    {
      q: "What was Peter doing on the housetop about the sixth hour when he fell into a trance?",
      correct: "Praying",
      wrong: [
        "Sleeping",
        "Eating",
        "Mending his nets",
      ],
    },
    {
      q: "How many men did the Spirit tell Peter were looking for him?",
      correct: "Three",
      wrong: [
        "Two",
        "Five",
        "Seven",
      ],
    },
    {
      q: "What did Peter command to be done to the Gentiles after the Holy Spirit fell upon them?",
      correct: "That they be baptized in the name of Jesus Christ",
      wrong: [
        "That they be circumcised according to the custom of Moses",
        "That they travel to Jerusalem to present themselves to the apostles",
        "That they sell their possessions and give alms to the poor",
      ],
    },
  ],
  "act-11": [
    {
      q: "What specific criticism did the circumcision party bring against Peter when he returned to Jerusalem?",
      correct: "You went to uncircumcised men and ate with them",
      wrong: [
        "You baptized Gentiles without teaching them the law of Moses",
        "You stayed in the house of Simon the tanner, an unclean place",
        "You commanded the centurion to forsake his military oath",
      ],
    },
    {
      q: "How many brothers accompanied Peter from Joppa to Cornelius's house, according to his report in Jerusalem?",
      correct: "Six",
      wrong: [
        "Three",
        "Ten",
        "Twelve",
      ],
    },
    {
      q: "Those scattered by the persecution over Stephen traveled as far as Phoenicia, Cyprus, and Antioch, speaking the word to no one except whom?",
      correct: "Jews",
      wrong: [
        "Hellenists",
        "God-fearing Greeks",
        "Samaritans",
      ],
    },
    {
      q: "Who did the church in Jerusalem send to Antioch when they heard of the great number who believed?",
      correct: "Barnabas",
      wrong: [
        "Peter",
        "Silas",
        "John",
      ],
    },
    {
      q: "In which city were the disciples first called Christians?",
      correct: "Antioch",
      wrong: [
        "Jerusalem",
        "Damascus",
        "Tarsus",
      ],
    },
  ],
  "act-12": [
    {
      q: "During which days did Herod arrest Peter and put him in prison?",
      correct: "The days of Unleavened Bread",
      wrong: [
        "The Feast of Weeks (Pentecost)",
        "The Feast of Booths",
        "The Day of Atonement",
      ],
    },
    {
      q: "How many squads of soldiers did Herod deliver Peter over to be guarded by?",
      correct: "Four squads",
      wrong: [
        "Two squads",
        "Six squads",
        "Ten squads",
      ],
    },
    {
      q: "What was the name of the servant girl who recognized Peter's voice at the gate of Mary's house?",
      correct: "Rhoda",
      wrong: [
        "Lydia",
        "Tabitha",
        "Damaris",
      ],
    },
    {
      q: "What did the believers gathered at Mary's house say when the servant girl insisted Peter was at the gate?",
      correct: "You are out of your mind",
      wrong: [
        "It is a trap set by Herod's men",
        "Let us go out and meet him secretly",
        "An angel must have delivered him",
      ],
    },
    {
      q: "Why did an angel of the Lord strike Herod down, leading to his death by worms?",
      correct: "Because he did not give God the glory",
      wrong: [
        "Because he killed James the brother of John with the sword",
        "Because he plotted to kill Peter after the Passover",
        "Because he oppressed the people of Tyre and Sidon",
      ],
    },
  ],
  "act-13": [
    {
      q: "Which of these men was NOT listed among the prophets and teachers at Antioch before Barnabas and Saul were sent off?",
      correct: "Silas",
      wrong: [
        "Simeon who was called Niger",
        "Lucius of Cyrene",
        "Manaen a lifelong friend of Herod the tetrarch",
      ],
    },
    {
      q: "What was the name of the Jewish false prophet and magician who was with the proconsul Sergius Paulus in Paphos?",
      correct: "Bar-Jesus (Elymas)",
      wrong: [
        "Simon the Sorcerer",
        "Apollos",
        "Sceva",
      ],
    },
    {
      q: "Who left Paul and his companions at Perga in Pamphylia and returned to Jerusalem?",
      correct: "John",
      wrong: [
        "Barnabas",
        "Timothy",
        "Titus",
      ],
    },
    {
      q: "In his sermon at Antioch in Pisidia, how long did Paul say God gave Israel judges until Samuel the prophet?",
      correct: "About four hundred and fifty years",
      wrong: [
        "About four hundred years",
        "About three hundred years",
        "About seventy years",
      ],
    },
    {
      q: "When the Jews in Antioch in Pisidia saw the crowds on the next Sabbath and contradicted Paul, what did Paul and Barnabas say they must now do?",
      correct: "Turn to the Gentiles",
      wrong: [
        "Shake the dust from their feet and leave immediately",
        "Appeal to the Roman governor for protection",
        "Fast and pray that God would soften their hearts",
      ],
    },
  ],
  "act-14": [
    {
      q: "In Iconium, how did the unbelieving Jews stir up the Gentiles against the brothers?",
      correct: "They poisoned their minds against the brothers",
      wrong: [
        "They paid them silver to riot in the marketplace",
        "They accused Paul of bringing an uncircumcised Greek into the synagogue",
        "They claimed the brothers were plotting a rebellion against Caesar",
      ],
    },
    {
      q: "In Lystra, what names did the crowds call Barnabas and Paul after Paul healed a crippled man?",
      correct: "Zeus and Hermes",
      wrong: [
        "Apollo and Ares",
        "Jupiter and Mercury",
        "Elijah and Moses",
      ],
    },
    {
      q: "What did the priest of Zeus bring to the city gates, intending to offer a sacrifice with the crowds?",
      correct: "Bulls and garlands",
      wrong: [
        "Lambs and incense",
        "Gold and silver idols",
        "Grain offerings and wine",
      ],
    },
    {
      q: "Who came to Lystra from Antioch and Iconium, and persuaded the crowds to stone Paul?",
      correct: "Jews",
      wrong: [
        "Roman officials",
        "Priests of Zeus",
        "Local magistrates",
      ],
    },
    {
      q: "What did Paul and Barnabas do in every church they visited on their way back to Antioch before committing them to the Lord?",
      correct: "Appointed elders for them with prayer and fasting",
      wrong: [
        "Collected an offering for the poor in Jerusalem",
        "Baptized the new believers with water and the Spirit",
        "Wrote letters of instruction to be read on the Sabbath",
      ],
    },
  ],
  "act-15": [
    {
      q: "What custom did men coming down from Judea teach the brothers in Antioch was necessary to be saved?",
      correct: "Circumcision according to the custom of Moses",
      wrong: [
        "Fasting twice a week",
        "Keeping the Sabbath strictly",
        "Offering sacrifices at the temple",
      ],
    },
    {
      q: "Which prophet did James quote to support his judgment at the Jerusalem council?",
      correct: "Amos",
      wrong: [
        "Isaiah",
        "Jeremiah",
        "Joel",
      ],
    },
    {
      q: "Which of the following was NOT one of the things the council's letter instructed the Gentile believers to abstain from?",
      correct: "Working on the Sabbath day",
      wrong: [
        "Things sacrificed to idols",
        "Blood and what has been strangled",
        "Sexual immorality",
      ],
    },
    {
      q: "Who did the apostles and elders choose to send to Antioch with Paul and Barnabas to deliver the letter?",
      correct: "Judas called Barsabbas, and Silas",
      wrong: [
        "Timothy and Titus",
        "John Mark and Luke",
        "Aquila and Priscilla",
      ],
    },
    {
      q: "Why did a sharp disagreement arise between Paul and Barnabas, causing them to separate?",
      correct: "Barnabas wanted to take John called Mark, but Paul thought best not to take him",
      wrong: [
        "They disagreed on whether to visit Cyprus or Syria first",
        "Barnabas wanted to require circumcision for the new converts",
        "Paul wanted to preach in Asia, but Barnabas wanted to go to Macedonia",
      ],
    },
  ],
  "act-16": [
    {
      q: "Why did Paul have Timothy circumcised before taking him on his journey?",
      correct: "Because of the Jews who were in those places, for they all knew his father was a Greek",
      wrong: [
        "Because the letter from the Jerusalem council required it of all leaders",
        "Because Timothy's mother, a Jewish believer, requested it",
        "Because it was necessary for him to enter the temple in Jerusalem",
      ],
    },
    {
      q: "What vision did Paul have in the night while at Troas?",
      correct: "A man of Macedonia urging him to come over and help them",
      wrong: [
        "An angel telling him to speak boldly in Corinth",
        "The Lord saying he would suffer many things in Jerusalem",
        "A scroll from heaven containing the names of the elect",
      ],
    },
    {
      q: "What was the trade of Lydia, the worshiper of God who listened to Paul in Philippi?",
      correct: "A seller of purple goods",
      wrong: [
        "A maker of tents",
        "A silversmith",
        "A merchant of fine spices",
      ],
    },
    {
      q: "What happened to the jailer when the earthquake opened the prison doors and unfastened the bonds?",
      correct: "He drew his sword and was about to kill himself",
      wrong: [
        "He ran into the city to alert the magistrates",
        "He fell to his knees and begged the prisoners not to escape",
        "He locked the inner doors and stood guard at the gate",
      ],
    },
    {
      q: "Why did the magistrates in Philippi come and apologize to Paul and Silas?",
      correct: "They realized Paul and Silas were Roman citizens who had been beaten uncondemned",
      wrong: [
        "The earthquake terrified them into believing Paul's message",
        "The crowds demanded their release after hearing them sing hymns",
        "The jailer testified of his household's conversion",
      ],
    },
  ],
  "act-17": [
    {
      q: "Whose house did the mob attack in Thessalonica, seeking to bring Paul and Silas out to the crowd?",
      correct: "Jason's",
      wrong: [
        "Crispus's",
        "Titius Justus's",
        "Sopater's",
      ],
    },
    {
      q: "Why were the Jews in Berea considered more noble than those in Thessalonica?",
      correct: "They received the word with eagerness, examining the Scriptures daily",
      wrong: [
        "They refused to listen to the rabble-rousers from Antioch",
        "They immediately gave money to support Paul's ministry",
        "They allowed Gentiles to worship in their synagogue",
      ],
    },
    {
      q: "Which two groups of philosophers conversed with Paul in the marketplace in Athens?",
      correct: "Epicurean and Stoic",
      wrong: [
        "Platonic and Aristotelian",
        "Pythagorean and Cynic",
        "Sophist and Gnostic",
      ],
    },
    {
      q: "What inscription did Paul read on an altar in Athens that he used as a starting point for his sermon?",
      correct: "To the unknown god",
      wrong: [
        "To the creator of heaven and earth",
        "To the god of all nations",
        "To the unseen deity",
      ],
    },
    {
      q: "Which member of the Areopagus is specifically named as having joined Paul and believed?",
      correct: "Dionysius",
      wrong: [
        "Damaris",
        "Gallio",
        "Erastus",
      ],
    },
  ],
  "act-18": [
    {
      q: "Why had Aquila and Priscilla recently come from Italy to Corinth?",
      correct: "Because Claudius had commanded all the Jews to leave Rome",
      wrong: [
        "Because they were fleeing persecution from the Sanhedrin",
        "Because the famine in Italy forced them to seek work",
        "Because they heard Paul was preaching the gospel there",
      ],
    },
    {
      q: "What trade did Paul share with Aquila and Priscilla, which they worked at together?",
      correct: "Tentmakers",
      wrong: [
        "Tanners",
        "Coppersmiths",
        "Fishermen",
      ],
    },
    {
      q: "What did Paul do when the Jews in Corinth opposed and reviled him?",
      correct: "He shook out his garments and said, 'Your blood be on your own heads!'",
      wrong: [
        "He pronounced a curse of blindness upon their leaders",
        "He wept bitterly and left the synagogue immediately",
        "He brought them before the Roman tribunal",
      ],
    },
    {
      q: "Who was the proconsul of Achaia when the Jews made a united attack on Paul?",
      correct: "Gallio",
      wrong: [
        "Festus",
        "Felix",
        "Sergius Paulus",
      ],
    },
    {
      q: "Who took Apollos aside in Ephesus and explained to him the way of God more accurately?",
      correct: "Priscilla and Aquila",
      wrong: [
        "Paul and Silas",
        "Peter and John",
        "Timothy and Erastus",
      ],
    },
  ],
  "act-19": [
    {
      q: "When Paul arrived in Ephesus, into what baptism did the twelve disciples there say they had been baptized?",
      correct: "Into John's baptism",
      wrong: [
        "Into the baptism of Moses",
        "Into the baptism of the Holy Spirit",
        "Into the baptism of repentance only",
      ],
    },
    {
      q: "After withdrawing from the synagogue in Ephesus, where did Paul reason daily for two years?",
      correct: "In the hall of Tyrannus",
      wrong: [
        "In the marketplace of Diana",
        "In the courtyard of Titius Justus",
        "In the house of Aquila",
      ],
    },
    {
      q: "What happened to the seven sons of Sceva, a Jewish high priest, when they tried to cast out an evil spirit?",
      correct: "The man with the evil spirit leaped on them and mastered all of them",
      wrong: [
        "The spirit confessed Jesus and came out immediately",
        "They were struck blind for using the Lord's name in vain",
        "The spirit mocked them and refused to speak",
      ],
    },
    {
      q: "What did a number of those who had practiced magic arts do with their books after confessing their practices?",
      correct: "They brought them together and burned them in the sight of all",
      wrong: [
        "They sold them and gave the proceeds to the poor",
        "They handed them over to the magistrates as evidence",
        "They cast them into the sea to be destroyed forever",
      ],
    },
    {
      q: "Who was Demetrius, the man who stirred up a riot against Paul in Ephesus?",
      correct: "A silversmith who made silver shrines of Artemis",
      wrong: [
        "A priest of the temple of Diana",
        "A Roman official who feared losing tax revenue",
        "A sorcerer who had lost his livelihood",
      ],
    },
  ],
  "act-20": [
    {
      q: "What happened to the young man named Eutychus during Paul's prolonged speech in Troas?",
      correct: "He sank into a deep sleep, fell from the third story, and was taken up dead",
      wrong: [
        "He interrupted Paul to prophesy about the journey to Jerusalem",
        "He was struck by an evil spirit and fell into the fire",
        "He fell from the window but was caught by angels",
      ],
    },
    {
      q: "Why had Paul decided to sail past Ephesus and not spend time in Asia?",
      correct: "He was hastening to be at Jerusalem, if possible, on the day of Pentecost",
      wrong: [
        "He feared another riot by the silversmiths",
        "The Holy Spirit had forbidden him to speak the word in Asia again",
        "He wanted to reach Rome before the winter storms",
      ],
    },
    {
      q: "From Miletus, Paul sent to Ephesus and called for whom to come to him?",
      correct: "The elders of the church",
      wrong: [
        "The entire congregation",
        "Aquila and Priscilla",
        "The magistrates of the city",
      ],
    },
    {
      q: "What did Paul say the Holy Spirit testified to him in every city?",
      correct: "That imprisonment and afflictions awaited him",
      wrong: [
        "That he would stand before Caesar in Rome",
        "That he would establish a church in every province",
        "That he must shake the dust off his feet against the Jews",
      ],
    },
    {
      q: "What saying of the Lord Jesus did Paul tell the Ephesian elders to remember?",
      correct: "It is more blessed to give than to receive",
      wrong: [
        "Take up your cross and follow me",
        "A prophet has no honor in his hometown",
        "My sheep hear my voice, and I know them",
      ],
    },
  ],
  "act-21": [
    {
      q: "In Caesarea, Paul stayed at the house of Philip the evangelist. What unique detail is mentioned about Philip's four unmarried daughters?",
      correct: "They prophesied",
      wrong: [
        "They served as deaconesses",
        "They had the gift of healing",
        "They spoke in tongues continually",
      ],
    },
    {
      q: "What did the prophet Agabus do to illustrate what would happen to Paul in Jerusalem?",
      correct: "He took Paul's belt and bound his own feet and hands",
      wrong: [
        "He tore Paul's cloak into twelve pieces",
        "He poured ashes over Paul's head",
        "He placed a wooden yoke on his own neck",
      ],
    },
    {
      q: "What did the brothers in Jerusalem ask Paul to do to prove he had not taught Jews to forsake Moses?",
      correct: "Purify himself along with four men under a vow and pay their expenses",
      wrong: [
        "Offer a sin offering at the altar of the temple",
        "Circumcise the Gentile believers traveling with him",
        "Preach from the Torah in the synagogues on the Sabbath",
      ],
    },
    {
      q: "What false accusation caused the crowd from Asia to stir up the people and lay hands on Paul in the temple?",
      correct: "They claimed he had brought Greeks into the temple and defiled the holy place",
      wrong: [
        "They claimed he was stealing money from the temple treasury",
        "They claimed he was plotting to burn the sanctuary",
        "They claimed he was an Egyptian who had led a revolt",
      ],
    },
    {
      q: "When Paul was about to be brought into the barracks, what language did he use to speak to the tribune, surprising him?",
      correct: "Greek",
      wrong: [
        "Hebrew",
        "Latin",
        "Aramaic",
      ],
    },
  ],
  "act-22": [
    {
      q: "When Paul addressed the crowd in Jerusalem, what caused them to become especially quiet?",
      correct: "He addressed them in the Hebrew language",
      wrong: [
        "He held up his chained hands",
        "He invoked the name of the high priest",
        "He quoted from the prophet Isaiah",
      ],
    },
    {
      q: "According to Paul's defense, what did Ananias tell Paul to do to wash away his sins?",
      correct: "Rise and be baptized, calling on his name",
      wrong: [
        "Go to the temple and offer a sacrifice",
        "Fast and pray for three days",
        "Present himself to the apostles in Jerusalem",
      ],
    },
    {
      q: "At what point in Paul's speech did the crowd raise their voices and say, 'Away with such a fellow from the earth!'?",
      correct: "When he said the Lord sent him far away to the Gentiles",
      wrong: [
        "When he claimed Jesus of Nazareth was the Christ",
        "When he admitted to participating in Stephen's death",
        "When he stated he was a Roman citizen",
      ],
    },
    {
      q: "How did the tribune initially order Paul to be examined after the crowd's uproar?",
      correct: "By flogging",
      wrong: [
        "By questioning before the Sanhedrin",
        "By torture on the rack",
        "By cross-examination with witnesses",
      ],
    },
    {
      q: "How did Paul obtain his Roman citizenship, according to his conversation with the tribune?",
      correct: "He was a citizen by birth",
      wrong: [
        "He bought it for a large sum of money",
        "It was granted for his military service",
        "He inherited it from his Greek father",
      ],
    },
  ],
  "act-23": [
    {
      q: "What did Paul say that caused the high priest Ananias to order him to be struck on the mouth?",
      correct: "Brothers, I have lived my life before God in all good conscience up to this day.",
      wrong: [
        "God will strike you, you whitewashed wall!",
        "I am a Pharisee, a son of Pharisees.",
        "You sit to judge me according to the law, but you order me to be struck contrary to the law.",
      ],
    },
    {
      q: "What theological issue did Paul use to divide the Pharisees and Sadducees in the council?",
      correct: "The resurrection of the dead",
      wrong: [
        "The requirement of circumcision for Gentiles",
        "The authority of the oral traditions",
        "The coming of the Messiah",
      ],
    },
    {
      q: "How many Jews bound themselves by an oath neither to eat nor drink until they had killed Paul?",
      correct: "More than forty",
      wrong: [
        "About seventy",
        "Twelve of the most zealous",
        "More than a hundred",
      ],
    },
    {
      q: "Who heard of the ambush plot and warned both Paul and the tribune?",
      correct: "The son of Paul's sister",
      wrong: [
        "A sympathetic Pharisee named Gamaliel",
        "One of the centurions guarding Paul",
        "A servant in the high priest's household",
      ],
    },
    {
      q: "What was the name of the tribune who wrote a letter to the governor Felix regarding Paul?",
      correct: "Claudius Lysias",
      wrong: [
        "Julius",
        "Porcius Festus",
        "Cornelius",
      ],
    },
  ],
  "act-24": [
    {
      q: "Who was the spokesman that the high priest Ananias brought to present the case against Paul before Felix?",
      correct: "Tertullus",
      wrong: [
        "Drusilla",
        "Trophimus",
        "Alexander",
      ],
    },
    {
      q: "Which of the following was NOT one of the specific accusations made against Paul before Felix?",
      correct: "He refused to pay the tribute to Caesar",
      wrong: [
        "He was a plague who stirred up riots among the Jews",
        "He was a ringleader of the sect of the Nazarenes",
        "He tried to profane the temple",
      ],
    },
    {
      q: "When Paul reasoned about righteousness, self-control, and the coming judgment, what was Felix's reaction?",
      correct: "He was alarmed and sent Paul away until he had an opportunity",
      wrong: [
        "He wept and asked to be baptized",
        "He laughed and mocked Paul's beliefs",
        "He became enraged and ordered Paul beaten",
      ],
    },
    {
      q: "Why did Felix leave Paul in prison for two years instead of releasing him?",
      correct: "He hoped that money would be given him by Paul",
      wrong: [
        "He was waiting for the Emperor's decree",
        "He feared an uprising from the sect of the Nazarenes",
        "He wanted to use Paul as a bargaining chip with Rome",
      ],
    },
    {
      q: "Who succeeded Felix as governor of Judea?",
      correct: "Porcius Festus",
      wrong: [
        "Pontius Pilate",
        "Herod Agrippa",
        "Publius",
      ],
    },
  ],
  "act-25": [
    {
      q: "When Festus went up to Jerusalem, what favor did the chief priests and principal men of the Jews ask of him regarding Paul?",
      correct: "To have Paul brought to Jerusalem, planning an ambush to kill him",
      wrong: [
        "To hand Paul over to them for execution",
        "To banish Paul from Judea permanently",
        "To force Paul to stand trial in the temple courts",
      ],
    },
    {
      q: "To whom did Paul appeal his case when Festus asked if he wished to go up to Jerusalem to be tried?",
      correct: "Caesar",
      wrong: [
        "The Roman Senate",
        "The proconsul of Syria",
        "King Agrippa",
      ],
    },
    {
      q: "Who arrived at Caesarea to welcome Festus, and ended up hearing about Paul's case?",
      correct: "King Agrippa and Bernice",
      wrong: [
        "Felix and Drusilla",
        "The tribune Claudius Lysias",
        "Emperor Nero's envoy",
      ],
    },
    {
      q: "How did Festus summarize the Jews' dispute with Paul when discussing the matter with the king?",
      correct: "It was about their own religion and a dead man named Jesus who Paul claimed was alive",
      wrong: [
        "It was about Paul profaning the temple with Greeks",
        "It was about Paul organizing an armed rebellion",
        "It was about Paul refusing to pay the temple tax",
      ],
    },
    {
      q: "What did Festus hope to gain by bringing Paul before King Agrippa?",
      correct: "Something to write to the Emperor, as it seemed unreasonable to send a prisoner without indicating the charges",
      wrong: [
        "A final judgment so he wouldn't have to send Paul to Rome",
        "A compromise that would satisfy the Jewish leaders",
        "A theological explanation of the Jewish prophecies",
      ],
    },
  ],
  "act-26": [
    {
      q: "When Paul recounted his conversion experience to Agrippa, in what language did he say the voice spoke to him?",
      correct: "The Hebrew language",
      wrong: [
        "The Greek language",
        "The Aramaic language",
        "The Latin language",
      ],
    },
    {
      q: "What phrase did the voice from heaven add in Paul's recounting to Agrippa that was NOT mentioned in the previous accounts?",
      correct: "It is hard for you to kick against the goads.",
      wrong: [
        "Why are you persecuting my church?",
        "You will be my chosen instrument.",
        "Rise and stand upon your feet.",
      ],
    },
    {
      q: "What was Festus's loud interruption during Paul's defense?",
      correct: "Paul, you are out of your mind; your great learning is driving you out of your mind.",
      wrong: [
        "You speak treason against the Emperor!",
        "Enough! I will hear no more of these fables.",
        "Do you think you can convert a Roman governor?",
      ],
    },
    {
      q: "How did King Agrippa respond to Paul's question about believing the prophets?",
      correct: "In a short time would you persuade me to be a Christian?",
      wrong: [
        "I believe the prophets, but not your interpretation of them.",
        "You almost convince me to abandon the faith of my fathers.",
        "I am a king, I need no persuasion from a prisoner.",
      ],
    },
    {
      q: "What was Agrippa's final conclusion to Festus regarding Paul's legal status?",
      correct: "This man could have been set free if he had not appealed to Caesar.",
      wrong: [
        "This man is guilty of blasphemy, but not of treason.",
        "You must send him to Rome under heavy guard.",
        "He should be handed over to the Jewish council for judgment.",
      ],
    },
  ],
  "act-27": [
    {
      q: "What was the name of the centurion of the Augustan Cohort to whom Paul was delivered for the voyage to Italy?",
      correct: "Julius",
      wrong: [
        "Cornelius",
        "Claudius",
        "Lysias",
      ],
    },
    {
      q: "What advice did Paul give at Fair Havens that was ignored by the centurion and the captain?",
      correct: "He advised them not to sail, warning of injury and loss of cargo and life",
      wrong: [
        "He advised them to sail directly to Rome, avoiding Crete",
        "He warned them of a plot by the prisoners to mutiny",
        "He told them to throw the cargo overboard immediately",
      ],
    },
    {
      q: "What was the name of the tempestuous wind that struck down from the land and caught the ship?",
      correct: "The Euroaquilo",
      wrong: [
        "The Sirocco",
        "The Levantine",
        "The Notus",
      ],
    },
    {
      q: "During the storm, Paul stood up and encouraged the crew, stating an angel had appeared to him. What did the angel promise?",
      correct: "Paul must stand before Caesar, and God had granted him the lives of all sailing with him",
      wrong: [
        "The ship would safely reach the shores of Italy within a week",
        "The storm would cease the moment Paul prayed for them",
        "The cargo would be lost, but they would find gold on the island",
      ],
    },
    {
      q: "How many persons were on the ship in total before it was wrecked?",
      correct: "276",
      wrong: [
        "120",
        "300",
        "153",
      ],
    },
  ],
  "act-28": [
    {
      q: "What did the native people of Malta initially think when the viper fastened onto Paul's hand?",
      correct: "That he was a murderer being punished by Justice",
      wrong: [
        "That he was a god in human form",
        "That he had disturbed the island's sacred fire",
        "That he was an evil sorcerer",
      ],
    },
    {
      q: "What medical issue was afflicting the father of Publius, the chief man of the island?",
      correct: "Fever and dysentery",
      wrong: [
        "Leprosy",
        "Blindness",
        "Paralysis",
      ],
    },
    {
      q: "After three months on Malta, Paul and the others set sail on an Alexandrian ship. What was its figurehead?",
      correct: "The Twin Brothers",
      wrong: [
        "The Eagle of Rome",
        "The Goddess Athena",
        "The Winged Victory",
      ],
    },
    {
      q: "When Paul finally arrived in Rome, what were his living conditions?",
      correct: "He was allowed to stay by himself, with the soldier who guarded him",
      wrong: [
        "He was thrown into the Mamertine Prison",
        "He was placed in the Emperor's palace",
        "He was forced to work in the stone quarries during the day",
      ],
    },
    {
      q: "How long did Paul live in Rome at his own expense, welcoming all who came to him?",
      correct: "Two whole years",
      wrong: [
        "Three months",
        "Six months",
        "One year",
      ],
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
  // No fake fallback. Callers should check `hasQuiz()` first and skip the
  // quiz step entirely for chapters we haven't hand-scripted yet.
  return [];
}

// Kept exported so the helper isn't dead code if we ever want a debug fallback.
export { generic as _genericQuizFallback };

