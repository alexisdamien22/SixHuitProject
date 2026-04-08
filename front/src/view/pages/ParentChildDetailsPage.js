import { el } from "../../utils/DOMBuilder.js";
import { ApiClient } from "../../model/ApiClient.js";

export class ParentChildDetailsPage {
    constructor(app) {
        this.app = app;
        this.childData = null;
        this.isLoading = true;
    }

    async render() {
        const childId = localStorage.getItem("viewingChildId");
        if (!this.childData || this.childData.id != childId) {
            this.isLoading = true;
            try {
                const data = await ApiClient.get(`/child/${childId}`);
                this.childData = data || { name: "Profil introuvable" };
            } catch (err) {
                this.childData = { name: "Erreur" };
            } finally {
                this.isLoading = false;
            }
        }

        if (this.isLoading)
            return el(
                "div",
                { className: "page page-centered" },
                "Chargement...",
            );

        const history = this.childData.sessions || [];
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        const filteredSessions = history
            .filter((s) => new Date(s.session_date) >= twoMonthsAgo)
            .sort(
                (a, b) => new Date(a.session_date) - new Date(b.session_date),
            );

        return el(
            "div",
            { className: "page parent-details-page" },
            this.renderHeader(),
            el(
                "div",
                { className: "stats-container" },
                el(
                    "div",
                    { className: "dashboard-section" },
                    el(
                        "h3",
                        { className: "section-title" },
                        "Évolution du moral",
                    ),
                    el(
                        "div",
                        { className: "graph-and-axis" },
                        el(
                            "div",
                            { className: "graph-wrapper" },
                            this.renderYAxisMood(),
                            this.renderCurveGraph(
                                filteredSessions,
                                "happiness",
                                3,
                            ),
                        ),
                        this.renderXAxis(filteredSessions),
                    ),
                ),
                el(
                    "div",
                    { className: "dashboard-section" },
                    el(
                        "h3",
                        { className: "section-title" },
                        "Respect des objectifs",
                    ),
                    el(
                        "div",
                        { className: "graph-and-axis" },
                        el(
                            "div",
                            { className: "graph-wrapper" },
                            this.renderYAxisQuality(),
                            this.renderBarGraph(filteredSessions),
                        ),
                        this.renderXAxis(filteredSessions),
                    ),
                ),
            ),
            el(
                "div",
                { className: "dashboard-section" },
                el("h3", { className: "section-title" }, "Dernières séances"),
                el(
                    "div",
                    { className: "history-list" },
                    history.length > 0
                        ? history
                              .slice(0, 10)
                              .map((s) => this.renderHistoryRow(s))
                        : el(
                              "p",
                              { className: "empty-text" },
                              "Aucune donnée.",
                          ),
                ),
            ),
        );
    }

    renderHeader() {
        return el(
            "div",
            { className: "details-header" },
            el(
                "button",
                {
                    className: "back-circle-btn",
                    onClick: () => this.app.navigation.goTo("parent-home"),
                },
                "‹",
            ),
            el(
                "div",
                { className: "header-info" },
                el("h2", { className: "ca-title" }, this.childData.name),
                el(
                    "p",
                    { className: "subtitle" },
                    this.childData.instrument || "Instrument non défini",
                ),
            ),
            el(
                "div",
                { className: "header-mascot" },
                this.childData.mascot || "🦊",
            ),
        );
    }

    renderYAxisMood() {
        return el(
            "div",
            { className: "graph-y-axis" },
            el("span", {}, "🤩"),
            el("span", {}, "😊"),
            el("span", {}, "🫥"),
            el("span", {}, "😞"),
        );
    }

    renderYAxisQuality() {
        return el(
            "div",
            { className: "graph-y-axis labels" },
            el("span", {}, "Top"),
            el("span", {}, "Ok"),
            el("span", {}, "Nul"),
        );
    }

    renderXAxis(data) {
        if (data.length < 2) return el("div", { className: "graph-x-axis" });
        const points = [
            data[0],
            data[Math.floor(data.length / 2)],
            data[data.length - 1],
        ];
        return el(
            "div",
            { className: "graph-x-axis" },
            points.map((s) => {
                const d = new Date(s.session_date);
                return el(
                    "span",
                    { className: "x-label" },
                    d.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                    }),
                );
            }),
        );
    }

    renderCurveGraph(data, key, maxVal) {
        if (data.length < 2)
            return el(
                "div",
                { className: "graph-empty" },
                "Données insuffisantes",
            );
        const width = 1000,
            height = 200,
            padding = 10;
        const gW = width - padding * 2,
            gH = height - padding * 2;
        const stepX = gW / (data.length - 1);
        const points = data.map((s, i) => ({
            x: padding + i * stepX,
            y: height - padding - (s[key] / maxVal) * gH,
        }));
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i],
                p1 = points[i + 1],
                cpX = (p0.x + p1.x) / 2;
            d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
        }
        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg",
        );
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.setAttribute("preserveAspectRatio", "none");
        svg.innerHTML = `<path d="${d}" class="path-curve" />`;
        return svg;
    }

    renderBarGraph(data) {
        if (data.length === 0)
            return el(
                "div",
                { className: "graph-empty" },
                "Données insuffisantes",
            );
        const colors = ["#ff5252", "#58cc02", "#ffb900"];
        return el(
            "div",
            { className: "bar-chart" },
            data.map((s) =>
                el(
                    "div",
                    { className: "bar-container" },
                    el("div", {
                        className: "bar-fill",
                        style: `height: ${((s.quality + 1) / 3) * 100}%; background: ${colors[s.quality]}`,
                    }),
                ),
            ),
        );
    }

    renderHistoryRow(session) {
        const date = new Date(session.session_date).toLocaleDateString(
            "fr-FR",
            { day: "numeric", month: "short" },
        );
        const emojis = ["😞", "🫥", "😊", "🤩"];
        const qIcons = [
            "❌ Temps ignoré",
            "✅ Temps respecté",
            "🔥 Séance bonus",
        ];
        return el(
            "div",
            { className: "history-row" },
            el(
                "div",
                { className: "row-main" },
                el("span", { className: "row-date" }, date),
                el(
                    "span",
                    { className: "row-quality" },
                    qIcons[session.quality],
                ),
            ),
            el("div", { className: "row-mood" }, emojis[session.happiness]),
        );
    }
}
