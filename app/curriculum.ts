export type Level = {
  id: number;
  name: string;
  arabic: string;
  cefr: string;
  promise: string;
  focus: string[];
  color: string;
  xpFloor: number;
};

export const levels: Level[] = [
  { id: 1, name: "First Sounds", arabic: "أَصْوَاتِي", cefr: "A0", promise: "Hear, recognise, and shape every Arabic letter.", focus: ["letters", "sounds", "tracing"], color: "mint", xpFloor: 0 },
  { id: 2, name: "Everyday Words", arabic: "كَلِمَاتِي", cefr: "Pre-A1", promise: "Build a useful vocabulary from the world around you.", focus: ["vocabulary", "listening", "word building"], color: "sun", xpFloor: 140 },
  { id: 3, name: "Little Sentences", arabic: "جُمَلِي", cefr: "A1", promise: "Turn familiar words into clear everyday thoughts.", focus: ["sentences", "questions", "conversation"], color: "coral", xpFloor: 360 },
  { id: 4, name: "Story Paths", arabic: "حِكَايَاتِي", cefr: "A2", promise: "Read, listen, and understand connected ideas.", focus: ["stories", "reading", "comprehension"], color: "lavender", xpFloor: 720 },
  { id: 5, name: "Confident Voice", arabic: "أَتَحَدَّثُ", cefr: "B1", promise: "Speak with confidence across real-life situations.", focus: ["dialogue", "grammar", "fluency"], color: "sky", xpFloor: 1250 },
  { id: 6, name: "Young Writer", arabic: "أَكْتُبُ", cefr: "B2", promise: "Express opinions, write stories, and refine style.", focus: ["writing", "expression", "advanced reading"], color: "rose", xpFloor: 1900 },
];

export const letters = [
  ["ا", "أَسَد", "Lion", "🦁"], ["ب", "بَطَّة", "Duck", "🦆"],
  ["ت", "تُفَّاحَة", "Apple", "🍎"], ["ث", "ثَعْلَب", "Fox", "🦊"],
  ["ج", "جَمَل", "Camel", "🐪"], ["ح", "حُوت", "Whale", "🐋"],
  ["خ", "خُبْز", "Bread", "🥖"], ["د", "دُبّ", "Bear", "🐻"],
  ["ذ", "ذُرَة", "Corn", "🌽"], ["ر", "رُمَّان", "Pomegranate", "🍎"],
  ["ز", "زَهْرَة", "Flower", "🌸"], ["س", "سَمَكَة", "Fish", "🐟"],
  ["ش", "شَمْس", "Sun", "☀️"], ["ص", "صَقْر", "Falcon", "🦅"],
  ["ض", "ضِفْدَع", "Frog", "🐸"], ["ط", "طَائِرَة", "Plane", "✈️"],
  ["ظ", "ظَرْف", "Envelope", "✉️"], ["ع", "عَيْن", "Eye", "👁️"],
  ["غ", "غَيْمَة", "Cloud", "☁️"], ["ف", "فَرَاشَة", "Butterfly", "🦋"],
  ["ق", "قَمَر", "Moon", "🌙"], ["ك", "كِتَاب", "Book", "📘"],
  ["ل", "لَيْمُون", "Lemon", "🍋"], ["م", "مَوْز", "Banana", "🍌"],
  ["ن", "نَحْلَة", "Bee", "🐝"], ["ه", "هَدِيَّة", "Gift", "🎁"],
  ["و", "وَرْدَة", "Rose", "🌹"], ["ي", "يَد", "Hand", "✋"],
] as const;

export type WordItem = {
  id: string;
  arabic: string;
  english: string;
  icon: string;
  category: string;
  level: number;
  color: string;
};

