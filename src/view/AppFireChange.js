export const AppFireChange = {
  FireTextur(number) {
    const strikNumber =
      typeof number === "number" && !isNaN(number) ? Math.max(0, number) : 0;
    const level = Math.min(Math.floor(strikNumber / 7) + 1, 12);

    return `/assets/img/icons/strik/flame_${level}.png`;
  },
};
