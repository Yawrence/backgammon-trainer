function drawBoard() {
    const canvas = document.getElementById("backgammonBoard");
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    const board = {
        bg: "#777777",
        border: "#2f2f2f",
        bar: "#5f5f5f",
        orange: "#d98a2b",
        white: "#f4f1e8"
    };

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = board.bg;
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 8;
    ctx.strokeStyle = board.border;
    ctx.strokeRect(4, 4, width - 8, height - 8);

    const margin = 35;
    const barWidth = 44;
    const innerWidth = width - margin * 2 - barWidth;
    const pointWidth = innerWidth / 12;
    const pointHeight = height * 0.38;

    function pointX(i) {
        return margin + i * pointWidth + (i >= 6 ? barWidth : 0);
    }

    function triangle(x, isTop, color) {
        ctx.fillStyle = color;
        ctx.beginPath();

        if (isTop) {
            ctx.moveTo(x, margin);
            ctx.lineTo(x + pointWidth, margin);
            ctx.lineTo(x + pointWidth / 2, margin + pointHeight);
        } else {
            ctx.moveTo(x, height - margin);
            ctx.lineTo(x + pointWidth, height - margin);
            ctx.lineTo(x + pointWidth / 2, height - margin - pointHeight);
        }

        ctx.closePath();
        ctx.fill();
    }

    for (let i = 0; i < 12; i++) {
        const topColor = i % 2 === 0 ? board.orange : board.white;
        const bottomColor = i % 2 === 0 ? board.white : board.orange;

        triangle(pointX(i), true, topColor);
        triangle(pointX(i), false, bottomColor);
    }

    const barX = margin + 6 * pointWidth;

    ctx.fillStyle = board.bar;
    ctx.fillRect(barX, 0, barWidth, height);

    ctx.strokeStyle = board.border;
    ctx.lineWidth = 3;
    ctx.strokeRect(barX, 0, barWidth, height);

    ctx.fillStyle = "#dddddd";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";

    ctx.fillText("BAR", barX + barWidth / 2, height / 2);

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(margin, margin, width - 2 * margin, height - 2 * margin);
}
