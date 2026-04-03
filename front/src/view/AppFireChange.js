export const AppFireChange = {
    FireTextur(number) {
        const streakNumber =
            typeof number === "number" && !isNaN(number) ? Math.max(0, number) : 0;
        const level = Math.min(Math.floor(streakNumber / 7) + 1, 12);
        return `/assets/img/icons/streak/flame_${level}.png`;
    },
};
