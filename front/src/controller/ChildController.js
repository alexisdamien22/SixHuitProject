import { ApiClient } from "../model/ApiClient.js";

export class ChildController {
    constructor(app) {
        this.app = app;
    }

    async loadChildData() {
        try {
            const childId = this.app.model.session.getChildId();
            if (!childId) return;

            const data = await ApiClient.get(`/child/${childId}`);
            if (data && data.error) throw new Error(data.error);

            data.formattedWeeklyPlan = this.formatWeeklyPlan(
                data.weeklyPlan || [],
                data.lesson_day,
                data.history || data.sessions || [],
            );

            this.app.model.setChildData(data);
            this.app.view.updateChildData(data);
        } catch (err) {
            console.error("Error loading child data:", err);
        }
    }

    async getChildById(childId) {
        try {
            const data = await ApiClient.get(`/child/${childId}`);
            if (data && data.error) throw new Error(data.error);
            return data;
        } catch (err) {
            throw err;
        }
    }

    async updateSession(sessionData) {
        try {
            const childId = this.app.model.session.getChildId();
            if (!childId) throw new Error("No active child ID");

            await ApiClient.post(`/child/${childId}/session`, sessionData);
            await this.loadChildData();
        } catch (err) {
            console.error("Error updating session:", err);
            throw err;
        }
    }

    async updateStreak(value) {
        try {
            const childId = this.app.model.session.getChildId();
            await ApiClient.post(`/child/${childId}/streak`, { value });
            await this.loadChildData();
        } catch (err) {
            console.error("Error updating streak:", err);
        }
    }

    async updateSettings(childId, settings) {
        try {
            await ApiClient.patch(`/child/${childId}/settings`, settings);
            return { success: true };
        } catch (err) {
            throw err;
        }
    }

    async deleteChild(childId) {
        try {
            await ApiClient.delete(`/child/${childId}`);
            return { success: true };
        } catch (err) {
            throw err;
        }
    }

    formatWeeklyPlan(rawPlan, lessonDay = "Lundi", history = []) {
        const dayMap = {
            monday: "Lundi",
            tuesday: "Mardi",
            wednesday: "Mercredi",
            thursday: "Jeudi",
            friday: "Vendredi",
            saturday: "Samedi",
            sunday: "Dimanche",
        };
        const frenchDays = [
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi",
            "Dimanche",
        ];

        let startIndex = frenchDays.indexOf(lessonDay);
        if (startIndex === -1) startIndex = 0;

        const orderedDays = [
            ...frenchDays.slice(startIndex),
            ...frenchDays.slice(0, startIndex),
        ];
        const fullPlan = {};
        orderedDays.forEach((day) => (fullPlan[day] = "nothing"));

        const jsDays = [
            "Dimanche",
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi",
        ];
        const now = new Date();
        const currentDayName = jsDays[now.getDay()];

        let targetDayIndex = jsDays.indexOf(lessonDay);
        if (targetDayIndex === -1) targetDayIndex = 1;

        let daysAgo = now.getDay() - targetDayIndex;
        if (daysAgo < 0) daysAgo += 7;

        const startOfCycle = new Date(now);
        startOfCycle.setDate(now.getDate() - daysAgo);
        startOfCycle.setHours(0, 0, 0, 0);

        const doneDaysThisCycle = new Set();
        history.forEach((session) => {
            if (session.session_date) {
                const sessionDate = new Date(session.session_date);
                if (sessionDate >= startOfCycle && session.practice_day) {
                    doneDaysThisCycle.add(session.practice_day);
                }
            }
        });

        const todayIndexInOrdered = orderedDays.indexOf(currentDayName);

        if (!rawPlan || !Array.isArray(rawPlan)) return fullPlan;

        rawPlan.forEach((entry) => {
            const day = dayMap[entry.day_of_week];
            if (day) {
                const dayIndex = orderedDays.indexOf(day);
                const isPast = dayIndex < todayIndexInOrdered;

                if (doneDaysThisCycle.has(day) || entry.status === 1) {
                    fullPlan[day] = "done";
                } else if (entry.practice === 1) {
                    if (day === currentDayName) {
                        fullPlan[day] = "todo";
                    } else if (isPast) {
                        fullPlan[day] = "missed";
                    } else {
                        fullPlan[day] = "todo-future";
                    }
                } else {
                    fullPlan[day] = "nothing";
                }
            }
        });

        return fullPlan;
    }
}