export const words: WordItem[] = [
  { id: "moon", arabic: "قَمَر", english: "Moon", icon: "🌙", category: "Nature", level: 1, color: "lavender" },
  { id: "book", arabic: "كِتَاب", english: "Book", icon: "📘", category: "School", level: 1, color: "mint" },
  { id: "apple", arabic: "تُفَّاحَة", english: "Apple", icon: "🍎", category: "Food", level: 1, color: "coral" },
  { id: "home", arabic: "بَيْت", english: "Home", icon: "🏠", category: "Home", level: 1, color: "sun" },
  { id: "water", arabic: "مَاء", english: "Water", icon: "💧", category: "Food", level: 2, color: "sky" },
  { id: "family", arabic: "عَائِلَة", english: "Family", icon: "👨‍👩‍👧", category: "People", level: 2, color: "rose" },
  { id: "school", arabic: "مَدْرَسَة", english: "School", icon: "🏫", category: "School", level: 2, color: "mint" },
  { id: "garden", arabic: "حَدِيقَة", english: "Garden", icon: "🌿", category: "Nature", level: 2, color: "sun" },
  { id: "morning", arabic: "صَبَاح", english: "Morning", icon: "🌤️", category: "Time", level: 3, color: "sun" },
  { id: "friend", arabic: "صَدِيق", english: "Friend", icon: "🤝", category: "People", level: 3, color: "coral" },
  { id: "library", arabic: "مَكْتَبَة", english: "Library", icon: "📚", category: "School", level: 3, color: "lavender" },
  { id: "journey", arabic: "رِحْلَة", english: "Journey", icon: "🧭", category: "Places", level: 3, color: "sky" },
  { id: "memory", arabic: "ذَاكِرَة", english: "Memory", icon: "🫧", category: "Ideas", level: 4, color: "lavender" },
  { id: "adventure", arabic: "مُغَامَرَة", english: "Adventure", icon: "🗺️", category: "Ideas", level: 4, color: "coral" },
  { id: "knowledge", arabic: "مَعْرِفَة", english: "Knowledge", icon: "💡", category: "Ideas", level: 4, color: "sun" },
  { id: "cooperation", arabic: "تَعَاوُن", english: "Cooperation", icon: "🧩", category: "Ideas", level: 5, color: "mint" },
  { id: "environment", arabic: "بِيئَة", english: "Environment", icon: "🌍", category: "Nature", level: 5, color: "sky" },
  { id: "future", arabic: "مُسْتَقْبَل", english: "Future", icon: "🔭", category: "Time", level: 5, color: "lavender" },
  { id: "imagination", arabic: "خَيَال", english: "Imagination", icon: "✨", category: "Ideas", level: 6, color: "rose" },
  { id: "responsibility", arabic: "مَسْؤُولِيَّة", english: "Responsibility", icon: "🌱", category: "Ideas", level: 6, color: "mint" },
  { id: "exploration", arabic: "اِسْتِكْشَاف", english: "Exploration", icon: "🔎", category: "Ideas", level: 6, color: "sun" },
];

export const wordChallenges = [
  { level: 1, word: "كتاب", display: "كِتَاب", english: "book", letters: ["ب", "ك", "ا", "ت"] },
  { level: 2, word: "حديقة", display: "حَدِيقَة", english: "garden", letters: ["ق", "ح", "ة", "ي", "د"] },
  { level: 3, word: "مدرسة", display: "مَدْرَسَة", english: "school", letters: ["س", "م", "ة", "ر", "د"] },
  { level: 4, word: "مغامرة", display: "مُغَامَرَة", english: "adventure", letters: ["ر", "م", "ة", "غ", "ا", "م"] },
  { level: 5, word: "مستقبل", display: "مُسْتَقْبَل", english: "future", letters: ["ق", "م", "ب", "ت", "س", "ل"] },
  { level: 6, word: "استكشاف", display: "اِسْتِكْشَاف", english: "exploration", letters: ["ش", "ا", "ك", "ف", "ت", "س", "ا"] },
];

export type SentenceExercise = {
  id: string;
  level: number;
  prompt: string;
  correct: string[];
  bank: string[];
  hint: string;
  explanation: string;
  spoken: string;
};

