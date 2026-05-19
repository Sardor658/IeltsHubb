import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Mic, CheckCircle2, Play, Square, RotateCcw, 
  HelpCircle, Sparkles, MessageCircle, AlertTriangle 
} from 'lucide-react';
import { updateBackendStats } from '../utils/api';
import './SpeakingPractice.css';

// Rich IELTS Speaking Topics Dataset
const speakingTopics = [
  {
    id: 1,
    title: 'Shoes & Someone Apologized to You',
    emoji: '👟',
    level: "O'rta",
    category: 'Fashion & Relationships',
    isFree: true,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [
      { word: 'Footwear', type: 'noun', definition: 'Outerwear worn on the feet, such as shoes, boots, or slippers.', example: 'He was advised to wear sturdy footwear for the hike.' },
      { word: 'Aesthetic', type: 'adjective', definition: 'Concerned with beauty or the appreciation of beauty.', example: 'The minimal aesthetic of the store appeals to young shoppers.' },
      { word: 'Remorseful', type: 'adjective', definition: 'Filled with remorse; sorry or apologetic.', example: 'She looked truly remorseful after accidentally bumping into me.' },
      { word: 'Indispensable', type: 'adjective', definition: 'Absolutely necessary; essential.', example: 'A good pair of running shoes is indispensable for active training.' },
      { word: 'Reconciliation', type: 'noun', definition: 'The restoration of friendly relations after a dispute.', example: 'An apology is the first major step toward reconciliation.' }
    ],
    ideas: [
      { title: "Put yourself in someone's shoes", text: "Idiom meaning to understand another person's perspective or experiences." },
      { title: "To clear the air", text: "Idiom meaning to remove anger, doubt, or misunderstandings between people." },
      { title: "Sincerity is key", text: "When speaking about apologies, highlight that an apology must feel authentic and genuine." }
    ],
    answers: [
      { question: "Do you like buying shoes? How often?", answer: "To be honest, I am quite passionate about footwear. I wouldn't say I'm an obsessive collector, but I do buy a new pair of shoes every three to four months. I prioritize comfort over luxury, but a clean aesthetic is definitely a must." }
    ],
    parts: {
      part1: [
        "Do you like buying shoes? How often?",
        "What kind of shoes do you usually wear?",
        "Do you spend a lot of money on shoes? Why?",
        "Have you ever bought shoes online?"
      ],
      part2: [
        "Describe a time when someone apologized to you.\n\nYou should say:\n- Who apologized to you\n- Why they apologized\n- When and where it happened\n- And explain how you felt about it."
      ],
      part3: [
        "In what situations do people usually apologize?",
        "Why is it sometimes difficult to say \"I'm sorry\"?",
        "Is it important to teach children to apologize? Why?",
        "Do you think people apologize too much nowadays?",
        "How do you feel when someone refuses to apologize for their mistake?"
      ]
    }
  },
  {
    id: 2,
    title: 'Rules & Something You Can\'t Live Without',
    emoji: '📋',
    level: "O'rta",
    category: 'Society & Daily Life',
    isFree: true,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [
      { word: 'Obedience', type: 'noun', definition: 'Compliance with an order, request, or law or submission to another\'s authority.', example: 'Good schools foster cooperation and obedience without stifling creativity.' },
      { word: 'Indispensable', type: 'adjective', definition: 'Absolutely necessary that one cannot do without.', example: 'Smartphones have become indispensable tools for modern business.' },
      { word: 'Strictness', type: 'noun', definition: 'The quality of enforcing rules or behaving in a demanding way.', example: 'The strictness of the code of conduct ensures all members behave ethically.' },
      { word: 'Sentimental Value', type: 'noun', definition: 'The value of an object based on personal associations rather than monetary worth.', example: 'This watch has high sentimental value as it belonged to my late grandfather.' }
    ],
    ideas: [
      { title: "To play by the rules", text: "To follow all rules, guidelines, or codes of conduct exactly." },
      { title: "Essential vs. Superfluous", text: "Differentiate between what is absolutely critical for daily survival and what is just luxury." }
    ],
    answers: [
      { question: "Are there many rules at your school or workplace?", answer: "Yes, quite a few. We have a set of strict regulations regarding punctuality, dress code, and professional ethics. While they might seem demanding, they maintain a highly organized and productive working environment." }
    ],
    parts: {
      part1: [
        "Are there many rules at your school or workplace?",
        "Do you think rules are necessary? Why?",
        "Were you a well-behaved child at school?",
        "What rules do you think should be changed in your country?"
      ],
      part2: [
        "Describe something you own that you cannot live without.\n\nYou should say:\n- What it is\n- How long you have had it\n- What you use it for\n- And explain why you cannot live without it."
      ],
      part3: [
        "Why are some people obsessed with material possessions?",
        "How has technology changed the things we cannot live without?",
        "Should schools have strict rules about students using mobile phones?",
        "Do you think people generally obey rules in society?",
        "In what ways can rules protect human rights?"
      ]
    }
  },
  {
    id: 3,
    title: 'Building & Proud of a Family Member',
    emoji: '🏛️',
    level: "O'rta",
    category: 'Architecture & Family',
    isFree: true,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [
      { word: 'Preservation', type: 'noun', definition: 'The act or process of keeping something safe or alive from injury, damage, or decay.', example: 'Historic preservation prevents cultural heritage from being demolished.' },
      { word: 'Role Model', type: 'noun', definition: 'A person looked to by others as an example to be imitated.', example: 'My older sister was my primary role model during my early high school years.' },
      { word: 'Skyscraper', type: 'noun', definition: 'A very tall continuous building having many storeys.', example: 'The skyline of New York is defined by beautiful, towering skyscrapers.' }
    ],
    ideas: [
      { title: "Chip off the old block", text: "Idiom meaning a child who is very similar to one of their parents." },
      { title: "Urban sprawl", text: "Uncontrolled expansion of urban areas, raising architectural and social issues." }
    ],
    answers: [
      { question: "What is your favorite building in your hometown?", answer: "My absolute favorite is the old central library. It features neo-classical architecture with enormous columns, and walking into it always feels like taking a journey back in time." }
    ],
    parts: {
      part1: [
        "What is your favorite building in your hometown?",
        "Do you prefer modern buildings or old, traditional ones?",
        "What kind of building would you like to live in?",
        "Are there any famous buildings in your country?"
      ],
      part2: [
        "Describe a family member you are proud of.\n\nYou should say:\n- Who this person is\n- What they did\n- Why you are proud of them\n- And explain how they have influenced you."
      ],
      part3: [
        "What is the role of family in modern society?",
        "Why do children often look up to their parents?",
        "How can old historic buildings be preserved?",
        "Do modern high-rise buildings destroy the character of a city?",
        "How has family structure changed in your country over the past few decades?"
      ]
    }
  },
  {
    id: 4,
    title: 'Morning Time & Traditional Story',
    emoji: '🌅',
    level: "O'rta",
    category: 'Daily Life & Culture',
    isFree: true,
    totalQuestions: 11,
    progress: 0,
    partsDistribution: '5 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 5,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [
      { word: 'Morning Person', type: 'noun', definition: 'A person who dislikes staying up late but is naturally alert and productive in the morning.', example: 'I\'m a complete morning person, often starting my day around 5 AM.' },
      { word: 'Folklore', type: 'noun', definition: 'The traditional beliefs, customs, and stories of a community, passed through generations by word of mouth.', example: 'Traditional folklore holds vital life lessons wrapped in simple tales.' },
      { word: 'Productivity', type: 'noun', definition: 'The state or quality of being productive or fertile.', example: 'Starting the day with exercise boosts my mental productivity throughout.' }
    ],
    ideas: [
      { title: "Early bird catches the worm", text: "Idiom meaning that starting early increases chances of success." },
      { title: "Oral tradition", text: "Cultural material and traditions transmitted orally from one generation to another." }
    ],
    answers: [],
    parts: {
      part1: [
        "Do you like mornings? Why/Why not?",
        "What is your morning routine?",
        "Do you prefer to study/work in the morning or at night?",
        "Did you like traditional stories when you were a child?",
        "Who used to tell you stories when you were young?"
      ],
      part2: [
        "Describe a traditional story in your country that you know well.\n\nYou should say:\n- What the story is about\n- When you first heard it\n- Who told it to you\n- And explain why it is still popular today."
      ],
      part3: [
        "Why is storytelling important for children?",
        "Do you think reading books is better than watching movies?",
        "How do traditions affect our daily routines in the morning?",
        "Should traditional stories be preserved in modern digital forms?",
        "How do cultural stories help form a national identity?"
      ]
    }
  },
  {
    id: 5,
    title: 'Mobile Phone & Childhood Toy',
    emoji: '📱',
    level: "O'rta",
    category: 'Technology & Childhood',
    isFree: true,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [
      { word: 'Distraction', type: 'noun', definition: 'A thing that prevents someone from giving full attention to something else.', example: 'Social media notifications serve as a constant source of distraction.' },
      { word: 'Nostalgia', type: 'noun', definition: 'A sentimental longing or wistful affection for the past, typically for a period with happy personal associations.', example: 'Looking at my old teddy bear fills me with a sense of pure nostalgia.' }
    ],
    ideas: [
      { title: "Double-edged sword", text: "A tool or situation having both positive and negative consequences (like mobile phones)." }
    ],
    answers: [],
    parts: {
      part1: [
        "How often do you use your mobile phone?",
        "What is the most useful feature of your phone?",
        "Did you have a favorite toy when you were a child?",
        "What kinds of toys are popular in your country today?"
      ],
      part2: [
        "Describe a toy that was special to you in your childhood.\n\nYou should say:\n- What it looked like\n- Who gave it to you\n- How you played with it\n- And explain why it was special to you."
      ],
      part3: [
        "How do toys help in the mental development of children?",
        "Do you think modern children play with toys less because of gadgets?",
        "What are the negative effects of mobile phone addiction on teenagers?",
        "Should parents limit the screen time of young children?",
        "In what ways has mobile communication changed our social lives?"
      ]
    }
  },
  {
    id: 6,
    title: 'Gifts',
    emoji: '🎁',
    level: "O'rta",
    category: 'Gifts & Relationships',
    isFree: true,
    totalQuestions: 11,
    progress: 0,
    partsDistribution: '5 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 5,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [
      { word: 'Thoughtfulness', type: 'noun', definition: 'The state of being thoughtful; showing consideration for others.', example: 'The value of a gift lies in its thoughtfulness, not its price tag.' },
      { word: 'Reciprocity', type: 'noun', definition: 'The practice of exchanging things with others for mutual benefit, especially privileges granted by one country or organization to another.', example: 'Gift-giving operates heavily on the cultural principle of reciprocity.' }
    ],
    ideas: [
      { title: "It's the thought that counts", text: "Expression highlighting that the good intentions behind a gift matter more than the cost." }
    ],
    answers: [],
    parts: {
      part1: [
        "Do you like giving or receiving gifts? Why?",
        "How often do you buy gifts for others?",
        "What was the best gift you ever received?",
        "Do people in your country give gifts on special occasions?",
        "Is it difficult to choose a gift for someone?"
      ],
      part2: [
        "Describe a special gift you gave to someone.\n\nYou should say:\n- What the gift was\n- Who you gave it to\n- Why you chose it\n- And explain how the person reacted to it."
      ],
      part3: [
        "Why is gift-giving a significant part of many cultures?",
        "Do you think commercialization has ruined the meaning of gifts?",
        "Under what circumstances can a hand-made gift be better than a bought one?",
        "How do people usually choose gifts for business partners?",
        "What role does price play in the value of a gift?"
      ]
    }
  }
];

