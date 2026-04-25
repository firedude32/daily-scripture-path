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
      q: "How does Mark's gospel begin — what does the very first verse declare?",
      correct: "The beginning of the gospel of Jesus Christ, the Son of God",
      wrong: [
        "An account of the things that have been fulfilled among us",
        "In the beginning was the Word, and the Word was with God",
        "The genealogy of Jesus, the son of David, the son of Abraham",
      ],
    },
    {
      q: "Who appears in the wilderness preaching a baptism of repentance, before Jesus begins his ministry?",
      correct: "John the Baptist",
      wrong: ["Elijah the prophet", "Simeon the priest", "Zechariah the father of John"],
    },
    {
      q: "What happens when Jesus is baptized in the Jordan River?",
      correct: "The heavens tear open, the Spirit descends on him like a dove, and a voice declares him the beloved Son",
      wrong: [
        "An angel appears, the river parts, and a voice calls him the Messiah",
        "A pillar of fire descends, John kneels before him, and the people cry out in praise",
        "The earth shakes, a star appears overhead, and a voice declares the kingdom has come",
      ],
    },
    {
      q: "Who are the first four disciples Jesus calls in chapter 1, and what were they doing when he called them?",
      correct: "Simon, Andrew, James, and John — all fishermen working with their nets",
      wrong: [
        "Matthew, Philip, Thomas, and Bartholomew — all gathered at the synagogue",
        "Peter, Paul, James, and John — all praying by the river",
        "Simon, Judas, James, and John — all working in their father's vineyard",
      ],
    },
    {
      q: "After a long day of healing, where does Jesus go very early in the morning, and what does he do there?",
      correct: "To a solitary place, where he prays",
      wrong: [
        "To the synagogue, where he reads the scriptures",
        "To the temple, where he offers a sacrifice",
        "To the mountain, where he gathers the disciples to teach them",
      ],
    },
  ],
  "mrk-2": [
    {
      q: "In chapter 2, friends bring a paralyzed man to Jesus. How do they get him to Jesus when the house is too crowded?",
      correct: "They dig through the roof and lower him down on his mat",
      wrong: [
        "They push through the crowd until they reach Jesus",
        "They climb in through a window at the back of the house",
        "They wait outside until Jesus comes to them",
      ],
    },
    {
      q: "What does Jesus say to the paralyzed man before healing him, and why does this upset the religious leaders?",
      correct: "He says 'your sins are forgiven' — they think only God can forgive sins",
      wrong: [
        "He says 'rise and walk' — they think he is breaking the Sabbath",
        "He says 'go in peace' — they think he is dismissing the man without proper ritual",
        "He says 'your faith has saved you' — they think he is granting salvation that only the priests can declare",
      ],
    },
    {
      q: "Whom does Jesus call as a disciple while he sits at his tax booth?",
      correct: "Levi",
      wrong: ["Zacchaeus", "Nathanael", "Bartimaeus"],
    },
    {
      q: "When Jesus is criticized for eating with tax collectors and sinners, how does he answer?",
      correct: "It is not the healthy who need a doctor, but the sick — he came to call sinners, not the righteous",
      wrong: [
        "All have sinned and fallen short — he came for everyone, not just the righteous",
        "Even the righteous were once sinners — he came to remind them where they came from",
        "The kingdom of God is for the humble — he came to teach the proud through the humble",
      ],
    },
    {
      q: "What does Jesus declare about himself at the end of chapter 2, after the disciples are accused of breaking the Sabbath by picking grain?",
      correct: "The Son of Man is Lord even of the Sabbath",
      wrong: [
        "The Son of Man came to fulfill the law, not to abolish it",
        "The Son of Man has authority on earth to forgive sins",
        "The Son of Man is greater than the temple itself",
      ],
    },
  ],
  "mrk-3": [
    {
      q: "Jesus heals a man in the synagogue at the start of chapter 3. What was wrong with the man?",
      correct: "He had a withered hand",
      wrong: ["He was blind", "He was deaf and could not speak", "He was paralyzed"],
    },
    {
      q: "Why are the religious leaders so angry after this healing in the synagogue?",
      correct: "Jesus healed on the Sabbath, and they begin plotting how to destroy him",
      wrong: [
        "Jesus claimed authority over the temple, and they accuse him of blasphemy",
        "Jesus refused to pay the temple tax, and they call him a lawbreaker",
        "Jesus rebuked them in front of the people, and they are humiliated",
      ],
    },
    {
      q: "What does Jesus do after the crowds become so large that he can barely move?",
      correct: "He goes up on a mountain and appoints twelve apostles to be with him and to preach",
      wrong: [
        "He sends the crowds away and retreats with the disciples to a quiet place",
        "He commands the disciples to feed the people before continuing his teaching",
        "He climbs into a boat to teach the people from the water",
      ],
    },
    {
      q: "What accusation do the scribes from Jerusalem make about Jesus in chapter 3, and how does he answer it?",
      correct: "They say he drives out demons by Beelzebul — he answers that a kingdom divided against itself cannot stand",
      wrong: [
        "They say he is a false prophet — he answers that a tree is known by its fruit",
        "They say he is breaking the law of Moses — he answers that he came to fulfill the law",
        "They say he is leading the people astray — he answers that the truth will set them free",
      ],
    },
    {
      q: "Who comes looking for Jesus at the end of chapter 3, and how does Jesus respond?",
      correct: "His mother and brothers — he says that whoever does God's will is his brother, sister, and mother",
      wrong: [
        "His former teachers — he says that no prophet is honored in his own town",
        "The chief priests — he says that he must continue the work his Father gave him",
        "His childhood friends — he says that he no longer belongs to this world",
      ],
    },
  ],
  "mrk-4": [
    {
      q: "In chapter 4, Jesus teaches a famous parable about a man who scatters seed. The seed falls in four kinds of places. What are they?",
      correct: "Along the path, on rocky ground, among thorns, and on good soil",
      wrong: [
        "On the mountain, in the valley, by the river, and on the plain",
        "On the road, in the field, in the garden, and in the vineyard",
        "On the threshing floor, in the storehouse, on the hillside, and by the sea",
      ],
    },
    {
      q: "Why does Jesus say he speaks in parables?",
      correct: "So that those outside may see but not perceive, and hear but not understand — but to those given the secret of the kingdom, the meaning is revealed",
      wrong: [
        "So that the simple may understand and the proud may be humbled",
        "So that the people may remember the lessons through stories rather than commandments",
        "So that the religious leaders cannot use his words against him",
      ],
    },
    {
      q: "What does Jesus compare the kingdom of God to in the parable that involves a very small seed?",
      correct: "A mustard seed, which is the smallest of seeds but grows into a large plant where birds can nest",
      wrong: [
        "A grain of wheat, which must die to bear fruit",
        "A fig seed, which slowly grows into a tree of shade and fruit",
        "An olive seed, which yields oil for many generations",
      ],
    },
    {
      q: "When the storm rises on the lake at the end of chapter 4, what is Jesus doing in the boat?",
      correct: "Sleeping on a cushion in the stern",
      wrong: [
        "Praying in the bow of the boat",
        "Teaching the disciples about the kingdom",
        "Watching the disciples handle the boat",
      ],
    },
    {
      q: "What does Jesus do to calm the storm, and how do the disciples react?",
      correct: "He rebukes the wind and tells the sea to be still — the disciples are filled with great fear and ask who he is",
      wrong: [
        "He stretches out his hand over the water — the disciples fall down and worship him",
        "He commands the storm to depart in his Father's name — the disciples ask him to teach them how",
        "He raises his eyes to heaven and prays — the disciples are amazed at the power of his prayer",
      ],
    },
  ],
  "mrk-5": [
    {
      q: "In chapter 5, Jesus encounters a man with an unclean spirit on the other side of the lake. Where had the man been living, and what does he call himself when Jesus asks his name?",
      correct: "He had been living among the tombs, and he calls himself Legion, because they are many",
      wrong: [
        "He had been living in the wilderness, and he calls himself Apollyon, the destroyer",
        "He had been living in the caves of the mountain, and he calls himself Beelzebul, the prince",
        "He had been living near the city gates, and he calls himself Satan, the accuser",
      ],
    },
    {
      q: "Where do the unclean spirits go when Jesus drives them out of the man?",
      correct: "Into a herd of pigs, which then rushes down the bank into the lake and drowns",
      wrong: [
        "Into the wilderness, where they wander seeking rest and find none",
        "Into the deep, where they are sealed away until the day of judgment",
        "Into the air, where they vanish at the command of Jesus",
      ],
    },
    {
      q: "After the healing, what does the man beg Jesus to let him do, and what does Jesus tell him instead?",
      correct: "He begs to go with Jesus — Jesus tells him to go home and tell his family how much the Lord has done for him",
      wrong: [
        "He begs to be hidden from the people — Jesus tells him to go to the temple and offer thanks",
        "He begs to follow as a disciple — Jesus tells him to wait until he is called",
        "He begs to know how he was healed — Jesus tells him to ponder it in his heart",
      ],
    },
    {
      q: "While Jesus is on his way to heal a synagogue leader's daughter, a woman touches his cloak in the crowd. What had been wrong with her, and what happens?",
      correct: "She had been bleeding for twelve years — she is healed instantly when she touches his cloak",
      wrong: [
        "She had been blind from birth — her sight is restored when she touches his garment",
        "She had been crippled from a young age — she is able to walk when she touches the hem of his robe",
        "She had been suffering from a fever — her fever leaves her when she touches his hand",
      ],
    },
    {
      q: "When Jesus arrives at the synagogue leader's house, the people are mourning because the daughter has died. What does Jesus do?",
      correct: "He puts the mourners outside, takes the parents and three disciples in, and says to her 'Talitha cumi' — and she gets up and walks",
      wrong: [
        "He prays with the family at her bedside, lays his hands on her, and she opens her eyes",
        "He stretches out his hand toward heaven, calls her name three times, and she rises",
        "He goes alone into the room, kneels beside her, and breathes life back into her",
      ],
    },
  ],
  "mrk-6": [
    {
      q: "In chapter 6, how do the people of Jesus' hometown react when he teaches in their synagogue?",
      correct: "They take offense at him, and Jesus says a prophet is not honored in his hometown or among his own family",
      wrong: [
        "They reject him outright, and Jesus shakes the dust off his feet as a witness against them",
        "They demand that he prove himself with a sign, and Jesus tells them no sign will be given",
        "They follow him into the streets to listen further, but Jesus tells them to return to their homes",
      ],
    },
    {
      q: "When Jesus sends out the twelve disciples, what instructions does he give them about what to take?",
      correct: "Take nothing but a staff — no bread, no bag, no money in their belts; wear sandals but not an extra tunic",
      wrong: [
        "Take only a cloak and a small bag of provisions; no shoes, no walking stick",
        "Take what you need for one day, then trust the Lord for the next",
        "Take whatever the people offer along the way, but accept no money",
      ],
    },
    {
      q: "Mark interrupts the story of the disciples' mission to tell about the death of John the Baptist. Who orders his death, and why?",
      correct: "Herod, because he had promised the daughter of Herodias whatever she asked, and she asked for John's head",
      wrong: [
        "Pilate, because the chief priests demanded John's death after he criticized the temple",
        "Caiaphas, because John had publicly accused him of corruption",
        "Herod, because John refused to bow before him in the royal court",
      ],
    },
    {
      q: "When Jesus sees the crowd by the lake and has compassion on them, he teaches them and then feeds them. How many people are fed, and with what?",
      correct: "Five thousand men are fed with five loaves and two fish",
      wrong: [
        "Four thousand men are fed with seven loaves and a few small fish",
        "Three thousand men are fed with two loaves and five fish",
        "Two thousand men are fed with three loaves and two fish",
      ],
    },
    {
      q: "After the feeding, Jesus sends the disciples ahead in a boat. What happens when they are out on the lake?",
      correct: "They struggle against the wind, and Jesus comes to them walking on the water",
      wrong: [
        "They are caught in a great storm, and Jesus calms it by speaking from the shore",
        "Their boat begins to sink, and Jesus appears beside them and pulls them to safety",
        "They lose their way in the dark, and a star appears to guide them back to land",
      ],
    },
  ],
  "mrk-7": [
    {
      q: "What is the conflict at the start of chapter 7 between Jesus and the Pharisees about?",
      correct: "The disciples eating without the ceremonial washing of hands required by the tradition of the elders",
      wrong: [
        "The disciples picking grain on the Sabbath",
        "The disciples failing to fast as the Pharisees did",
        "The disciples eating with tax collectors and sinners",
      ],
    },
    {
      q: "How does Jesus answer the Pharisees about what truly defiles a person?",
      correct: "Nothing from outside can defile a person — what comes out of a person, from the heart, is what defiles them",
      wrong: [
        "Only what is forbidden by the law of Moses defiles — their human traditions cannot",
        "What a person eats is between him and God — only what he does to others can defile him",
        "Defilement comes from breaking the Sabbath, not from eating with unwashed hands",
      ],
    },
    {
      q: "A Gentile woman comes to Jesus asking him to heal her daughter. What is unusual about how Jesus responds at first?",
      correct: "He compares helping her to throwing the children's bread to the dogs — but heals her daughter when she answers humbly",
      wrong: [
        "He tells her he was sent only to the lost sheep of Israel and refuses to help her",
        "He asks her to bring her daughter to him in person, even though she is far away",
        "He sends her away three times, then heals her daughter when she returns a fourth time",
      ],
    },
    {
      q: "In the Decapolis region, Jesus heals a man with two specific conditions. What were they?",
      correct: "The man was deaf and could hardly speak",
      wrong: [
        "The man was blind and lame",
        "The man was paralyzed and mute",
        "The man was deaf and blind",
      ],
    },
    {
      q: "What unusual thing does Jesus do as part of healing the deaf man?",
      correct: "He puts his fingers in the man's ears, spits and touches his tongue, looks up to heaven, and says 'Ephphatha'",
      wrong: [
        "He breathes on the man and says 'Be opened' in a loud voice",
        "He anoints the man's ears with oil and prays the Aaronic blessing",
        "He places his hands on the man's head and remains silent for a long time",
      ],
    },
  ],
  "mrk-8": [
    {
      q: "In chapter 8, Jesus feeds another large crowd. How many people are fed, and with what?",
      correct: "Four thousand are fed with seven loaves and a few small fish",
      wrong: [
        "Five thousand are fed with five loaves and two fish",
        "Three thousand are fed with three loaves and three fish",
        "Two thousand are fed with seven loaves and seven fish",
      ],
    },
    {
      q: "After this feeding, the Pharisees demand a sign from heaven. How does Jesus respond?",
      correct: "He sighs deeply and says no sign will be given to this generation, then leaves them and gets back in the boat",
      wrong: [
        "He performs a sign in the sky to silence them, then warns them not to ask again",
        "He tells them the only sign they will receive is the sign of Jonah",
        "He answers with a parable about a fig tree and walks away",
      ],
    },
    {
      q: "Jesus heals a blind man in Bethsaida. What is unusual about this healing?",
      correct: "It happens in two stages — at first the man sees people who look like trees walking, and then his sight is fully restored",
      wrong: [
        "Jesus heals him from a great distance, without touching him",
        "Jesus heals him in front of the entire town, who all praise God together",
        "Jesus heals him only after the man's faith is tested through three questions",
      ],
    },
    {
      q: "At Caesarea Philippi, Jesus asks the disciples who they say he is. Who answers, and what does he say?",
      correct: "Peter answers that Jesus is the Christ, the Messiah",
      wrong: [
        "John answers that Jesus is the Son of God, the chosen one",
        "Andrew answers that Jesus is the prophet who was to come into the world",
        "All the disciples together answer that Jesus is the Lord",
      ],
    },
    {
      q: "After Peter's confession, Jesus begins to teach about his coming death. How does Peter react, and how does Jesus respond?",
      correct: "Peter takes Jesus aside and rebukes him — Jesus rebukes Peter back, saying 'Get behind me, Satan'",
      wrong: [
        "Peter weeps and says he will die with Jesus — Jesus tells him he will deny him three times",
        "Peter asks if there is another way — Jesus tells him to trust the Father's plan",
        "Peter falls silent in fear — Jesus places his hand on him and tells him not to be afraid",
      ],
    },
  ],
  "mrk-9": [
    {
      q: "Jesus takes three disciples up a high mountain at the start of chapter 9. Which three, and what do they witness?",
      correct: "Peter, James, and John — they see Jesus transfigured, his clothes becoming dazzling white, with Moses and Elijah appearing beside him",
      wrong: [
        "Peter, Andrew, and John — they see Jesus glorified in light, with angels descending and ascending around him",
        "Peter, James, and Andrew — they see Jesus speaking with David and the prophets",
        "Peter, James, and Philip — they see Jesus standing in fire while a voice speaks from a cloud",
      ],
    },
    {
      q: "What does the voice from the cloud say during the transfiguration?",
      correct: "This is my beloved Son — listen to him",
      wrong: [
        "This is my chosen one — bow down before him",
        "This is the Lord of all — worship and obey him",
        "This is my servant whom I love — go and proclaim him",
      ],
    },
    {
      q: "When Jesus comes down the mountain, he finds the other disciples unable to drive out a spirit from a boy. What does the father of the boy say to Jesus?",
      correct: "I believe — help my unbelief",
      wrong: [
        "Lord, only say the word, and my son will be healed",
        "If you can do anything, have mercy on us",
        "I have heard of your power — show it now to my son",
      ],
    },
    {
      q: "When the disciples argue along the road about who is the greatest, what does Jesus do to teach them about greatness?",
      correct: "He places a child in their midst and says whoever welcomes a child like this in his name welcomes him",
      wrong: [
        "He kneels and washes their feet, telling them they should serve one another",
        "He tells them to look at the lilies of the field, which neither toil nor spin",
        "He sends them out two by two with no possessions, to learn humility on the road",
      ],
    },
    {
      q: "Jesus uses strong language about avoiding sin in chapter 9. What does he say should be done if a hand, foot, or eye causes you to sin?",
      correct: "Cut it off or tear it out — it is better to enter life maimed than to be thrown into hell with two",
      wrong: [
        "Bind it tightly until the desire passes — better to be restrained than to fall",
        "Pray fervently for that part of the body to be healed — God will deliver those who seek him",
        "Confess the sin openly to others — sin loses its power when brought into the light",
      ],
    },
  ],
  "mrk-10": [
    {
      q: "When the Pharisees ask Jesus about divorce, what does he point them back to?",
      correct: "The creation account — God made them male and female, and what God has joined together let no one separate",
      wrong: [
        "The law of Moses, which permitted divorce only for adultery",
        "The covenant with Abraham, which established marriage as a sign",
        "The prophets, who called Israel a faithless wife",
      ],
    },
    {
      q: "When parents bring their children to Jesus and the disciples try to stop them, how does Jesus respond?",
      correct: "He is indignant and tells them to let the little children come, for the kingdom belongs to such as these",
      wrong: [
        "He is patient and tells the disciples that he will see the children when his work is done",
        "He smiles at the children but tells them to return when they are older",
        "He sets the children apart and teaches them privately while the disciples watch",
      ],
    },
    {
      q: "A rich young man asks Jesus what he must do to inherit eternal life. What does Jesus finally tell him to do?",
      correct: "Sell all he has, give to the poor, and come follow him",
      wrong: [
        "Forgive everyone who has wronged him and seek reconciliation",
        "Fast for forty days and offer sacrifices in the temple",
        "Go and study the law of Moses with the elders",
      ],
    },
    {
      q: "James and John ask Jesus for a special favor — what is it, and how does he respond?",
      correct: "To sit at his right and left in his glory — Jesus says they don't know what they are asking, and that those places are not his to give",
      wrong: [
        "To call down fire from heaven on a Samaritan village — Jesus rebukes them, saying he came to save not destroy",
        "To be given the keys of the kingdom — Jesus tells them the keys belong to all who believe",
        "To know the day of his return — Jesus tells them no one knows the day, not even the Son",
      ],
    },
    {
      q: "On the way to Jericho, a blind beggar calls out to Jesus. What is his name, and what does he ask for?",
      correct: "Bartimaeus — he asks Jesus to let him see again",
      wrong: [
        "Lazarus — he asks Jesus for healing",
        "Zacchaeus — he asks Jesus to stay at his house",
        "Simon — he asks Jesus to teach him the way of the kingdom",
      ],
    },
  ],
  "mrk-11": [
    {
      q: "How does Jesus enter Jerusalem at the start of chapter 11?",
      correct: "Riding on a colt, with people spreading their cloaks and leafy branches on the road",
      wrong: [
        "Walking with his disciples through the gates while crowds line the streets",
        "Riding a white horse, with his disciples surrounding him in formation",
        "Carried on a litter by the disciples, with the priests waiting at the temple",
      ],
    },
    {
      q: "What do the crowds shout as Jesus enters Jerusalem?",
      correct: "Hosanna! Blessed is he who comes in the name of the Lord",
      wrong: [
        "Glory to God in the highest, and peace on earth",
        "The Lord is our shepherd, the king of Israel has come",
        "Praise the Lord, all you nations — the Messiah has arrived",
      ],
    },
    {
      q: "What does Jesus do to a fig tree on the road to Jerusalem, and why?",
      correct: "He curses it because it has no fruit, even though the season for figs has not yet come",
      wrong: [
        "He prunes its branches and tells the disciples that good trees must be tended",
        "He gathers its leaves and uses them to bless the disciples",
        "He sits beneath it to teach a parable about the kingdom",
      ],
    },
    {
      q: "When Jesus enters the temple, what does he do?",
      correct: "He drives out those buying and selling, overturns the tables of the money changers, and says they have made a den of robbers out of his Father's house of prayer",
      wrong: [
        "He calls the priests together and rebukes them for their corruption",
        "He stands in the outer court and warns the people to flee from the coming judgment",
        "He prays in the inner court and refuses to leave until the temple is cleansed",
      ],
    },
    {
      q: "When the chief priests ask Jesus by what authority he is acting, how does he answer?",
      correct: "He asks them whether John's baptism was from heaven or from man — when they refuse to answer, he refuses to answer them",
      wrong: [
        "He tells them his authority comes from his Father in heaven",
        "He tells them they will know in due time, when the Son of Man is revealed",
        "He answers by quoting the prophets and walking away",
      ],
    },
  ],
  "mrk-12": [
    {
      q: "Jesus tells a parable about a vineyard at the start of chapter 12. What happens to the servants and the son the owner sends?",
      correct: "The tenants beat and kill the servants, and finally kill the son and throw him out of the vineyard",
      wrong: [
        "The tenants ignore the servants but receive the son with honor, then betray him",
        "The tenants accept the servants but turn the son away when he comes for the harvest",
        "The tenants flee from the servants but kill the son when he tries to take possession",
      ],
    },
    {
      q: "When the Pharisees and Herodians try to trap Jesus on paying taxes to Caesar, how does he answer?",
      correct: "He asks whose image is on the coin, and tells them to give to Caesar what is Caesar's, and to God what is God's",
      wrong: [
        "He tells them to pay no taxes, since God alone is their king",
        "He tells them to pay all taxes willingly, since the rulers serve God's purposes",
        "He refuses to answer, and walks away from the temple courts",
      ],
    },
    {
      q: "When the Sadducees try to trap Jesus with a question about marriage and the resurrection, how does he answer?",
      correct: "In the resurrection people neither marry nor are given in marriage, but are like angels in heaven — and God is the God of the living, not the dead",
      wrong: [
        "All who have been faithful in marriage will be reunited in the resurrection",
        "The first marriage is honored above all others in the resurrection",
        "Marriage was given for this life, but the resurrection brings a greater union with God alone",
      ],
    },
    {
      q: "When asked which is the greatest commandment, what does Jesus answer?",
      correct: "Love the Lord your God with all your heart, soul, mind, and strength — and the second is like it: love your neighbor as yourself",
      wrong: [
        "Honor the Lord with your possessions and the firstfruits of all your produce",
        "Hear, O Israel, the Lord our God, the Lord is one — keep his commandments and live",
        "Do justice, love kindness, and walk humbly with your God",
      ],
    },
    {
      q: "At the end of chapter 12, Jesus watches a poor widow at the temple treasury. What does he say about her?",
      correct: "She put in more than all the others, because they gave out of their abundance, but she gave out of her poverty everything she had",
      wrong: [
        "She gave with greater faith than any other, even though her gift was small",
        "She gave more than the rich because her heart was right before the Lord",
        "She gave the smallest gift but received the greatest blessing in return",
      ],
    },
  ],
  "mrk-13": [
    {
      q: "What does Jesus predict about the temple at the start of chapter 13?",
      correct: "Not one stone will be left on another — every one will be thrown down",
      wrong: [
        "It will be cleansed and rebuilt in three days",
        "It will be filled with foreigners and the Gentiles will worship there",
        "It will stand only as long as the priests are faithful",
      ],
    },
    {
      q: "When the disciples ask when these things will happen, what does Jesus warn them about first?",
      correct: "Watch out — many will come in his name claiming to be him, and will deceive many",
      wrong: [
        "Pray without ceasing — only those who pray will recognize the signs",
        "Stay together — the enemy will scatter those who walk alone",
        "Trust no rumors — the day will come without warning",
      ],
    },
    {
      q: "What does Jesus say will happen in the heavens in those days?",
      correct: "The sun will be darkened, the moon will not give its light, the stars will fall, and the powers of the heavens will be shaken",
      wrong: [
        "A great star will fall from heaven and the seas will boil",
        "The sky will roll back like a scroll and the angels will descend",
        "Lightning will flash from east to west and the heavens will open",
      ],
    },
    {
      q: "Jesus uses a tree as a sign for understanding the times. Which tree, and what is the lesson?",
      correct: "The fig tree — when its branch becomes tender and puts out leaves, you know summer is near; so when you see these things, know that he is near",
      wrong: [
        "The olive tree — when its fruit ripens, the harvest of the kingdom has come",
        "The cedar tree — when its branches reach to heaven, the day of the Lord is at hand",
        "The vine — when its grapes are ready, the time of judgment is upon you",
      ],
    },
    {
      q: "What does Jesus say about the day and hour of his return?",
      correct: "No one knows it — not the angels in heaven, nor the Son, but only the Father",
      wrong: [
        "It will come within this generation, before the disciples have died",
        "It will come when the gospel has been preached to every nation",
        "It will come at the time appointed by the prophets long ago",
      ],
    },
  ],
  "mrk-14": [
    {
      q: "At Bethany, a woman pours expensive ointment on Jesus' head. How do those present react, and what does Jesus say about her?",
      correct: "Some are indignant at the waste — Jesus says she has done a beautiful thing, and what she has done will be told wherever the gospel is preached",
      wrong: [
        "The disciples object to a woman touching him — Jesus says her faith has saved her",
        "The Pharisees accuse her of adultery — Jesus tells her to go and sin no more",
        "Judas alone protests the cost — Jesus tells him the poor will always be with them, but his time has come",
      ],
    },
    {
      q: "What does Jesus do during the Passover meal that becomes the basis of the Lord's Supper?",
      correct: "He takes bread, blesses it, breaks it, and gives it to them as his body — then takes a cup, gives thanks, and gives it as his blood of the covenant poured out for many",
      wrong: [
        "He passes a single cup around the table, telling each disciple to drink in remembrance of him",
        "He breaks one loaf into twelve pieces, giving one to each disciple by name",
        "He pours wine and oil together over bread, declaring it the new covenant",
      ],
    },
    {
      q: "After the meal, Jesus goes with the disciples to a particular place to pray. What is the place called, and what does he ask his Father?",
      correct: "Gethsemane — he asks the Father to take this cup from him, but says, 'Not what I will, but what you will'",
      wrong: [
        "The Mount of Olives — he asks the Father to send angels to deliver him",
        "Bethany — he asks the Father to forgive his enemies",
        "The temple courts — he asks the Father to glorify his name",
      ],
    },
    {
      q: "Who betrays Jesus to the religious leaders, and how does he identify Jesus to them?",
      correct: "Judas Iscariot, with a kiss",
      wrong: [
        "Judas Iscariot, by pointing to him from a distance",
        "Caiaphas the high priest, by sending guards who knew Jesus",
        "An informer in the crowd, by calling out his name",
      ],
    },
    {
      q: "What does Peter do during Jesus' trial that fulfills Jesus' earlier prediction?",
      correct: "He denies knowing Jesus three times, and the rooster crows",
      wrong: [
        "He flees with the other disciples and hides until morning",
        "He draws his sword to defend Jesus and is rebuked",
        "He follows at a distance but refuses to enter the courtyard",
      ],
    },
  ],
  "mrk-15": [
    {
      q: "When Pilate questions Jesus, what does Jesus say in his defense?",
      correct: "Almost nothing — he answers Pilate's first question and then makes no further reply, which amazes Pilate",
      wrong: [
        "He answers every question with another question, frustrating Pilate",
        "He defends himself by quoting the law of Moses and the prophets",
        "He explains his kingdom is not of this world, and Pilate finds no fault in him",
      ],
    },
    {
      q: "Pilate offers to release a prisoner during the festival. Who do the crowds choose to be released instead of Jesus?",
      correct: "Barabbas, who had committed murder during an insurrection",
      wrong: [
        "A common thief named Bartholomew",
        "A Zealot named Simon, who had attacked Roman guards",
        "A Pharisee named Saul, who had been falsely accused",
      ],
    },
    {
      q: "Who is forced to carry Jesus' cross, and where is he from?",
      correct: "Simon of Cyrene",
      wrong: [
        "Simon Peter, the disciple",
        "Simon the Zealot, one of the twelve",
        "Joseph of Arimathea",
      ],
    },
    {
      q: "What does Jesus cry out from the cross, and what does it mean?",
      correct: "Eloi, Eloi, lema sabachthani — 'My God, my God, why have you forsaken me?'",
      wrong: [
        "Maranatha — 'Come, Lord' — calling for the Father to receive him",
        "Talitha cumi — 'Little one, arise' — speaking of the resurrection to come",
        "Tetelestai — 'It is finished' — declaring the work complete",
      ],
    },
    {
      q: "What happens at the moment of Jesus' death, and what does the Roman centurion say?",
      correct: "The curtain of the temple is torn in two from top to bottom — the centurion says, 'Truly this man was the Son of God'",
      wrong: [
        "Darkness covers the land — the centurion says, 'This man was the king of the Jews'",
        "An earthquake shakes the city — the centurion says, 'The Lord has spoken through this man'",
        "A voice is heard from heaven — the centurion says, 'I have seen something I cannot explain'",
      ],
    },
  ],
  "mrk-16": [
    {
      q: "Who comes to the tomb early on the first day of the week, and why?",
      correct: "Mary Magdalene, Mary the mother of James, and Salome — to anoint Jesus' body with spices",
      wrong: [
        "Peter and John — to confirm that Jesus had truly died",
        "Joseph of Arimathea and Nicodemus — to seal the tomb properly",
        "The eleven disciples — to keep watch at the tomb",
      ],
    },
    {
      q: "What concern do the women have on their way to the tomb, and what do they find when they arrive?",
      correct: "They wonder who will roll the stone away — when they arrive, the stone has already been rolled back",
      wrong: [
        "They worry that the guards will turn them away — when they arrive, the guards are gone",
        "They fear they have come too late — when they arrive, the body is already prepared",
        "They are uncertain which tomb is the right one — when they arrive, an angel guides them",
      ],
    },
    {
      q: "Who do the women see when they enter the tomb, and what does he tell them?",
      correct: "A young man dressed in a white robe — he tells them Jesus has risen, and to go tell his disciples and Peter that he is going ahead of them to Galilee",
      wrong: [
        "Two angels in shining clothes — they tell them not to weep, for the Lord is risen",
        "Jesus himself — he tells them to fear not, and to spread the word to the nations",
        "An empty tomb with the burial cloths neatly folded — they understand without being told",
      ],
    },
    {
      q: "How do the women immediately react after seeing the empty tomb, according to verse 8?",
      correct: "They flee from the tomb, trembling and bewildered, and say nothing to anyone because they are afraid",
      wrong: [
        "They run to the disciples with great joy, telling them everything they had seen",
        "They fall down and worship at the entrance of the tomb",
        "They sit down to wait for the disciples to arrive at the tomb",
      ],
    },
    {
      q: "In the longer ending of Mark, what final commission does Jesus give to the eleven disciples?",
      correct: "Go into all the world and proclaim the gospel to the whole creation",
      wrong: [
        "Wait in Jerusalem until the Spirit comes upon them with power",
        "Make disciples of all nations, baptizing them in the name of the Father, Son, and Spirit",
        "Be his witnesses in Jerusalem, all Judea and Samaria, and to the ends of the earth",
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
  // Fall back to generic literal-style questions for chapters not yet scripted.
  return generic(bookId.toUpperCase(), chapter);
}

