import prisma from "../config/db.js";

const getDateKey = (date) => {
    const d = new Date(date);

    return `${d.getFullYear()}-${String(
        d.getMonth() + 1
    ).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")}`;
};

const getPreviousDateKey = (dateKey) => {
    const date = new Date(`${dateKey}T00:00:00`);

    date.setDate(date.getDate() - 1);

    return getDateKey(date);
};

export const calculateLearningStreak = async (userId) => {
    // Get completed tasks
    const completedTasks = await prisma.task.findMany({
        where: {
            userId,
            status: "completed",
            completedAt: {
                not: null,
            },
        },
        select: {
            completedAt: true,
        },
        orderBy: {
            completedAt: "desc",
        },
    });

    // Get quiz attempts
    const quizAttempts = await prisma.quizAttempt.findMany({
        where: {
            userId,
        },
        select: {
            completedAt: true,
        },
        orderBy: {
            completedAt: "desc",
        },
    });

    // Collect all days on which the user learned
    const activityDays = new Set();

    for (const task of completedTasks) {
        if (task.completedAt) {
            activityDays.add(getDateKey(task.completedAt));
        }
    }

    for (const quiz of quizAttempts) {
        if (quiz.completedAt) {
            activityDays.add(getDateKey(quiz.completedAt));
        }
    }

    // No learning activity
    if (activityDays.size === 0) {
        return {
            currentStreak: 0,
            longestStreak: 0,
            activityDays: [],
        };
    }

    const sortedDays = Array.from(activityDays).sort(
        (a, b) =>
            new Date(b).getTime() -
            new Date(a).getTime()
    );

    const todayKey = getDateKey(new Date());

    // Current streak
    let currentStreak = 0;
    let checkDay = todayKey;

    // A streak is active if the user learned today
    // or yesterday.
    if (
        activityDays.has(todayKey) ||
        activityDays.has(
            getPreviousDateKey(todayKey)
        )
    ) {
        if (!activityDays.has(todayKey)) {
            checkDay = getPreviousDateKey(todayKey);
        }

        while (activityDays.has(checkDay)) {
            currentStreak++;

            checkDay =
                getPreviousDateKey(checkDay);
        }
    }

    // Calculate longest historical streak
    let longestStreak = 0;
    let runningStreak = 0;
    let previousDay = null;

    for (const day of [...sortedDays].reverse()) {
        if (!previousDay) {
            runningStreak = 1;
        } else {
            const expectedNextDay =
                getPreviousDateKey(previousDay);

            if (day === expectedNextDay) {
                runningStreak++;
            } else {
                runningStreak = 1;
            }
        }

        longestStreak = Math.max(
            longestStreak,
            runningStreak
        );

        previousDay = day;
    }

    return {
        currentStreak,
        longestStreak,
        activityDays: sortedDays,
    };
};