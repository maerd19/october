addEventListener('keydown', (e)=>{
    if(e.keyCode === 78) {
        document.getElementById('start').textContent = '';
    }
});

// const levelSelection = doUwantItHard => {
//     document.getElementById("levels").style.visibility = "hidden";
//     document.getElementById("start").style.visibility = "visible";
//     // alert('Dif: ' + difficulty.value);
//     difficulty = doUwantItHard.value;
//     trainLifePoints = (difficulty === 'easy') ? 100 : (difficulty === 'medium') ? 80 : 600;
// }