// Cambridge Speaking Tests Dataset (18-20 Book, Tests 1-4)
const cambridgeSpeakingTests = [
  {
    id: 'cam-20-4',
    title: 'Cambridge IELTS 20 Academic Speaking Test 4',
    book: 20,
    test: 4,
    level: "Qiyin",
    category: 'Full Cambridge Test',
    isFree: false,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [
      { word: 'Laughter', type: 'noun', definition: 'The action or sound of laughing.', example: 'Laughter is key to stress relief.' },
      { word: 'Recreational', type: 'adjective', definition: 'Relating to or denoting activity done for enjoyment when one is not working.', example: 'Beautiful places offer vital recreational value.' }
    ],
    ideas: [
      { title: "Eco-tourism balance", text: "Highlight the conflict between tourist attraction revenue and environmental preservation." }
    ],
    answers: [],
    parts: {
      part1: [
        "Do you work or are you a student?",
        "Do you like to write with a pen or pencil? Why?",
        "How often do you laugh in your daily life?",
        "Who is the person who makes you laugh the most?"
      ],
      part2: [
        "Describe a beautiful place in your country that you would like to visit.\n\nYou should say:\n- Where it is\n- What you can do there\n- Who you would like to go with\n- And explain why you think it is beautiful."
      ],
      part3: [
        "What makes a place beautiful or attractive to tourists?",
        "How do tourist destinations change over time?",
        "Should governments spend money to protect natural beautiful places?",
        "In what ways can tourism damage local beautiful environments?",
        "Why do some people prefer to travel to remote, quiet places?"
      ]
    }
  },
  {
    id: 'cam-20-3',
    title: 'Cambridge IELTS 20 Academic Speaking Test 3',
    book: 20,
    test: 3,
    level: "O'rta",
    category: 'Full Cambridge Test',
    isFree: true,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [],
    ideas: [],
    answers: [],
    parts: {
      part1: [
        "Where is your hometown?",
        "Do you enjoy visiting art galleries? Why/Why not?",
        "What sports did you play when you were a child?",
        "Who is your favorite sportsperson? Why?"
      ],
      part2: [
        "Describe a book you have read recently that you found exciting.\n\nYou should say:\n- What book it is\n- What it is about\n- Why you decided to read it\n- And explain why you found it exciting."
      ],
      part3: [
        "Why do some people prefer reading physical books over digital screens?",
        "Should reading be heavily encouraged in primary schools?",
        "How does technology affect the way stories are told nowadays?",
        "Do you think movies based on books are usually as good as the novels?",
        "In what ways can reading stimulate a child's imagination?"
      ]
    }
  },
  {
    id: 'cam-20-2',
    title: 'Cambridge IELTS 20 Academic Speaking Test 2',
    book: 20,
    test: 2,
    level: "Oson",
    category: 'Full Cambridge Test',
    isFree: false,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [],
    ideas: [],
    answers: [],
    parts: {
      part1: [
        "What type of accommodation do you live in?",
        "Can you play any musical instruments?",
        "Do you prefer hot or cold weather? Why?",
        "What is the typical weather like in your country?"
      ],
      part2: [
        "Describe a person who has done a lot of good work for others.\n\nYou should say:\n- Who this person is\n- How you know them\n- What good work they have done\n- And explain why you respect them."
      ],
      part3: [
        "Why do some people choose to do volunteer work?",
        "Should charity work be a compulsory part of high school education?",
        "In what ways can local communities help elderly people?",
        "Does the government or individuals have more responsibility to help poor people?",
        "How can international charity organizations assist during natural disasters?"
      ]
    }
  },
  {
    id: 'cam-20-1',
    title: 'Cambridge IELTS 20 Academic Speaking Test 1',
    book: 20,
    test: 1,
    level: "O'rta",
    category: 'Full Cambridge Test',
    isFree: true,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [],
    ideas: [],
    answers: [],
    parts: {
      part1: [
        "What are you studying at the moment?",
        "What languages can you speak?",
        "Do you like running as a form of exercise?",
        "How often do you go running?"
      ],
      part2: [
        "Describe a memorable event you attended in your childhood.\n\nYou should say:\n- What the event was\n- When it happened\n- Who attended it with you\n- And explain why it is memorable to you."
      ],
      part3: [
        "Why are early childhood memories often difficult to recall?",
        "Should parents take children to major family events?",
        "How do childhood events shape a person's adult character?",
        "What are the benefits of celebrating milestones within families?",
        "Do you think national events are more important than personal ones?"
      ]
    }
  },
  {
    id: 'cam-19-4',
    title: 'Cambridge IELTS 19 Academic Speaking Test 4',
    book: 19,
    test: 4,
    level: "Qiyin",
    category: 'Full Cambridge Test',
    isFree: false,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [],
    ideas: [],
    answers: [],
    parts: {
      part1: [
        "What is your typical daily routine?",
        "Do you like flowers? Why/Why not?",
        "Do you often see advertisements on your phone?",
        "What kinds of advertisements do you dislike the most?"
      ],
      part2: [
        "Describe a piece of good news that you heard from someone.\n\nYou should say:\n- What the news was\n- Who told it to you\n- When and where you heard it\n- And explain why you felt it was good news."
      ],
      part3: [
        "How does good news spread faster than bad news?",
        "Should news programs focus more on positive achievements?",
        "What role does social media play in distributing daily news?",
        "Do you think journalists always tell the absolute truth in news?",
        "How can misinformation be controlled on modern platforms?"
      ]
    }
  },
  {
    id: 'cam-19-3',
    title: 'Cambridge IELTS 19 Academic Speaking Test 3',
    book: 19,
    test: 3,
    level: "O'rta",
    category: 'Full Cambridge Test',
    isFree: true,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [],
    ideas: [],
    answers: [],
    parts: {
      part1: [
        "Do you often use paper maps or digital maps?",
        "How do you feel about noise in your environment?",
        "What types of clothes do you prefer to wear?",
        "Is fashion highly important to you?"
      ],
      part2: [
        "Describe an interesting conversation you had with a stranger.\n\nYou should say:\n- Who the stranger was\n- Where and when it happened\n- What you talked about\n- And explain why the conversation was interesting."
      ],
      part3: [
        "Why is it sometimes easier to talk to strangers than close friends?",
        "How does local environment influence communication between neighbors?",
        "What social skills are critical for making good conversations?",
        "Should children be taught how to interact safely with strangers?",
        "In what ways has the internet changed global communication habits?"
      ]
    }
  },
  {
    id: 'cam-19-2',
    title: 'Cambridge IELTS 19 Academic Speaking Test 2',
    book: 19,
    test: 2,
    level: "Oson",
    category: 'Full Cambridge Test',
    isFree: false,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [],
    ideas: [],
    answers: [],
    parts: {
      part1: [
        "What are your typical eating habits?",
        "What is your absolute favorite color?",
        "Do you have a highly reliable memory?",
        "How do you try to remember important things?"
      ],
      part2: [
        "Describe a sport or game that you would like to learn.\n\nYou should say:\n- What sport or game it is\n- What skills are required\n- Where you could practice it\n- And explain why you would like to learn it."
      ],
      part3: [
        "What makes competitive sports popular worldwide?",
        "Should parents force their children to play physical games?",
        "How does sports culture benefit a nation's general health?",
        "Are mental games like chess better than physically active sports?",
        "What role does money play in modern professional sport championships?"
      ]
    }
  },
  {
    id: 'cam-19-1',
    title: 'Cambridge IELTS 19 Academic Speaking Test 1',
    book: 19,
    test: 1,
    level: "O'rta",
    category: 'Full Cambridge Test',
    isFree: true,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [],
    ideas: [],
    answers: [],
    parts: {
      part1: [
        "What is your current job?",
        "Do you think robots will replace humans in many fields?",
        "How often do you give gifts to others?",
        "Is it difficult to choose gifts for friends?"
      ],
      part2: [
        "Describe a time when you had to wait in a long queue.\n\nYou should say:\n- When and where it was\n- Why you were waiting in the queue\n- What you did while waiting\n- And explain how you felt about waiting in that queue."
      ],
      part3: [
        "Why do people dislike waiting in long queues?",
        "How can public offices reduce queue waiting times?",
        "Is patience a highly valued character trait in modern society?",
        "Do you think people are less patient nowadays due to technology?",
        "In what situations is patience absolutely critical?"
      ]
    }
  },
  {
    id: 'cam-18-4',
    title: 'Cambridge IELTS 18 Academic Speaking Test 4',
    book: 18,
    test: 4,
    level: "Qiyin",
    category: 'Full Cambridge Test',
    isFree: false,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [],
    ideas: [],
    answers: [],
    parts: {
      part1: [
        "How often do you carry physical keys?",
        "Are you interested in outer space exploration?",
        "Do you prefer hand-writing or typing on gadgets?",
        "How often do you write articles or stories?"
      ],
      part2: [
        "Describe a piece of technology that you find very useful.\n\nYou should say:\n- What technology it is\n- How long you have used it\n- How it benefits your life\n- And explain why you find it particularly useful."
      ],
      part3: [
        "How does technology change the way people study and learn?",
        "Will schools rely 100% on computerized education systems soon?",
        "What are the main drawbacks of using gadgets all day long?",
        "Can older generations adapt quickly to modern technological shifts?",
        "In what ways does technology bridge or isolate human connections?"
      ]
    }
  },
  {
    id: 'cam-18-3',
    title: 'Cambridge IELTS 18 Academic Speaking Test 3',
    book: 18,
    test: 3,
    level: "O'rta",
    category: 'Full Cambridge Test',
    isFree: true,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [],
    ideas: [],
    answers: [],
    parts: {
      part1: [
        "Do you often stay up late at night?",
        "What kinds of jewelry do you prefer to wear?",
        "Do you regularly use public transport systems?",
        "Is public transport highly efficient in your city?"
      ],
      part2: [
        "Describe an outdoor activity you did for the first time.\n\nYou should say:\n- What the activity was\n- When and where you did it\n- Who did it with you\n- And explain how you felt about doing it."
      ],
      part3: [
        "Why are outdoor sports popular among young generations?",
        "Can outdoor activities improve community relations?",
        "Should city plans prioritize parks and open spaces over tall complexes?",
        "Is nature protection vital for outdoor recreation industries?",
        "How do extreme outdoor sports build a person's bravery?"
      ]
    }
  },
  {
    id: 'cam-18-2',
    title: 'Cambridge IELTS 18 Academic Speaking Test 2',
    book: 18,
    test: 2,
    level: "Oson",
    category: 'Full Cambridge Test',
    isFree: false,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [],
    ideas: [],
    answers: [],
    parts: {
      part1: [
        "Do you like eating ice cream? How often?",
        "Do you like to ride a bicycle?",
        "What is your second language?",
        "Do you enjoy learning new foreign languages?"
      ],
      part2: [
        "Describe a historic place that you visited in the past.\n\nYou should say:\n- What place it was\n- Where it is located\n- Who visited it with you\n- And explain what you learned from your visit."
      ],
      part3: [
        "Why is history education critical in primary school?",
        "How can historical buildings be effectively preserved from city expansion?",
        "Should governments spend public funds on historical museum preservation?",
        "Do modern youths show less interest in history than past generations?",
        "Can historic sites serve as powerful tourist engines for towns?"
      ]
    }
  },
  {
    id: 'cam-18-1',
    title: 'Cambridge IELTS 18 Academic Speaking Test 1',
    book: 18,
    test: 1,
    level: "O'rta",
    category: 'Full Cambridge Test',
    isFree: true,
    totalQuestions: 10,
    progress: 0,
    partsDistribution: '4 Part 1 | 1 Part 2 | 5 Part 3',
    q1Count: 4,
    q2Count: 1,
    q3Count: 5,
    vocabulary: [],
    ideas: [],
    answers: [],
    parts: {
      part1: [
        "What are your favorite daily snacks?",
        "Do you actively use social media apps?",
        "Do you enjoy singing songs? Why?",
        "Who is your favorite singer?"
      ],
      part2: [
        "Describe a rule at your school or work that you found difficult.\n\nYou should say:\n- What the rule was\n- When and where it was applied\n- Why it was difficult for you\n- And explain what happened if the rule was broken."
      ],
      part3: [
        "Why are rules necessary in community lives?",
        "How do rules in workplaces boost output efficiency?",
        "Should rules be flexible in high-stress companies?",
        "In what ways can parents set rules without making children feel restricted?",
        "Are school uniforms a helpful rule for children's focus?"
      ]
    }
  }
];


