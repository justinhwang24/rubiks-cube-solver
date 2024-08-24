function typeInfo(sentence, if_del) {
    const terminal = document.getElementById('terminal');
    const typewriter = new Typewriter(terminal);

    if(if_del == true) {
      typewriter.typeString(sentence)
        .pauseFor(500)
        .deleteAll()
        .start();
    }
    else typewriter.typeString(sentence).start();
}

function cubeShuffle() {
    let shuffle = Cube.scramble();
    typeInfo("Shuffle: " + shuffle, true);
    let shuffle_step = convertAlg(shuffle);
    
    console.log(shuffle_step);
    cubeGL.shuffle(shuffle_step.length, shuffle_step);
}

function cubeReset() {
    updateCubeTwoPhase();
    const solveString = cubeTwoPhase.solve();
    let solve_step = convertAlg(solveString);
    
    cubeGL.twistDuration = 0;
    cubeGL.twist(solve_step);
    setTimeout("cubeGL.twistDuration = 300", 1000);
}

// Convert algorithm from spaced to unspaced
function convertAlg(alg) {
    const solveArr = alg.split(' ');
    let solve_step = '';
    for (let i = 0; i < solveArr.length; i++) {
        const move = solveArr[i];
        console.log(move);
        let face = move[0];
        if (move.length == 2) {
            if (move[1] == '\'') face = face.toLowerCase();
            else if (move[1] == '2') face += face;
        }
        solve_step += face;
    }
    return solve_step;
}