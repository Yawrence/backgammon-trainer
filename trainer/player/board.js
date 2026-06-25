class BackgammonBoard {
    constructor(svgElementId) {
        this.svg = document.getElementById(svgElementId);

        this.colors = {
            case: "#202326",
            caseInner: "#2a2d2f",
            felt: "#45413e",
            bar: "#232628",
            orange: "#dc7650",
            white: "#eee8dd",
            darkChecker: "#4f4f4f",
            darkCheckerEdge: "#2e2e2e",
            lightChecker: "#cfcbc0",
            lightCheckerEdge: "#948f86"
        };

        this.geometry = {
            leftX: 90,
            rightX: 636,
            pointWidth: 78,
            checkerRadius: 30,
            checkerGap: 64
        };
    }

    clear() {
        this.svg.innerHTML = "";
    }

    el(name, attrs) {
        const e = document.createElementNS("http://www.w3.org/2000/svg", name);
        Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
        this.svg.appendChild(e);
        return e;
    }

    drawBoard() {
        this.clear();

        this.el("rect", { width: 1200, height: 840, fill: "#383838" });
        this.el("rect", { x: 32, y: 34, width: 1136, height: 772, rx: 14, fill: this.colors.case });
        this.el("rect", { x: 52, y: 58, width: 1096, height: 724, rx: 9, fill: this.colors.caseInner });

        this.el("rect", { x: 90, y: 78, width: 474, height: 684, rx: 3, fill: this.colors.felt });
        this.el("rect", { x: 636, y: 78, width: 474, height: 684, rx: 3, fill: this.colors.felt });

        this.el("rect", { x: 574, y: 34, width: 52, height: 772, fill: this.colors.bar });
        this.el("rect", { x: 591, y: 66, width: 18, height: 708, fill: "#343739" });

        this.drawPoints();

        this.el("rect", {
            x: 32, y: 34, width: 1136, height: 772, rx: 14,
            fill: "none", stroke: "#131517", "stroke-width": 12
        });
    }

    drawPoints() {
        for (let i = 0; i < 12; i++) {
            this.drawPoint(i, true, i % 2 === 0 ? this.colors.orange : this.colors.white);
            this.drawPoint(i, false, i % 2 === 0 ? this.colors.white : this.colors.orange);
        }
    }

    drawPoint(index, top, color) {
        const baseX = index < 6 ? this.geometry.leftX : this.geometry.rightX;
        const local = index % 6;

        const x1 = baseX + local * this.geometry.pointWidth + 6;
        const x2 = x1 + 72;
        const cx = x1 + 36;

        const points = top
            ? `${x1},86 ${x2},86 ${cx},392`
            : `${x1},754 ${x2},754 ${cx},448`;

        this.el("polygon", { points, fill: color });
    }

    getPointCenter(point) {
        let index;
        let top;

        if (point >= 1 && point <= 12) {
            top = false;
            index = 12 - point;
        } else {
            top = true;
            index = point - 13;
        }

        const baseX = index < 6 ? this.geometry.leftX : this.geometry.rightX;
        const local = index % 6;

        return {
            x: baseX + local * this.geometry.pointWidth + this.geometry.pointWidth / 2,
            top
        };
    }

    drawChecker(x, y, player) {
        const dark = player === "Oli" || player === "dark";

        this.el("circle", {
            cx: x,
            cy: y,
            r: this.geometry.checkerRadius,
            fill: dark ? this.colors.darkChecker : this.colors.lightChecker,
            stroke: dark ? this.colors.darkCheckerEdge : this.colors.lightCheckerEdge,
            "stroke-width": 4
        });

        this.el("circle", {
            cx: x,
            cy: y,
            r: this.geometry.checkerRadius - 8,
            fill: "none",
            stroke: "rgba(255,255,255,0.16)",
            "stroke-width": 2
        });
    }

    drawStack(point, player, count) {
        const center = this.getPointCenter(point);

        for (let i = 0; i < count; i++) {
            const y = center.top
                ? 122 + i * this.geometry.checkerGap
                : 718 - i * this.geometry.checkerGap;

            this.drawChecker(center.x, y, player);
        }
    }

    drawPosition(position) {
        this.drawBoard();

        for (const point in position) {
            const stack = position[point];

            if (stack.Oli) this.drawStack(Number(point), "Oli", stack.Oli);
            if (stack.BD) this.drawStack(Number(point), "BD", stack.BD);
            if (stack.dark) this.drawStack(Number(point), "dark", stack.dark);
            if (stack.light) this.drawStack(Number(point), "light", stack.light);
        }
    }
}

window.backgammonBoard =
    new BackgammonBoard("backgammonBoard");
