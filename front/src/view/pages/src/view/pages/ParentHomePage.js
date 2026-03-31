import { esc } from "../../utils/FormHelpers.js";

export const ParentHomePage = {
  getHTML: (parentData) => {
    const welcomeName = parentData?.name ? `, ${esc(parentData.name)}` : "";

    return `
      <div class="parent-screen" style="padding: 20px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh;">
        <h1 style="margin-bottom: 10px;">Espace Parent</h1>
        <p style="color: #666; margin-bottom: 30px;">Bienvenue dans ton tableau de bord${welcomeName} !</p>
        
        <div class="ca-form-block" style="width: 100%; max-width: 400px; padding: 20px; border-radius: 15px; background: #f9f9f9;">
          <p class="ca-question">Tu n'as pas encore de profil enfant configuré.</p>
          <p style="font-size: 0.9em; color: #888;">Crée un profil pour que ton enfant puisse commencer ses sessions de musique et suivre sa progression.</p>
        </div>
        
        <button id="add-child-btn" class="ca-btn-next" style="margin-top: 40px; width: 100%; max-width: 300px;">
          + Ajouter un profil enfant
        </button>
        
        <a href="#" id="ca-logout-btn" style="margin-top: 20px; color: #ff4757; text-decoration: none; font-size: 0.9em;">Se déconnecter</a>
      </div>
    `;
  },

  afterRender: () => {
    document.getElementById("add-child-btn")?.addEventListener("click", () => {
      window.appController?.navigateToPage("registerChild");
    });

    document.getElementById("ca-logout-btn")?.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("activeChildId");
      window.appController?.model.logout?.();
      window.appController?.navigateToPage("login");
    });
  },
};
