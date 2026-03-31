export function isStepValid(state) {
  if (state.isLoading) return false;
  if (state.isLoginMode)
    return (
      state.loginData.email.includes("@") &&
      state.loginData.password.length >= 4
    );

  switch (state.step) {
    case 1:
      return (
        state.registerData.email.includes("@") &&
        state.registerData.password.length >= 8 &&
        state.registerData.name.trim().length >= 2
      );
    case 2:
      return parseInt(state.registerData.age) >= 5;
    case 3:
      return !!state.registerData.instrument;
    case 4:
      return state.registerData.duree !== "";
    case 5:
      return state.registerData.ecole.trim().length > 0;
    case 6:
      return !!state.registerData.mascotte;
    case 7:
      return state.registerData.jours.length > 0;
    default:
      return true;
  }
}
