"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  assessmentQuestions,
  dictationExercises,
  placementQuestions,
} from "./assessments";
import {
  coloringScenes,
  gameRounds,
  letters,
  levels,
  sentenceExercises,
  stories,
  wordChallenges,
  words,
  type SentenceExercise,
  type Story,
} from "./curriculum";

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
  | "tests"
  | "dictation"
  | "placement"
  | "teacher";

type ResultState = "idle" | "right" | "try";
type SyncState = "loading" | "saved" | "saving" | "preview" | "error";
type Point = { x: number; y: number };
type PaintStroke = {
  color: string;
  size: number;
  erase: boolean;
  points: Point[];
};
type ProgressItem = {
  id?: number;
  track: string;
  itemId: string;
  status: string;
  score: number;
  attempts?: number;
};
type Learner = {
  id?: number;
  name: string;
  ageBand: string;
  currentLevel: number;
  xp: number;
  streak: number;
};
type CustomContent = {
  id: number;
  type: string;
  title: string;
  arabic: string;
  english: string;
  level: number;
};
type Booking = {
  id?: number;
  teacherName: string;
  lessonSlot: string;
  focus: string;
  status: string;
};
type LessonDay = {
  key: string;
  weekday: string;
  day: string;
  label: string;
};

declare const __GITHUB_PAGES__: boolean;

const FULL_APP_URL =
  "https://kalemati-learning-world.minaalbayati05.chatgpt.site/";
const isGitHubPagesBuild =
  typeof __GITHUB_PAGES__ !== "undefined" && __GITHUB_PAGES__;
const PAGES_STORAGE_KEY = "kalemati-github-pages-progress-v1";

const navGroups: {
  label: string;
  items: { id: ViewId; icon: string; label: string }[];
}[] = [
  {
    label: "Learn",
    items: [
      { id: "home", icon: "⌂", label: "My World" },
      { id: "letters", icon: "أ", label: "Letter Garden" },
      { id: "words", icon: "✦", label: "Word Workshop" },
      { id: "sentences", icon: "≋", label: "Sentence Studio" },
      { id: "stories", icon: "◐", label: "Story Library" },
    ],
  },
  {
    label: "Create & Practise",
    items: [
      { id: "homework", icon: "✓", label: "Homework Nest" },
      { id: "copybook", icon: "✎", label: "Copybook" },
      { id: "coloring", icon: "✿", label: "Color Studio" },
      { id: "games", icon: "◆", label: "Game Meadow" },
      { id: "teacher", icon: "☏", label: "Meet a Teacher" },
    ],
  },
  {
    label: "Check & Grow",
    items: [
      { id: "tests", icon: "◫", label: "Test Centre" },
      { id: "dictation", icon: "✐", label: "Dictation Lab" },
      { id: "placement", icon: "◎", label: "Level Compass" },
    ],
  },
];

const palette = [
  "#ef8f79",
  "#f2c968",
  "#80b49b",
  "#7fc4cc",
  "#b7a7d8",
  "#e89eb6",
  "#315b54",
  "#f7f0df",
];

const copyTargets = [
  { value: "ح", label: "Letter Haa", guide: "حـ · ـحـ · ـح" },
  { value: "ع", label: "Letter Ain", guide: "عـ · ـعـ · ـع" },
  { value: "م", label: "Letter Meem", guide: "مـ · ـمـ · ـم" },
  { value: "ك", label: "Letter Kaaf", guide: "كـ · ـكـ · ـك" },
  { value: "قَمَر", label: "Moon", guide: "قَـمَـر" },
  { value: "كِتَاب", label: "Book", guide: "كِـتَـاب" },
  { value: "حَدِيقَة", label: "Garden", guide: "حَـدِيـقَـة" },
  { value: "أَنَا أَقْرَأُ", label: "I read", guide: "أَنَا أَقْرَأُ" },
];

function canvasPoint(
  event: ReactPointerEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
    y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
  };
}

function drawColorTemplate(
  context: CanvasRenderingContext2D,
  sceneId: string,
  width: number,
  height: number,
) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#fffdf7";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "#315b54";
  context.fillStyle = "#fffdf7";
  context.lineWidth = 7;
  context.lineCap = "round";
  context.lineJoin = "round";

  const line = (points: Point[], close = false) => {
    context.beginPath();
    points.forEach((point, index) =>
      index === 0
        ? context.moveTo(point.x, point.y)
        : context.lineTo(point.x, point.y),
    );
    if (close) context.closePath();
    context.stroke();
  };
  const circle = (x: number, y: number, radius: number) => {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  };
  const rect = (x: number, y: number, w: number, h: number, radius = 18) => {
    context.beginPath();
    context.roundRect(x, y, w, h, radius);
    context.fill();
    context.stroke();
  };

  context.save();
  if (sceneId === "garden") {
    line([{ x: 70, y: 520 }, { x: 930, y: 520 }]);
    circle(805, 105, 48);
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI * 2 * i) / 6;
      circle(470 + Math.cos(angle) * 95, 260 + Math.sin(angle) * 95, 55);
    }
    circle(470, 260, 61);
    line([{ x: 470, y: 321 }, { x: 470, y: 520 }]);
    context.beginPath();
    context.ellipse(410, 420, 70, 34, -0.45, 0, Math.PI * 2);
    context.fill(); context.stroke();
    context.beginPath();
    context.ellipse(530, 450, 70, 34, 0.45, 0, Math.PI * 2);
    context.fill(); context.stroke();
  } else if (sceneId === "night") {
    context.beginPath();
    context.arc(485, 260, 145, 0.35, Math.PI * 1.75);
    context.arc(555, 225, 125, Math.PI * 1.65, 0.47, true);
    context.closePath(); context.fill(); context.stroke();
    [[180, 140], [755, 125], [800, 340], [250, 410]].forEach(([x, y]) => {
      line([{ x, y: y - 34 }, { x: x + 12, y: y - 10 }, { x: x + 39, y }, { x: x + 12, y: y + 10 }, { x, y: y + 38 }, { x: x - 12, y: y + 10 }, { x: x - 39, y }, { x: x - 12, y: y - 10 }], true);
    });
    line([{ x: 610, y: 500 }, { x: 725, y: 370 }, { x: 770, y: 400 }, { x: 675, y: 515 }], true);
    line([{ x: 650, y: 510 }, { x: 610, y: 585 }]);
    line([{ x: 683, y: 508 }, { x: 725, y: 585 }]);
  } else if (sceneId === "home") {
    rect(310, 255, 390, 285, 8);
    line([{ x: 250, y: 270 }, { x: 505, y: 90 }, { x: 760, y: 270 }]);
    rect(455, 385, 105, 155, 40);
    rect(355, 330, 85, 78, 10); rect(575, 330, 85, 78, 10);
    line([{ x: 398, y: 330 }, { x: 398, y: 408 }]);
    line([{ x: 618, y: 330 }, { x: 618, y: 408 }]);
    circle(150, 360, 75); line([{ x: 150, y: 435 }, { x: 150, y: 550 }]);
    line([{ x: 70, y: 550 }, { x: 900, y: 550 }]);
  } else if (sceneId === "sea") {
    for (let row = 0; row < 4; row += 1) {
      context.beginPath();
      for (let x = 30; x <= 970; x += 20) {
        const y = 390 + row * 60 + Math.sin(x / 45) * 16;
        if (x === 30) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    }
    line([{ x: 365, y: 355 }, { x: 655, y: 355 }, { x: 595, y: 440 }, { x: 425, y: 440 }], true);
    line([{ x: 510, y: 110 }, { x: 510, y: 355 }]);
    line([{ x: 510, y: 125 }, { x: 315, y: 330 }, { x: 510, y: 330 }], true);
    line([{ x: 525, y: 150 }, { x: 705, y: 330 }, { x: 525, y: 330 }], true);
    circle(825, 105, 45);
  } else if (sceneId === "market") {
    line([{ x: 255, y: 245 }, { x: 735, y: 245 }, { x: 675, y: 545 }, { x: 315, y: 545 }], true);
    for (let x = 340; x <= 650; x += 100) circle(x, 320 + (x % 200), 49);
    circle(455, 350, 52); circle(560, 440, 50); circle(400, 455, 46);
    line([{ x: 320, y: 245 }, { x: 365, y: 120 }, { x: 630, y: 120 }, { x: 685, y: 245 }]);
    line([{ x: 385, y: 170 }, { x: 615, y: 170 }]);
    line([{ x: 105, y: 560 }, { x: 890, y: 560 }]);
  } else if (sceneId === "kite") {
    line([{ x: 500, y: 105 }, { x: 665, y: 265 }, { x: 500, y: 430 }, { x: 335, y: 265 }], true);
    line([{ x: 500, y: 105 }, { x: 500, y: 430 }]);
    line([{ x: 335, y: 265 }, { x: 665, y: 265 }]);
    context.beginPath();
    context.moveTo(500, 430);
    context.bezierCurveTo(390, 470, 620, 530, 450, 610);
    context.stroke();
    [[480, 470], [510, 525], [472, 570]].forEach(([x, y]) => line([{ x: x - 25, y: y - 12 }, { x, y }, { x: x - 25, y: y + 12 }, { x: x + 25, y }, { x: x + 25, y: y - 12 }, { x, y }], true));
    context.beginPath(); context.arc(175, 160, 55, Math.PI, 0); context.arc(240, 160, 70, Math.PI, 0); context.arc(315, 160, 52, Math.PI, 0); context.stroke();
  } else if (sceneId === "classroom") {
    line([{ x: 120, y: 510 }, { x: 880, y: 510 }]);
    line([{ x: 205, y: 165 }, { x: 465, y: 210 }, { x: 500, y: 500 }, { x: 220, y: 450 }], true);
    line([{ x: 795, y: 165 }, { x: 535, y: 210 }, { x: 500, y: 500 }, { x: 780, y: 450 }], true);
    line([{ x: 500, y: 210 }, { x: 500, y: 500 }]);
    rect(90, 80, 125, 90, 16); rect(750, 75, 130, 100, 16);
    circle(152, 125, 25);
    line([{ x: 775, y: 150 }, { x: 840, y: 95 }]);
  } else {
    line([{ x: 430, y: 470 }, { x: 500, y: 110 }, { x: 570, y: 470 }], true);
    line([{ x: 455, y: 360 }, { x: 350, y: 430 }, { x: 430, y: 470 }], true);
    line([{ x: 545, y: 360 }, { x: 650, y: 430 }, { x: 570, y: 470 }], true);
    circle(500, 235, 42);
    line([{ x: 450, y: 470 }, { x: 405, y: 550 }, { x: 470, y: 520 }], true);
    line([{ x: 550, y: 470 }, { x: 595, y: 550 }, { x: 530, y: 520 }], true);
    circle(780, 190, 82); circle(220, 215, 52);
    context.beginPath(); context.ellipse(780, 190, 132, 32, -0.3, 0, Math.PI * 2); context.stroke();
    [[760, 450], [225, 465], [145, 95]].forEach(([x, y]) => line([{ x, y: y - 28 }, { x: x + 12, y }, { x, y: y + 28 }, { x: x - 12, y }], true));
  }
  context.restore();
}