export const sentenceExercises: SentenceExercise[] = [
  { id: "s1-1", level: 1, prompt: "This is a book.", correct: ["هذا", "كتاب"], bank: ["كتاب", "هذه", "هذا"], hint: "Start with هذا for a masculine object.", explanation: "هذا introduces a nearby masculine noun.", spoken: "هَذَا كِتَابٌ" },
  { id: "s1-2", level: 1, prompt: "This is my hand.", correct: ["هذه", "يدي"], bank: ["يدي", "هذه", "هو"], hint: "Hand is treated as feminine, so choose هذه.", explanation: "The ending ـي means “my”.", spoken: "هَذِهِ يَدِي" },
  { id: "s1-3", level: 1, prompt: "The moon is beautiful.", correct: ["القمر", "جميل"], bank: ["جميل", "القمر", "في"], hint: "Name the moon first, then describe it.", explanation: "A simple Arabic nominal sentence does not need “is”.", spoken: "الْقَمَرُ جَمِيلٌ" },
  { id: "s1-4", level: 1, prompt: "The flower is red.", correct: ["الزهرة", "حمراء"], bank: ["حمراء", "الزهرة", "أحمر"], hint: "The adjective matches the feminine noun.", explanation: "زهرة is feminine, so the adjective becomes حمراء.", spoken: "الزَّهْرَةُ حَمْرَاءُ" },
  { id: "s2-1", level: 2, prompt: "I drink water.", correct: ["أنا", "أشرب", "الماء"], bank: ["الماء", "أنا", "يشرب", "أشرب"], hint: "Begin with أنا, then use the verb starting with أ.", explanation: "أشرب agrees with the first-person pronoun أنا.", spoken: "أَنَا أَشْرَبُ الْمَاءَ" },
  { id: "s2-2", level: 2, prompt: "I love apples.", correct: ["أنا", "أحب", "التفاح"], bank: ["أحب", "التفاح", "أنا", "يحب"], hint: "أنا comes first in this learning pattern.", explanation: "أحب means “I love” or “I like”.", spoken: "أَنَا أُحِبُّ التُّفَّاحَ" },
  { id: "s2-3", level: 2, prompt: "Mira opens the door.", correct: ["تفتح", "ميرا", "الباب"], bank: ["الباب", "يفتح", "ميرا", "تفتح"], hint: "The verb تفتح agrees with Mira.", explanation: "A verbal sentence often begins with the verb.", spoken: "تَفْتَحُ مِيرَا الْبَابَ" },
  { id: "s2-4", level: 2, prompt: "My family is in the garden.", correct: ["عائلتي", "في", "الحديقة"], bank: ["الحديقة", "إلى", "عائلتي", "في"], hint: "Use في for “in”.", explanation: "عائلتي combines عائلة with the possessive ending ـي.", spoken: "عَائِلَتِي فِي الْحَدِيقَةِ" },
  { id: "s3-1", level: 3, prompt: "We go to school in the morning.", correct: ["نذهب", "إلى", "المدرسة", "صباحًا"], bank: ["المدرسة", "نذهب", "في", "صباحًا", "إلى"], hint: "Movement toward a place uses إلى.", explanation: "نـ at the start of the verb marks “we”.", spoken: "نَذْهَبُ إِلَى الْمَدْرَسَةِ صَبَاحًا" },
  { id: "s3-2", level: 3, prompt: "My sister reads a short story.", correct: ["تقرأ", "أختي", "قصة", "قصيرة"], bank: ["قصيرة", "أختي", "يقرأ", "قصة", "تقرأ"], hint: "The adjective follows the noun it describes.", explanation: "قصة and قصيرة are both feminine and indefinite.", spoken: "تَقْرَأُ أُخْتِي قِصَّةً قَصِيرَةً" },
  { id: "s3-3", level: 3, prompt: "Where is the new library?", correct: ["أين", "المكتبة", "الجديدة"], bank: ["الجديدة", "متى", "المكتبة", "أين"], hint: "Questions about place begin with أين.", explanation: "The adjective follows the definite noun and is also definite.", spoken: "أَيْنَ الْمَكْتَبَةُ الْجَدِيدَةُ؟" },
  { id: "s3-4", level: 3, prompt: "I want to visit my friend.", correct: ["أريد", "أن", "أزور", "صديقي"], bank: ["أزور", "أريد", "إلى", "صديقي", "أن"], hint: "أريد أن introduces what you want to do.", explanation: "The verb after أن appears in the subjunctive form.", spoken: "أُرِيدُ أَنْ أَزُورَ صَدِيقِي" },
  { id: "s4-1", level: 4, prompt: "The children discovered a hidden path.", correct: ["اكتشف", "الأطفال", "طريقًا", "مخفيًا"], bank: ["الأطفال", "مخفيًا", "اكتشف", "طريقًا", "في"], hint: "Begin with the past-tense verb.", explanation: "The adjective agrees with طريقًا in gender and case.", spoken: "اِكْتَشَفَ الْأَطْفَالُ طَرِيقًا مَخْفِيًّا" },
  { id: "s4-2", level: 4, prompt: "When the rain stopped, we went outside.", correct: ["عندما", "توقف", "المطر", "خرجنا"], bank: ["المطر", "خرجنا", "لأن", "توقف", "عندما"], hint: "Use عندما to connect the time event.", explanation: "خرجنا contains the past-tense “we” ending نا.", spoken: "عِنْدَمَا تَوَقَّفَ الْمَطَرُ خَرَجْنَا" },
  { id: "s4-3", level: 4, prompt: "The story teaches us the value of cooperation.", correct: ["تعلمنا", "القصة", "قيمة", "التعاون"], bank: ["التعاون", "تعلمنا", "القصة", "قيمة", "من"], hint: "The story is the subject after the verb.", explanation: "نا in تعلمنا is the object pronoun “us”.", spoken: "تُعَلِّمُنَا الْقِصَّةُ قِيمَةَ التَّعَاوُنِ" },
  { id: "s4-4", level: 4, prompt: "I finished the book that you gave me.", correct: ["أنهيت", "الكتاب", "الذي", "أعطيتني"], bank: ["الذي", "أنهيت", "أعطيتني", "الكتاب", "هذه"], hint: "الذي links a masculine noun to more information.", explanation: "أعطيتني combines “you gave” with the object “me”.", spoken: "أَنْهَيْتُ الْكِتَابَ الَّذِي أَعْطَيْتَنِي" },
  { id: "s5-1", level: 5, prompt: "Although the journey was long, it was enjoyable.", correct: ["رغم", "أن", "الرحلة", "كانت", "طويلة", "فقد", "كانت", "ممتعة"], bank: ["طويلة", "كانت", "ممتعة", "رغم", "الرحلة", "أن", "لكن", "فقد", "كانت"], hint: "رغم أن introduces a contrast.", explanation: "The two clauses balance difficulty with a positive result.", spoken: "رَغْمَ أَنَّ الرِّحْلَةَ كَانَتْ طَوِيلَةً فَقَدْ كَانَتْ مُمْتِعَةً" },
  { id: "s5-2", level: 5, prompt: "We can protect the environment by reducing waste.", correct: ["يمكننا", "حماية", "البيئة", "بتقليل", "النفايات"], bank: ["النفايات", "حماية", "يمكننا", "من", "البيئة", "بتقليل"], hint: "بـ can express the means: “by”.", explanation: "يمكننا is an impersonal possibility form plus “us”.", spoken: "يُمْكِنُنَا حِمَايَةُ الْبِيئَةِ بِتَقْلِيلِ النُّفَايَاتِ" },
  { id: "s5-3", level: 5, prompt: "If we cooperate, we will finish the project early.", correct: ["إذا", "تعاوننا", "فسننهي", "المشروع", "مبكرًا"], bank: ["إذا", "المشروع", "لأن", "تعاوننا", "مبكرًا", "فسننهي"], hint: "إذا sets the condition; فـ introduces the result.", explanation: "سـ marks the future in سننهي.", spoken: "إِذَا تَعَاوَنَّا فَسَنُنْهِي الْمَشْرُوعَ مُبَكِّرًا" },
  { id: "s5-4", level: 5, prompt: "In my opinion, reading opens new horizons.", correct: ["في", "رأيي", "تفتح", "القراءة", "آفاقًا", "جديدة"], bank: ["جديدة", "في", "القراءة", "رأيي", "تفتح", "آفاقًا", "عن"], hint: "Begin with the opinion phrase في رأيي.", explanation: "القراءة is feminine, so the verb is تفتح.", spoken: "فِي رَأْيِي تَفْتَحُ الْقِرَاءَةُ آفَاقًا جَدِيدَةً" },
  { id: "s6-1", level: 6, prompt: "Imagination allows us to see possibilities beyond the familiar.", correct: ["يتيح", "لنا", "الخيال", "رؤية", "إمكانات", "تتجاوز", "المألوف"], bank: ["الخيال", "إمكانات", "لنا", "المألوف", "رؤية", "يتيح", "تتجاوز", "فوق"], hint: "Build the main clause, then add the relative description.", explanation: "تتجاوز describes the plural non-human noun إمكانات using feminine singular agreement.", spoken: "يُتِيحُ لَنَا الْخَيَالُ رُؤْيَةَ إِمْكَانَاتٍ تَتَجَاوَزُ الْمَأْلُوفَ" },
  { id: "s6-2", level: 6, prompt: "The more we read, the richer our language becomes.", correct: ["كلما", "قرأنا", "ازدادت", "لغتنا", "ثراء"], bank: ["ثراء", "كلما", "لغتنا", "قرأنا", "ازدادت", "حين"], hint: "كلما creates a proportional relationship.", explanation: "The paired structure links increased reading with richer language.", spoken: "كُلَّمَا قَرَأْنَا ازْدَادَتْ لُغَتُنَا ثَرَاءً" },
  { id: "s6-3", level: 6, prompt: "The writer described the city as if it were a living painting.", correct: ["وصف", "الكاتب", "المدينة", "كأنها", "لوحة", "حية"], bank: ["المدينة", "حية", "وصف", "كأنها", "الكاتب", "لوحة", "مثل"], hint: "كأنها introduces the imaginative comparison.", explanation: "ها in كأنها refers back to the feminine noun المدينة.", spoken: "وَصَفَ الْكَاتِبُ الْمَدِينَةَ كَأَنَّهَا لَوْحَةٌ حَيَّةٌ" },
  { id: "s6-4", level: 6, prompt: "We should consider different viewpoints before making a decision.", correct: ["ينبغي", "أن", "نراعي", "وجهات", "النظر", "المختلفة", "قبل", "اتخاذ", "القرار"], bank: ["المختلفة", "القرار", "أن", "ينبغي", "قبل", "وجهات", "نراعي", "اتخاذ", "النظر", "بعد"], hint: "ينبغي أن introduces a thoughtful recommendation.", explanation: "وجهات النظر is an idafa phrase meaning “viewpoints”.", spoken: "يَنْبَغِي أَنْ نُرَاعِيَ وِجْهَاتِ النَّظَرِ الْمُخْتَلِفَةَ قَبْلَ اتِّخَاذِ الْقَرَارِ" },
];

