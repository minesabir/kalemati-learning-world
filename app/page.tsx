"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

type ViewId =
  | "home"
  | "letters"
  | "words"
  | "sentences"
  | "stories"
  | "homework"
  | "copybook"
  | "coloring"
  | "games"
  | "teacher";

const navGroups: { label: string; items: { id: ViewId; icon: string; label: string }[] }[] = [
  {
    label: "Explore",
    items: [
      { id: "home", icon: "⌂", label: "My World" },
      { id: "letters", icon: "أ", label: "Letter Garden" },
      { id: "words", icon: "✦", label: "Word Workshop" },
      { id: "sentences", icon: "≋", label: "Sentence Studio" },
      { id: "stories", icon: "◐", label: "Story Cove" },
    ],
  },
  {
    label: "Create & Play",
    items: [
      { id: "homework", icon: "✓", label: "Homework Nest" },
      { id: "copybook", icon: "✎", label: "Copybook" },
      { id: "coloring", icon: "✿", label: "Color & Learn" },
      { id: "games", icon: "◆", label: "Game Meadow" },
      { id: "teacher", icon: "☏", label: "Meet a Teacher" },
    ],
  },
];

const letterData = [
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

const wordCards = [
  { arabic: "قَمَر", english: "Moon", icon: "🌙", color: "lavender" },
  { arabic: "كِتَاب", english: "Book", icon: "📘", color: "mint" },
  { arabic: "تُفَّاحَة", english: "Apple", icon: "🍎", color: "coral" },
  { arabic: "بَيْت", english: "Home", icon: "🏠", color: "sun" },
  { arabic: "سَمَكَة", english: "Fish", icon: "🐟", color: "sky" },
  { arabic: "زَهْرَة", english: "Flower", icon: "🌸", color: "rose" },
];

const stories = [
  {
    title: "The Little Moon",
    arabicTitle: "الْقَمَرُ الصَّغِيرُ",
    level: "6 min · Beginner",
    icon: "🌙",
    text: "فِي اللَّيْلِ، نَظَرَ سَامِي إِلَى السَّمَاءِ. رَأَى قَمَرًا صَغِيرًا يَضْحَكُ بَيْنَ النُّجُومِ. قَالَ سَامِي: مَرْحَبًا يَا قَمَر!",
    words: ["اللَّيْل — night", "السَّمَاء — sky", "يَضْحَك — smiles"],
  },
  {
    title: "Mira's Red Kite",
    arabicTitle: "طَائِرَةُ مِيرَا الْحَمْرَاءُ",
    level: "5 min · Beginner",
    icon: "🪁",
    text: "مِيرَا فِي الْحَدِيقَةِ. مَعَهَا طَائِرَةٌ حَمْرَاءُ. تَطِيرُ الطَّائِرَةُ عَالِيًا، وَمِيرَا تَضْحَكُ فَرِحَةً.",
    words: ["الْحَدِيقَة — garden", "حَمْرَاء — red", "عَالِيًا — high"],
  },
  {
    title: "The Garden of Words",
    arabicTitle: "حَدِيقَةُ الْكَلِمَاتِ",
    level: "7 min · Growing",
    icon: "🌱",
    text: "زَرَعَتْ لَيْلَى ثَلَاثَ بُذُورٍ فِي الْحَدِيقَةِ. كَتَبَتْ عَلَيْهَا: حُبّ، فَرَح، وَسَلَام. كَبُرَتِ الْكَلِمَاتُ وَصَارَتْ أَزْهَارًا جَمِيلَةً.",
    words: ["بُذُور — seeds", "فَرَح — joy", "سَلَام — peace"],
  },
];

const homeworkTasks = [
  ["Listen & repeat", "Say the letter ح and its word three times", "4 min", "🎧"],
  ["Copybook practice", "Trace ح on one practice page", "6 min", "✎"],
  ["Tiny story", "Listen to The Little Moon", "6 min", "🌙"],
  ["Family challenge", "Find two things at home that start with ب", "5 min", "🏠"],
];

const palette = ["#ef8f79", "#f2c968", "#80b49b", "#7fc4cc", "#b7a7d8", "#e89eb6"];

export default function Home() {
  const [view, setView] = useState<ViewId>("home");
  const [soundOn, setSoundOn] = useState(true);
  const [activeLetter, setActiveLetter] = useState(5);
  const [activeWord, setActiveWord] = useState(0);
  const [builtWord, setBuiltWord] = useState("");
  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [sentenceResult, setSentenceResult] = useState<"idle" | "right" | "try">("idle");
  const [storyIndex, setStoryIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({ 0: true });
  const [color, setColor] = useState(palette[0]);
  const [petals, setPetals] = useState(["#fffaf0", "#fffaf0", "#fffaf0", "#fffaf0", "#fffaf0", "#fffaf0"]);
  const [gameResult, setGameResult] = useState<"idle" | "right" | "try">("idle");
  const [teacherSlot, setTeacherSlot] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showParent, setShowParent] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const goTo = (next: ViewId) => {
    setView(next);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const speak = (text: string) => {
    if (!soundOn || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.72;
    window.speechSynthesis.speak(utterance);
  };

  const drawPoint = (event: ReactPointerEvent<HTMLCanvasElement>, start: boolean) => {
    const canvas = event.currentTarget;
    const bounds = canvas.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * canvas.width;
    const y = ((event.clientY - bounds.top) / bounds.height) * canvas.height;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.strokeStyle = "#315b54";
    context.lineWidth = 13;
    context.lineCap = "round";
    context.lineJoin = "round";
    if (start) {
      drawing.current = true;
      canvas.setPointerCapture(event.pointerId);
      context.beginPath();
      context.moveTo(x, y);
    } else if (drawing.current) {
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    drawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const pageHeader = (eyebrow: string, title: string, description: string, arabic?: string) => (
    <header className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {arabic && <div className="heading-token arabic" dir="rtl">{arabic}</div>}
    </header>
  );

  const renderHome = () => (
    <div className="dashboard-grid">
      <div className="main-stack">
        <section className="hero-card">
          <img src="/kalemati-world.png" alt="Children open a sculptural portal into worlds made from Arabic words" />
          <div className="hero-wash" />
          <div className="hero-copy">
            <span className="soft-pill">Today · 12 minute adventure</span>
            <p className="arabic hello" dir="rtl">مَرْحَبًا يَا لَيْلَى!</p>
            <h1>Your Arabic world is growing.</h1>
            <p>Your next word portal is waiting in the Letter Garden.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => goTo("letters")}>Continue the journey <span>→</span></button>
              <button className="round-button" onClick={() => speak("مَرْحَبًا يَا لَيْلَى") } aria-label="Hear the Arabic greeting">♪</button>
            </div>
          </div>
          <div className="hero-progress" aria-label="Weekly goal 72 percent complete">
            <div><span>Weekly journey</span><strong>72%</strong></div>
            <div className="progress-track"><span style={{ width: "72%" }} /></div>
          </div>
        </section>

        <section className="section-block">
          <div className="section-title-row">
            <div><p className="eyebrow">Your learning path</p><h2>Follow the curiosity trail</h2></div>
            <button className="text-button" onClick={() => goTo("homework")}>View this week <span>→</span></button>
          </div>
          <div className="journey-path">
            <button className="journey-stop complete" onClick={() => goTo("letters")}>
              <span className="stop-number">✓</span><span className="stop-art arabic">ح</span><span><strong>Letter sound</strong><small>Completed</small></span>
            </button>
            <span className="trail dotted" />
            <button className="journey-stop current" onClick={() => goTo("words")}>
              <span className="stop-number">2</span><span className="stop-art">🐋</span><span><strong>Build a word</strong><small>Up next · 5 min</small></span>
            </button>
            <span className="trail" />
            <button className="journey-stop" onClick={() => goTo("sentences")}>
              <span className="stop-number">3</span><span className="stop-art">💬</span><span><strong>Make a sentence</strong><small>Locked for now</small></span>
            </button>
          </div>
        </section>

        <section className="split-cards">
          <button className="story-feature" onClick={() => goTo("stories")}>
            <div className="mini-scene"><span className="moon">☾</span><span className="cloud">☁</span><span className="book">▰</span></div>
            <div><p className="eyebrow">Tonight's story</p><h3>The Little Moon</h3><p className="arabic" dir="rtl">الْقَمَرُ الصَّغِيرُ</p><span className="listen-link">Listen together · 6 min →</span></div>
          </button>
          <div className="practice-card">
            <div className="practice-icon">✎</div>
            <div><p className="eyebrow">Quiet practice</p><h3>Trace today's letter</h3><p>Follow the soft path, then try it on your own.</p></div>
            <button className="small-button" onClick={() => goTo("copybook")}>Open copybook</button>
          </div>
        </section>
      </div>

      <aside className="right-rail">
        <section className="rail-card profile-card">
          <div className="avatar-bubble">L</div>
          <div><p className="eyebrow">Little explorer</p><h3>Layla's garden</h3></div>
          <div className="level-line"><span>Seedling level 2</span><strong>460 / 600</strong></div>
          <div className="progress-track mint"><span style={{ width: "77%" }} /></div>
          <div className="tiny-stats"><div><strong>8</strong><span>letters</span></div><div><strong>14</strong><span>words</span></div><div><strong>3</strong><span>stories</span></div></div>
        </section>
        <button className="rail-card achievement-card" onClick={() => setShowAchievements(true)}>
          <div className="achievement-top"><span className="medal">★</span><span className="new-tag">NEW</span></div>
          <p className="eyebrow">Achievement bloomed</p><h3>Brave Storyteller</h3><p>You listened to three Arabic stories.</p><span className="text-link">See all keepsakes →</span>
        </button>
        <section className="rail-card rhythm-card">
          <div className="section-title-row compact"><div><p className="eyebrow">Learning rhythm</p><h3>7-day sparkle</h3></div><span className="streak">7 ✦</span></div>
          <div className="week-dots">{["M", "T", "W", "T", "F", "S", "S"].map((day, i) => <div key={`${day}-${i}`}><span className={i < 6 ? "done" : "today"}>{i < 6 ? "✓" : "•"}</span><small>{day}</small></div>)}</div>
          <p className="gentle-note">One tiny visit today keeps your garden glowing.</p>
        </section>
      </aside>
    </div>
  );

  const renderLetters = () => {
    const letter = letterData[activeLetter];
    return <div className="page-stack">
      {pageHeader("Sound by sound", "Letter Garden", "Touch a letter, hear its voice, then discover a word it grows inside.", "أ ب ت")}
      <section className="letter-explorer panel">
        <div className="letter-stage">
          <span className="floating-speck one">✦</span><span className="floating-speck two">•</span>
          <button className="letter-orb arabic" onClick={() => speak(letter[0])} aria-label={`Hear letter ${letter[0]}`}>{letter[0]}</button>
          <div><span className="soft-pill">Today's sound</span><p>Tap the letter to hear it</p></div>
        </div>
        <div className="letter-word-card">
          <span className="word-emoji">{letter[3]}</span>
          <div><p className="eyebrow">It lives in this word</p><h2 className="arabic" dir="rtl">{letter[1]}</h2><p>{letter[2]}</p></div>
          <button className="round-button" onClick={() => speak(letter[1])} aria-label={`Hear ${letter[1]}`}>♪</button>
        </div>
      </section>
      <section className="panel alphabet-panel">
        <div className="section-title-row"><div><p className="eyebrow">The whole garden</p><h2>28 letters to discover</h2></div><span className="legend"><i /> growing <i /> new</span></div>
        <div className="alphabet-grid" dir="rtl">{letterData.map((item, index) => <button key={item[0]} className={`${index === activeLetter ? "active" : ""} ${index < 8 ? "learned" : ""}`} onClick={() => { setActiveLetter(index); speak(item[0]); }}><strong className="arabic">{item[0]}</strong><small>{index < 8 ? "Growing" : "New"}</small></button>)}</div>
      </section>
    </div>;
  };

  const renderWords = () => (
    <div className="page-stack">
      {pageHeader("Meaning you can touch", "Word Workshop", "Explore useful Arabic words through sound, shape, and playful building.", "كَلِمَات")}
      <section className="panel word-shelf">
        <div className="section-title-row"><div><p className="eyebrow">Picture shelf</p><h2>Tap, look, listen</h2></div><span className="soft-pill">Food · Nature · Home</span></div>
        <div className="word-card-grid">{wordCards.map((word, index) => <button key={word.arabic} className={`word-card ${word.color} ${index === activeWord ? "active" : ""}`} onClick={() => { setActiveWord(index); speak(word.arabic); }}><span>{word.icon}</span><strong className="arabic" dir="rtl">{word.arabic}</strong><small>{word.english}</small><i>♪</i></button>)}</div>
      </section>
      <section className="panel builder-panel">
        <div className="builder-copy"><p className="eyebrow">Word maker</p><h2>Can you build “book”?</h2><p>Choose the Arabic letters in the right order. Arabic builds from right to left.</p><div className="letter-bank" dir="rtl">{["ب", "ا", "ت", "ك"].map((letter, i) => <button key={`${letter}-${i}`} className="chip arabic" onClick={() => setBuiltWord((value) => value + letter)}>{letter}</button>)}</div></div>
        <div className="build-zone"><span className="build-icon">📘</span><div className="answer-slots arabic" dir="rtl">{builtWord || "ــ  ــ  ــ  ــ"}</div><div className="builder-actions"><button className="text-button" onClick={() => setBuiltWord("")}>Start again</button><button className="small-button" onClick={() => builtWord === "كتاب" ? speak("أَحْسَنْت! كِتَاب") : speak("حَاوِلْ مَرَّةً أُخْرَى")}>{builtWord === "كتاب" ? "Beautiful! Hear it" : "Check my word"}</button></div></div>
      </section>
    </div>
  );

  const sentenceBank = ["القراءة", "أحب", "أنا"];
  const renderSentences = () => (
    <div className="page-stack">
      {pageHeader("Thoughts become language", "Sentence Studio", "Arrange simple Arabic words and watch a complete idea come alive.", "جُمْلَة")}
      <section className="panel sentence-workspace">
        <div className="sentence-prompt"><span className="scene-emoji">📚</span><div><p className="eyebrow">Build this thought</p><h2>“I love reading.”</h2><p>Tap the words in Arabic order.</p></div></div>
        <div className={`sentence-line ${sentenceResult}`} dir="rtl">{sentenceWords.length ? sentenceWords.map((word, index) => <button key={`${word}-${index}`} className="sentence-piece arabic" onClick={() => setSentenceWords((items) => items.filter((_, i) => i !== index))}>{word}</button>) : <span>ضع الكلمات هنا</span>}</div>
        <div className="sentence-bank" dir="rtl">{sentenceBank.map((word) => <button key={word} className="chip arabic" disabled={sentenceWords.includes(word)} onClick={() => { setSentenceWords((items) => [...items, word]); setSentenceResult("idle"); }}>{word}</button>)}</div>
        <div className="sentence-footer"><p className={sentenceResult === "right" ? "success-message" : sentenceResult === "try" ? "try-message" : "helper-message"}>{sentenceResult === "right" ? "Wonderful — a complete sentence has bloomed!" : sentenceResult === "try" ? "Almost there. Remember: start on the right." : "Tip: the first word is أنا."}</p><div><button className="text-button" onClick={() => { setSentenceWords([]); setSentenceResult("idle"); }}>Clear</button><button className="primary-button" onClick={() => { const right = sentenceWords.join(" ") === "أنا أحب القراءة"; setSentenceResult(right ? "right" : "try"); if (right) speak("أَنَا أُحِبُّ الْقِرَاءَة"); }}>Check sentence</button></div></div>
      </section>
      <section className="pattern-row">{[["أَنَا أَشْرَبُ الْمَاءَ", "I drink water", "💧"], ["هَذَا بَيْتِي", "This is my home", "🏠"], ["أُمِّي تَقْرَأُ", "My mother reads", "📖"]].map((item) => <button key={item[0]} className="pattern-card" onClick={() => speak(item[0])}><span>{item[2]}</span><strong className="arabic" dir="rtl">{item[0]}</strong><small>{item[1]} · ♪</small></button>)}</section>
    </div>
  );

  const renderStories = () => {
    const story = stories[storyIndex];
    return <div className="page-stack">
      {pageHeader("Listen with wonder", "Story Cove", "Short, gentle tales narrated in Arabic, with just enough help in English.", "حِكَايَات")}
      <section className="story-reader panel">
        <div className="story-cover"><img src="/kalemati-world.png" alt="The paper-and-clay word portals of Kalemati" /><span className="story-number">Story {storyIndex + 1} of {stories.length}</span></div>
        <div className="story-content"><p className="eyebrow">{story.level}</p><h2>{story.title}</h2><h3 className="arabic" dir="rtl">{story.arabicTitle}</h3><p className="arabic story-text" dir="rtl">{story.text}</p><div className="vocabulary-row">{story.words.map((word) => <span key={word}>{word}</span>)}</div><div className="reader-actions"><button className="primary-button" onClick={() => speak(story.text)}>▶ Listen in Arabic</button><button className="round-button" onClick={() => speak(story.arabicTitle)} aria-label="Hear story title">♪</button></div></div>
      </section>
      <section className="story-list">{stories.map((item, index) => <button key={item.title} className={`story-list-card ${index === storyIndex ? "active" : ""}`} onClick={() => setStoryIndex(index)}><span>{item.icon}</span><div><strong>{item.title}</strong><small className="arabic" dir="rtl">{item.arabicTitle}</small></div><i>{index === storyIndex ? "Playing" : "Open"}</i></button>)}</section>
    </div>;
  };

  const renderHomework = () => {
    const completed = Object.values(completedTasks).filter(Boolean).length;
    return <div className="page-stack">
      {pageHeader("A little, often", "Homework Nest", "A calm weekly plan that helps learning settle without feeling heavy.", "وَاجِبَاتِي")}
      <section className="homework-summary panel"><div className="nest-graphic"><span>🥚</span><span>🥚</span><span>🐣</span></div><div><p className="eyebrow">This week's nest</p><h2>{completed} of {homeworkTasks.length} tiny tasks complete</h2><p>Due Friday · about 21 minutes altogether</p></div><div className="ring-progress" style={{ "--percent": `${(completed / homeworkTasks.length) * 100}%` } as CSSProperties}><strong>{Math.round((completed / homeworkTasks.length) * 100)}%</strong></div></section>
      <section className="homework-list panel">{homeworkTasks.map((task, index) => <button key={task[0]} className={completedTasks[index] ? "complete" : ""} onClick={() => setCompletedTasks((items) => ({ ...items, [index]: !items[index] }))}><span className="task-check">{completedTasks[index] ? "✓" : ""}</span><span className="task-icon">{task[3]}</span><span><strong>{task[0]}</strong><small>{task[1]}</small></span><em>{task[2]}</em></button>)}</section>
      <p className="parent-tip"><span>☼</span><strong>Grown-up tip</strong> Celebrate effort, not perfect pronunciation. One warm “I heard you try” goes a long way.</p>
    </div>;
  };

  const renderCopybook = () => (
    <div className="page-stack">
      {pageHeader("Slow hands, strong memory", "My Copybook", "Trace the guide with a finger, mouse, or pen. Clear the page whenever you wish.", "نَسْخ")}
      <section className="copy-panel panel">
        <div className="copy-toolbar"><div><p className="eyebrow">Practice page 04</p><h2 className="arabic" dir="rtl">حـ · ـحـ · ـح</h2></div><div><button className="round-button" onClick={() => speak("حَاء")}>♪</button><button className="small-button secondary" onClick={clearCanvas}>Clear page</button></div></div>
        <div className="trace-board"><div className="trace-letter arabic">ح</div><canvas ref={canvasRef} width={960} height={360} aria-label="Drawing area for tracing the Arabic letter Haa" onPointerDown={(event) => drawPoint(event, true)} onPointerMove={(event) => drawPoint(event, false)} onPointerUp={stopDrawing} onPointerCancel={stopDrawing} onPointerLeave={stopDrawing} /></div>
        <div className="copy-cues"><span><i>1</i> Start at the glowing dot</span><span><i>2</i> Follow the soft path</span><span><i>3</i> Try once without the guide</span></div>
      </section>
    </div>
  );

  const paintPetal = (index: number) => setPetals((items) => items.map((item, i) => i === index ? color : item));
  const renderColoring = () => (
    <div className="page-stack">
      {pageHeader("Color makes meaning stick", "Color & Learn", "Choose a calm color, fill the picture, and say the Arabic word aloud.", "لَوِّنْ")}
      <section className="coloring-layout panel">
        <div className="color-sidebar"><p className="eyebrow">Your palette</p><h2>Pick a color</h2><div className="swatches">{palette.map((shade) => <button key={shade} aria-label={`Choose color ${shade}`} className={color === shade ? "active" : ""} style={{ background: shade }} onClick={() => setColor(shade)} />)}</div><button className="small-button secondary" onClick={() => setPetals(petals.map(() => "#fffaf0"))}>Start fresh</button><p className="color-tip">Tap each petal to fill it. There are no wrong colors here.</p></div>
        <div className="color-canvas">
          <span className="sun-doodle">☀</span><span className="cloud-doodle">☁</span>
          <div className="css-flower" aria-label="Coloring flower">{petals.map((shade, index) => <button key={index} className={`petal petal-${index + 1}`} style={{ background: shade }} onClick={() => paintPetal(index)} aria-label={`Color petal ${index + 1}`} />)}<button className="flower-center" style={{ background: petals[0] === "#fffaf0" ? "#f2c968" : color }} aria-label="Color flower center" /><span className="stem" /><button className="leaf leaf-one" style={{ background: petals[4] }} onClick={() => paintPetal(4)} aria-label="Color left leaf" /><button className="leaf leaf-two" style={{ background: petals[5] }} onClick={() => paintPetal(5)} aria-label="Color right leaf" /></div>
          <button className="color-word" onClick={() => speak("زَهْرَة")}><strong className="arabic" dir="rtl">زَهْرَة</strong><small>flower · tap to hear ♪</small></button>
        </div>
      </section>
    </div>
  );

  const renderGames = () => (
    <div className="page-stack">
      {pageHeader("Play is practice in disguise", "Game Meadow", "Quick learning games that feel light, friendly, and wonderfully replayable.", "أَلْعَاب")}
      <section className="game-feature panel">
        <div className="game-intro"><span className="game-badge">Round 1 of 5</span><h2>Which picture matches this word?</h2><strong className="arabic target-word" dir="rtl">قَمَر</strong><button className="round-button" onClick={() => speak("قَمَر")}>♪</button></div>
        <div className="game-options">{[["☀️", "sun"], ["🌙", "moon"], ["⭐", "star"]].map((option) => <button key={option[1]} onClick={() => { const right = option[1] === "moon"; setGameResult(right ? "right" : "try"); if (right) speak("أَحْسَنْت! قَمَر"); }}><span>{option[0]}</span><small>{option[1]}</small></button>)}</div>
        <div className={`game-feedback ${gameResult}`}>{gameResult === "right" ? "✦ Brilliant! قَمَر means moon." : gameResult === "try" ? "That is a lovely guess. Listen once more." : "Choose the picture that feels right."}</div>
      </section>
      <section className="mini-game-grid">{[["Sound Safari", "Hear a sound and find its letter", "🎧", "4 min", "mint"], ["Word Picnic", "Pack pictures into the right baskets", "🧺", "6 min", "sun"], ["Sentence Steps", "Build a bridge one word at a time", "🌉", "5 min", "lavender"]].map((game) => <button key={game[0]} className={`mini-game ${game[4]}`}><span>{game[2]}</span><div><h3>{game[0]}</h3><p>{game[1]}</p><small>{game[3]} · Play →</small></div></button>)}</section>
    </div>
  );

  const renderTeacher = () => (
    <div className="page-stack">
      {pageHeader("A real person, right when you need one", "Meet a Teacher", "Book a warm, face-to-face Arabic lesson tailored to your learner.", "مُعَلِّمَتِي")}
      <section className="teacher-layout">
        <div className="teacher-card panel"><div className="teacher-avatar">ن</div><div className="teacher-live">Available this week</div><div className="teacher-info"><p className="eyebrow">Recommended for Layla</p><h2>Ms. Noor</h2><p className="arabic" dir="rtl">الْمُعَلِّمَةُ نُور</p><p>Children's Arabic specialist · 8 years teaching · English & Arabic</p><div className="teacher-tags"><span>Patient pace</span><span>Story-led</span><span>Beginner friendly</span></div><blockquote>“We will turn the sounds you know into your very first conversation.”</blockquote></div></div>
        <div className="booking-card panel"><p className="eyebrow">25-minute live lesson</p><h2>Choose a gentle time</h2><div className="date-strip"><button>‹</button><div><small>MON</small><strong>10</strong></div><div className="active"><small>TUE</small><strong>11</strong></div><div><small>WED</small><strong>12</strong></div><div><small>THU</small><strong>13</strong></div><button>›</button></div><div className="time-slots">{["3:30 PM", "4:15 PM", "5:00 PM", "5:45 PM"].map((slot) => <button key={slot} className={teacherSlot === slot ? "active" : ""} onClick={() => { setTeacherSlot(slot); setBookingConfirmed(false); }}>{slot}</button>)}</div><button className="primary-button full" disabled={!teacherSlot} onClick={() => setBookingConfirmed(true)}>{bookingConfirmed ? "Lesson request sent ✓" : teacherSlot ? `Request ${teacherSlot}` : "Choose a time first"}</button><p className="booking-note">A parent confirms the lesson before it is booked. No payment is taken in this prototype.</p></div>
      </section>
    </div>
  );

  const renderView = () => {
    if (view === "letters") return renderLetters();
    if (view === "words") return renderWords();
    if (view === "sentences") return renderSentences();
    if (view === "stories") return renderStories();
    if (view === "homework") return renderHomework();
    if (view === "copybook") return renderCopybook();
    if (view === "coloring") return renderColoring();
    if (view === "games") return renderGames();
    if (view === "teacher") return renderTeacher();
    return renderHome();
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => goTo("home")} aria-label="Kalemati home"><span className="brand-cube arabic">ك</span><span><strong>Kalemati</strong><small className="arabic" dir="rtl">كَلِماتي</small></span></button>
        <nav aria-label="Main navigation">{navGroups.map((group) => <div className="nav-group" key={group.label}><p>{group.label}</p>{group.items.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => goTo(item.id)}><span className={`nav-icon ${item.id === "letters" ? "arabic" : ""}`}>{item.icon}</span><em>{item.label}</em>{view === item.id && <i />}</button>)}</div>)}</nav>
        <div className="sidebar-footer"><span className="helper-dot">✦</span><div><strong>Need a little help?</strong><button onClick={() => goTo("teacher")}>Open a hint →</button></div></div>
      </aside>

      <main ref={mainRef}>
        <header className="topbar"><div><span className="today-dot" /> <span>{view === "home" ? "Sunday, 9 August" : navGroups.flatMap((group) => group.items).find((item) => item.id === view)?.label}</span></div><div className="top-actions"><button className="streak-button" onClick={() => setShowAchievements(true)}><span>✦</span> 7 day streak</button><button className="icon-button" onClick={() => setSoundOn((value) => !value)} aria-label={soundOn ? "Turn sound off" : "Turn sound on"}>{soundOn ? "♪" : "×"}</button><button className="parent-button" onClick={() => setShowParent(true)}><span>♧</span> Parent Space</button><button className="mini-avatar" onClick={() => setShowAchievements(true)} aria-label="Open Layla's achievements">L</button></div></header>
        <div className="content">{renderView()}</div>
      </main>

      {showAchievements && <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowAchievements(false)}><section className="modal-card achievement-modal" role="dialog" aria-modal="true" aria-labelledby="achievement-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowAchievements(false)} aria-label="Close achievements">×</button><p className="eyebrow">Layla's keepsake shelf</p><h2 id="achievement-title">Small wins, beautifully remembered.</h2><div className="badge-shelf">{[["★", "Brave Storyteller", "3 stories"], ["أ", "Letter Gardener", "8 letters"], ["✦", "Seven-day Spark", "7 days"], ["◐", "Moon Listener", "New"], ["✎", "Careful Hand", "12 traces"], ["◆", "Playful Thinker", "5 games"]].map((badge, i) => <div className={i === 3 ? "new" : ""} key={badge[1]}><span className={i === 1 ? "arabic" : ""}>{badge[0]}</span><strong>{badge[1]}</strong><small>{badge[2]}</small></div>)}</div><button className="primary-button full" onClick={() => setShowAchievements(false)}>Keep exploring</button></section></div>}

      {showParent && <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowParent(false)}><section className="modal-card parent-modal" role="dialog" aria-modal="true" aria-labelledby="parent-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowParent(false)} aria-label="Close Parent Space">×</button><div className="parent-modal-header"><div><p className="eyebrow">Private grown-up view</p><h2 id="parent-title">Layla is building a lovely rhythm.</h2><p>Clear progress without pressure, plus one useful next step.</p></div><div className="parent-score"><strong>86%</strong><span>weekly goal</span></div></div><div className="parent-metrics"><div><span>32 min</span><small>Learning time</small><em>+8 this week</em></div><div><span>8</span><small>Letters growing</small><em>2 nearly fluent</em></div><div><span>14</span><small>Words remembered</small><em>Strong recall</em></div></div><div className="parent-detail-grid"><section><div className="section-title-row compact"><div><p className="eyebrow">This week</p><h3>Calm, consistent visits</h3></div></div><div className="activity-chart">{[38, 58, 42, 75, 52, 84, 64].map((height, i) => <div key={i}><span style={{ height: `${height}%` }} /><small>{["M", "T", "W", "T", "F", "S", "S"][i]}</small></div>)}</div></section><section className="teacher-note"><p className="eyebrow">From Ms. Noor</p><blockquote>“Layla hears the difference between ح and ه beautifully. Next, we’ll practise using ح inside short words.”</blockquote><button className="text-button" onClick={() => { setShowParent(false); goTo("teacher"); }}>Plan a live lesson →</button></section></div><div className="parent-focus"><span>☼</span><div><strong>One focus for this week</strong><p>Say three ح words together during everyday moments: حُبّ، حَلِيب، حَدِيقَة.</p></div></div></section></div>}
    </div>
  );
}
