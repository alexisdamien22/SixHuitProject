import { el } from "../../utils/DOMBuilder.js";

export class MusicPage {
    constructor(app) {
        this.app = app;
        this.anecdotes = [
            { id: 1, title: "Bach improvisait comme un champion", img: "/assets/img/collection/bach.jpg", desc: "Johann Sebastian Bach était célèbre pour ses improvisations à l'orgue. Un jour, un musicien venu de France voulait l'affronter dans un concours d'improvisation. Quand il a etendu Bach s'échauffer à l'orgue... il est reparti discrètement avant même le duel." },
            { id: 2, title: "Le violoniste magicien", img: "/assets/img/collection/paganini.jpg", desc: "Niccolò Paganini jouait du violon avec une virtuosité incroyable. Sa technique était si spectaculaire que certains pensaient qu'il avait fait un pacte avec le diable. En rélité, il avait simplement développé une tehnique totalement nouvelle pour son époque." },
            { id: 3, title: "Un scandaleux concert", img: "/assets/img/collection/le_sacre_du_printemps.jpg", desc: "En 1913, à Paris, le ballet Le Sacre du printemps d'Igor Stravinski a provoqué un énorme scandale. La musique était si nouvelle et surprenante que certins spectateurs ont hué pendant que d'autres applaudissaient. Le bruit était tel que les danseurs entendaient à peine l'orchestre." },
            { id: 4, title: "Le compositeur qui aimait les trains", img: "/assets/img/collection/dvorak.jpg", desc: "Antonín Dvořák adorait observer les locomotives dans les gares. Pendant son séjour aux États-Unis, il passait parfois des heures à regarder les trains. Les rythmes des locomotives auraient inspiré certaines idées musicales." },
            { id: 5, title: "Le silence le plus célèbre de la musique", img: "/assets/img/collection/cage4m33.jpg", desc: "En 1952, le compositeur John Cage a écrit une œuvre très particulière : 4 minutes et 33 secondes… sans aucune note. Les musiciens restent silencieux. La « musique » devient alors tous les sons de la salle : respirations, toux, chaises qui grincent." },
            { id: 6, title: "Le plus grand instrument du monde", img: "/assets/img/collection/orgue.jpg", desc: "L’orgue d’église est souvent considéré comme le plus grand instrument musical. Certains possèdent plus de 10 000 tuyaux et peuvent produire des sons très puissants, capables de remplir une immense cathédrale." },
            { id: 7, title: "Beetothoven testait son piano... trop fort", img: "/assets/img/collection/beetoven.jpg", desc: "Beethoven avait la réputation de jouer très puissamment. Certains de ses pianos se cassaient rapidement parce qu’il frappait les touches avec beaucoup d’énergie. Mais cette puissance correspondait parfaitement à la musique intense qu’il écrivait." },
            { id: 8, title: "Le piano est aussi un instrument de percussion", img: "/assets/img/collection/piano.jpg", desc: "Quand on appuie sur une touche de piano, un petit marteau frappe une corde. C’est pourquoi le piano est à la fois un instrument à cordes et un instrument de percussion." },
            { id: 9, title: "La musique avant la métronome", img: "/assets/img/collection/mozart.jpg", desc: "Quand Mozart composait, le métronome n’avait pas encore été inventé. Les musiciens devaient deviner le bon tempo grâce aux indications écrites et à leur expérience." },
            { id: 10, title: "Certains chefs d'orchestre dirigent sans baguette", img: "/assets/img/collection/baguette.jpg", desc: "La baguette sert à rendre les gestes plus visibles, mais certains chefs préfèrent diriger uniquement avec leurs mains. Cela permet parfois d’exprimer plus de nuances et de détails." },
            { id: 11, title: "Le concert se termine sans musicien", img: "/assets/img/collection/haydn.jpg", desc: "Joseph Haydn a composé en 1772 une œuvre très particulière : la Symphonie n°45, surnommée « Symphonie des adieux ». À cette époque, les musiciens de l’orchestre étaient retenus depuis longtemps dans le palais de leur employeur et voulaient rentrer chez eux. Pour faire passer le message sans se fâcher, Haydn a eu une idée originale : à la fin de la symphonie, les musiciens s’arrêtent de jouer un par un, éteignent leur bougie et quittent la scène… jusqu’à ce qu’il ne reste presque plus personne. Le prince a parfaitement compris le message — et les musiciens ont pu rentrer chez eux dès le lendemain." },
            { id: 12, title: "L'étourneau de Mozart", img: "/assets/img/collection/etourneau.jpg", desc: "En avril 1784, Mozart achète un étourneau, une espèce proche du merle. Il est fasciné par le chant de cet oiseau qui parvient même à reproduire des extraits d’une de ses compositions. Selon son carnet, il aurait acheté l’oiseau 34 kreutzer après l’avoir entendu siffler un motif de son concerto pour piano n°17 en sol majeur ! Mozart s’attache beaucoup à cet oiseau. À sa mort, il lui organise même de véritables funérailles, avec un petit poème." },
            { id: 13, title: "La réplique de Brahms", img: "/assets/img/collection/brahms.jpg", desc: "Un jour, Brahms jouait une sonate avec un violoncelliste dont la justesse laissait beaucoup à désirer. Au milieu de l’exécution, le violoncelliste se tourna vers lui et lui dit : « Pourriez-vous jouer un peu moins fort ? Je ne m’entends pas. » Brahms lui répondit alors, imperturbable : « Vous avez bien de la chance. »" },
            // Ajouter les autres annecdotes
        ]; 
    }

    async render() {
        const childData = (await this.app.model.getChildData()) || {};
        const weeklyPlan = childData.weeklyPlan || [];
        
        const lessonsDoneCount = weeklyPlan.filter(entry => entry.status === 1).length;

        const cards = this.anecdotes.map((item, index) => {
            const isUnlocked = index < lessonsDoneCount;

            const cardContent = [
                el("div", { className: "card-shadow" }),
                el("div", { 
                    className: "card-main" 
                }, 
                    el("img", { src: item.img, className: "card-img", alt: item.title }),
                    !isUnlocked ? el("div", { className: "card-lock-overlay" }, "🔒") : null,
                    el("div", { className: "card-title" }, item.title)
                )
            ];

            return el(
                "div",
                { 
                    className: `anecdote-card ${!isUnlocked ? "is-locked" : ""}`,
                    onClick: () => isUnlocked ? this.showModal(item) : null
                },
                ...cardContent
            );
        });

        return el(
            "div",
            { className: "page collection-page" },
            el("h2", { className: "page-title" }, "Ma Collection"),
            el("p", { className: "page-subtitle" }, `${lessonsDoneCount} anecdotes débloquées`),
            el("div", { className: "collection-grid" }, ...cards)
        );
    }

    showModal(item) {
        const modal = el(
            "div",
            { 
                className: "modal-overlay",
                onClick: (e) => { if(e.target.className === "modal-overlay") modal.remove(); }
            },
            el("div", { className: "modal-content" },
                el("img", { src: item.img, className: "modal-header-img" }),
                el("div", { className: "modal-body" },
                    el("h3", {}, item.title),
                    el("p", { className: "modal-desc" }, item.desc),
                    el("button", { 
                        className: "start-btn",
                        onClick: () => modal.remove()
                    }, "FERMER")
                )
            )
        );

        document.body.appendChild(modal);
    }
}