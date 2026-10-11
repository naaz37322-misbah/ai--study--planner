import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Target,
  Clock,
  Calendar,
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCheck,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Brain,
  AlertCircle,
  Check,
  X,
  Play,
  Pause,
  Menu
} from 'lucide-react';

// ==========================================
// 1. DATE & TIME UTILITIES
// ==========================================
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDaysToDateString(dateStr, days) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function getDaysDifference(targetDateStr, baseDateStr = getTodayDateString()) {
  const [y1, m1, d1] = targetDateStr.split('-').map(Number);
  const [y2, m2, d2] = baseDateStr.split('-').map(Number);
  const target = new Date(y1, m1 - 1, d1);
  const base = new Date(y2, m2 - 1, d2);
  const diffTime = target.getTime() - base.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatFriendlyDate(dateStr) {
  if (!dateStr) return '';
  const diff = getDaysDifference(dateStr);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff > 1 && diff <= 6) return `In ${diff} days`;
  if (diff < 0) return `${Math.abs(diff)} days ago`;

  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}

function getDayOfWeekName(dayIndex) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayIndex % 7];
}

function getFullDayName(dayIndex) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex % 7];
}

// ==========================================
// 2. COLOR SCHEMES
// ==========================================
const SUBJECT_COLOR_SCHEMES = {
  indigo: { badgeText: 'text-indigo-300', accentBg: 'bg-indigo-600', dotColor: 'bg-indigo-400' },
  violet: { badgeText: 'text-violet-300', accentBg: 'bg-violet-600', dotColor: 'bg-violet-400' },
  blue: { badgeText: 'text-blue-300', accentBg: 'bg-blue-600', dotColor: 'bg-blue-400' },
  sky: { badgeText: 'text-sky-300', accentBg: 'bg-sky-600', dotColor: 'bg-sky-400' },
  purple: { badgeText: 'text-purple-300', accentBg: 'bg-purple-600', dotColor: 'bg-purple-400' },
  fuchsia: { badgeText: 'text-fuchsia-300', accentBg: 'bg-fuchsia-600', dotColor: 'bg-fuchsia-400' },
  emerald: { badgeText: 'text-emerald-300', accentBg: 'bg-emerald-600', dotColor: 'bg-emerald-400' },
};

function getColorScheme(color) {
  return SUBJECT_COLOR_SCHEMES[color] || SUBJECT_COLOR_SCHEMES.indigo;
}