function drawPaintStrokes(
  context: CanvasRenderingContext2D,
  strokes: PaintStroke[],
) {
  strokes.forEach((stroke) => {
    if (!stroke.points.length) return;
    context.save();
    context.globalCompositeOperation = stroke.erase
      ? "destination-out"
      : "source-over";
    context.strokeStyle = stroke.color;
    context.lineWidth = stroke.size;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(stroke.points[0].x, stroke.points[0].y);
    stroke.points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
    if (stroke.points.length === 1) {
      context.lineTo(stroke.points[0].x + 0.1, stroke.points[0].y + 0.1);
    }
    context.stroke();
    context.restore();
  });
}

function normalizeArabic(value: string) {
  return value
    .normalize("NFC")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[؟،؛.!,:\s]/g, "")
    .trim();
}

export default function Home() {
  const [view, setView] = useState<ViewId>("home");
  const [todayLabel, setTodayLabel] = useState("Today");
  const [soundOn, setSoundOn] = useState(true);
  const [activeLevel, setActiveLevel] = useState(1);
  const [activeLetter, setActiveLetter] = useState(5);
  const [activeWordId, setActiveWordId] = useState("moon");
  const [wordCategory, setWordCategory] = useState("All");
  const [builtLetters, setBuiltLetters] = useState<string[]>([]);
  const [wordResult, setWordResult] = useState<ResultState>("idle");
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [sentenceResult, setSentenceResult] = useState<ResultState>("idle");
  const [showHint, setShowHint] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyAnswer, setStoryAnswer] = useState("");
  const [copyTargetIndex, setCopyTargetIndex] = useState(0);
  const [selectedSceneId, setSelectedSceneId] = useState("garden");
  const [coloringBook, setColoringBook] = useState<Record<string, PaintStroke[]>>({});
  const [brushColor, setBrushColor] = useState(palette[0]);
  const [brushSize, setBrushSize] = useState(24);
  const [eraserOn, setEraserOn] = useState(false);
  const [artMessage, setArtMessage] = useState("");
  const [gameIndex, setGameIndex] = useState(0);
  const [gameResult, setGameResult] = useState<ResultState>("idle");
  const [testIndex, setTestIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [testFinished, setTestFinished] = useState(false);
  const [dictationIndex, setDictationIndex] = useState(0);
  const [dictationInput, setDictationInput] = useState("");
  const [dictationResult, setDictationResult] = useState<ResultState>("idle");
  const [showDictationHint, setShowDictationHint] = useState(false);
  const [placementStarted, setPlacementStarted] = useState(false);
  const [placementIndex, setPlacementIndex] = useState(0);
  const [placementAnswers, setPlacementAnswers] = useState<Record<string, string>>({});
  const [placementResult, setPlacementResult] = useState<{
    level: number;
    correct: number;
    score: number;
  } | null>(null);
  const [lessonDays, setLessonDays] = useState<LessonDay[]>([]);
  const [teacherDay, setTeacherDay] = useState("");
  const [teacherSlot, setTeacherSlot] = useState("");
  const [lessonFocus, setLessonFocus] = useState("Conversation confidence");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showParent, setShowParent] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [parentTab, setParentTab] = useState<"progress" | "content" | "account">("progress");
  const [authenticated, setAuthenticated] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>("loading");
  const [owner, setOwner] = useState({ displayName: "Parent", email: "" });
  const [learner, setLearner] = useState<Learner>({ name: "Layla", ageBand: "6–8", currentLevel: 1, xp: 80, streak: 7 });
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customContent, setCustomContent] = useState<CustomContent[]>([]);
  const [contentForm, setContentForm] = useState({ type: "story", title: "", arabic: "", english: "", level: 1 });
  const [learnerNameDraft, setLearnerNameDraft] = useState("Layla");
  const [pagesStorageReady, setPagesStorageReady] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const achievementCloseRef = useRef<HTMLButtonElement>(null);
  const parentCloseRef = useRef<HTMLButtonElement>(null);
  const traceCanvasRef = useRef<HTMLCanvasElement>(null);
  const tracing = useRef(false);
  const colorCanvasRef = useRef<HTMLCanvasElement>(null);
  const painting = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const now = new Date();
      const fullDate = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
      const dayNumber = new Intl.DateTimeFormat("en-GB", { day: "numeric" });
      setTodayLabel(fullDate.format(now));

      const upcoming = Array.from({ length: 4 }, (_, index) => {
        const date = new Date(now);
        date.setDate(now.getDate() + index + 1);
        const key = [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, "0"),
          String(date.getDate()).padStart(2, "0"),
        ].join("-");
        return {
          key,
          weekday: weekday.format(date).toUpperCase(),
          day: dayNumber.format(date),
          label: fullDate.format(date),
        };
      });
      setLessonDays(upcoming);
      setTeacherDay(upcoming[0]?.key ?? "");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isGitHubPagesBuild) {
      const frame = window.requestAnimationFrame(() => {
        try {
          const saved = window.localStorage.getItem(PAGES_STORAGE_KEY);
          if (saved) {
            const data = JSON.parse(saved) as {
              learner?: Learner;
              progress?: ProgressItem[];
              coloringBook?: Record<string, PaintStroke[]>;
              customContent?: CustomContent[];
            };
            if (data.learner) {
              setLearner(data.learner);
              setLearnerNameDraft(data.learner.name);
              setActiveLevel(data.learner.currentLevel);
            }
            if (data.progress) setProgress(data.progress);
            if (data.coloringBook) setColoringBook(data.coloringBook);
            if (data.customContent) setCustomContent(data.customContent);
          }
        } catch {
          window.localStorage.removeItem(PAGES_STORAGE_KEY);
        }
        setSyncState("preview");
        setPagesStorageReady(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    let cancelled = false;
    fetch("/api/learning")
      .then((response) => response.json())
      .then((data) => {
        if (cancelled || !data.authenticated) {
          if (!cancelled) setSyncState("preview");
          return;
        }
        setAuthenticated(true);
        setOwner(data.owner);
        setLearner(data.learner);
        setLearnerNameDraft(data.learner.name);
        setActiveLevel(data.learner.currentLevel);
        setProgress(data.progress ?? []);
        setBookings(data.bookings ?? []);
        setCustomContent(data.customContent ?? []);
        const restored: Record<string, PaintStroke[]> = {};
        (data.artworks ?? []).forEach(
          (artwork: { sceneId: string; strokesJson: string }) => {
            try {
              restored[artwork.sceneId] = JSON.parse(artwork.strokesJson);
            } catch {
              restored[artwork.sceneId] = [];
            }
          },
        );
        setColoringBook(restored);
        setSyncState("saved");
      })
      .catch(() => setSyncState("preview"));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isGitHubPagesBuild || !pagesStorageReady) return;
    window.localStorage.setItem(
      PAGES_STORAGE_KEY,
      JSON.stringify({ learner, progress, coloringBook, customContent }),
    );
  }, [coloringBook, customContent, learner, pagesStorageReady, progress]);

  useEffect(() => {
    if (!showParent && !showAchievements) return;
    (showParent ? parentCloseRef : achievementCloseRef).current?.focus();
    const previousOverflow = document.body.style.overflow;
    const closeModal = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (showParent) setShowParent(false);
      else setShowAchievements(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeModal);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeModal);
    };
  }, [showAchievements, showParent]);

  useEffect(() => {
    const canvas = colorCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    drawColorTemplate(context, selectedSceneId, canvas.width, canvas.height);
    const paintLayer = document.createElement("canvas");
    paintLayer.width = canvas.width;
    paintLayer.height = canvas.height;
    const paintContext = paintLayer.getContext("2d");
    if (!paintContext) return;
    drawPaintStrokes(paintContext, coloringBook[selectedSceneId] ?? []);
    context.drawImage(paintLayer, 0, 0);
  }, [selectedSceneId, coloringBook]);

  const activeLevelInfo = levels[activeLevel - 1];
  const completedIds = useMemo(
    () => new Set(progress.filter((item) => item.status === "completed").map((item) => item.itemId)),
    [progress],
  );
  const currentLevelFloor = activeLevelInfo.xpFloor;
  const nextLevelFloor = levels[activeLevel]?.xpFloor ?? currentLevelFloor + 700;
  const levelPercent = Math.max(
    0,
    Math.min(100, ((learner.xp - currentLevelFloor) / (nextLevelFloor - currentLevelFloor)) * 100),
  );

  const postAction = async (payload: Record<string, unknown>) => {
    if (!authenticated) {
      setSyncState("preview");
      return null;
    }
    setSyncState("saving");
    try {
      const response = await fetch("/api/learning", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save");
      setSyncState("saved");
      return data;
    } catch {
      setSyncState("error");
      return null;
    }
  };

  const recordProgress = async (
    itemId: string,
    track: string,
    score = 100,
  ) => {
    setProgress((items) => {
      const existing = items.find((item) => item.itemId === itemId);
      if (existing) {
        return items.map((item) =>
          item.itemId === itemId
            ? { ...item, status: "completed", score: Math.max(item.score, score) }
            : item,
        );
      }
      return [...items, { itemId, track, score, status: "completed" }];
    });
    if (!authenticated) {
      setLearner((item) => ({ ...item, xp: item.xp + Math.max(5, Math.round(score / 5)) }));
    }
    const data = await postAction({ action: "progress", itemId, track, status: "completed", score });
    if (data?.learner) setLearner(data.learner);
  };

  const selectLevel = async (level: number) => {
    setActiveLevel(level);
    setSentenceIndex(0);
    setSentenceWords([]);
    setSentenceResult("idle");
    setStoryIndex(0);
    setStoryAnswer("");
    setGameIndex(0);
    setGameResult("idle");
    setTestIndex(0);
    setTestAnswers({});
    setTestFinished(false);
    setDictationIndex(0);
    setDictationInput("");
    setDictationResult("idle");
    setShowDictationHint(false);
    setBuiltLetters([]);
    setWordResult("idle");
    setLearner((item) => ({ ...item, currentLevel: level }));
    const data = await postAction({ action: "profile", name: learner.name, currentLevel: level });
    if (data?.learner) setLearner(data.learner);
  };

  const goTo = (next: ViewId) => {
    setView(next);
    const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    mainRef.current?.scrollTo({ top: 0, behavior });
    window.scrollTo({ top: 0, behavior });
  };

  const openAccount = () => {
    setParentTab("account");
    setShowParent(true);
  };

  const speak = (text: string) => {
    if (!soundOn || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = activeLevel >= 4 ? 0.82 : 0.7;
    window.speechSynthesis.speak(utterance);
  };

  const beginTrace = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d");
    if (!context) return;
    const point = canvasPoint(event, canvas);
    tracing.current = true;
    canvas.setPointerCapture(event.pointerId);
    context.strokeStyle = "#315b54";
    context.lineWidth = 13;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const moveTrace = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!tracing.current) return;
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d");
    if (!context) return;
    const point = canvasPoint(event, canvas);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const clearTrace = () => {
    const canvas = traceCanvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const beginPaint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const point = canvasPoint(event, canvas);
    painting.current = true;
    canvas.setPointerCapture(event.pointerId);
    const stroke: PaintStroke = {
      color: brushColor,
      size: brushSize,
      erase: eraserOn,
      points: [point],
    };
    setColoringBook((book) => ({
      ...book,
      [selectedSceneId]: [...(book[selectedSceneId] ?? []), stroke],
    }));
    setArtMessage("");
  };

  const movePaint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!painting.current) return;
    const canvas = event.currentTarget;
    const point = canvasPoint(event, canvas);
    setColoringBook((book) => {
      const strokes = [...(book[selectedSceneId] ?? [])];
      const last = strokes[strokes.length - 1];
      if (!last) return book;
      strokes[strokes.length - 1] = { ...last, points: [...last.points, point] };
      return { ...book, [selectedSceneId]: strokes };
    });
  };

  const undoPaint = () => {
    setColoringBook((book) => ({
      ...book,
      [selectedSceneId]: (book[selectedSceneId] ?? []).slice(0, -1),
    }));
  };

  const saveArtwork = async () => {
    const scene = coloringScenes.find((item) => item.id === selectedSceneId)!;
    const strokesJson = JSON.stringify(coloringBook[selectedSceneId] ?? []);
    const data = await postAction({ action: "artwork", sceneId: scene.id, title: scene.title, strokesJson });
    setArtMessage(data ? "Saved to the learner gallery ✓" : authenticated ? "Save failed — try again" : "Saved for this preview session");
    await recordProgress(`art-${scene.id}`, "coloring", 100);
  };

  const downloadArtwork = () => {
    const canvas = colorCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `kalemati-${selectedSceneId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const customSentences = customContent
    .filter((item) => item.type === "sentence" && item.level === activeLevel)
    .map<SentenceExercise>((item) => ({
      id: `custom-sentence-${item.id}`,
      level: item.level,
      prompt: item.english || item.title,
      correct: item.arabic.split(/\s+/),
      bank: item.arabic.split(/\s+/).reverse(),
      hint: "Use the meaning and Arabic reading direction to rebuild the sentence.",
      explanation: "This sentence was added from the Content Studio.",
      spoken: item.arabic,
    }));
  const levelSentences = [
    ...sentenceExercises.filter((item) => item.level === activeLevel),
    ...customSentences,
  ];
  const sentence = levelSentences[sentenceIndex % levelSentences.length];

  const addSentenceWord = (word: string) => {
    const available = sentence.bank.filter((item) => item === word).length;
    const used = sentenceWords.filter((item) => item === word).length;
    if (used >= available) return;
    setSentenceWords((items) => [...items, word]);
    setSentenceResult("idle");
  };

  const checkSentence = async () => {
    const right = sentenceWords.join(" ") === sentence.correct.join(" ");
    setSentenceResult(right ? "right" : "try");
    if (right) {
      speak(sentence.spoken);
      await recordProgress(sentence.id, "sentences", 100);
    }
  };

  const nextSentence = () => {
    setSentenceIndex((index) => (index + 1) % levelSentences.length);
    setSentenceWords([]);
    setSentenceResult("idle");
    setShowHint(false);
  };

  const customStories = customContent
    .filter((item) => item.type === "story" && item.level === activeLevel)
    .map<Story>((item) => ({
      id: `custom-story-${item.id}`,
      level: item.level,
      title: item.title,
      arabicTitle: item.title,
      minutes: 6,
      icon: "✦",
      text: item.arabic,
      words: item.english ? [item.english] : [],
      question: "Did you understand the main idea?",
      options: ["Yes", "I will listen again"],
      answer: "Yes",
    }));
  const levelStories = [
    ...stories.filter((item) => item.level === activeLevel),
    ...customStories,
  ];
  const story = levelStories[storyIndex % levelStories.length];

  const levelGames = gameRounds.filter((item) => item.level === activeLevel);
  const game = levelGames[gameIndex % levelGames.length];

  const levelTests = assessmentQuestions.filter((item) => item.level === activeLevel);
  const testQuestion = levelTests[testIndex % levelTests.length];
  const testCorrect = levelTests.filter(
    (item) => testAnswers[item.id] === item.answer,
  ).length;
  const testScore = Math.round((testCorrect / levelTests.length) * 100);
  const levelDictations = dictationExercises.filter((item) => item.level === activeLevel);
  const dictation = levelDictations[dictationIndex % levelDictations.length];
  const completedDictations = levelDictations.filter((item) => completedIds.has(item.id)).length;

  const advanceLevelTest = async () => {
    if (!testAnswers[testQuestion.id]) return;
    if (testIndex < levelTests.length - 1) {
      setTestIndex((index) => index + 1);
      return;
    }
    setTestFinished(true);
    await recordProgress(`checkpoint-level-${activeLevel}`, "tests", testScore);
  };

  const restartLevelTest = () => {
    setTestIndex(0);
    setTestAnswers({});
    setTestFinished(false);
  };

  const checkDictation = async () => {
    if (!dictationInput.trim()) return;
    const right = normalizeArabic(dictationInput) === normalizeArabic(dictation.text);
    setDictationResult(right ? "right" : "try");
    if (right) {
      speak(dictation.text);
      await recordProgress(dictation.id, "dictation", 100);
    }
  };

  const nextDictation = () => {
    setDictationIndex((index) => (index + 1) % levelDictations.length);
    setDictationInput("");
    setDictationResult("idle");
    setShowDictationHint(false);
  };

  const answerPlacement = async (option: string) => {
    const question = placementQuestions[placementIndex];
    const nextAnswers = { ...placementAnswers, [question.id]: option };
    setPlacementAnswers(nextAnswers);
    if (placementIndex < placementQuestions.length - 1) {
      setPlacementIndex((index) => index + 1);
      return;
    }
    const correct = placementQuestions.filter(
      (item) => nextAnswers[item.id] === item.answer,
    ).length;
    const score = Math.round((correct / placementQuestions.length) * 100);
    const level = Math.min(6, Math.max(1, Math.floor(correct / 2) + 1));
    setPlacementResult({ level, correct, score });
    await recordProgress("placement-compass", "placement", score);
  };

  const restartPlacement = () => {
    setPlacementStarted(true);
    setPlacementIndex(0);
    setPlacementAnswers({});
    setPlacementResult(null);
  };

  const visibleWords = words.filter(
    (item) =>
      item.level <= activeLevel &&
      (wordCategory === "All" || item.category === wordCategory),
  );
  const wordCategories = [
    "All",
    ...Array.from(new Set(words.filter((item) => item.level <= activeLevel).map((item) => item.category))),
  ];
  const activeWord =
    visibleWords.find((item) => item.id === activeWordId) ?? visibleWords[0];
  const wordChallenge = wordChallenges[activeLevel - 1];
  const builtWord = builtLetters.join("");

  const weeklyTasks = [
    { id: `hw-${activeLevel}-listen`, icon: "🎧", title: "Listen & echo", detail: `Repeat five phrases from ${activeLevelInfo.name}`, minutes: 5, view: activeLevel < 3 ? "letters" : "sentences" as ViewId },
    { id: `hw-${activeLevel}-copy`, icon: "✎", title: "Copybook practice", detail: "Complete one guided line and one free line", minutes: 7, view: "copybook" as ViewId },
    { id: `hw-${activeLevel}-story`, icon: "◐", title: "Story visit", detail: `Listen to a level ${activeLevel} story and answer its question`, minutes: 8, view: "stories" as ViewId },
    { id: `hw-${activeLevel}-sentence`, icon: "≋", title: "Sentence builder", detail: "Build two sentences without a hint", minutes: 6, view: "sentences" as ViewId },
    { id: `hw-${activeLevel}-family`, icon: "⌂", title: "Family challenge", detail: "Use three Arabic words during an everyday moment", minutes: 5, view: "words" as ViewId },
  ];
  const completedHomework = weeklyTasks.filter((task) => completedIds.has(task.id)).length;

  const trackScore = (track: string) => {
    const items = progress.filter((item) => item.track === track);
    if (!items.length) return 0;
    return Math.round(items.reduce((total, item) => total + item.score, 0) / items.length);
  };

  const updateProfile = async () => {
    const nextName = learnerNameDraft.trim() || learner.name;
    setLearner((item) => ({ ...item, name: nextName }));
    const data = await postAction({ action: "profile", name: nextName, currentLevel: activeLevel });
    if (data?.learner) setLearner(data.learner);
  };

  const addCustomContent = async () => {
    if (!contentForm.title.trim() || !contentForm.arabic.trim()) return;
    const data = await postAction({ action: "content", ...contentForm });
    const fallback: CustomContent = {
      id: Date.now(),
      ...contentForm,
    };
    setCustomContent((items) => [...items, data?.item ?? fallback]);
    setContentForm((item) => ({ ...item, title: "", arabic: "", english: "" }));
  };

  const selectedLessonDay = lessonDays.find((item) => item.key === teacherDay);

  const requestTeacherLesson = async () => {
    if (!teacherSlot || !selectedLessonDay) return;
    if (!authenticated) {
      setBookingConfirmed(false);
      openAccount();
      return;
    }
    const data = await postAction({
      action: "booking",
      teacherName: "Ms. Noor",
      lessonSlot: `${selectedLessonDay.label} · ${teacherSlot}`,
      focus: lessonFocus,
    });
    if (!data?.booking) return;
    setBookings((items) => [data.booking, ...items]);
    setBookingConfirmed(true);
  };

  const pageHeader = (
    eyebrow: string,
    title: string,
    description: string,
    arabic?: string,
  ) => (
    <header className="page-heading expanded-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="level-context">
          <span className={`level-dot ${activeLevelInfo.color}`} />
          Level {activeLevel} · {activeLevelInfo.name} · {activeLevelInfo.cefr}
        </div>
      </div>
      {arabic && (
        <div className="heading-token arabic" dir="rtl">
          {arabic}
        </div>
      )}
    </header>
  );

  const renderHome = () => (
    <div className="dashboard-grid expanded-dashboard">
      <div className="main-stack">
        <section className="hero-card expanded-hero">
          <Image
            src="/kalemati-world.png"
            alt="Children open a sculptural portal into worlds made from Arabic words"
            fill
            priority
            sizes="(max-width: 720px) 100vw, (max-width: 1240px) 85vw, 70vw"
          />
          <div className="hero-wash" />
          <div className="hero-copy">
            <span className="soft-pill">
              Level {activeLevel} · {activeLevelInfo.cefr} · adaptive journey
            </span>
            <p className="arabic hello" dir="rtl">
              مَرْحَبًا يَا {learner.name}!
            </p>
            <h1>Every word opens a new world.</h1>
            <p>{activeLevelInfo.promise}</p>
            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() =>
                  goTo(activeLevel <= 1 ? "letters" : activeLevel <= 2 ? "words" : "sentences")
                }
              >
                Continue my path <span>→</span>
              </button>
              <button
                className="round-button"
                onClick={() => speak(`مَرْحَبًا يَا ${learner.name}`)}
                aria-label="Hear the greeting"
              >
                ♪
              </button>
            </div>
          </div>
          <div className="hero-progress">
            <div>
              <span>{activeLevelInfo.name} journey</span>
              <strong>{Math.round(levelPercent)}%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${levelPercent}%` }} />
            </div>
          </div>
        </section>

        <section className="panel curriculum-map">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Complete Arabic pathway</p>
              <h2>Six worlds, one connected curriculum</h2>
            </div>
            <span className="curriculum-count">190+ guided activities</span>
          </div>
          <div className="level-roadmap">
            {levels.map((level) => (
              <button
                key={level.id}
                className={`level-card ${level.color} ${activeLevel === level.id ? "active" : ""}`}
                onClick={() => selectLevel(level.id)}
              >
                <span className="level-number">{level.id}</span>
                <small>{level.cefr}</small>
                <strong>{level.name}</strong>
                <span className="arabic" dir="rtl">{level.arabic}</span>
                <em>{level.focus[0]} · {level.focus[1]}</em>
                {learner.xp >= level.xpFloor ? <i>Open</i> : <i>Preview</i>}
              </button>
            ))}
          </div>
        </section>

        <section className="skill-grid">
          {[
            ["letters", "Letter confidence", trackScore("letters"), "أ", "letters"],
            ["words", "Growing vocabulary", trackScore("words"), "ك", "words"],
            ["sentences", "Sentence building", trackScore("sentences"), "≋", "sentences"],
            ["stories", "Reading & listening", trackScore("stories"), "◐", "stories"],
          ].map((skill) => (
            <button
              key={String(skill[0])}
              className="skill-card"
              onClick={() => goTo(skill[4] as ViewId)}
            >
              <span className={skill[0] === "letters" || skill[0] === "words" ? "arabic" : ""}>{skill[3]}</span>
              <div>
                <small>{skill[1]}</small>
                <strong>{Number(skill[2]) || "New"}{Number(skill[2]) ? "%" : ""}</strong>
              </div>
              <div className="mini-meter"><i style={{ width: `${Number(skill[2]) || 8}%` }} /></div>
            </button>
          ))}
        </section>

        <section className="panel assessment-gateway">
          <div className="assessment-gateway-copy">
            <span className="assessment-compass">◎</span>
            <div>
              <p className="eyebrow">A calm way to check growth</p>
              <h2>Three new portals for confident progress</h2>
              <p>Short checkpoints, listen-and-write practice, and a full pathway recommendation.</p>
            </div>
          </div>
          <div className="assessment-gateway-cards">
            <button onClick={() => goTo("tests")}>
              <span>◫</span><div><small>Level {activeLevel}</small><strong>Test Centre</strong><em>{trackScore("tests") || "Ready"}{trackScore("tests") ? "% best" : ""}</em></div><i>→</i>
            </button>
            <button onClick={() => goTo("dictation")}>
              <span>✐</span><div><small>Listen & write</small><strong>Dictation Lab</strong><em>{completedDictations}/{levelDictations.length} mastered</em></div><i>→</i>
            </button>
            <button onClick={() => goTo("placement")}>
              <span>◎</span><div><small>12 adaptive questions</small><strong>Level Compass</strong><em>{trackScore("placement") ? `${trackScore("placement")}% latest` : "Find my pathway"}</em></div><i>→</i>
            </button>
          </div>
        </section>

        <section className="split-cards expanded-quick-actions">
          <button className="story-feature" onClick={() => goTo("stories")}>
            <div className="mini-scene"><span className="moon">☾</span><span className="cloud">☁</span><span className="book">▰</span></div>
            <div>
              <p className="eyebrow">Level {activeLevel} story shelf</p>
              <h3>{story.title}</h3>
              <p className="arabic" dir="rtl">{story.arabicTitle}</p>
              <span className="listen-link">Listen, read & answer →</span>
            </div>
          </button>
          <button className="studio-invite" onClick={() => goTo("coloring")}>
            <div className="paint-rings"><span /><span /><span /></div>
            <div>
              <p className="eyebrow">Creative language</p>
              <h3>Eight-page Color Studio</h3>
              <p>Brushes, eraser, undo, account saving, and vocabulary audio.</p>
              <strong>Open the studio →</strong>
            </div>
          </button>
        </section>
      </div>

      <aside className="right-rail">
        <section className="rail-card profile-card">
          <div className="avatar-bubble">{learner.name.slice(0, 1).toUpperCase()}</div>
          <div><p className="eyebrow">Learner profile</p><h3>{learner.name}&apos;s portal</h3></div>
          <div className="level-line"><span>{activeLevelInfo.name}</span><strong>{learner.xp} XP</strong></div>
          <div className="progress-track mint"><span style={{ width: `${levelPercent}%` }} /></div>
          <div className="tiny-stats">
            <div><strong>{progress.filter((item) => item.track === "letters").length}</strong><span>letters</span></div>
            <div><strong>{progress.filter((item) => item.track === "sentences").length}</strong><span>sentences</span></div>
            <div><strong>{progress.filter((item) => item.track === "stories").length}</strong><span>stories</span></div>
          </div>
        </section>

        <button className="rail-card achievement-card" onClick={() => setShowAchievements(true)}>
          <div className="achievement-top"><span className="medal">★</span><span className="new-tag">{progress.length ? "GROWING" : "START"}</span></div>
          <p className="eyebrow">Achievement collection</p>
          <h3>{progress.length >= 8 ? "Curious Pathfinder" : "First Portal Opened"}</h3>
          <p>{authenticated ? `${progress.length} learning moments saved across the curriculum.` : `${progress.length} learning moments completed in this preview session.`}</p>
          <span className="text-link">See every keepsake →</span>
        </button>

        <section className="rail-card rhythm-card">
          <div className="section-title-row compact">
            <div><p className="eyebrow">Account progress</p><h3>{syncState === "saved" ? "Safely remembered" : syncState === "saving" ? "Saving your work…" : syncState === "preview" ? "Preview session" : "Connecting…"}</h3></div>
            <span className={`sync-orb ${syncState}`}>{syncState === "saved" ? "✓" : "•"}</span>
          </div>
          <div className="week-dots">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <div key={`${day}-${index}`}><span className={index < Math.min(learner.streak, 6) ? "done" : "today"}>{index < Math.min(learner.streak, 6) ? "✓" : "•"}</span><small>{day}</small></div>
            ))}
          </div>
          <button className="small-button secondary full" onClick={() => setShowParent(true)}>Open Parent Space</button>
        </section>
      </aside>
    </div>
  );

  const renderLetters = () => {
    const letter = letters[activeLetter];
    return (
      <div className="page-stack">
        {pageHeader("Sound by sound", "Letter Garden", "Explore all 28 letters through sound, position, vocabulary, and handwriting.", "أ ب ت")}
        <section className="letter-explorer panel">
          <div className="letter-stage">
            <span className="floating-speck one">✦</span><span className="floating-speck two">•</span>
            <button className="letter-orb arabic" onClick={() => speak(letter[0])}>{letter[0]}</button>
            <div><span className="soft-pill">Shape & sound</span><p>Tap the letter to hear it clearly.</p><button className="small-button secondary" onClick={() => { recordProgress(`letter-${letter[0]}`, "letters", 100); goTo("copybook"); setCopyTargetIndex(Math.min(activeLetter, 3)); }}>Practise writing →</button></div>
          </div>
          <div className="letter-word-card">
            <span className="word-emoji">{letter[3]}</span>
            <div><p className="eyebrow">It lives in this word</p><h2 className="arabic" dir="rtl">{letter[1]}</h2><p>{letter[2]}</p><div className="letter-forms arabic" dir="rtl"><span>{letter[0]}</span><span>ـ{letter[0]}ـ</span><span>ـ{letter[0]}</span></div></div>
            <button className="round-button" onClick={() => speak(letter[1])}>♪</button>
          </div>
        </section>
        <section className="panel alphabet-panel">
          <div className="section-title-row"><div><p className="eyebrow">Complete alphabet</p><h2>28 letters · 84 positional forms</h2></div><span className="legend"><i /> practised <i /> new</span></div>
          <div className="alphabet-grid" dir="rtl">
            {letters.map((item, index) => (
              <button key={item[0]} className={`${index === activeLetter ? "active" : ""} ${completedIds.has(`letter-${item[0]}`) ? "learned" : ""}`} onClick={() => { setActiveLetter(index); speak(item[0]); recordProgress(`letter-${item[0]}`, "letters", 90); }}>
                <strong className="arabic">{item[0]}</strong><small>{completedIds.has(`letter-${item[0]}`) ? "Practised" : "Explore"}</small>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  };

  const renderWords = () => (
    <div className="page-stack">
      {pageHeader("Meaning you can touch", "Word Workshop", `${words.filter((item) => item.level <= activeLevel).length} useful words are open at this level, grouped by real-life themes.`, "كَلِمَات")}
      <section className="panel word-shelf">
        <div className="section-title-row word-filter-row">
          <div><p className="eyebrow">Vocabulary library</p><h2>Look, listen, remember</h2></div>
          <div className="category-tabs">{wordCategories.map((category) => <button key={category} className={wordCategory === category ? "active" : ""} onClick={() => setWordCategory(category)}>{category}</button>)}</div>
        </div>
        {activeWord && (
          <div className="word-focus-strip">
            <span>{activeWord.icon}</span>
            <div><small>{activeWord.category} · Level {activeWord.level}</small><strong className="arabic" dir="rtl">{activeWord.arabic}</strong><em>{activeWord.english}</em></div>
            <button className="round-button" onClick={() => { speak(activeWord.arabic); recordProgress(`word-${activeWord.id}`, "words", 90); }}>♪</button>
          </div>
        )}
        <div className="word-card-grid expanded-words">
          {visibleWords.map((word) => (
            <button key={word.id} className={`word-card ${word.color} ${word.id === activeWord?.id ? "active" : ""}`} onClick={() => { setActiveWordId(word.id); speak(word.arabic); }}>
              <span>{word.icon}</span><strong className="arabic" dir="rtl">{word.arabic}</strong><small>{word.english}</small><i>{completedIds.has(`word-${word.id}`) ? "✓" : "♪"}</i>
            </button>
          ))}
        </div>
      </section>
      <section className="panel builder-panel">
        <div className="builder-copy"><p className="eyebrow">Level {activeLevel} word maker</p><h2>Build “{wordChallenge.english}”</h2><p>Choose the letters in Arabic reading order. Tap a placed letter to remove it.</p><div className="letter-bank" dir="rtl">{wordChallenge.letters.map((letter, index) => <button key={`${letter}-${index}`} className="chip arabic" onClick={() => { setBuiltLetters((items) => [...items, letter]); setWordResult("idle"); }}>{letter}</button>)}</div></div>
        <div className={`build-zone ${wordResult}`}><span className="build-icon">✦</span><div className="answer-slots arabic" dir="rtl">{builtLetters.length ? builtLetters.map((letter, index) => <button key={`${letter}-${index}`} onClick={() => setBuiltLetters((items) => items.filter((_, i) => i !== index))}>{letter}</button>) : "ــ  ــ  ــ"}</div><strong className="challenge-target arabic" dir="rtl">{wordChallenge.display}</strong><div className="builder-actions"><button className="text-button" onClick={() => { setBuiltLetters([]); setWordResult("idle"); }}>Start again</button><button className="small-button" onClick={async () => { const right = builtWord === wordChallenge.word; setWordResult(right ? "right" : "try"); if (right) { speak(wordChallenge.display); await recordProgress(`word-build-${activeLevel}`, "words", 100); } }}>{wordResult === "right" ? "Wonderful ✓" : "Check my word"}</button></div>{wordResult === "try" && <p className="try-message">Look closely at the model, then move one letter at a time.</p>}</div>
      </section>
    </div>
  );

  const renderSentences = () => (
    <div className="page-stack">
      {pageHeader("A real sentence engine", "Sentence Studio", `${levelSentences.length} guided challenges at this level, with hints, grammar feedback, audio, and ${authenticated ? "saved mastery" : "session progress"}.`, "جُمْلَة")}
      <section className="sentence-course-strip panel">
        <div><p className="eyebrow">Level {activeLevel} set</p><h2>{activeLevelInfo.focus[0]} in context</h2></div>
        <div className="sentence-dots">{levelSentences.map((item, index) => <button key={item.id} className={`${index === sentenceIndex % levelSentences.length ? "active" : ""} ${completedIds.has(item.id) ? "complete" : ""}`} onClick={() => { setSentenceIndex(index); setSentenceWords([]); setSentenceResult("idle"); }}>{completedIds.has(item.id) ? "✓" : index + 1}</button>)}</div>
        <strong>{completedIds.has(sentence.id) ? "Mastered" : `${sentenceIndex + 1} / ${levelSentences.length}`}</strong>
      </section>
      <section className="panel sentence-workspace advanced-sentence">
        <div className="sentence-prompt"><span className="scene-emoji">💬</span><div><p className="eyebrow">Build this thought</p><h2>{sentence.prompt}</h2><p>Tap or drag the Arabic words into the sentence line.</p></div><button className="round-button" onClick={() => speak(sentence.spoken)}>♪</button></div>
        <div className={`sentence-line ${sentenceResult}`} dir="rtl" onDragOver={(event) => event.preventDefault()} onDrop={(event: DragEvent<HTMLDivElement>) => addSentenceWord(event.dataTransfer.getData("text/plain"))}>
          {sentenceWords.length ? sentenceWords.map((word, index) => <button key={`${word}-${index}`} className="sentence-piece arabic" onClick={() => setSentenceWords((items) => items.filter((_, i) => i !== index))}>{word}</button>) : <span>اسحب الكلمات إلى هنا · Drop words here</span>}
        </div>
        <div className="sentence-bank" dir="rtl">{sentence.bank.map((word, index) => { const total = sentence.bank.filter((item) => item === word).length; const used = sentenceWords.filter((item) => item === word).length; const disabled = used >= total; return <button key={`${word}-${index}`} className="chip arabic" disabled={disabled} draggable={!disabled} onDragStart={(event) => event.dataTransfer.setData("text/plain", word)} onClick={() => addSentenceWord(word)}>{word}</button>; })}</div>
        <div className="sentence-tools"><button className="hint-button" onClick={() => setShowHint((value) => !value)}>☼ {showHint ? "Hide hint" : "Gentle hint"}</button>{showHint && <p>{sentence.hint}</p>}</div>
        <div className="sentence-footer">
          <div className="feedback-copy">{sentenceResult === "right" ? <><strong className="success-message">Beautifully built!</strong><p>{sentence.explanation}</p></> : sentenceResult === "try" ? <><strong className="try-message">Almost there.</strong><p>{sentence.hint}</p></> : <p className="helper-message">Arabic begins on the right. You can remove any placed word by tapping it.</p>}</div>
          <div><button className="text-button" onClick={() => { setSentenceWords([]); setSentenceResult("idle"); }}>Clear</button>{sentenceResult === "right" ? <button className="primary-button" onClick={nextSentence}>Next sentence →</button> : <button className="primary-button" onClick={checkSentence}>Check sentence</button>}</div>
        </div>
      </section>
      <section className="grammar-lens panel"><span>◎</span><div><p className="eyebrow">Grammar lens</p><h3>{sentence.explanation}</h3><p>Grammar appears only when it helps the learner understand a pattern—never as a wall of rules.</p></div><button className="small-button secondary" onClick={() => speak(sentence.spoken)}>Hear naturally</button></section>
    </div>
  );

  const renderStories = () => (
    <div className="page-stack">
      {pageHeader("Listen, read, understand", "Story Library", `${stories.length} levelled stories plus anything you add in Content Studio, each with vocabulary, narration, and comprehension.`, "حِكَايَات")}
      <section className="story-library-summary panel">
        <div><span className="story-stack-mark">◐</span><div><p className="eyebrow">A growing Arabic bookshelf</p><h2>{stories.length} stories across six reading worlds</h2><p>Level {activeLevel} currently opens {levelStories.length} stories for {learner.name}.</p></div></div>
        <div className="story-level-shelves">{levels.map((level) => { const count = stories.filter((item) => item.level === level.id).length; return <button key={level.id} className={`${level.color} ${activeLevel === level.id ? "active" : ""}`} onClick={() => selectLevel(level.id)}><span>{level.id}</span><strong>{count} stories</strong><small>{level.cefr}</small></button>; })}</div>
      </section>
      <section className="story-reader panel expanded-reader">
        <div className="story-cover"><Image src="/kalemati-world.png" alt="The paper-and-clay word portals of Kalimati" fill sizes="(max-width: 720px) 100vw, 44vw" /><span className="story-number">Level {activeLevel} · {story.minutes} min</span></div>
        <div className="story-content"><p className="eyebrow">Story {storyIndex + 1} of {levelStories.length}</p><h2>{story.title}</h2><h3 className="arabic" dir="rtl">{story.arabicTitle}</h3><p className="arabic story-text" dir="rtl">{story.text}</p><div className="vocabulary-row">{story.words.map((word) => <span key={word}>{word}</span>)}</div><div className="reader-actions"><button className="primary-button" onClick={() => speak(story.text)}>▶ Listen in Arabic</button><button className="small-button secondary" onClick={() => recordProgress(story.id, "stories", 90)}>Mark as read ✓</button></div></div>
      </section>
      <section className="story-comprehension panel"><div><p className="eyebrow">Meaning check</p><h2>{story.question}</h2></div><div className="answer-options">{story.options.map((option) => <button key={option} className={`${storyAnswer === option ? "selected" : ""} ${storyAnswer && option === story.answer ? "correct" : ""}`} onClick={async () => { setStoryAnswer(option); if (option === story.answer) await recordProgress(`${story.id}-question`, "stories", 100); }}>{option}</button>)}</div><p>{storyAnswer ? storyAnswer === story.answer ? "Yes — you understood the heart of the story. ✦" : "Listen once more and look for the key detail." : "Choose the best answer after listening or reading."}</p></section>
      <section className="story-list expanded-story-list">{levelStories.map((item, index) => <button key={item.id} className={`story-list-card ${index === storyIndex ? "active" : ""}`} onClick={() => { setStoryIndex(index); setStoryAnswer(""); }}><span>{item.icon}</span><div><strong>{item.title}</strong><small className="arabic" dir="rtl">{item.arabicTitle}</small></div><i>{completedIds.has(item.id) ? "Read ✓" : `${item.minutes} min`}</i></button>)}</section>
    </div>
  );

  const renderHomework = () => (
    <div className="page-stack">
      {pageHeader("A little, often", "Homework Nest", authenticated ? "A balanced weekly plan generated from the learner's current level and saved to their account." : "A balanced weekly plan for this session. Sign in to keep completed tasks across devices.", "وَاجِبَاتِي")}
      <section className="homework-summary panel"><div className="nest-graphic"><span>◌</span><span>◌</span><span>✦</span></div><div><p className="eyebrow">This week · Level {activeLevel}</p><h2>{completedHomework} of {weeklyTasks.length} meaningful tasks complete</h2><p>About {weeklyTasks.reduce((total, task) => total + task.minutes, 0)} calm minutes altogether</p></div><div className="ring-progress" style={{ "--percent": `${(completedHomework / weeklyTasks.length) * 100}%` } as CSSProperties}><strong>{Math.round((completedHomework / weeklyTasks.length) * 100)}%</strong></div></section>
      <section className="homework-list panel">{weeklyTasks.map((task) => <button key={task.id} className={completedIds.has(task.id) ? "complete" : ""} onClick={async () => { if (!completedIds.has(task.id)) await recordProgress(task.id, "homework", 100); else goTo(task.view); }}><span className="task-check">{completedIds.has(task.id) ? "✓" : ""}</span><span className="task-icon">{task.icon}</span><span><strong>{task.title}</strong><small>{task.detail}</small></span><em>{completedIds.has(task.id) ? "Open again" : `${task.minutes} min`}</em></button>)}</section>
      <p className="parent-tip"><span>☼</span><strong>Grown-up tip</strong> Praise effort and curiosity. A warm “I noticed how carefully you listened” builds more confidence than correcting every sound.</p>
    </div>
  );

  const renderCopybook = () => {
    const target = copyTargets[copyTargetIndex];
    return (
      <div className="page-stack">
        {pageHeader("Slow hands, strong memory", "My Copybook", "Move from single letters to connected words and short sentences, using a finger, mouse, or pen.", "نَسْخ")}
        <section className="copy-target-strip panel"><div><p className="eyebrow">Choose a practice card</p><h2>Letters → words → sentences</h2></div><div>{copyTargets.map((item, index) => <button key={item.value} className={`arabic ${copyTargetIndex === index ? "active" : ""}`} onClick={() => { setCopyTargetIndex(index); clearTrace(); }}>{item.value}</button>)}</div></section>
        <section className="copy-panel panel">
          <div className="copy-toolbar"><div><p className="eyebrow">Guided practice · {target.label}</p><h2 className="arabic" dir="rtl">{target.guide}</h2></div><div><button className="round-button" onClick={() => speak(target.value)}>♪</button><button className="small-button secondary" onClick={clearTrace}>Clear page</button><button className="small-button" onClick={() => recordProgress(`copy-${copyTargetIndex}`, "copybook", 100)}>Save practice ✓</button></div></div>
          <div className="trace-board"><div className={`trace-letter arabic ${target.value.length > 3 ? "trace-word" : ""}`}>{target.value}</div><canvas ref={traceCanvasRef} width={960} height={360} aria-label={`Drawing area for tracing ${target.label}`} onPointerDown={beginTrace} onPointerMove={moveTrace} onPointerUp={() => { tracing.current = false; }} onPointerCancel={() => { tracing.current = false; }} onPointerLeave={() => { tracing.current = false; }} /></div>
          <div className="copy-cues"><span><i>1</i> Start at the coral dot</span><span><i>2</i> Follow the pale guide</span><span><i>3</i> Repeat without the guide</span></div>
        </section>
      </div>
    );
  };

  const renderColoring = () => {
    const scene = coloringScenes.find((item) => item.id === selectedSceneId)!;
    const sceneStrokes = coloringBook[selectedSceneId] ?? [];
    return (
      <div className="page-stack">
        {pageHeader("Create, speak, remember", "Color Studio", "Eight original line-art worlds with real brushes, eraser, undo, account saving, downloads, and Arabic audio.", "لَوِّنْ")}
        <section className="color-library panel"><div><p className="eyebrow">My coloring book</p><h2>{coloringScenes.length} scenes across the learning journey</h2></div><div className="scene-tabs">{coloringScenes.map((item) => <button key={item.id} className={`${selectedSceneId === item.id ? "active" : ""} ${coloringBook[item.id]?.length ? "painted" : ""}`} onClick={() => { setSelectedSceneId(item.id); setArtMessage(""); }}><span>{item.icon}</span><strong>{item.title}</strong><small className="arabic">{item.arabic}</small><i>Level {item.level}</i></button>)}</div></section>
        <section className="advanced-coloring panel">
          <div className="art-toolbar">
            <div className="tool-section"><p className="eyebrow">Colors</p><div className="swatches horizontal">{palette.map((shade) => <button key={shade} aria-label={`Choose ${shade}`} className={brushColor === shade && !eraserOn ? "active" : ""} style={{ background: shade }} onClick={() => { setBrushColor(shade); setEraserOn(false); }} />)}</div></div>
            <div className="tool-section"><p className="eyebrow">Brush</p><div className="brush-sizes">{[12, 24, 42].map((size) => <button key={size} aria-label={`Use ${size} pixel brush`} aria-pressed={brushSize === size && !eraserOn} className={brushSize === size ? "active" : ""} onClick={() => { setBrushSize(size); setEraserOn(false); }}><i style={{ width: size / 2, height: size / 2 }} /></button>)}</div></div>
            <div className="tool-actions"><button className={eraserOn ? "active" : ""} onClick={() => setEraserOn((value) => !value)}>⌫ Eraser</button><button disabled={!sceneStrokes.length} onClick={undoPaint}>↶ Undo</button><button disabled={!sceneStrokes.length} onClick={() => setColoringBook((book) => ({ ...book, [selectedSceneId]: [] }))}>Clear</button></div>
          </div>
          <div className="artboard-wrap"><canvas ref={colorCanvasRef} width={1000} height={650} aria-label={`Coloring page: ${scene.title}`} onPointerDown={beginPaint} onPointerMove={movePaint} onPointerUp={() => { painting.current = false; }} onPointerCancel={() => { painting.current = false; }} onPointerLeave={() => { painting.current = false; }} /><button className="art-word-card" onClick={() => speak(scene.arabic)}><strong className="arabic" dir="rtl">{scene.arabic}</strong><span>{scene.word} · tap to hear ♪</span></button></div>
          <div className="art-footer"><p>{artMessage || `${sceneStrokes.length} brush strokes · creativity has no wrong answer.`}</p><div><button className="small-button secondary" onClick={downloadArtwork}>Download picture</button><button className="primary-button" onClick={saveArtwork}>Save to my gallery</button></div></div>
        </section>
      </div>
    );
  };

  const renderGames = () => (
    <div className="page-stack">
      {pageHeader("Play is practice in disguise", "Game Meadow", "Twelve adaptive rounds covering sound, meaning, grammar, and comprehension across six levels.", "أَلْعَاب")}
      <section className="game-progress panel"><div><p className="eyebrow">Level {activeLevel} challenge path</p><h2>{levelGames.length} rounds ready</h2></div><div>{levelGames.map((item, index) => <button key={item.id} className={`${index === gameIndex ? "active" : ""} ${completedIds.has(item.id) ? "complete" : ""}`} onClick={() => { setGameIndex(index); setGameResult("idle"); }}>{completedIds.has(item.id) ? "✓" : index + 1}</button>)}</div></section>
      <section className="game-feature panel">
        <div className="game-intro"><span className="game-badge">Round {gameIndex + 1} of {levelGames.length}</span><h2>{game.prompt}</h2><strong className="arabic target-word" dir="rtl">{game.arabic}</strong><button className="round-button" onClick={() => speak(game.spoken)}>♪</button></div>
        <div className="game-options">{game.options.map((option) => <button key={option.label} onClick={async () => { const right = option.label === game.answer; setGameResult(right ? "right" : "try"); if (right) { speak(game.spoken); await recordProgress(game.id, "games", 100); } }}><span className={option.display.length > 2 ? "arabic game-text-option" : ""}>{option.display}</span><small>{option.label}</small></button>)}</div>
        <div className={`game-feedback ${gameResult}`} aria-live="polite">{gameResult === "right" ? <><span>✦ Excellent — this pattern is {authenticated ? "now saved" : "complete for this session"}.</span><button onClick={() => { setGameIndex((index) => (index + 1) % levelGames.length); setGameResult("idle"); }}>Next round →</button></> : gameResult === "try" ? "A thoughtful try. Listen once more, then compare the choices." : "Choose the answer that fits best."}</div>
      </section>
      <section className="mini-game-grid">{[["Sound Safari", "Hear, compare, and identify Arabic sounds", "◉", "letters", "mint"], ["Word Constellations", "Connect words by theme and meaning", "✦", "words", "sun"], ["Sentence Steps", "Build increasingly rich Arabic sentences", "≋", "sentences", "lavender"], ["Story Detective", "Find clues inside narrated stories", "◐", "stories", "coral"], ["Speed Copy", "Strengthen letter memory through movement", "✎", "copybook", "sky"], ["Creative Color", "Learn vocabulary while making art", "✿", "coloring", "rose"]].map((item) => <button key={item[0]} className={`mini-game ${item[4]}`} onClick={() => goTo(item[3] as ViewId)}><span>{item[2]}</span><div><h3>{item[0]}</h3><p>{item[1]}</p><small>Open activity →</small></div></button>)}</section>
    </div>
  );

  const renderTests = () => {
    const selectedAnswer = testAnswers[testQuestion.id];
    return (
      <div className="page-stack">
        {pageHeader("Understand what has grown", "Test Centre", authenticated ? "A four-part checkpoint for the current level. Results are saved without timers, pressure, or penalties." : "A four-part checkpoint for the current level. Sign in to keep results across devices.", "اِخْتِبَار")}
        <section className="assessment-overview panel">
          <div><p className="eyebrow">Level {activeLevel} checkpoint</p><h2>Four skills · one gentle picture</h2><p>Each question checks a different part of the learning journey.</p></div>
          <div className="assessment-skill-cards">
            {["Sounds", "Vocabulary", "Sentences", "Reading"].map((skill, index) => {
              const questions = levelTests.filter((item) => item.skill === skill);
              const correct = questions.filter((item) => testAnswers[item.id] === item.answer).length;
              return <div key={skill} className={testFinished && correct === questions.length ? "complete" : ""}><span>{["♪", "ك", "≋", "◐"][index]}</span><strong>{skill}</strong><small>{testFinished ? `${correct}/${questions.length}` : `${questions.length} question${questions.length === 1 ? "" : "s"}`}</small></div>;
            })}
          </div>
        </section>

        {!testFinished ? <>
          <section className="assessment-progress panel">
            <div><span style={{ width: `${((testIndex + 1) / levelTests.length) * 100}%` }} /></div>
            <strong>Question {testIndex + 1} of {levelTests.length}</strong>
            <em>{testQuestion.skill}</em>
          </section>
          <section className="test-stage panel">
            <div className="test-stage-heading"><span className="test-glyph">{testQuestion.skill === "Sounds" ? "♪" : testQuestion.skill === "Vocabulary" ? "✦" : testQuestion.skill === "Sentences" ? "≋" : "◐"}</span><div><p className="eyebrow">{testQuestion.skill} gate</p><h2>{testQuestion.prompt}</h2></div>{testQuestion.spoken && <button className="round-button" onClick={() => speak(testQuestion.spoken!)} aria-label="Listen to the Arabic prompt">♪</button>}</div>
            <div className="test-arabic arabic" dir="rtl">{testQuestion.arabic}</div>
            <div className="assessment-options">{testQuestion.options.map((option) => <button key={option.label} className={selectedAnswer === option.label ? "selected" : ""} onClick={() => setTestAnswers((answers) => ({ ...answers, [testQuestion.id]: option.label }))}><span className="arabic">{option.display}</span><small>{option.label !== option.display ? option.label : "Choose this answer"}</small><i>{selectedAnswer === option.label ? "✓" : ""}</i></button>)}</div>
            <div className="test-stage-footer"><p>{selectedAnswer ? "Answer held. You can change it before moving on." : "Take your time. Nothing is timed here."}</p><button className="primary-button" disabled={!selectedAnswer} onClick={advanceLevelTest}>{testIndex === levelTests.length - 1 ? "Finish checkpoint" : "Next question →"}</button></div>
          </section>
        </> : <>
          <section className={`test-result panel ${testScore >= 75 ? "strong" : "growing"}`}>
            <div className="result-orbit" style={{ "--score": `${testScore}%` } as CSSProperties}><strong>{testScore}%</strong><span>checkpoint</span></div>
            <div><p className="eyebrow">Level {activeLevel} result {authenticated ? "saved" : "ready"}</p><h2>{testScore >= 75 ? "This pathway feels well matched." : "A little more practice will make this level feel lighter."}</h2><p>{testCorrect} of {levelTests.length} answers were correct. The result is a guide, never a label.</p><div className="result-actions"><button className="small-button secondary" onClick={restartLevelTest}>Try again</button><button className="primary-button" onClick={() => goTo(testScore >= 75 ? "dictation" : activeLevel <= 2 ? "words" : "sentences")}>{testScore >= 75 ? "Continue to dictation →" : "Practise this level →"}</button></div></div>
          </section>
          <section className="answer-review panel"><div><p className="eyebrow">Answer map</p><h2>See the pattern, not just the score</h2></div>{levelTests.map((question, index) => { const right = testAnswers[question.id] === question.answer; return <div key={question.id} className={right ? "right" : "try"}><span>{right ? "✓" : index + 1}</span><div><strong>{question.skill}</strong><p>{question.insight}</p></div><em>{right ? "Mastered" : "Review"}</em></div>; })}</section>
        </>}
      </div>
    );
  };

  const renderDictation = () => (
    <div className="page-stack">
      {pageHeader("Listen · hold · write", "Dictation Lab", "A focused Arabic listening space that accepts answers with or without vowel marks and saves every mastered card.", "إِمْلَاء")}
      <section className="dictation-path panel">
        <div><p className="eyebrow">Level {activeLevel} sound path</p><h2>{completedDictations} of {levelDictations.length} cards mastered</h2></div>
        <div>{levelDictations.map((item, index) => <button key={item.id} className={`${index === dictationIndex ? "active" : ""} ${completedIds.has(item.id) ? "complete" : ""}`} onClick={() => { setDictationIndex(index); setDictationInput(""); setDictationResult("idle"); setShowDictationHint(false); }}><span>{completedIds.has(item.id) ? "✓" : index + 1}</span><strong>{item.kind}</strong><small>{item.meaning}</small></button>)}</div>
      </section>
      <section className={`dictation-stage panel ${dictationResult}`}>
        <div className="sound-portal"><button onClick={() => speak(dictation.text)} aria-label="Play the dictation"><span>♪</span><i /><i /><i /></button><p>Tap to listen in Arabic</p><small>Listen as many times as you need</small></div>
        <form onSubmit={(event) => { event.preventDefault(); void checkDictation(); }}>
          <p className="eyebrow">{dictation.kind} · {dictation.meaning}</p>
          <h2>Write exactly what you hear.</h2>
          <label><span>Arabic answer</span><textarea className="arabic" dir="rtl" value={dictationInput} onChange={(event) => { setDictationInput(event.target.value); setDictationResult("idle"); }} placeholder="اكتب ما تسمع هنا" aria-label="Write the Arabic dictation answer" /></label>
          <div className="dictation-tools"><button type="button" className="hint-button" onClick={() => setShowDictationHint((value) => !value)}>☼ {showDictationHint ? "Hide clue" : "Gentle clue"}</button><span>Vowel marks are optional.</span></div>
          {showDictationHint && <p className="dictation-hint">{dictation.hint}</p>}
          {dictationResult === "right" && <div className="dictation-feedback right"><span>✓</span><div><strong>Beautiful listening.</strong><p className="arabic" dir="rtl">{dictation.text}</p></div></div>}
          {dictationResult === "try" && <div className="dictation-feedback try"><span>↻</span><div><strong>Very close. Listen once more.</strong><p>Compare the sounds slowly, then change only what you notice.</p></div></div>}
          <div className="dictation-footer"><button type="button" className="text-button" onClick={() => speak(dictation.text)}>Play slowly again ♪</button>{dictationResult === "right" ? <button type="button" className="primary-button" onClick={nextDictation}>Next sound card →</button> : <button className="primary-button" disabled={!dictationInput.trim()}>Check my writing</button>}</div>
        </form>
      </section>
      <section className="dictation-method panel"><div><span>1</span><strong>Listen</strong><p>Hear the whole word or sentence without writing.</p></div><div><span>2</span><strong>Hold</strong><p>Say it quietly and notice its rhythm.</p></div><div><span>3</span><strong>Write</strong><p>Write, check, and listen again with curiosity.</p></div></section>
    </div>
  );

  const renderPlacement = () => {
    const question = placementQuestions[placementIndex];
    if (!placementStarted) {
      return <div className="page-stack">
        {pageHeader("Find the right beginning", "Level Compass", "A short adaptive journey across sounds, vocabulary, sentences, and reading. It recommends a starting point without locking any content.", "مُسْتَوَايَ")}
        <section className="placement-welcome panel"><div className="compass-art"><span>ك</span><i /><i /><i /><i /><b>◎</b></div><div><span className="soft-pill">12 questions · about 6 minutes</span><h2>Let Arabic show us where to begin.</h2><p>The questions grow gradually from first sounds to rich reading. It is completely fine not to know an answer—the compass becomes more accurate when the learner answers honestly.</p><ul><li>No timer and no negative score</li><li>Audio can be replayed</li><li>All six pathways remain open</li><li>The recommendation can be changed by a parent</li></ul><button className="primary-button" onClick={restartPlacement}>Start my level check →</button></div></section>
        <section className="placement-levels">{levels.map((level) => <div key={level.id} className={level.color}><span>{level.id}</span><strong>{level.name}</strong><small>{level.cefr}</small><p>{level.focus.slice(0, 2).join(" · ")}</p></div>)}</section>
      </div>;
    }

    if (placementResult) {
      const recommended = levels[placementResult.level - 1];
      return <div className="page-stack">
        {pageHeader("Your learning starting point", "Compass Result", "A pathway recommendation based on the complete six-level check.", "مَسَارِي")}
        <section className={`placement-result panel ${recommended.color}`}><div className="placement-result-level"><span>{placementResult.level}</span><small>{recommended.cefr}</small></div><div><p className="eyebrow">Recommended starting pathway</p><h2>{recommended.name}</h2><h3 className="arabic" dir="rtl">{recommended.arabic}</h3><p>{recommended.promise}</p><div className="result-actions"><button className="small-button secondary" onClick={restartPlacement}>Take it again</button><button className="primary-button" onClick={async () => { await selectLevel(placementResult.level); goTo("home"); }}>Use this pathway →</button></div></div><div className="placement-score"><strong>{placementResult.correct}/{placementQuestions.length}</strong><span>answers</span><em>{placementResult.score}%</em></div></section>
        <section className="placement-map panel"><div><p className="eyebrow">Your answer trail</p><h2>How the recommendation was shaped</h2></div><div>{levels.map((level) => { const questions = placementQuestions.filter((item) => item.level === level.id); const right = questions.filter((item) => placementAnswers[item.id] === item.answer).length; return <div key={level.id} className={`${level.color} ${level.id === placementResult.level ? "recommended" : ""}`}><span>{level.id}</span><strong>{level.name}</strong><div>{questions.map((item) => <i key={item.id} className={placementAnswers[item.id] === item.answer ? "right" : "try"} />)}</div><small>{right}/2</small></div>; })}</div><p>The compass recommends the first pathway that offers both confidence and meaningful challenge.</p></section>
      </div>;
    }

    return <div className="page-stack">
      {pageHeader("Question by question", "Level Compass", "Answer what you know and make your best guess when something feels new.", "مُسْتَوَايَ")}
      <section className="placement-progress panel"><div><span style={{ width: `${((placementIndex + 1) / placementQuestions.length) * 100}%` }} /></div><strong>{placementIndex + 1} / {placementQuestions.length}</strong><em>Exploring Level {question.level} · {levels[question.level - 1].cefr}</em></section>
      <section className="placement-question panel"><div className="placement-question-top"><span>Level {question.level}</span><button className="text-button" onClick={restartPlacement}>Start again</button></div><div className="placement-prompt"><p className="eyebrow">{question.skill}</p><h2>{question.prompt}</h2><strong className="arabic" dir="rtl">{question.arabic}</strong>{question.spoken && <button className="round-button" onClick={() => speak(question.spoken!)} aria-label="Listen to the Arabic question">♪</button>}</div><div className="assessment-options placement-options">{question.options.map((option) => <button key={option.label} onClick={() => void answerPlacement(option.label)}><span className="arabic">{option.display}</span><small>{option.label !== option.display ? option.label : "Choose this answer"}</small><i>→</i></button>)}</div><p className="placement-reassurance">There is no “bad” result. Every answer helps choose a kinder starting point.</p></section>
    </div>;
  };

  const renderTeacher = () => (
    <div className="page-stack">
      {pageHeader("Human guidance, exactly when useful", "Meet a Teacher", "Request a focused live lesson, choose the learning goal, and keep the request in the parent account.", "مُعَلِّمَتِي")}
      <section className="teacher-layout">
        <div className="teacher-card panel"><div className="teacher-avatar" /><div className="teacher-live">Available this week</div><div className="teacher-info"><p className="eyebrow">Recommended for Level {activeLevel}</p><h2>Ms. Noor</h2><p className="arabic" dir="rtl">الْمُعَلِّمَةُ نُور</p><p>Children&apos;s Arabic specialist · 8 years teaching · English & Arabic</p><div className="teacher-tags"><span>Patient pace</span><span>Story-led</span><span>Beginner to B2</span></div><blockquote>“We will build from what your learner already knows and turn it into confident communication.”</blockquote></div></div>
        <div className="booking-card panel">
          <p className="eyebrow">25-minute live lesson request</p>
          <h2>Choose a focus and time</h2>
          <label className="focus-select">
            <span>Lesson focus</span>
            <select value={lessonFocus} onChange={(event) => setLessonFocus(event.target.value)}>
              <option>Conversation confidence</option>
              <option>Letter pronunciation</option>
              <option>Sentence building</option>
              <option>Reading comprehension</option>
              <option>Writing feedback</option>
            </select>
          </label>
          <div className="date-strip" aria-label="Available lesson days">
            {lessonDays.length ? lessonDays.map((day) => (
              <button
                key={day.key}
                className={teacherDay === day.key ? "active" : ""}
                aria-pressed={teacherDay === day.key}
                aria-label={day.label}
                onClick={() => {
                  setTeacherDay(day.key);
                  setTeacherSlot("");
                  setBookingConfirmed(false);
                }}
              >
                <small>{day.weekday}</small>
                <strong>{day.day}</strong>
              </button>
            )) : <span className="schedule-loading">Preparing available days…</span>}
          </div>
          <div className="time-slots">{["3:30 PM", "4:15 PM", "5:00 PM", "5:45 PM"].map((slot) => <button key={slot} className={teacherSlot === slot ? "active" : ""} aria-pressed={teacherSlot === slot} onClick={() => { setTeacherSlot(slot); setBookingConfirmed(false); }}>{slot}</button>)}</div>
          <button className="primary-button full" disabled={!teacherSlot || !selectedLessonDay} onClick={() => void requestTeacherLesson()} aria-live="polite">
            {bookingConfirmed ? "Lesson request saved ✓" : isGitHubPagesBuild && teacherSlot ? `Open full app to request ${teacherSlot}` : !authenticated && teacherSlot ? `Sign in to request ${teacherSlot}` : teacherSlot ? `Request ${teacherSlot}` : "Choose a time first"}
          </button>
          <p className="booking-note">{authenticated ? "A parent reviews the request before confirmation. No payment is taken in this prototype." : isGitHubPagesBuild ? "Teacher requests and cloud accounts are available in the full Kalimati app." : "Choose a time, then sign in so the request can be stored in the parent account."}</p>
        </div>
      </section>
      {bookings.length > 0 && <section className="panel booking-history"><div><p className="eyebrow">Saved requests</p><h2>Your lesson plan</h2></div>{bookings.slice(0, 3).map((booking, index) => <div key={`${booking.lessonSlot}-${index}`}><span>☏</span><strong>{booking.teacherName}</strong><p>{booking.lessonSlot} · {booking.focus}</p><em>{booking.status}</em></div>)}</section>}
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
    if (view === "tests") return renderTests();
    if (view === "dictation") return renderDictation();
    if (view === "placement") return renderPlacement();
    if (view === "teacher") return renderTeacher();
    return renderHome();
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => goTo("home")} aria-label="Kalimati home"><span className="brand-cube arabic">ك</span><span><strong>Kalimati</strong><small className="arabic" dir="rtl">كَلِماتي</small></span></button>
        <nav aria-label="Main navigation">{navGroups.map((group) => <div className="nav-group" key={group.label}><p>{group.label}</p>{group.items.map((item) => <button key={item.id} aria-label={item.label} title={item.label} className={view === item.id ? "active" : ""} onClick={() => goTo(item.id)}><span className={`nav-icon ${item.id === "letters" ? "arabic" : ""}`}>{item.icon}</span><em>{item.label}</em>{view === item.id && <i />}</button>)}</div>)}</nav>
        <div className="sidebar-footer"><span className="helper-dot">✦</span><div><strong>Level {activeLevel} · {activeLevelInfo.cefr}</strong><button onClick={() => setShowParent(true)}>Parent controls →</button></div></div>
      </aside>

      <main ref={mainRef}>
        <header className="topbar expanded-topbar">
          <div><span className="today-dot" /><span>{view === "home" ? todayLabel : navGroups.flatMap((group) => group.items).find((item) => item.id === view)?.label}</span></div>
          <div className="top-actions">
            <label className="level-switcher"><span>Path</span><select value={activeLevel} onChange={(event) => selectLevel(Number(event.target.value))}>{levels.map((level) => <option key={level.id} value={level.id}>{level.id}. {level.name} ({level.cefr})</option>)}</select></label>
            <button
              className={`save-state ${syncState}`}
              onClick={() => { if (isGitHubPagesBuild || syncState === "preview" || syncState === "error") openAccount(); }}
              disabled={!isGitHubPagesBuild && (syncState === "saved" || syncState === "saving" || syncState === "loading")}
              aria-live="polite"
            >
              {isGitHubPagesBuild ? "✓ Saved on device" : syncState === "saved" ? "✓ Saved" : syncState === "saving" ? "Saving…" : syncState === "preview" ? "Sign in to save" : syncState === "error" ? "Save needs attention" : "Connecting…"}
            </button>
            <button className="streak-button" onClick={() => setShowAchievements(true)}><span>✦</span>{learner.streak} day streak</button>
            <button className="icon-button" onClick={() => setSoundOn((value) => !value)} aria-label={soundOn ? "Turn sound off" : "Turn sound on"}>{soundOn ? "♪" : "×"}</button>
            <button className="parent-button" onClick={() => setShowParent(true)}><span>♧</span> Parent Space</button>
            <button className="mini-avatar" onClick={() => setShowAchievements(true)}>{learner.name.slice(0, 1).toUpperCase()}</button>
          </div>
        </header>
        <div className="content">{renderView()}</div>
      </main>

      {showAchievements && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAchievements(false); }}>
          <section className="modal-card achievement-modal" role="dialog" aria-modal="true" aria-labelledby="achievement-title">
            <button ref={achievementCloseRef} className="modal-close" aria-label="Close achievements" onClick={() => setShowAchievements(false)}>×</button>
            <p className="eyebrow">{learner.name}&apos;s keepsake shelf</p>
            <h2 id="achievement-title">Every kind of growth deserves a place.</h2>
            <div className="badge-shelf">{[
              ["★", "First Portal", progress.length ? `${progress.length} activities` : "Begin here"],
              ["أ", "Letter Gardener", `${progress.filter((item) => item.track === "letters").length} letters`],
              ["≋", "Sentence Maker", `${progress.filter((item) => item.track === "sentences").length} sentences`],
              ["◐", "Story Thinker", `${progress.filter((item) => item.track === "stories").length} stories`],
              ["✎", "Careful Hand", `${progress.filter((item) => item.track === "copybook").length} pages`],
              ["✿", "Word Artist", `${Object.values(coloringBook).filter((item) => item.length).length} artworks`],
              ["◫", "Calm Checker", `${progress.filter((item) => item.track === "tests").length} checkpoints`],
              ["✐", "Sound Scribe", `${progress.filter((item) => item.track === "dictation").length} dictations`],
              ["◎", "Path Finder", trackScore("placement") ? `${trackScore("placement")}% result` : "Ready to begin"],
            ].map((badge, index) => <div className={index === 0 && progress.length < 2 ? "new" : ""} key={badge[1]}><span className={index === 1 ? "arabic" : ""}>{badge[0]}</span><strong>{badge[1]}</strong><small>{badge[2]}</small></div>)}</div>
            <button className="primary-button full" onClick={() => setShowAchievements(false)}>Keep exploring</button>
          </section>
        </div>
      )}

      {showParent && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowParent(false); }}>
          <section className="modal-card parent-modal expanded-parent-modal" role="dialog" aria-modal="true" aria-labelledby="parent-title">
            <button ref={parentCloseRef} className="modal-close" aria-label="Close Parent Space" onClick={() => setShowParent(false)}>×</button>
            <div className="parent-modal-header"><div><p className="eyebrow">Private grown-up view</p><h2 id="parent-title">A complete view of {learner.name}&apos;s Arabic journey.</h2><p>Progress, curriculum controls, account saving, and your own content library.</p></div><div className="parent-score"><strong>{Math.round(levelPercent)}%</strong><span>level path</span></div></div>
            <div className="parent-tabs"><button className={parentTab === "progress" ? "active" : ""} onClick={() => setParentTab("progress")}>Progress</button><button className={parentTab === "content" ? "active" : ""} onClick={() => setParentTab("content")}>Content Studio</button><button className={parentTab === "account" ? "active" : ""} onClick={() => setParentTab("account")}>Account</button></div>

            {parentTab === "progress" && <>
              <div className="parent-metrics"><div><span>{learner.xp} XP</span><small>Total learning growth</small><em>Level {activeLevel} · {activeLevelInfo.cefr}</em></div><div><span>{progress.length}</span><small>Activities remembered</small><em>{completedHomework}/5 homework tasks</em></div><div><span>{Object.values(coloringBook).filter((item) => item.length).length}</span><small>Saved artworks</small><em>{bookings.length} lesson requests</em></div><div><span>{progress.filter((item) => ["tests", "dictation", "placement"].includes(item.track)).length}</span><small>Assessment records</small><em>{completedDictations}/{levelDictations.length} dictations at this level</em></div></div>
              <div className="parent-detail-grid"><section><div className="section-title-row compact"><div><p className="eyebrow">Skill balance</p><h3>Where growth is strongest</h3></div></div><div className="skill-bars">{[["Letters", trackScore("letters")], ["Words", trackScore("words")], ["Sentences", trackScore("sentences")], ["Stories", trackScore("stories")], ["Tests", trackScore("tests")], ["Dictation", trackScore("dictation")]].map((item) => <div key={String(item[0])}><span>{item[0]}</span><div><i style={{ width: `${Number(item[1]) || 6}%` }} /></div><strong>{Number(item[1]) || 0}%</strong></div>)}</div></section><section className="teacher-note"><p className="eyebrow">Adaptive recommendation</p><blockquote>“Use the checkpoint and dictation results together: one shows understanding, while the other reveals listening and spelling confidence.”</blockquote><button className="text-button" onClick={() => { setShowParent(false); goTo("tests"); }}>Open the Test Centre →</button></section></div>
            </>}

            {parentTab === "content" && <div className="content-studio">
              <section><p className="eyebrow">Add to the curriculum</p><h3>Create a reusable learning item</h3><div className="content-form"><label><span>Type</span><select value={contentForm.type} onChange={(event) => setContentForm((item) => ({ ...item, type: event.target.value }))}><option value="story">Story</option><option value="sentence">Sentence</option><option value="game">Game</option><option value="coloring">Coloring prompt</option><option value="lesson">Lesson</option></select></label><label><span>Level</span><select value={contentForm.level} onChange={(event) => setContentForm((item) => ({ ...item, level: Number(event.target.value) }))}>{levels.map((level) => <option key={level.id} value={level.id}>{level.id}. {level.name}</option>)}</select></label><label className="wide"><span>English title or instruction</span><input value={contentForm.title} onChange={(event) => setContentForm((item) => ({ ...item, title: event.target.value }))} placeholder="A visit to the library" /></label><label className="wide"><span>Arabic content</span><textarea dir="rtl" className="arabic" value={contentForm.arabic} onChange={(event) => setContentForm((item) => ({ ...item, arabic: event.target.value }))} placeholder="اكتب المحتوى العربي هنا" /></label><label className="wide"><span>English support (optional)</span><input value={contentForm.english} onChange={(event) => setContentForm((item) => ({ ...item, english: event.target.value }))} placeholder="Translation, prompt, or vocabulary help" /></label><button className="primary-button" onClick={addCustomContent} disabled={!contentForm.title.trim() || !contentForm.arabic.trim()}>Add to Kalimati</button></div></section>
              <section className="content-library"><div><p className="eyebrow">Your additions</p><h3>{customContent.length} custom items</h3></div>{customContent.length ? customContent.map((item) => <div key={item.id}><span>{item.type.slice(0, 1).toUpperCase()}</span><strong>{item.title}</strong><small>Level {item.level} · {item.type}</small><p className="arabic" dir="rtl">{item.arabic}</p></div>) : <p className="empty-state">Your stories and sentence challenges will appear here and inside the learner&apos;s matching level.</p>}</section>
            </div>}

            {parentTab === "account" && <div className="account-panel"><section><p className="eyebrow">Learner profile</p><h3>Personalise the journey</h3><label><span>Learner name</span><input value={learnerNameDraft} onChange={(event) => setLearnerNameDraft(event.target.value)} /></label><label><span>Current pathway</span><select value={activeLevel} onChange={(event) => selectLevel(Number(event.target.value))}>{levels.map((level) => <option key={level.id} value={level.id}>Level {level.id} · {level.name}</option>)}</select></label><button className="primary-button" onClick={updateProfile}>{authenticated ? "Save profile" : isGitHubPagesBuild ? "Save on this device" : "Apply for this session"}</button></section><section className="account-identity"><span className="account-avatar">{owner.displayName.slice(0, 1).toUpperCase()}</span><p className="eyebrow">{authenticated ? "Signed-in grown-up" : isGitHubPagesBuild ? "GitHub Pages edition" : "Save across devices"}</p><h3>{authenticated ? owner.displayName : isGitHubPagesBuild ? "Saved in this browser" : "Keep every learning moment"}</h3><p>{owner.email || (isGitHubPagesBuild ? "Use the full app for cloud saving and teacher requests." : "A parent can sign in with ChatGPT.")}</p><div className={`account-save-status ${syncState}`}><i />{syncState === "saved" ? "Progress is stored securely across sessions." : isGitHubPagesBuild ? "Progress, artwork, and custom content stay on this device. Open the full app to use an account across devices." : syncState === "preview" ? "This preview lasts only until the page is closed. Sign in to keep progress, artwork, and lesson requests." : syncState === "error" ? "Saving needs attention. Sign in again or retry shortly." : "Connecting to your saved learning account."}</div>{authenticated ? <a href="/signout-with-chatgpt?return_to=/">Sign out of this account</a> : <a className="account-signin" href={isGitHubPagesBuild ? FULL_APP_URL : "/signin-with-chatgpt?return_to=/"} target={isGitHubPagesBuild ? "_blank" : undefined} rel={isGitHubPagesBuild ? "noreferrer" : undefined}>{isGitHubPagesBuild ? "Open the full Kalimati app →" : "Sign in with ChatGPT →"}</a>}</section></div>}
          </section>
        </div>
      )}
    </div>
  );
}