export type Story = {
  id: string;
  level: number;
  title: string;
  arabicTitle: string;
  minutes: number;
  icon: string;
  text: string;
  words: string[];
  question: string;
  options: string[];
  answer: string;
};

export const stories: Story[] = [
  { id: "little-moon", level: 1, title: "The Little Moon", arabicTitle: "الْقَمَرُ الصَّغِيرُ", minutes: 4, icon: "🌙", text: "فِي اللَّيْلِ، نَظَرَ سَامِي إِلَى السَّمَاءِ. رَأَى قَمَرًا صَغِيرًا يَضْحَكُ بَيْنَ النُّجُومِ. قَالَ سَامِي: مَرْحَبًا يَا قَمَر!", words: ["اللَّيْل — night", "السَّمَاء — sky", "يَضْحَك — smiles"], question: "What did Sami see?", options: ["A moon", "A house", "A book"], answer: "A moon" },
  { id: "red-kite", level: 1, title: "Mira's Red Kite", arabicTitle: "طَائِرَةُ مِيرَا الْحَمْرَاءُ", minutes: 5, icon: "🪁", text: "مِيرَا فِي الْحَدِيقَةِ. مَعَهَا طَائِرَةٌ حَمْرَاءُ. تَطِيرُ الطَّائِرَةُ عَالِيًا، وَمِيرَا تَضْحَكُ فَرِحَةً.", words: ["الْحَدِيقَة — garden", "حَمْرَاء — red", "عَالِيًا — high"], question: "What colour is Mira's kite?", options: ["Blue", "Red", "Green"], answer: "Red" },
  { id: "breakfast", level: 2, title: "Breakfast for Everyone", arabicTitle: "فُطُورٌ لِلْجَمِيعِ", minutes: 5, icon: "🥣", text: "اِسْتَيْقَظَتِ الْعَائِلَةُ مُبَكِّرًا. وَضَعَتْ لَيْلَى الْخُبْزَ وَالْجُبْنَ عَلَى الْمَائِدَةِ، وَصَبَّ أَخُوهَا الْحَلِيبَ. قَالَ الْأَبُ: شُكْرًا لَكُمَا!", words: ["فُطُور — breakfast", "الْمَائِدَة — table", "الْحَلِيب — milk"], question: "Who poured the milk?", options: ["Layla's brother", "The father", "Layla"], answer: "Layla's brother" },
  { id: "word-garden", level: 2, title: "The Garden of Words", arabicTitle: "حَدِيقَةُ الْكَلِمَاتِ", minutes: 6, icon: "🌱", text: "زَرَعَتْ لَيْلَى ثَلَاثَ بُذُورٍ فِي الْحَدِيقَةِ. كَتَبَتْ عَلَيْهَا: حُبّ، فَرَح، وَسَلَام. كَبُرَتِ الْكَلِمَاتُ وَصَارَتْ أَزْهَارًا جَمِيلَةً.", words: ["بُذُور — seeds", "فَرَح — joy", "سَلَام — peace"], question: "What did the words become?", options: ["Flowers", "Books", "Stars"], answer: "Flowers" },
  { id: "library-key", level: 3, title: "The Library Key", arabicTitle: "مِفْتَاحُ الْمَكْتَبَةِ", minutes: 7, icon: "🗝️", text: "وَجَدَ عُمَرُ مِفْتَاحًا صَغِيرًا تَحْتَ شَجَرَةٍ قَدِيمَةٍ. بَحَثَ فِي الْحَيِّ حَتَّى وَجَدَ بَابًا أَزْرَقَ. فَتَحَ الْمِفْتَاحُ بَابَ مَكْتَبَةٍ مَلِيئَةٍ بِالْحِكَايَاتِ.", words: ["مِفْتَاح — key", "الْحَيّ — neighbourhood", "مَلِيئَة — full"], question: "What was behind the blue door?", options: ["A library", "A garden", "A bakery"], answer: "A library" },
  { id: "rain-picnic", level: 3, title: "The Rainy Picnic", arabicTitle: "نُزْهَةٌ تَحْتَ الْمَطَرِ", minutes: 7, icon: "☔", text: "خَرَجَ الْأَصْدِقَاءُ فِي نُزْهَةٍ، لَكِنَّ الْمَطَرَ بَدَأَ فَجْأَةً. لَمْ يَحْزَنُوا؛ فَصَنَعُوا خَيْمَةً صَغِيرَةً وَتَنَاوَلُوا الطَّعَامَ وَهُمْ يَسْمَعُونَ صَوْتَ الْمَطَرِ.", words: ["نُزْهَة — picnic", "فَجْأَة — suddenly", "خَيْمَة — tent"], question: "How did the friends solve the problem?", options: ["They made a tent", "They went swimming", "They called a taxi"], answer: "They made a tent" },
  { id: "paper-city", level: 4, title: "The Paper City", arabicTitle: "مَدِينَةُ الْوَرَقِ", minutes: 8, icon: "🏙️", text: "بَنَتْ نُورُ مَدِينَةً مِنَ الْوَرَقِ. كَانَ لِكُلِّ بَيْتٍ لَوْنٌ، وَلِكُلِّ شَارِعٍ اسْمٌ. عِنْدَمَا هَبَّتِ الرِّيحُ، تَعَاوَنَ الْأَطْفَالُ لِحِمَايَةِ الْمَدِينَةِ وَجَعَلُوهَا أَقْوَى.", words: ["شَارِع — street", "هَبَّت — blew", "حِمَايَة — protecting"], question: "Why did the children cooperate?", options: ["To protect the city", "To paint the sky", "To find food"], answer: "To protect the city" },
  { id: "sea-letter", level: 4, title: "A Letter from the Sea", arabicTitle: "رِسَالَةٌ مِنَ الْبَحْرِ", minutes: 9, icon: "🌊", text: "وَجَدَتْ سَلْمَى زُجَاجَةً عَلَى الشَّاطِئِ وَدَاخِلَهَا رِسَالَةٌ. لَمْ تَكُنِ الرِّسَالَةُ خَرِيطَةَ كَنْزٍ، بَلْ دَعْوَةً لِحِمَايَةِ الْبَحْرِ. فَبَدَأَتْ سَلْمَى حَمْلَةً مَعَ زُمَلَائِهَا.", words: ["الشَّاطِئ — beach", "دَعْوَة — invitation", "حَمْلَة — campaign"], question: "What did the message ask for?", options: ["Protecting the sea", "Finding treasure", "Building a boat"], answer: "Protecting the sea" },
  { id: "two-viewpoints", level: 5, title: "Two Viewpoints", arabicTitle: "وِجْهَتَا نَظَرٍ", minutes: 10, icon: "💬", text: "اِخْتَلَفَتْ مَرْيَمُ وَيُوسُفُ حَوْلَ أَفْضَلِ مَكَانٍ لِحَدِيقَةِ الْمَدْرَسَةِ. بَدَلًا مِنَ الْجِدَالِ، رَسَمَ كُلٌّ مِنْهُمَا خُطَّتَهُ. عِنْدَمَا جَمَعَا الْفِكْرَتَيْنِ، وَجَدَا حَلًّا أَفْضَلَ.", words: ["اِخْتَلَفَ — disagreed", "الْجِدَال — arguing", "حَلّ — solution"], question: "What produced the best solution?", options: ["Combining both ideas", "Ignoring the problem", "Choosing randomly"], answer: "Combining both ideas" },
  { id: "tomorrow-school", level: 5, title: "Tomorrow's School", arabicTitle: "مَدْرَسَةُ الْغَدِ", minutes: 10, icon: "🔭", text: "تَخَيَّلَ الطُّلَّابُ مَدْرَسَةَ الْغَدِ. أَرَادُوا فُصُولًا مَفْتُوحَةً عَلَى الطَّبِيعَةِ، وَمَخْتَبَرًا لِلْأَفْكَارِ، وَوَقْتًا أَكْبَرَ لِلْفَنِّ. ثُمَّ كَتَبُوا رِسَالَةً إِلَى مُدِيرِ الْمَدْرَسَةِ.", words: ["الْغَد — tomorrow", "مَخْتَبَر — laboratory", "الْمُدِير — principal"], question: "Which subject did students want more time for?", options: ["Art", "Sport", "Maths"], answer: "Art" },
  { id: "shadow-writer", level: 6, title: "The Writer of Shadows", arabicTitle: "كَاتِبُ الظِّلَالِ", minutes: 12, icon: "✍️", text: "كَانَ الرَّسَّامُ يَرْسُمُ مَا يَرَاهُ، أَمَّا أُخْتُهُ فَكَانَتْ تَكْتُبُ مَا لَا يُرَى: صَوْتَ الْمَكَانِ، وَذِكْرَيَاتِ النَّاسِ، وَالْأَحْلَامَ الَّتِي تَسْكُنُ النَّوَافِذَ. وَحِينَ جَمَعَا الرَّسْمَ وَالْكَلِمَاتِ، وُلِدَتْ حِكَايَةٌ لَمْ تُشْبِهْ أَيَّ حِكَايَةٍ أُخْرَى.", words: ["ذِكْرَيَات — memories", "تَسْكُن — inhabit", "وُلِدَت — was born"], question: "What made their story unique?", options: ["Combining art and words", "Using only shadows", "Copying an old book"], answer: "Combining art and words" },
  { id: "question-tree", level: 6, title: "The Tree of Questions", arabicTitle: "شَجَرَةُ الْأَسْئِلَةِ", minutes: 12, icon: "🌳", text: "فِي وَسَطِ الْمَدِينَةِ شَجَرَةٌ لَا تُثْمِرُ إِلَّا عِنْدَمَا يَطْرَحُ أَحَدٌ سُؤَالًا صَادِقًا. تَجَمَّعَ النَّاسُ حَوْلَهَا، فَسَأَلَ الصِّغَارُ عَنِ النُّجُومِ، وَسَأَلَ الْكِبَارُ عَنِ السَّعَادَةِ. وَمَعَ كُلِّ سُؤَالٍ، كَانَتْ تَنْبُتُ ثَمَرَةٌ جَدِيدَةٌ.", words: ["تُثْمِر — bears fruit", "صَادِق — sincere", "تَنْبُت — grows"], question: "What made new fruit grow?", options: ["A sincere question", "Rain", "Music"], answer: "A sincere question" },
];