const SpeakingPractice = ({ initialViewState = 'hub', selectedTest = null, onClose = null }) => {
  const navigate = useNavigate();
  
  // Navigation State: 'hub' | 'topics' | 'cambridge_list' | 'practice'
  const [viewState, setViewState] = useState(initialViewState);
  
  // Selected Entity (Topic or Cambridge Test)
  const [selectedTopic, setSelectedTopic] = useState(selectedTest || speakingTopics[0]);

  // Sync state if props change dynamically
  useEffect(() => {
    if (selectedTest) {
      setSelectedTopic(selectedTest);
    }
    setViewState(initialViewState);
  }, [initialViewState, selectedTest]);
  
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [activeTestForTimer, setActiveTestForTimer] = useState(null);
  const timerRef = useRef(null);
  const practiceStartTimeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatStopwatch = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (viewState === 'practice') {
      practiceStartTimeRef.current = Date.now();
    } else {
      if (practiceStartTimeRef.current) {
        const elapsedSeconds = Math.round((Date.now() - practiceStartTimeRef.current) / 1000);
        if (elapsedSeconds > 2) {
          try {
            const stats = JSON.parse(localStorage.getItem('ielts_user_stats_precise')) || {
              targetBand: "0", averageScore: "0%", daysToExam: "0", streak: 0,
              listeningTime: 0, readingTime: 0, writingTime: 0, speakingTime: 0,
              weeklyProgress: { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 },
              radarSkills: { Listening: 0, Reading: 0, Writing: 0, Speaking: 0, Mock: 0 }
            };
            stats.speakingTime += elapsedSeconds;

            const activePoints = Math.min(99, Math.round(elapsedSeconds / 10));
            if (activePoints > 0) {
              stats.radarSkills.Speaking = stats.radarSkills.Speaking
                ? Math.min(99, stats.radarSkills.Speaking + activePoints)
                : Math.min(99, activePoints);
            }

            localStorage.setItem('ielts_user_stats_precise', JSON.stringify(stats));
          } catch (e) {
            console.error(e);
          }
        }
        practiceStartTimeRef.current = null;
      }
    }
  }, [viewState]);

  // Matching Session Modal (1:1 conversation)
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchStatus, setMatchStatus] = useState('searching'); // 'searching' | 'matched'
  
  // Practice Sub-navigation Tab: 'savollar' | 'sozlar' | 'goyalar' | 'javoblar'
  const [activeTab, setActiveTab] = useState('savollar');
  
  // Practice Active Part: 'part1' | 'part2' | 'part3'
  const [activePart, setActivePart] = useState('part1');
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // Audio Recording states
  const [recordingState, setRecordingState] = useState('idle'); // 'idle' | 'recording' | 'recorded'
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  
  // Simulated Voice Waveform Animation heights
  const [waveHeights, setWaveHeights] = useState([8, 8, 8, 8, 8]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Stop recording timer and streams on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Update dynamic progress count locally
  const userMembership = localStorage.getItem('ielts_user_membership_precise') || 'free';
  const unlockedCount = userMembership === 'pro_plus' ? Infinity : (userMembership === 'pro' ? 8 : 5);

  const mappedTopics = speakingTopics.map((t, idx) => ({ ...t, isLocked: idx >= unlockedCount }));
  const mappedCambridgeTests = cambridgeSpeakingTests.map((t, idx) => ({ ...t, isLocked: idx >= unlockedCount }));

  const [localTopics, setLocalTopics] = useState(mappedTopics);
  const [localCambridgeTests, setLocalCambridgeTests] = useState(mappedCambridgeTests);

  // Matching simulator
  useEffect(() => {
    if (showMatchModal) {
      setMatchStatus('searching');
      const timer = setTimeout(() => {
        setMatchStatus('matched');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMatchModal]);

  // Audio Wave dance simulation
  useEffect(() => {
    let animId;
    if (recordingState === 'recording') {
      const updateWave = () => {
        setWaveHeights(prev => prev.map(() => Math.floor(Math.random() * 20) + 6));
        animId = setTimeout(updateWave, 100);
      };
      updateWave();
    } else {
      setWaveHeights([8, 8, 8, 8, 8]);
    }
    return () => clearTimeout(animId);
  }, [recordingState]);

  // Start microphone voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecordingState('recorded');
        
        // Stop all media tracks to release the microphone device
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingState('recording');
      setRecordingTime(0);
      
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.warn("Microphone access denied or failed, launching sandbox simulation.", err);
      // Sandbox fallback recording animation simulation
      setRecordingState('recording');
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Mock recording finish
      setAudioUrl('#');
      setRecordingState('recorded');
    }
  };

  // Reset/Retry Recording
  const resetRecording = () => {
    setAudioUrl(null);
    setRecordingState('idle');
    setRecordingTime(0);
  };

  // Format Time Helper
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Handle active part switch
  const handlePartSwitch = (part) => {
    setActivePart(part);
    setActiveQuestionIdx(0);
    resetRecording();
  };

  // Handle topic selected to practice
  const startPractice = (topic) => {
    if (topic.isLocked) {
      const go = window.confirm("Ushbu speaking mavzusi qulflangan! 🔒\n\nBepul (FREE) tarifda faqat 5 ta mavzu ochiq.\nPRO tarifda 8 ta mavzu, PRO+ tarifda esa barcha mavzular to'liq ochiladi!\n\nTarifni yangilash uchun Premium sahifasiga o'tishni xohlaysizmi?");
      if (go) navigate('/packs');
      return;
    }
    setSelectedTopic(topic);
    setViewState('practice');
    setActiveTab('savollar');
    setActivePart('part1');
    setActiveQuestionIdx(0);
    resetRecording();
  };

  const handleStartCambridgeTest = (testCard) => {
    if (testCard.isLocked) {
      const go = window.confirm("Ushbu Cambridge speaking testi qulflangan! 🔒\n\nBepul (FREE) tarifda faqat 5 ta test ochiq.\nPRO tarifda 8 ta test, PRO+ tarifda esa barcha testlar to'liq va cheksiz ochiladi!\n\nTarifni yangilash uchun Premium sahifasiga o'tishni xohlaysizmi?");
      if (go) navigate('/packs');
      return;
    }
    const url = `https://engnovate.com/ielts-speaking-tests/cambridge-ielts-${testCard.book}-academic-speaking-test-${testCard.test}/`;
    setActiveTestForTimer({ title: testCard.title, book: testCard.book, test: testCard.test, url });
    setSecondsElapsed(0);
    setShowTimerModal(true);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
  };

  const handleCancelTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowTimerModal(false);
    setActiveTestForTimer(null);
  };

  const handleFinishTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowTimerModal(false);

    if (activeTestForTimer) {
      try {
        const stats = JSON.parse(localStorage.getItem('ielts_user_stats_precise')) || {
          targetBand: "0",
          averageScore: "0%",
          daysToExam: "0",
          streak: 0,
          listeningTime: 0,
          readingTime: 0,
          writingTime: 0,
          speakingTime: 0,
          weeklyProgress: { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 },
          radarSkills: { Listening: 0, Reading: 0, Writing: 0, Speaking: 0, Mock: 0 }
        };

        const trackedSeconds = secondsElapsed;
        const newTestScore = Math.floor(Math.random() * 25) + 65; 
        stats.completedTests = (stats.completedTests || 0) + 1;
        stats.totalScoreSum = (stats.totalScoreSum || 0) + newTestScore;
        stats.averageScore = `${Math.round(stats.totalScoreSum / stats.completedTests)}%`;

        stats.speakingTime += trackedSeconds;
        stats.radarSkills.Speaking = stats.radarSkills.Speaking 
          ? Math.round((stats.radarSkills.Speaking + newTestScore) / 2)
          : newTestScore;

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const todayName = dayNames[new Date().getDay()];
        stats.weeklyProgress[todayName] = stats.weeklyProgress[todayName]
          ? Math.round((stats.weeklyProgress[todayName] + newTestScore) / 2)
          : newTestScore;

        stats.streak = (stats.streak || 0) + 1;

        localStorage.setItem('ielts_user_stats_precise', JSON.stringify(stats));

        const currentUserEmail = localStorage.getItem('ielts_current_user_email') || 'google_user@gmail.com';
        const usersDb = JSON.parse(localStorage.getItem('ielts_users_db')) || [];
        const currentUser = usersDb.find(u => u.email === currentUserEmail) || { name: 'User' };
        
        updateBackendStats(currentUserEmail, currentUser.name, {
          stars: 15,
          time: Math.max(1, Math.round(trackedSeconds / 60)),
          streak: stats.streak,
          coins: 10,
          practices: 1
        });
      } catch (e) {
        console.error(e);
      }
    }

    setActiveTestForTimer(null);
  };

  // Question navigation
  const questionsInCurrentPart = selectedTopic.parts[activePart] || [];
  
  const handlePrevQuestion = () => {
    if (activeQuestionIdx > 0) {
      setActiveQuestionIdx(prev => prev - 1);
      resetRecording();
    }
  };

  const handleNextQuestion = () => {
    try {
      const stats = JSON.parse(localStorage.getItem('ielts_user_stats_precise')) || {
        targetBand: "0",
        averageScore: "0%",
        daysToExam: "0",
        streak: 0,
        listeningTime: 0,
        readingTime: 0,
        writingTime: 0,
        speakingTime: 0,
        weeklyProgress: { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 },
        radarSkills: { Listening: 0, Reading: 0, Writing: 0, Speaking: 0, Mock: 0 }
      };
      const durMin = 2;
      const questionScore = Math.floor(Math.random() * 20) + 70; 
      
      stats.speakingTime += durMin;
      stats.radarSkills.Speaking = stats.radarSkills.Speaking
        ? Math.round((stats.radarSkills.Speaking + questionScore) / 2)
        : questionScore;
        
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const todayName = dayNames[new Date().getDay()];
      
      stats.weeklyProgress[todayName] = stats.weeklyProgress[todayName]
        ? Math.round((stats.weeklyProgress[todayName] + questionScore) / 2)
        : questionScore;

      // Per correct question: 15 stars + 10 coins + time
      const currentUserEmail = localStorage.getItem('ielts_current_user_email') || 'google_user@gmail.com';
      const usersDb = JSON.parse(localStorage.getItem('ielts_users_db')) || [];
      const currentUser = usersDb.find(u => u.email === currentUserEmail) || { name: 'User' };
      updateBackendStats(currentUserEmail, currentUser.name, {
        stars: 15,
        time: 2,
        coins: 10,
        practices: 1
      });

      localStorage.setItem('ielts_user_stats_precise', JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }

    if (activeQuestionIdx < questionsInCurrentPart.length - 1) {
      setActiveQuestionIdx(prev => prev + 1);
      resetRecording();
    } else {
      // Update progress locally on completing a part
      if (selectedTopic.category === 'Full Cambridge Test') {
        setLocalCambridgeTests(prev => prev.map(t => {
          if (t.id === selectedTopic.id) {
            const currentProgress = Math.min(t.totalQuestions, t.progress + 1);
            return { ...t, progress: currentProgress };
          }
          return t;
        }));
      } else {
        setLocalTopics(prev => prev.map(t => {
          if (t.id === selectedTopic.id) {
            const currentProgress = Math.min(t.totalQuestions, t.progress + 1);
            return { ...t, progress: currentProgress };
          }
          return t;
        }));
      }
    }
  };

  return (
    <div className="speaking-practice-container">
      
      {/* PHASE 1: MAIN SELECTOR HUB */}
      {viewState === 'hub' && (
        <div className="speaking-hub">
          <h1 className="hub-title">Speaking Practice</h1>
          
          <div className="hub-grid">
            {/* Speaking Topics */}
            <div className="hub-card">
              <div>
                <div className="hub-card-header">
                  <div className="hub-icon-wrapper">
                    <BookOpen size={28} />
                  </div>
                  <span className="hub-tag">New</span>
                </div>
                <div className="hub-card-body">
                  <h3>Speaking Topics</h3>
                  <p>Mavzular bo'yicha savollarni o'rganib, speaking ko'nikmangizni oshiring. Har bir mavzu barcha 3 ta speaking qismlari va eng boy namuna lug'atlarini o'z ichiga oladi.</p>
                </div>
              </div>
              <button className="hub-btn hub-btn-primary" onClick={() => setViewState('topics')}>
                Mavzularni ko'rish
              </button>
            </div>

            {/* Cambridge Full Tests */}
            <div className="hub-card">
              <div>
                <div className="hub-card-header">
                  <div className="hub-icon-wrapper" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                    <Mic size={28} />
                  </div>
                  <span className="hub-tag" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>Full Test</span>
                </div>
                <div className="hub-card-body">
                  <h3>Cambridge Full Tests</h3>
                  <p>Cambridge IELTS 18-20 Academic kitoblari andozasidagi to'liq gapirish imtihonlarini topshiring hamda nutqingizni imtihon talablarida sinab ko'ring.</p>
                </div>
              </div>
              <button className="hub-btn" style={{ backgroundColor: '#dc2626', color: 'white' }} onClick={() => setViewState('cambridge_list')}>
                Testlarni boshlash
              </button>
            </div>

            {/* 1:1 Conversation */}
            <div className="hub-card">
              <div>
                <div className="hub-card-header">
                  <div className="hub-icon-wrapper">
                    <Mic size={28} />
                  </div>
                  <span className="hub-tag">Jonli suhbat</span>
                </div>
                <div className="hub-card-body">
                  <h3>1:1 Conversation</h3>
                  <p>Real foydalanuvchilar bilan juftlashib, jonli speaking mashq qiling. O'zaro suhbat orqali qo'rquvni yengib, nutqingizni tez rivojlantiring.</p>
                </div>
              </div>
              <button className="hub-btn hub-btn-secondary" onClick={() => setShowMatchModal(true)}>
                Suhbatni boshlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: SPEAKING TOPICS GRID */}
      {viewState === 'topics' && (
        <div className="speaking-topics-view">
          <div className="topics-header">
            <button className="back-link-btn" onClick={() => onClose ? onClose() : setViewState('hub')}>
              <ArrowLeft size={16} /> Orqaga
            </button>
            <h2 className="topics-title">Speaking Mavzulari</h2>
          </div>

          <div className="topics-grid">
            {localTopics.map((topic, index) => {
              // Custom borders for colorful aesthetic
              const colors = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
              const borderColor = colors[index % colors.length];

              return (
                <div 
                  key={topic.id} 
                  className={`topic-card ${topic.isLocked ? 'topic-card-locked' : ''}`}
                  style={{ borderBottomColor: topic.isLocked ? '#94a3b8' : borderColor }}
                  onClick={() => startPractice(topic)}
                >
                  <div>
                    <div className="topic-emoji-wrapper">
                      {topic.isLocked ? '🔒' : topic.emoji}
                    </div>
                    <h3 className="topic-card-title">{topic.title}</h3>
                    
                    <div className="topic-badges">
                      {topic.isLocked ? (
                        <span className="t-badge t-badge-locked">🔒 PREMIUM</span>
                      ) : (
                        <span className="t-badge t-badge-free">FREE</span>
                      )}
                      <span className="t-badge t-badge-level">{topic.level}</span>
                      <span className="t-badge t-badge-questions">{topic.totalQuestions} ta savol</span>
                    </div>

                    <p className="topic-category">{topic.category}</p>
                  </div>

                  <div className="topic-progress-section">
                    <div className="progress-label-row">
                      <span>Progress</span>
                      <span>{topic.progress} / {topic.totalQuestions}</span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${(topic.progress / topic.totalQuestions) * 100}%`,
                          backgroundColor: topic.isLocked ? '#cbd5e1' : borderColor
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PHASE 2B: CAMBRIDGE FULL TESTS GRID LIST */}
      {viewState === 'cambridge_list' && (
        <div className="speaking-topics-view">
          <div className="topics-header">
            <button className="back-link-btn" onClick={() => onClose ? onClose() : setViewState('hub')}>
              <ArrowLeft size={16} /> Orqaga
            </button>
            <h2 className="topics-title">Cambridge Speaking Tests</h2>
          </div>

          <div className="cambridge-grid-list">
            {localCambridgeTests.map((testCard) => (
              <div key={testCard.id} className={`cam-test-card ${testCard.isLocked ? 'cam-test-card-locked' : ''}`} onClick={() => testCard.isLocked && handleStartCambridgeTest(testCard)}>
                {testCard.isLocked ? (
                  <span className="cam-badge cam-badge-locked">🔒 PREMIUM</span>
                ) : (
                  <span className="cam-badge">Full Test</span>
                )}
                <h3 className="cam-card-title">{testCard.title}</h3>
                <button 
                  className={`cam-take-btn ${testCard.isLocked ? 'cam-btn-locked' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartCambridgeTest(testCard);
                  }}
                >
                  {testCard.isLocked ? '🔒 Ochish' : 'Take Test'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 3: CUE CARD AND MIC INTERACTION ROOM */}
      {viewState === 'practice' && (
        <div className="speaking-practice-room">
          <div className="detail-header">
            <div className="detail-header-left">
              <button className="back-to-topics-btn" onClick={() => {
                if (onClose) {
                  onClose();
                } else if (selectedTopic.category === 'Full Cambridge Test') {
                  setViewState('cambridge_list');
                } else {
                  setViewState('topics');
                }
              }}>
                <ArrowLeft size={14} /> Mavzularga qaytish
              </button>
              <h1 className="detail-title">{selectedTopic.title}</h1>
              <div className="detail-header-badges">
                <span className="t-badge t-badge-free">BEPUL</span>
                <span className="t-badge t-badge-questions">{selectedTopic.totalQuestions} ta savol</span>
                <span className="t-badge t-badge-level">{selectedTopic.level}</span>
                <span className="t-badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>{selectedTopic.category}</span>
              </div>
            </div>

            <div className="detail-distribution-card">
              <div className="distribution-title">Savollar taqsimoti</div>
              <div className="distribution-content">
                <span>{selectedTopic.q1Count}</span> Part 1 | <span>{selectedTopic.q2Count}</span> Part 2 | <span>{selectedTopic.q3Count}</span> Part 3
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="speaking-tabs-row">
            <button 
              className={`speaking-tab ${activeTab === 'savollar' ? 'active' : ''}`}
              onClick={() => setActiveTab('savollar')}
            >
              Savollar <span className="tab-badge">{selectedTopic.totalQuestions}</span>
            </button>
            <button 
              className={`speaking-tab ${activeTab === 'sozlar' ? 'active' : ''}`}
              onClick={() => setActiveTab('sozlar')}
            >
              So'zlar <span className="tab-badge">{selectedTopic.vocabulary.length}</span>
            </button>
            <button 
              className={`speaking-tab ${activeTab === 'goyalar' ? 'active' : ''}`}
              onClick={() => setActiveTab('goyalar')}
            >
              G'oyalar <span className="tab-badge">{selectedTopic.ideas.length}</span>
            </button>
            <button 
              className={`speaking-tab ${activeTab === 'javoblar' ? 'active' : ''}`}
              onClick={() => setActiveTab('javoblar')}
            >
              Javoblar <span className="tab-badge">{selectedTopic.answers.length || 1}</span>
            </button>
          </div>

          {/* TAB 1: SAVOLLAR ACTIVE (WITH SIDEBAR & MIC CONTROLS) */}
          {activeTab === 'savollar' && (
            <div className="sp-practice-grid">
              
              {/* Left Column: Horizontal Parts Row + Question Display */}
              <div className="left-practice-column">
                
                {/* Horizontal Parts Row */}
                <div className="parts-horizontal-row">
                  <button 
                    className={`part-card ${activePart === 'part1' ? 'active' : ''}`}
                    onClick={() => handlePartSwitch('part1')}
                  >
                    <h4 className="part-card-title">Qism 1</h4>
                    <p className="part-card-desc">Tanish mavzular</p>
                    <span className="part-card-meta">{selectedTopic.q1Count} savol</span>
                  </button>

                  <button 
                    className={`part-card ${activePart === 'part2' ? 'active' : ''}`}
                    onClick={() => handlePartSwitch('part2')}
                  >
                    <h4 className="part-card-title">Qism 2</h4>
                    <p className="part-card-desc">Uzun nutq (karta)</p>
                    <span className="part-card-meta">{selectedTopic.q2Count} savol</span>
                  </button>

                  <button 
                    className={`part-card ${activePart === 'part3' ? 'active' : ''}`}
                    onClick={() => handlePartSwitch('part3')}
                  >
                    <h4 className="part-card-title">Qism 3</h4>
                    <p className="part-card-desc">Muhokama</p>
                    <span className="part-card-meta">{selectedTopic.q3Count} savol</span>
                  </button>
                </div>

                {/* Question Display Card */}
                <div className="question-viewer-card">
                <div className="question-nav-header">
                  <span>
                    {activePart === 'part1' && 'QISM 1: Tanish savollar'}
                    {activePart === 'part2' && 'QISM 2: Cue Card (Kartochka)'}
                    {activePart === 'part3' && 'QISM 3: Muhokama'}
                  </span>
                  <span>Savol {activeQuestionIdx + 1} / {questionsInCurrentPart.length}</span>
                </div>

                <div className="active-question-wrapper">
                  {activePart === 'part2' ? (
                    <div className="cue-card-box">
                      {questionsInCurrentPart[activeQuestionIdx]}
                    </div>
                  ) : (
                    <h2 className="active-question-text">
                      {questionsInCurrentPart[activeQuestionIdx]}
                    </h2>
                  )}
                </div>

                <div className="question-viewer-footer">
                  {/* Dots Indicator */}
                  <div className="dots-indicator">
                    {questionsInCurrentPart.map((_, idx) => (
                      <span 
                        key={idx} 
                        className={`sp-dot ${activeQuestionIdx === idx ? 'active' : ''}`}
                        onClick={() => {
                          setActiveQuestionIdx(idx);
                          resetRecording();
                        }}
                      />
                    ))}
                  </div>

                  {/* Nav Actions */}
                  <div className="nav-buttons-row">
                    <button 
                      className="sp-nav-btn" 
                      onClick={handlePrevQuestion}
                      disabled={activeQuestionIdx === 0}
                    >
                      &lt; Oldingi
                    </button>
                    <button 
                      className="sp-nav-btn sp-nav-btn-primary" 
                      onClick={handleNextQuestion}
                      disabled={activeQuestionIdx === questionsInCurrentPart.length - 1}
                    >
                      {activeQuestionIdx === questionsInCurrentPart.length - 1 ? 'Tugatish' : 'Keyingi >'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

              {/* Right: Audio Recording Microphone Console */}
              <div className="mic-sidebar-card">
                <h3 className="mic-title">Sizning javobingiz</h3>

                {/* Big mic circular button */}
                <button 
                  className={`mic-circle-button ${recordingState === 'recording' ? 'recording' : ''}`}
                  onClick={recordingState === 'recording' ? stopRecording : startRecording}
                  disabled={recordingState === 'recorded'}
                >
                  {recordingState === 'recording' ? (
                    <Square size={32} />
                  ) : (
                    <Mic size={36} />
                  )}
                </button>

                {/* Soundwave animation */}
                {recordingState === 'recording' && (
                  <div className="audio-waveform-container">
                    {waveHeights.map((h, i) => (
                      <div key={i} className="wave-bar" style={{ height: `${h}px` }} />
                    ))}
                  </div>
                )}

                {/* Recording Status labels */}
                <div className="mic-status-text">
                  {recordingState === 'idle' && 'Bosib gapirishni boshlang'}
                  {recordingState === 'recording' && `Yozilmoqda... (${formatTime(recordingTime)})`}
                  {recordingState === 'recorded' && 'Javobingiz muvaffaqiyatli saqlandi!'}
                </div>

                {/* Interactive Player if recorded */}
                {recordingState === 'recorded' && (
                  <div className="audio-controls-box">
                    {audioUrl !== '#' ? (
                      <audio src={audioUrl} controls className="audio-player" />
                    ) : (
                      <div style={{ color: '#ef4444', fontSize: '0.8rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        <AlertTriangle size={14} /> Mikrafon ulanmadi (Demo rejimida saqlandi)
                      </div>
                    )}
                    <button className="reset-audio-btn" onClick={resetRecording}>
                      <RotateCcw size={14} /> Qaytadan yozish
                    </button>
                  </div>
                )}

                {/* Tip box */}
                <div className="tip-box">
                  <div className="tip-box-title">
                    <Sparkles size={14} />
                    <span>Maslahat</span>
                  </div>
                  <p>
                    {activePart === 'part1' && 'Qisqa va tabiiy javob bering. Savolga 20-30 soniya davomida to\'liq javob qaytarish kifoya.'}
                    {activePart === 'part2' && 'Boshlashdan oldin 1 daqiqa rejalashtirishga vaqt ajrating. Kalit so\'zlarni eslab qolib, 2 daqiqa to\'xtovsiz gapiring.'}
                    {activePart === 'part3' && 'Mavzu bo\'yicha o\'z shaxsiy nuqtai nazaringizni bildiring va uni misollar yordamida asoslab bering (40-60 soniya).'}
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SO'ZLAR (VOCABULARY) */}
          {activeTab === 'sozlar' && (
            <div className="tab-content-container">
              <div className="vocabulary-list">
                {selectedTopic.vocabulary.map((vocab, i) => (
                  <div key={i} className="vocab-card">
                    <h4 className="vocab-word">{vocab.word}</h4>
                    <span className="vocab-type">({vocab.type})</span>
                    <p className="vocab-def">{vocab.definition}</p>
                    <p className="vocab-ex"><strong>Ex:</strong> "{vocab.example}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: G'OYALAR (IDEAS) */}
          {activeTab === 'goyalar' && (
            <div className="tab-content-container">
              <div className="ideas-list">
                {selectedTopic.ideas.map((idea, i) => (
                  <div key={i} className="idea-item">
                    <div className="idea-icon">
                      <Sparkles size={20} />
                    </div>
                    <div className="idea-text-box">
                      <h4>{idea.title}</h4>
                      <p>{idea.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: JAVOBLAR (MODEL ANSWERS) */}
          {activeTab === 'javoblar' && (
            <div className="tab-content-container">
              <div className="answers-list">
                {selectedTopic.answers.length > 0 ? (
                  selectedTopic.answers.map((ans, i) => (
                    <div key={i} className="answer-item">
                      <h4 className="answer-q">Q: {ans.question}</h4>
                      <p className="answer-a">{ans.answer}</p>
                    </div>
                  ))
                ) : (
                  <div className="answer-item">
                    <h4 className="answer-q">Q: {selectedTopic.parts.part1[0]}</h4>
                    <p className="answer-a">
                      Here is a recommended Band 8+ framework for this question. Make sure to clearly state your direct answer, give a strong supporting reason, and add a brief illustrative example to demonstrate cohesive structures and vocabulary.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 1:1 CONVERSATION MATCHING MODAL */}
      {showMatchModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            {matchStatus === 'searching' ? (
              <div>
                <div className="matching-avatar-row">
                  <div className="matching-avatar pulse">
                    👤
                  </div>
                  <div className="matching-spinner" />
                  <div className="matching-avatar" style={{ backgroundColor: '#f1f5f9', color: '#cbd5e1' }}>
                    ❓
                  </div>
                </div>
                <h3 className="modal-title">Suhbatdosh qidirilmoqda...</h3>
                <p className="modal-desc">Sizning darajangizga mos keladigan real foydalanuvchi qidirilmoqda. Iltimos bir necha soniya kutib turing.</p>
                <button className="modal-close-btn" onClick={() => setShowMatchModal(false)}>
                  Bekor qilish
                </button>
              </div>
            ) : (
              <div>
                <div className="matching-avatar-row">
                  <div className="matching-avatar">
                    👤
                  </div>
                  <div style={{ fontSize: '2rem', color: '#10b981' }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="matching-avatar" style={{ backgroundColor: '#fdf2f8', color: '#ec4899' }}>
                    👩‍🎓
                  </div>
                </div>
                <h3 className="modal-title">Suhbatdosh topildi!</h3>
                <p className="modal-desc">
                  <strong>Rayhona</strong> (IELTS Target: 7.5)<br />
                  Siz bilan hozir jonli gapirishga tayyor. Ovozli suhbat xonangiz faollashdi.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button className="modal-close-btn" onClick={() => setShowMatchModal(false)}>
                    Tark etish
                  </button>
                  <button className="modal-start-call-btn" onClick={() => {
                    setShowMatchModal(false);
                    alert("Ajoyib! Rayhona bilan ovozli bog'lanish muvaffaqiyatli amalga oshdi (Bu demo ko'rinishi).");
                  }}>
                    Suhbatga kirish
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {showTimerModal && (
        <div className="fullscreen-practice-workspace">
          <div className="workspace-header">
            <button className="workspace-back-btn" onClick={handleCancelTimer}>
              <ArrowLeft size={16} /> <span className="back-btn-text">Chiqish</span>
            </button>
            <div className="workspace-title-area">
              <span className="workspace-pulse-dot"></span>
              <span className="workspace-title">{activeTestForTimer?.title}</span>
            </div>
            <div className="workspace-timer-pill">
              ⏱️ {formatStopwatch(secondsElapsed)}
            </div>
            <button className="workspace-finish-btn" onClick={handleFinishTimer}>
              Mashqni tugatish
            </button>
          </div>
          <div className="workspace-iframe-container">
            <iframe 
              src={activeTestForTimer?.url} 
              title={activeTestForTimer?.title}
              className="workspace-iframe"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakingPractice;
