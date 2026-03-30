export class OnboardingController {
  constructor(model) {
    this.model = model;
  }

  handleNextStep() {
    const currentStep = this.model.onboardingStep;

    if (currentStep === 0) {
      const nameInput = document.getElementById("ob-name");
      if (nameInput) this.model.updateData("name", nameInput.value);
    } else if (currentStep === 1) {
      const ageInput = document.getElementById("ob-age");
      if (ageInput) this.model.updateData("age", ageInput.value);
    }

    if (currentStep < 6) {
      this.model.onboardingStep++;
      if (typeof this.renderOnboarding === "function") {
        this.renderOnboarding();
      }
    } else {
      this.finishOnboarding();
    }
  }

  async finishOnboarding() {
    try {
      await this.model.saveFullProfile();
      if (this.navigateToPage) {
        this.navigateToPage("create-adult");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
