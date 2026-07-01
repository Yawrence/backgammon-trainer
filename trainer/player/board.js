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

    el(name, attrs, parent = this.svg) {
        const e = document.createElementNS(
            "http://www.w3.org/2000/svg",
            name
        );

        Object.keys(attrs).forEach(
            k => e.setAttribute(k, attrs[k])
        );

        parent.appendChild(e);

        return e;
    }

    drawBoard() {
        this.clear();

        this.el("rect", {
            width: 1200,
            height: 840,
            fill: "#383838"
        });

        this.el("rect", {
            x: 32,
            y: 34,
            width: 1136,
            height: 772,
            rx: 14,
            fill: this.colors.case
        });

        this.el("rect", {
            x: 52,
            y: 58,
            width: 1096,
            height: 724,
            rx: 9,
            fill: this.colors.caseInner
        });

        this.el("rect", {
            x: 90,
            y: 78,
            width: 474,
            height: 684,
            rx: 3,
            fill: this.colors.felt
        });

        this.el("rect", {
            x: 636,
            y: 78,
            width: 474,
            height: 684,
            rx: 3,
            fill: this.colors.felt
        });

        this.el("rect", {
            x: 574,
            y: 34,
            width: 52,
            height: 772,
            fill: this.colors.bar
        });

        this.el("rect", {
            x: 591,
            y: 66,
            width: 18,
            height: 708,
            fill: "#343739"
        });

        this.drawPoints();

        this.el("rect", {
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

            this.drawPoint(
                i,
                true,
                i % 2 === 0
                    ? this.colors.orange
                    : this.colors.white
            );

            this.drawPoint(
                i,
                false,
                i % 2 === 0
                    ? this.colors.white
                    : this.colors.orange
            );
        }
    }

    drawPoint(index, top, color) {

        const baseX =
            index < 6
                ? this.geometry.leftX
                : this.geometry.rightX;

        const local = index % 6;

        const x1 =
            baseX +
            local * this.geometry.pointWidth +
            6;

        const x2 = x1 + 72;
        const cx = x1 + 36;

        const points = top
            ? `${x1},86 ${x2},86 ${cx},392`
            : `${x1},754 ${x2},754 ${cx},448`;

        this.el("polygon", {
            points,
            fill: color
        });
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

        const baseX =
            index < 6
                ? this.geometry.leftX
                : this.geometry.rightX;

        const local = index % 6;

        return {
            x:
                baseX +
                local * this.geometry.pointWidth +
                this.geometry.pointWidth / 2,
            top
        };
    }

    getCheckerPosition(point, stackIndex) {

        const center =
            this.getPointCenter(point);

        const y = center.top
            ? 122 +
              stackIndex * this.geometry.checkerGap
            : 718 -
              stackIndex * this.geometry.checkerGap;

        return {
            x: center.x,
            y
        };
    }

    drawChecker(
        x,
        y,
        player,
        parent = this.svg
    ) {

        const dark =
            player === "Oli" ||
            player === "dark";

        const group =
            this.el("g", {}, parent);

        group.setAttribute(
            "transform",
            `translate(${x}, ${y})`
        );

        this.el("circle", {
            cx: 0,
            cy: 0,
            r: this.geometry.checkerRadius,
            fill: dark
                ? this.colors.darkChecker
                : this.colors.lightChecker,
            stroke: dark
                ? this.colors.darkCheckerEdge
                : this.colors.lightCheckerEdge,
            "stroke-width": 4
        }, group);

        this.el("circle", {
            cx: 0,
            cy: 0,
            r: this.geometry.checkerRadius - 8,
            fill: "none",
            stroke: "rgba(255,255,255,0.16)",
            "stroke-width": 2
        }, group);

        return group;
    }

    drawStack(point, player, count) {

        for (let i = 0; i < count; i++) {

            const pos =
                this.getCheckerPosition(point, i);

            this.drawChecker(
                pos.x,
                pos.y,
                player
            );
        }
    }

    drawPosition(position) {

        this.drawBoard();

        for (const point in position) {

            const stack =
                position[point];

            if (stack.Oli)
                this.drawStack(
                    Number(point),
                    "Oli",
                    stack.Oli
                );

            if (stack.BD)
                this.drawStack(
                    Number(point),
                    "BD",
                    stack.BD
                );

            if (stack.dark)
                this.drawStack(
                    Number(point),
                    "dark",
                    stack.dark
                );

            if (stack.light)
                this.drawStack(
                    Number(point),
                    "light",
                    stack.light
                );
        }
    }

    animateMove(
        startPosition,
        endPosition,
        player,
        from,
        to,
        callback
    ) {

        const movingStackCount =
            startPosition[from] &&
            startPosition[from][player]
                ? startPosition[from][player]
                : 1;

        const fromPos =
            this.getCheckerPosition(
                from,
                movingStackCount - 1
            );

        const endStackCount =
            endPosition[to] &&
            endPosition[to][player]
                ? endPosition[to][player]
                : 1;

        const toPos =
            this.getCheckerPosition(
                to,
                endStackCount - 1
            );

        const intermediate =
            JSON.parse(
                JSON.stringify(startPosition)
            );

        if (
            intermediate[from] &&
            intermediate[from][player]
        ) {

            intermediate[from][player]--;

            if (
                intermediate[from][player] <= 0
            ) {
                delete intermediate[from][player];
            }
        }

        this.drawPosition(intermediate);

        const checker =
            this.drawChecker(
                fromPos.x,
                fromPos.y,
                player
            );

        const duration = 350;

        const startTime =
            performance.now();

        const animate = (now) => {

            const elapsed =
                now - startTime;

            const rawProgress =
                Math.min(
                    elapsed / duration,
                    1
                );

            const progress =
                1 -
                Math.pow(
                    1 - rawProgress,
                    3
                );

            const x =
                fromPos.x +
                (toPos.x - fromPos.x) *
                    progress;

            const y =
                fromPos.y +
                (toPos.y - fromPos.y) *
                    progress;

            checker.setAttribute(
                "transform",
                `translate(${x}, ${y})`
            );

            if (rawProgress < 1) {

                requestAnimationFrame(
                    animate
                );

            } else {

                this.drawPosition(
                    endPosition
                );

                if (callback) {
                    callback();
                }
            }
        };

        requestAnimationFrame(
            animate
        );
    }

    animateMoveSequence(
        steps,
        callback
    ) {

        const runStep = (index) => {

            if (index >= steps.length) {

                if (callback) {
                    callback();
                }

                return;
            }

            const step =
                steps[index];

            this.animateMove(
                step.startPosition,
                step.endPosition,
                step.player,
                step.from,
                step.to,
                () => runStep(index + 1)
            );
        };

        runStep(0);
    }
}

window.backgammonBoard =
    new BackgammonBoard(
        "backgammonBoard"
    );
