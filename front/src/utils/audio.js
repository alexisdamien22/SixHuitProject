export const playSound = (fileName) => { // Dernier ajout
  const audio = new Audio(`./assets/audio/${fileName}`);
  audio.play().catch(err => console.log("Lecture audio bloquée :", err));
};