const COLOR_OPTIONS = [
  { id: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { id: 'violet', label: 'Violet', class: 'bg-violet-500' },
  { id: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { id: 'sky', label: 'Sky', class: 'bg-sky-500' },
  { id: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { id: 'fuchsia', label: 'Fuchsia', class: 'bg-fuchsia-500' },
  { id: 'emerald', label: 'Emerald', class: 'bg-emerald-500' },
];

// ==========================================
// 3. SAMPLE DEMO DATA
// ==========================================
function getDefaultSubjects() {
  const today = getTodayDateString();
  return [
    {
      id: 'sub-cs201',
      name: 'Data Structures & Algorithms',
      code: 'CS 201',
      examDate: addDaysToDateString(today, 5),
      examTime: '09:00',
      difficulty: 'Hard',
      targetGrade: 'A',
      color: 'violet',
      priority: 'high',
      weeklyTargetHours: 8,
      topics: ['Binary Search Trees', 'Graph Traversal (BFS/DFS)', 'Dynamic Programming', 'Dijkstra Algorithm'],
      notes: 'Final exam counts for 45% of final grade.'
    },
    {
      id: 'sub-math210',
      name: 'Linear Algebra',
      code: 'MATH 210',
      examDate: addDaysToDateString(today, 11),
      examTime: '13:30',
      difficulty: 'Medium',
      targetGrade: 'A-',
      color: 'blue',
      priority: 'medium',
      weeklyTargetHours: 6,
      topics: ['Vector Spaces', 'Eigenvalues & Eigenvectors', 'Gram-Schmidt Process', 'Matrix SVD'],
      notes: 'Focus on matrix diagonalization.'
    },
    {
      id: 'sub-chem150',
      name: 'Organic Chemistry I',
      code: 'CHEM 150',
      examDate: addDaysToDateString(today, 17),
      examTime: '10:00',
      difficulty: 'Hard',
      targetGrade: 'B+',
      color: 'indigo',
      priority: 'high',
      weeklyTargetHours: 7,
      topics: ['SN1 vs SN2 Substitution', 'E1/E2 Elimination', 'Stereochemistry', 'Spectroscopy'],
      notes: 'Arrow-pushing mechanisms review.'
    },
    {
      id: 'sub-econ102',
      name: 'Principles of Macroeconomics',
      code: 'ECON 102',
      examDate: addDaysToDateString(today, 24),
      examTime: '15:00',
      difficulty: 'Easy',
      targetGrade: 'A',
      color: 'purple',
      priority: 'low',
      weeklyTargetHours: 4,
      topics: ['GDP & Inflation', 'Aggregate Demand & Supply', 'Fiscal Policy Multiplier'],
      notes: 'Review past multiple choice problems.'
    }
  ];
}

function getDefaultTasks(subjects) {
  const today = getTodayDateString();
  const cs = subjects.find(s => s.code === 'CS 201')?.id || 'sub-cs201';
  const math = subjects.find(s => s.code === 'MATH 210')?.id || 'sub-math210';
  const chem = subjects.find(s => s.code === 'CHEM 150')?.id || 'sub-chem150';

  return [
    {
      id: 'task-1',
      subjectId: cs,
      title: 'Practice Dijkstra & Graph Problems',
      topic: 'Graph Traversal',
      date: today,
      timeSlot: '09:30 - 10:45',
      durationMinutes: 75,
      type: 'practice',
      completed: true,
      priority: 'high',
      notes: 'Solved LeetCode 743 and past graph questions.'
    },
    {
      id: 'task-2',
      subjectId: cs,
      title: 'Review AVL Tree Rotations & Balanced Trees',
      topic: 'Binary Search Trees',
      date: today,
      timeSlot: '11:15 - 12:15',
      durationMinutes: 60,
      type: 'review',
      completed: true,
      priority: 'high',
      notes: 'Rotation diagram revision.'
    },
    {
      id: 'task-3',
      subjectId: math,
      title: 'Eigenvalues & Characteristic Polynomial Exercises',
      topic: 'Eigenvalues',
      date: today,
      timeSlot: '14:00 - 15:15',
      durationMinutes: 75,
      type: 'deep_work',
      completed: false,
      priority: 'medium',
      notes: 'Chapter 5 practice set.'
    },
    {
      id: 'task-4',
      subjectId: cs,
      title: 'Timed Mock Practice Exam (CS 201)',
      topic: 'Dynamic Programming',
      date: addDaysToDateString(today, 1),
      timeSlot: '10:00 - 12:00',
      durationMinutes: 120,
      type: 'past_paper',
      completed: false,
      priority: 'high',
      notes: 'Strict 2 hour timer with no notes.'
    },
    {
      id: 'task-5',
      subjectId: chem,
      title: 'Reaction Mechanism Flashcards (SN1/SN2)',
      topic: 'Substitution Mechanisms',
      date: addDaysToDateString(today, 1),
      timeSlot: '14:30 - 15:30',
      durationMinutes: 60,
      type: 'flashcards',
      completed: false,
      priority: 'high'
    }
  ];
}

function getDefaultTimetable(subjects) {
  const cs = subjects.find(s => s.code === 'CS 201')?.id || 'sub-cs201';
  const math = subjects.find(s => s.code === 'MATH 210')?.id || 'sub-math210';
  const chem = subjects.find(s => s.code === 'CHEM 150')?.id || 'sub-chem150';
  const econ = subjects.find(s => s.code === 'ECON 102')?.id || 'sub-econ102';

  return [
    { id: 'tt-1', dayOfWeek: 1, startTime: '09:30', endTime: '11:00', subjectId: cs, title: 'CS 201: Graph Algorithms Drill', type: 'practice' },
    { id: 'tt-2', dayOfWeek: 1, startTime: '13:30', endTime: '15:00', subjectId: math, title: 'MATH 210: Eigenvectors & Matrices', type: 'study' },
    { id: 'tt-3', dayOfWeek: 2, startTime: '10:00', endTime: '12:00', subjectId: cs, title: 'CS 201: Mock Exam Simulation', type: 'revision' },
    { id: 'tt-4', dayOfWeek: 2, startTime: '14:30', endTime: '16:00', subjectId: chem, title: 'CHEM 150: Arrow-Pushing Mechanisms', type: 'study' },
    { id: 'tt-5', dayOfWeek: 3, startTime: '11:00', endTime: '12:30', subjectId: math, title: 'MATH 210: Orthogonal Bases Drill', type: 'practice' },
    { id: 'tt-6', dayOfWeek: 3, startTime: '15:00', endTime: '16:30', subjectId: econ, title: 'ECON 102: Macro Multipliers Review', type: 'study' },
    { id: 'tt-7', dayOfWeek: 4, startTime: '09:00', endTime: '11:00', subjectId: cs, title: 'CS 201: Weak Spot Revision', type: 'revision' },
    { id: 'tt-8', dayOfWeek: 4, startTime: '13:00', endTime: '14:30', subjectId: chem, title: 'CHEM 150: Spectroscopy Problem Sets', type: 'practice' },
    { id: 'tt-9', dayOfWeek: 5, startTime: '10:00', endTime: '11:30', subjectId: math, title: 'MATH 210: Chapter 5 Review Test', type: 'revision' },
    { id: 'tt-10', dayOfWeek: 6, startTime: '10:00', endTime: '12:30', subjectId: cs, title: 'CS 201: Final Review Session', type: 'revision' },
    { id: 'tt-11', dayOfWeek: 0, startTime: '11:00', endTime: '13:00', subjectId: math, title: 'MATH 210: SVD & Diagonalization', type: 'practice' },
  ];
}

// ==========================================
// 4. SMART SCHEDULE GENERATOR ALGORITHM
// ==========================================
function generateSuggestedSchedule(subjects, settings, lookaheadDays = 7) {
  const today = getTodayDateString();
  if (subjects.length === 0) return { tasks: [], timetable: [], summary: { totalHours: 0, totalTasks: 0, subjectsAllocated: [], rationale: [] } };

  const subjectWeights = subjects.map(sub => {
    const daysUntilExam = Math.max(0, getDaysDifference(sub.examDate, today));
    const diffMultiplier = sub.difficulty === 'Hard' ? 1.6 : sub.difficulty === 'Medium' ? 1.2 : 0.9;
    const priorityMultiplier = sub.priority === 'high' ? 1.4 : sub.priority === 'medium' ? 1.1 : 0.8;

    let urgencyMultiplier = 1.0;
    let urgencyLabel = 'Upcoming';
    if (daysUntilExam <= 3) { urgencyMultiplier = 4.0; urgencyLabel = 'Critical'; }
    else if (daysUntilExam <= 7) { urgencyMultiplier = 2.8; urgencyLabel = 'High'; }
    else if (daysUntilExam <= 14) { urgencyMultiplier = 1.8; urgencyLabel = 'Moderate'; }

    const urgencyScore = (100 / Math.max(daysUntilExam, 1)) * diffMultiplier * priorityMultiplier * urgencyMultiplier;
    return { subject: sub, daysUntilExam, urgencyScore, urgencyLabel };
  });

  const totalScore = subjectWeights.reduce((a, b) => a + b.urgencyScore, 0);
  subjectWeights.forEach(sw => {
    sw.targetHoursShare = totalScore > 0 ? sw.urgencyScore / totalScore : 1 / subjects.length;
  });
  subjectWeights.sort((a, b) => b.urgencyScore - a.urgencyScore);

  const generatedTasks = [];
  const sessionMinutes = settings.preferredSessionMinutes || 60;
  const hoursAllocatedPerSubject = {};
  subjects.forEach(s => (hoursAllocatedPerSubject[s.id] = 0));

  const timeSlots = ['09:30 - 10:45', '14:00 - 15:15', '19:00 - 20:15'];

  for (let dayOffset = 0; dayOffset < lookaheadDays; dayOffset++) {
    const currentDayStr = addDaysToDateString(today, dayOffset);
    const dateObj = new Date(currentDayStr);
    const dayOfWeek = dateObj.getDay();
    const availableHoursToday = settings.dailyAvailableHours[dayOfWeek] ?? 3.5;
    const maxSessions = Math.max(1, Math.round((availableHoursToday * 60) / sessionMinutes));
    let minutesScheduledToday = 0;

    for (let sIndex = 0; sIndex < maxSessions; sIndex++) {
      if (minutesScheduledToday >= availableHoursToday * 60) break;
      const chosen = subjectWeights[(sIndex + dayOffset) % subjectWeights.length];
      const sub = chosen.subject;
      const daysLeft = Math.max(0, chosen.daysUntilExam - dayOffset);
      const topic = sub.topics[(dayOffset + sIndex) % Math.max(1, sub.topics.length)] || `${sub.name} Core Concepts`;

      let taskType = 'review';
      let titlePrefix = 'Review & Comprehension';
      if (daysLeft <= 1) { taskType = 'revision'; titlePrefix = 'Final Review & Formula Sheet'; }
      else if (daysLeft <= 3) { taskType = 'past_paper'; titlePrefix = 'Timed Past Paper Exam'; }
      else if (daysLeft <= 7) { taskType = 'practice'; titlePrefix = 'Active Recall & Problem Drills'; }
      else if (sub.difficulty === 'Hard') { taskType = 'deep_work'; titlePrefix = 'Deep Work & Derivations'; }
      else { taskType = 'practice'; titlePrefix = 'Problem Sets & Concept Mastery'; }

      const duration = Math.min(sessionMinutes, Math.round(availableHoursToday * 60 - minutesScheduledToday));
      if (duration < 25) break;

      generatedTasks.push({
        id: `ai-task-${Date.now()}-${dayOffset}-${sIndex}`,
        subjectId: sub.id,
        title: `${titlePrefix}: ${topic}`,
        topic,
        date: currentDayStr,
        timeSlot: timeSlots[sIndex % timeSlots.length],
        durationMinutes: duration,
        type: taskType,
        completed: false,
        priority: chosen.urgencyLabel === 'Critical' || chosen.urgencyLabel === 'High' ? 'high' : 'medium',
        notes: `Urgency focus: ${daysLeft} days to exam. Recommended method: Active recall & testing.`
      });

      minutesScheduledToday += duration;
      hoursAllocatedPerSubject[sub.id] = (hoursAllocatedPerSubject[sub.id] || 0) + duration / 60;
    }
  }

  const timetableSlots = [];
  for (let day = 1; day <= 7; day++) {
    const dayOfWeek = day % 7;
    const chosen = subjectWeights[day % subjectWeights.length];
    timetableSlots.push({
      id: `ai-tt-${day}`,
      dayOfWeek,
      startTime: '10:00',
      endTime: '11:30',
      subjectId: chosen.subject.id,
      title: `${chosen.subject.code}: ${chosen.urgencyLabel === 'Critical' ? 'Intensive Exam Revision' : 'Targeted Practice'}`,
      type: 'practice'
    });
  }

  const totalAllocatedMinutes = generatedTasks.reduce((s, t) => s + t.durationMinutes, 0);
  const totalHours = Math.round((totalAllocatedMinutes / 60) * 10) / 10;

  const subjectsAllocated = subjectWeights.map(sw => ({
    subjectName: sw.subject.name,
    color: sw.subject.color,
    hours: Math.round((hoursAllocatedPerSubject[sw.subject.id] || 0) * 10) / 10,
    taskCount: generatedTasks.filter(t => t.subjectId === sw.subject.id).length,
    daysUntilExam: sw.daysUntilExam,
    urgency: sw.urgencyLabel
  }));

  const rationale = [
    `Priority given to nearest exam (${subjectWeights[0]?.subject.name}) with higher practice weighting.`,
    `Cognitive pacing: sessions alternate between hard subjects to prevent mental fatigue.`,
    `Spaced repetition: review sessions are interleaved over the 7-day lookahead window.`
  ];

  return {
    tasks: generatedTasks,
    timetable: timetableSlots,
    summary: { totalHours, totalTasks: generatedTasks.length, subjectsAllocated, rationale }
  };
}

// ==========================================
// 5. MAIN COMPONENT
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // App State with localStorage persistence
  const [subjects, setSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_study_subjects');
      return saved ? JSON.parse(saved) : getDefaultSubjects();
    } catch {
      return getDefaultSubjects();
    }
  });

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_study_tasks');
      return saved ? JSON.parse(saved) : getDefaultTasks(subjects);
    } catch {
      return getDefaultTasks(subjects);
    }
  });

  const [timetable, setTimetable] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_study_timetable');
      return saved ? JSON.parse(saved) : getDefaultTimetable(subjects);
    } catch {
      return getDefaultTimetable(subjects);
    }
  });

  const [settings, setSettings] = useState(() => {
    return {
      dailyAvailableHours: { 0: 4.5, 1: 3.5, 2: 3.5, 3: 3.0, 4: 3.5, 5: 2.5, 6: 5.0 },
      preferredSessionMinutes: 60,
      preferredTimeOfDay: 'afternoon',
    };
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_study_subjects', JSON.stringify(subjects));
      sessionStorage.setItem('ai_study_subjects', JSON.stringify(subjects));
    } catch (e) {}
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_study_tasks', JSON.stringify(tasks));
      sessionStorage.setItem('ai_study_tasks', JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_study_timetable', JSON.stringify(timetable));
      sessionStorage.setItem('ai_study_timetable', JSON.stringify(timetable));
    } catch (e) {}
  }, [timetable]);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const addToast = (type, title, description) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, description }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // Modals
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Subject Handlers
  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) addToast('success', 'Task Done!', `Completed "${t.title}".`);
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const handleMarkAllTodayDone = () => {
    const today = getTodayDateString();
    setTasks(prev => prev.map(t => t.date === today ? { ...t, completed: true } : t));
    addToast('success', 'Goal Reached', 'All today study tasks marked complete!');
  };

  const handleApplySchedule = (generatedResult, mode) => {
    if (mode === 'replace') {
      setTasks(generatedResult.tasks);
      setTimetable(generatedResult.timetable);
      addToast('success', 'Schedule Applied', `Loaded ${generatedResult.summary.totalTasks} study sessions.`);
    } else {
      setTasks(prev => [...generatedResult.tasks, ...prev]);
      setTimetable(prev => [...prev, ...generatedResult.timetable]);
      addToast('success', 'Schedule Appended', `Added ${generatedResult.summary.totalTasks} sessions.`);
    }
    setActiveTab('dashboard');
  };

  const handleResetToDemo = () => {
    const defaultSubs = getDefaultSubjects();
    const defaultT = getDefaultTasks(defaultSubs);
    const defaultTT = getDefaultTimetable(defaultSubs);
    setSubjects(defaultSubs);
    setTasks(defaultT);
    setTimetable(defaultTT);
    addToast('info', 'Reset Complete', 'Loaded sample university study schedule.');
  };

  // Metrics
  const todayStr = getTodayDateString();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const todayCompleted = todayTasks.filter(t => t.completed).length;
  const todayPlannedMinutes = todayTasks.reduce((a, b) => a + b.durationMinutes, 0);
  const todayCompletedMinutes = todayTasks.filter(t => t.completed).reduce((a, b) => a + b.durationMinutes, 0);

  const sortedExams = [...subjects].map(s => ({
    ...s,
    daysLeft: getDaysDifference(s.examDate, todayStr)
  })).sort((a, b) => a.daysLeft - b.daysLeft);
  const nearestExam = sortedExams[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-16">
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2.5 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                  AI Study Planner
                </span>
              </button>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'subjects', label: 'Subjects & Exams' },
                { id: 'tasks', label: 'Daily Tasks' },
                { id: 'timetable', label: 'Weekly Timetable' },
                { id: 'timer', label: 'Focus Timer' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap transition-colors py-1.5 border-b-2 cursor-pointer ${
                    activeTab === item.id
                      ? 'border-indigo-400 text-white font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsGeneratorOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Suggested Schedule</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-4 space-y-2">
            {['dashboard', 'subjects', 'tasks', 'timetable', 'timer'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize ${
                  activeTab === tab ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-slate-300'
                }`}
              >
                {tab === 'subjects' ? 'Subjects & Exams' : tab === 'tasks' ? 'Daily Tasks' : tab === 'timetable' ? 'Weekly Timetable' : tab === 'timer' ? 'Focus Timer' : 'Dashboard'}
              </button>
            ))}
            <button
              onClick={() => { setIsGeneratorOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Suggested Schedule</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-purple-950/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  <Brain className="w-4 h-4" />
                  <span>University Exam Prep Assistant</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Stay ahead of your exam deadlines with balanced daily pacing
                </h1>
                <p className="text-sm text-slate-300">
                  Auto-generates daily tasks based on subject difficulty, target grades, and days remaining until exams.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsGeneratorOpen(true)}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 rounded-lg shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Auto-Suggest Schedule</span>
                </button>
              </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Overall Progress</span>
                  <Target className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{progressPercent}%</span>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Today's Study Time</span>
                  <Clock className="w-4 h-4 text-purple-400" />
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    {(todayCompletedMinutes / 60).toFixed(1)}h
                  </span>
                  <span className="text-xs text-slate-400 ml-1.5">/ {(todayPlannedMinutes / 60).toFixed(1)}h planned</span>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${todayPlannedMinutes > 0 ? (todayCompletedMinutes / todayPlannedMinutes) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Nearest Exam</span>
                  <Calendar className="w-4 h-4 text-rose-400" />
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-bold text-rose-400 tabular-nums">
                    {nearestExam ? (nearestExam.daysLeft <= 0 ? 'Today!' : `${nearestExam.daysLeft}d left`) : 'None'}
                  </span>
                  <p className="text-xs text-slate-300 mt-1 truncate">{nearestExam ? `${nearestExam.code} · ${nearestExam.name}` : 'No exams'}</p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Study Consistency</span>
                  <Flame className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-bold text-amber-400 tabular-nums">4 Days</span>
                  <p className="text-xs text-slate-400 mt-1">Active Study Streak</p>
                </div>
              </div>
            </div>

            {/* Split Section: Today's Tasks & Exam Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Today Queue */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h2 className="text-base font-semibold text-white">Today's Study Queue ({todayCompleted}/{todayTasks.length})</h2>
                  <button onClick={() => setActiveTab('tasks')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    <span>View All Tasks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {todayTasks.length === 0 ? (
                    <div className="p-6 text-center rounded-xl border border-dashed border-slate-800 text-slate-400 text-xs">
                      No tasks scheduled for today. Click "Auto-Suggest Schedule" to create a plan.
                    </div>
                  ) : (
                    todayTasks.map(task => {
                      const sub = subjects.find(s => s.id === task.subjectId);
                      const scheme = getColorScheme(sub?.color);
                      return (
                        <div key={task.id} className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${task.completed ? 'border-slate-800/60 bg-slate-900/30 opacity-70' : 'border-slate-800 bg-slate-900/80'}`}>
                          <button onClick={() => handleToggleTask(task.id)} className="mt-0.5 text-slate-400 hover:text-indigo-400">
                            {task.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-slate-500" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                              <span className={`font-semibold ${scheme.badgeText}`}>{sub?.code}</span>
                              <span>·</span>
                              <span className="capitalize">{task.type.replace('_', ' ')}</span>
                              <span>·</span>
                              <span className="tabular-nums">{task.durationMinutes}m</span>
                            </div>
                            <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>{task.title}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Upcoming Exams */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h2 className="text-base font-semibold text-white">Upcoming Exams</h2>
                  <button onClick={() => setActiveTab('subjects')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    <span>Manage Subjects</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {sortedExams.map(sub => {
                    const scheme = getColorScheme(sub.color);
                    const isUrgent = sub.daysLeft <= 5;
                    return (
                      <div key={sub.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`text-xs font-bold ${scheme.badgeText}`}>{sub.code}</span>
                            <h3 className="text-sm font-semibold text-white mt-0.5">{sub.name}</h3>
                          </div>
                          <span className={`text-xs font-bold tabular-nums ${isUrgent ? 'text-rose-400' : 'text-indigo-400'}`}>
                            {sub.daysLeft <= 0 ? 'Today!' : `${sub.daysLeft} days`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                          <span>Target: <strong className="text-white">{sub.targetGrade}</strong></span>
                          <span>{formatFriendlyDate(sub.examDate)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SUBJECTS & EXAMS */}
        {activeTab === 'subjects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Subjects & Exam Schedule</h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Manage semester courses, upcoming exam dates, and chapter topics.</p>
              </div>
              <button
                onClick={() => setIsSubjectModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Subject</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map(sub => {
                const scheme = getColorScheme(sub.color);
                const daysLeft = getDaysDifference(sub.examDate, todayStr);
                return (
                  <div key={sub.id} className="p-5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className={`font-bold ${scheme.badgeText}`}>{sub.code}</span>
                          <span>·</span>
                          <span>{sub.difficulty}</span>
                        </div>
                        <h2 className="text-lg font-bold text-white mt-1">{sub.name}</h2>
                      </div>
                      <button
                        onClick={() => {
                          setSubjects(prev => prev.filter(s => s.id !== sub.id));
                          addToast('info', 'Deleted', `Removed ${sub.code}`);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        <span>{formatFriendlyDate(sub.examDate)} at {sub.examTime || '09:00'}</span>
                      </div>
                      <span className={`font-bold tabular-nums ${daysLeft <= 5 ? 'text-rose-400' : 'text-indigo-400'}`}>
                        {daysLeft <= 0 ? 'Today!' : `${daysLeft} days remaining`}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 block mb-1.5">Syllabus Focus Topics:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {sub.topics.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: DAILY TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Daily Study Tasks</h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Interactive daily checklist with completion checkboxes.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllTodayDone}
                  className="px-3 py-2 text-xs font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Complete Today's Tasks</span>
                </button>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {tasks.map(task => {
                const sub = subjects.find(s => s.id === task.subjectId);
                const scheme = getColorScheme(sub?.color);
                return (
                  <div key={task.id} className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${task.completed ? 'border-slate-800/60 bg-slate-900/40 opacity-70' : 'border-slate-800 bg-slate-900/80'}`}>
                    <button onClick={() => handleToggleTask(task.id)} className="mt-0.5 text-slate-400 hover:text-indigo-400 cursor-pointer">
                      {task.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-slate-500" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                        <span className={`font-bold ${scheme.badgeText}`}>{sub?.code}</span>
                        <span>·</span>
                        <span className="capitalize">{task.type.replace('_', ' ')}</span>
                        <span>·</span>
                        <span className="tabular-nums font-medium text-slate-300">{task.durationMinutes} min</span>
                        <span>·</span>
                        <span className="tabular-nums text-slate-400">{formatFriendlyDate(task.date)}</span>
                      </div>
                      <p className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>{task.title}</p>
                      {task.notes && <p className="text-xs text-slate-400 mt-1">{task.notes}</p>}
                    </div>
                    <button
                      onClick={() => {
                        setTasks(prev => prev.filter(t => t.id !== task.id));
                        addToast('info', 'Task Deleted', 'Task removed.');
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: WEEKLY TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Weekly Study Timetable</h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">7-Day schedule routine for lectures, revisions, and problem drills.</p>
              </div>
              <button
                onClick={() => setIsGeneratorOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg cursor-pointer"
              >
                Regenerate Timetable
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {[1, 2, 3, 4, 5, 6, 0].map(dayNum => {
                const slots = timetable.filter(t => t.dayOfWeek === dayNum);
                return (
                  <div key={dayNum} className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 min-h-[360px] flex flex-col">
                    <div className="pb-2 mb-2 border-b border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-bold text-white uppercase">{getDayOfWeekName(dayNum)}</span>
                      <span className="text-[10px] text-slate-400">{slots.length} sessions</span>
                    </div>

                    <div className="space-y-2 flex-1">
                      {slots.length === 0 ? (
                        <div className="text-center text-slate-600 text-xs py-10">Rest Day</div>
                      ) : (
                        slots.map(s => {
                          const sub = subjects.find(sub => sub.id === s.subjectId);
                          const scheme = getColorScheme(sub?.color);
                          return (
                            <div key={s.id} className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/80">
                              <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                                <span className={`font-semibold ${scheme.badgeText}`}>{sub?.code}</span>
                                <span>{s.startTime} - {s.endTime}</span>
                              </div>
                              <p className="text-xs font-medium text-white line-clamp-2">{s.title}</p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 5: POMODORO FOCUS TIMER */}
        {activeTab === 'timer' && (
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/80 text-center space-y-6">
            <h1 className="text-2xl font-bold text-white">Focus Companion</h1>
            <p className="text-xs text-slate-400">High-intensity interval study with spaced recall breaks.</p>
            <div className="text-6xl font-extrabold font-mono text-white tabular-nums">25:00</div>
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm cursor-pointer shadow-lg shadow-indigo-600/30">
              Start Session
            </button>
          </div>
        )}
      </main>

      {/* MODAL: SUGGESTED SCHEDULE GENERATOR */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Suggested Study Schedule Generator</h3>
              </div>
              <button onClick={() => setIsGeneratorOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Calculates daily study hours based on your subjects, available time, and upcoming exam dates without cramming.
            </p>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">Available Study Hours (Weekday / Weekend)</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Weekdays</span>
                  <span className="text-sm font-bold text-indigo-400">3.5 hrs/day</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Weekends</span>
                  <span className="text-sm font-bold text-purple-400">5.0 hrs/day</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => setIsGeneratorOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-300 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => {
                  const res = generateSuggestedSchedule(subjects, settings, 7);
                  handleApplySchedule(res, 'replace');
                  setIsGeneratorOpen(false);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg cursor-pointer"
              >
                Generate & Apply Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD SUBJECT */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Add Course & Exam</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const name = fd.get('name');
              const code = fd.get('code');
              const examDate = fd.get('examDate');
              if (!name || !code || !examDate) return;

              setSubjects(prev => [
                ...prev,
                {
                  id: `sub-${Date.now()}`,
                  name,
                  code: code.toUpperCase(),
                  examDate,
                  examTime: '09:00',
                  difficulty: fd.get('difficulty') || 'Medium',
                  targetGrade: 'A',
                  color: 'indigo',
                  priority: 'medium',
                  weeklyTargetHours: 6,
                  topics: ['Core Syllabus Review', 'Practice Problems']
                }
              ]);
              setIsSubjectModalOpen(false);
              addToast('success', 'Subject Added', `${code}: ${name}`);
            }} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Subject Name *</label>
                <input name="name" required placeholder="e.g. Operating Systems" className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Course Code *</label>
                  <input name="code" required placeholder="e.g. CS 350" className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white" />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Exam Date *</label>
                  <input name="examDate" type="date" required className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsSubjectModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 rounded-lg text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TASK */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Add Study Task</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const title = fd.get('title');
              const subId = fd.get('subjectId');
              if (!title || !subId) return;

              setTasks(prev => [
                {
                  id: `task-${Date.now()}`,
                  subjectId: subId,
                  title,
                  date: todayStr,
                  durationMinutes: Number(fd.get('duration')) || 60,
                  type: 'practice',
                  priority: 'medium',
                  completed: false
                },
                ...prev
              ]);
              setIsTaskModalOpen(false);
              addToast('success', 'Task Added', title);
            }} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Task Title *</label>
                <input name="title" required placeholder="e.g. Chapter 5 Practice Problems" className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white" />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Subject *</label>
                <select name="subjectId" className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white">
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.code}: {s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Duration (Minutes)</label>
                <input name="duration" type="number" defaultValue={60} className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 rounded-lg text-white">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST CONTAINER */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto p-3.5 rounded-xl border border-slate-800 bg-slate-900/95 shadow-xl text-xs flex items-center justify-between text-white">
            <div>
              <p className="font-bold">{t.title}</p>
              {t.description && <p className="text-slate-400 mt-0.5">{t.description}</p>}
            </div>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="text-slate-400 hover:text-white ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 mt-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>AI Study Planner · University Edition</span>
          <button onClick={handleResetToDemo} className="hover:text-slate-300 flex items-center gap-1 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Sample Plan</span>
          </button>
        </div>
      </footer>
    </div>
  );
}