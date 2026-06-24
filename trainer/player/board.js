
function drawBoard() {
    const canvas = document.getElementById("backgammonBoard");
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    const boardColor = "#777777";
    const pointOrange = "#d98a2b";
    const pointWhite = "#f4f1e8";
    const borderColor = "#333333";

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = boardColor;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, width - 6, height - 6);

    const margin = 30;
    const barWidth = 36;
    const playableWidth = width - 2 * margin - barWidth;
    const pointWidth = playableWidth / 12;
    const pointHeight = height * 0.38;

    function drawTriangle(x, top, color) {
        ctx.fillStyle = color;

        if (top) {
            ctx.beginPath();
            ctx.moveTo(x, margin);
            ctx.lineTo(x + pointWidth, margin);
            ctx.lineTo(x + pointWidth / 2, margin + pointHeight);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(x, height - margin);
            ctx.lineTo(x + pointWidth, height - margin);
            ctx.lineTo(x + pointWidth / 2, height - margin - pointHeight);
            ctx.closePath();
            ctx.fill();
        }
    }

    for (let i = 0; i < 12; i++) {
        const beforeBar = i < 6;
        const x =
            margin +
            i * pointWidth +
            (beforeBar ? 0 : barWidth);

        const color =
            i % 2 === 0 ? pointOrange : pointWhite;

        drawTriangle(x, true, color);
        drawTriangle(x, false, color === pointOrange ? pointWhite : pointOrange);
    }

    const barX = margin + 6 * pointWidth;

    ctx.fillStyle = "#555555";
    ctx.fillRect(barX, 0, barWidth, height);

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(barX, 0, barWidth, height);

    drawDemoCheckers(ctx, width, height, margin, pointWidth, barWidth);
}

function drawChecker(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawDemoCheckers(ctx, width, height, margin, pointWidth, barWidth) {
    const oliColor = "#444444";
    const bdColor = "#dddddd";

    const radius = 18;

    function pointCenter(index) {
        const beforeBar = index < 6;
        return (
            margin +
            index * pointWidth +
            (beforeBar ? 0 : barWidth) +
            pointWidth / 2
        );
    }

    // Demo-Steine unten links
    drawChecker(ctx, pointCenter(0), height - 50, radius, oliColor);
    drawChecker(ctx, pointCenter(0), height - 90, radius, oliColor);
    drawChecker(ctx, pointCenter(0), height - 130, radius, oliColor);

    // Demo-Steine oben rechts
    drawChecker(ctx, pointCenter(11), 50, radius, bdColor);
    drawChecker(ctx, pointCenter(11), 90, radius, bdColor);
    drawChecker(ctx, pointCenter(11), 130, radius, bdColor);
}
