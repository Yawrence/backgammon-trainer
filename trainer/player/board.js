class BackgammonBoard {
    constructor(svgElementId) {
        this.svg = document.getElementById(svgElementId);

        this.width = 1200;
        this.height = 840;

        this.colors = {
            case: "#202326",
            caseInner: "#2a2d2f",
            felt: "#45413e",
            feltDark: "#373635",
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
            topY: 78,
            bottomY: 762,
            pointWidth: 78,
            pointTipTop: 392,
            pointTipBottom: 448,
            checkerRadius: 35,
            checkerGap: 70
        };
    }

    clear() {
        this.svg.innerHTML = "";
    }

    createElement(name, attributes) {
        const element = document.createElementNS(
            "http://www.w3.org/2000/svg",
            name
        );

        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }

        this.svg.appendChild(element);
        return element;
    }

    drawBoard() {
        this.clear();

        this.createElement("rect", {
            width: this.width,
            height: this.height,
            fill: "#383838"
        });

        this.createElement("rect", {
            x: 32,
            y: 34,
            width: 1136,
            height: 772,
            rx: 14,
            fill: this.colors.case
        });

        this.createElement("rect", {
            x: 52,
            y: 58,
            width: 1096,
            height: 724,
            rx: 9,
            fill: this.colors.caseInner
        });

        this.createElement("rect", {
            x: 90,
            y: 78,
            width: 474,
            height: 684,
            rx: 3,
            fill: this.colors.felt
        });

        this.createElement("rect", {
            x: 636,
            y: 78,
            width: 474,
            height: 684,
            rx: 3,
            fill: this.colors.felt
        });

        this.createElement("rect", {
            x: 574,
            y: 34,
            width: 52,
            height: 772,
            fill: this.colors.bar
        });

        this.createElement("rect", {
            x: 591,
            y: 66,
            width: 18,
            height: 708,
            fill: "#343739"
        });

        this.drawPoints();

        this.createElement("rect", {
            x: 32,
            y: 34,
            width: 1136,
            height: 772,
            rx: 14,
            fill: "none",
            stroke: "#131517",
            "stroke-width": 12
        });
    }

    drawPoints() {
        for (let i = 0; i < 12; i++) {
            const topColor =
                i % 2 === 0 ? this.colors.orange : this.colors.white;

            const bottomColor =
                i % 2 === 0 ? this.colors.white : this.colors.orange;

            this.drawPoint(i, true, topColor);
            this.drawPoint(i, false, bottomColor);
        }
    }

    drawPoint(index, top, color) {
        const half = index < 6 ? "left" : "right";
        const localIndex = index % 6;

        const baseX =
            half === "left"
                ? this.geometry.leftX
                : this.geometry.rightX;

        const x1 =
            baseX + localIndex * this.geometry.pointWidth + 6;

        const x2 =
            x1 + 72;

        const cx =
            x1 + 36;

        let points;

        if (top) {
            points =
                `${x1},86 ${x2},86 ${cx},392`;
        } else {
            points =
                `${x1},754 ${x2},754 ${cx},448`;
        }

        this.createElement("polygon", {
            points,
            fill: color
        });
    }

    getPointCenter(point) {
        // point 1-6 unten rechts, 7-12 unten links,
        // 13-18 oben links, 19-24 oben rechts

        let index;
        let top;

        if (point >= 1 && point <= 6) {
            top = false;
            index = 12 - point;
        } else if (point >= 7 && point <= 12) {
            top = false;
            index = 12 - point;
        } else if (point >= 13 && point <= 18) {
            top = true;
            index = point - 13;
        } else if (point >= 19 && point <= 24) {
            top = true;
            index = point - 13;
        } else {
            throw new Error("Invalid point: " + point);
        }

        const half = index < 6 ? "left" : "right";
        const localIndex = index % 6;

        const baseX =
            half === "left"
                ? this.geometry.leftX
                : this.geometry.rightX;

        const x =
            baseX +
            localIndex * this.geometry.pointWidth +
            this.geometry.pointWidth / 2;

        return { x, top };
    }

    drawChecker(x, y, player) {
        const isDark =
            player === "dark" || player === "Oli";

        const fill =
            isDark
                ? this.colors.darkChecker
                : this.colors.lightChecker;

        const edge =
            isDark
                ? this.colors.darkCheckerEdge
                : this.colors.lightCheckerEdge;

        this.createElement("circle", {
            cx: x,
            cy: y,
            r: this.geometry.checkerRadius,
            fill: fill,
            stroke: edge,
            "stroke-width": 4
        });

        this.createElement("circle", {
            cx: x,
            cy: y,
            r: 27,
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

            if (stack.Oli) {
                this.drawStack(Number(point), "Oli", stack.Oli);
            }

            if (stack.BD) {
                this.drawStack(Number(point), "BD", stack.BD);
            }

            if (stack.dark) {
                this.drawStack(Number(point), "dark", stack.dark);
            }

            if (stack.light) {
                this.drawStack(Number(point), "light", stack.light);
            }
        }
    }
}

function drawBoard() {
    const board = new BackgammonBoard("backgammonBoard");

    board.drawPosition({
        24: { BD: 2 },
        13: { Oli: 5 },
        8: { Oli: 3 },
        6: { BD: 5 },
        1: { Oli: 2 },
        12: { BD: 5 }
    });

    window.backgammonBoard = board;
}
