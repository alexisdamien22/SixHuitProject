export const ParentHomePage = {
  getHTML: (parentData) => {
    return `
      <div class="parent-screen" style="padding: 20px; text-align: center;">
        <h1 style="margin-bottom: 20px;">Espace Parent</h1>
       
        
        <button id="add-child-btn" class="ca-btn-next" style="margin-top: 40px; max-width: 300px;">
          + Ajouter un profil enfant
        </button>
      </div>
    `;
  },

  afterRender: () => {
    document.getElementById("add-child-btn")?.addEventListener("click", () => {
      //TODO : Rediriger vers le formulaire d'ajout d'un enfant
    });
  },
};