export const coloringScenes = [
  { id: "garden", title: "Word Garden", arabic: "حَدِيقَة", word: "garden", level: 1, icon: "✿" },
  { id: "night", title: "Moon Observatory", arabic: "قَمَر", word: "moon", level: 1, icon: "☾" },
  { id: "home", title: "Our Little Home", arabic: "بَيْت", word: "home", level: 2, icon: "⌂" },
  { id: "sea", title: "Blue Sea", arabic: "بَحْر", word: "sea", level: 2, icon: "≈" },
  { id: "market", title: "Fruit Market", arabic: "سُوق", word: "market", level: 3, icon: "◉" },
  { id: "kite", title: "Kite in the Sky", arabic: "طَائِرَة", word: "kite", level: 3, icon: "◇" },
  { id: "classroom", title: "Creative Classroom", arabic: "فَصْل", word: "classroom", level: 4, icon: "▤" },
  { id: "space", title: "Future Journey", arabic: "فَضَاء", word: "space", level: 5, icon: "✦" },
];

export type GameRound = {
  id: string;
  level: number;
  prompt: string;
  arabic: string;
  spoken: string;
  options: { label: string; display: string }[];
  answer: string;
};

export const gameRounds: GameRound[] = [
  { id: "g1", level: 1, prompt: "Find the picture", arabic: "قَمَر", spoken: "قَمَر", options: [{ label: "sun", display: "☀️" }, { label: "moon", display: "🌙" }, { label: "star", display: "⭐" }], answer: "moon" },
  { id: "g2", level: 1, prompt: "Find the first letter", arabic: "بَيْت", spoken: "بَيْت", options: [{ label: "ب", display: "ب" }, { label: "ت", display: "ت" }, { label: "ي", display: "ي" }], answer: "ب" },
  { id: "g3", level: 2, prompt: "Find the meaning", arabic: "مَاء", spoken: "مَاء", options: [{ label: "water", display: "💧" }, { label: "bread", display: "🥖" }, { label: "book", display: "📘" }], answer: "water" },
  { id: "g4", level: 2, prompt: "Find the place", arabic: "مَدْرَسَة", spoken: "مَدْرَسَة", options: [{ label: "school", display: "🏫" }, { label: "home", display: "🏠" }, { label: "garden", display: "🌿" }], answer: "school" },
  { id: "g5", level: 3, prompt: "Choose the question word for place", arabic: "___ الْمَكْتَبَةُ؟", spoken: "أَيْنَ الْمَكْتَبَةُ؟", options: [{ label: "أين", display: "أين" }, { label: "متى", display: "متى" }, { label: "كيف", display: "كيف" }], answer: "أين" },
  { id: "g6", level: 3, prompt: "Choose the word that completes the idea", arabic: "أَنَا ___ الْقِرَاءَةَ", spoken: "أَنَا أُحِبُّ الْقِرَاءَةَ", options: [{ label: "أحب", display: "أحب" }, { label: "يحب", display: "يحب" }, { label: "تحب", display: "تحب" }], answer: "أحب" },
  { id: "g7", level: 4, prompt: "Which connector means “when”?", arabic: "___ تَوَقَّفَ الْمَطَرُ خَرَجْنَا", spoken: "عِنْدَمَا تَوَقَّفَ الْمَطَرُ خَرَجْنَا", options: [{ label: "عندما", display: "عندما" }, { label: "لكن", display: "لكن" }, { label: "لأن", display: "لأن" }], answer: "عندما" },
  { id: "g8", level: 4, prompt: "Find the closest meaning", arabic: "مُغَامَرَة", spoken: "مُغَامَرَة", options: [{ label: "adventure", display: "🗺️" }, { label: "memory", display: "🫧" }, { label: "future", display: "🔭" }], answer: "adventure" },
  { id: "g9", level: 5, prompt: "Choose the best contrast connector", arabic: "الرِّحْلَةُ طَوِيلَةٌ، ___ مُمْتِعَةٌ", spoken: "الرِّحْلَةُ طَوِيلَةٌ لَكِنَّهَا مُمْتِعَةٌ", options: [{ label: "لكنها", display: "لكنها" }, { label: "لأنها", display: "لأنها" }, { label: "عندما", display: "عندما" }], answer: "لكنها" },
  { id: "g10", level: 5, prompt: "Which word means cooperation?", arabic: "تَعَاوُن", spoken: "تَعَاوُن", options: [{ label: "cooperation", display: "🧩" }, { label: "environment", display: "🌍" }, { label: "future", display: "🔭" }], answer: "cooperation" },
  { id: "g11", level: 6, prompt: "Complete the proportional phrase", arabic: "كُلَّمَا قَرَأْنَا ___ لُغَتُنَا", spoken: "كُلَّمَا قَرَأْنَا ازْدَادَتْ لُغَتُنَا ثَرَاءً", options: [{ label: "ازدادت", display: "ازدادت" }, { label: "توقفت", display: "توقفت" }, { label: "نسيت", display: "نسيت" }], answer: "ازدادت" },
  { id: "g12", level: 6, prompt: "Which word introduces an imagined comparison?", arabic: "الْمَدِينَةُ ___ لَوْحَةٌ حَيَّةٌ", spoken: "الْمَدِينَةُ كَأَنَّهَا لَوْحَةٌ حَيَّةٌ", options: [{ label: "كأنها", display: "كأنها" }, { label: "لذلك", display: "لذلك" }, { label: "مهما", display: "مهما" }], answer: "كأنها" },
];
