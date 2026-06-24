const revealButton = document.getElementById("revealButton");
const nextButton = document.getElementById("nextButton");
const solution = document.getElementById("solution");

function revealSolution() {
    solution.classList.remove("hidden");
}

revealButton.addEventListener("click", revealSolution);

document.addEventListener("keydown", function(event) {

    if (event.code === "Space" || event.code === "Enter") {
        revealSolution();
    }

});

nextButton.addEventListener("click", function() {

    alert("Später wird hier die nächste Position geladen.");

});
