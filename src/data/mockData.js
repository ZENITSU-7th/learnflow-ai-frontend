export const courses = [
  { id: 1, title: "Python Foundations", category: "Programming", description: "Build a strong foundation in Python, problem solving and clean code.", completed: 18, lessons: 24, progress: 75, color: "purple" },
  { id: 2, title: "Data Structures", category: "Computer Science", description: "Master arrays, linked lists, trees, graphs and core algorithms.", completed: 12, lessons: 30, progress: 40, color: "cyan" },
  { id: 3, title: "Japanese Basics", category: "Language", description: "Learn practical Japanese vocabulary, grammar and conversation.", completed: 9, lessons: 20, progress: 45, color: "pink" },
  { id: 4, title: "Public Speaking", category: "Professional", description: "Improve clarity, confidence and presentation skills.", completed: 7, lessons: 12, progress: 58, color: "teal" },
  { id: 5, title: "Gym Fundamentals", category: "Academic", description: "Understand movement, training basics and sustainable routines.", completed: 5, lessons: 14, progress: 36, color: "orange" },
  { id: 6, title: "Photography", category: "Creative", description: "Explore composition, exposure, lighting and visual storytelling.", completed: 3, lessons: 10, progress: 30, color: "purple" },
];

export const tasks = [
  { id: 1, title: "Revise recursion", course: "Data Structures", duration: "25 min", level: "Medium", done: false },
  { id: 2, title: "Python functions practice", course: "Python Foundations", duration: "30 min", level: "Easy", done: true },
  { id: 3, title: "Spaced review: arrays", course: "Data Structures", duration: "15 min", level: "Easy", done: false },
  { id: 4, title: "Japanese vocabulary", course: "Japanese Basics", duration: "20 min", level: "Novice", done: false },
];

export const resources = [
  { id: 1, type: "YouTube", title: "Recursion Explained Simply", source: "YouTube", topic: "Recursion", saved: "Today", status: "Ready" },
  { id: 2, type: "Article", title: "A Visual Guide to Binary Trees", source: "Web article", topic: "Trees", saved: "Yesterday", status: "Ready" },
  { id: 3, type: "PDF", title: "Operating Systems Notes", source: "PDF document", topic: "Operating Systems", saved: "2 days ago", status: "Ready" },
  { id: 4, type: "Video", title: "Japanese N5 Starter Lesson", source: "Video", topic: "Japanese", saved: "3 days ago", status: "Ready" },
  { id: 5, type: "Article", title: "How Spaced Repetition Works", source: "Web article", topic: "Learning Science", saved: "5 days ago", status: "Ready" },
  { id: 6, type: "Image", title: "Photography Composition Cheat Sheet", source: "Image", topic: "Photography", saved: "1 week ago", status: "Ready" },
];
