export class AppModel {
  constructor() {
    this.activeChild = {
      name: "...",
      instrument: "...",
      sessions: [],
      weeklyPlan: {},
      streakData: { current_streak: 0, last_practice_date: null },
    };
    this.onboardingStep = 0;
    this.tempData = {};
  }

  async init() {
    const childId = localStorage.getItem("activeChildId");
    if (!this.isLoggedIn() || !childId) {
      this.loadLocalData();
      return;
    }

    try {
      const response = await fetch(`/api/child/${childId}/full-data`);
      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      this.activeChild = {
        ...this.activeChild,
        ...result.data,
        weeklyPlan: result.data.plan || result.data.jours || {},
        streakData: result.data.streak || {
          current_streak: 0,
          last_practice_date: null,
        },
      };

      this.generateWeeklyView();
      this.saveData();
    } catch (e) {
      this.loadLocalData();
    }
  }

  loadLocalData() {
    const savedData = localStorage.getItem("activeChildData");
    if (savedData) {
      this.activeChild = { ...this.activeChild, ...JSON.parse(savedData) };
    }
    this.generateWeeklyView();
  }

  updateData(key, value) {
    this.tempData[key] = value;
  }

  isLoggedIn() {
    return !!localStorage.getItem("jwt_token");
  }

  login() {
    localStorage.setItem("user_connected", "true");
  }

  getChildData() {
    return this.activeChild;
  }

  generateWeeklyView() {
    if (!this.activeChild) return;

    let plan = this.activeChild.weeklyPlan || {
      monday: { practice: 1, color: "#7b2fbe" },
    };

    if (typeof plan === "string") {
      try {
        plan = JSON.parse(plan);
      } catch (error) {
        console.warn("Format du plan hebdomadaire invalide, réinitialisation.");
        plan = [];
      }
    }

    const dayNameArray = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayNameMapFr = {
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mer",
      thursday: "Jeu",
      friday: "Ven",
      saturday: "Sam",
      sunday: "Dim",
    };
    const enToAbbr = {
      monday: "L",
      tuesday: "Ma",
      wednesday: "Me",
      thursday: "J",
      friday: "V",
      saturday: "S",
      sunday: "D",
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastPracticeDateStr = this.activeChild.streakData?.last_practice_date;
    const lastPracticeDate = lastPracticeDateStr
      ? new Date(lastPracticeDateStr)
      : null;
    if (lastPracticeDate) lastPracticeDate.setHours(0, 0, 0, 0);

    const hasPracticedToday =
      lastPracticeDate && lastPracticeDate.getTime() === today.getTime();

    const currentDayOfWeek = today.getDay();
    const distanceToMonday = (currentDayOfWeek + 6) % 7;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - distanceToMonday);

    const weeklySessions = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayOfWeek = dayNameArray[date.getDay()];

      let isPracticeDay = false;
      if (Array.isArray(plan)) {
        isPracticeDay =
          plan.includes(dayOfWeek) || plan.includes(enToAbbr[dayOfWeek]);
      } else if (typeof plan === "object" && plan !== null) {
        isPracticeDay = !!plan[dayOfWeek] || !!plan[enToAbbr[dayOfWeek]];
      }

      let status = "nothing";
      if (isPracticeDay) {
        const isPastOrPracticedToday =
          date.getTime() < today.getTime() ||
          (date.getTime() === today.getTime() && hasPracticedToday);
        status = isPastOrPracticedToday ? "done" : "todo";
      }

      weeklySessions.push({
        date: date.toISOString().split("T")[0],
        day: dayNameMapFr[dayOfWeek],
        status,
        isPracticeDay,
        isToday: date.getTime() === today.getTime(),
      });
    }

    this.activeChild.sessions = weeklySessions;
  }

  async completeCurrentSession() {
    const todayStr = new Date().toISOString().split("T")[0];
    const lastDateStr = this.activeChild.streakData?.last_practice_date;

    if (lastDateStr === todayStr) return;

    const currentStreak = this.activeChild.streakData?.current_streak || 0;
    const newStreak = currentStreak + 1;

    this.activeChild.streakData = {
      current_streak: newStreak,
      last_practice_date: todayStr,
    };
    localStorage.setItem("streak", newStreak.toString());

    this.generateWeeklyView();
    this.saveData();

    const activeChildId = localStorage.getItem("activeChildId");
    if (!activeChildId) return;

    try {
      await fetch(`/api/child/${activeChildId}/streak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streak: newStreak, lastDate: todayStr }),
      });
      await fetch(`/api/child/${activeChildId}/sessions`, { method: "POST" });
    } catch (err) {
      console.error(err);
    }
  }

  saveData() {
    localStorage.setItem("activeChildData", JSON.stringify(this.activeChild));
  }

  async saveFullProfile() {
    if (Object.keys(this.tempData).length > 0) {
      this.activeChild = { ...this.activeChild, ...this.tempData };
      this.saveData();
      this.tempData = {};
    }
  }
}
