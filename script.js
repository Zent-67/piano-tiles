window.onload = function() {
    const lanes = document.querySelectorAll('.lane');
    const startBtn = document.getElementById('startBtn');
    const startScreen = document.getElementById('start-screen');
    const scoreDisplay = document.getElementById('score');
    const laneContainer = document.getElementById('lane-container');

    // Siguraduhin na may music.mp3 ka sa folder
    const song = new Audio('fitterkarma - Kalapastangan (Lyrics).mp3');
    
    let score = 0;
    let gameActive = false;
    let tileSpeed = 6;      // Starting speed
    let spawnRate = 700;    // Starting spawn interval (ms)
    let spawner;

    function createTile() {
        if (!gameActive) return;

        const laneIdx = Math.floor(Math.random() * 4);
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.style.top = '-170px';

        // Press function for both Desktop and Mobile
        const handlePress = (e) => {
            if (!gameActive) return;
            e.stopPropagation();
            e.preventDefault();
            
            // Start music on first click if not playing
            if (song.paused) {
                song.play().catch(err => console.log("Audio play blocked."));
            }

            score++;
            scoreDisplay.innerText = score;
            
            // ACCELERATION: Pabilis nang pabilis sa bawat click
            tileSpeed += 0.18; 
            
            // Pabilis ng pabilis din ang labas ng tiles
            if (score % 5 === 0 && spawnRate > 200) {
                spawnRate -= 40;
                updateSpawner();
            }

            tile.style.backgroundColor = "#ff4d6d";
            tile.remove();
        };

        tile.addEventListener('mousedown', handlePress);
        tile.addEventListener('touchstart', handlePress);

        lanes[laneIdx].appendChild(tile);

        // Movement logic
        let pos = -170;
        const moveInterval = setInterval(() => {
            if (!gameActive) {
                clearInterval(moveInterval);
                return;
            }
            
            pos += tileSpeed;
            tile.style.top = pos + 'px';

            // Game Over if tile reaches bottom
            if (pos > window.innerHeight) {
                clearInterval(moveInterval);
                if (tile.parentElement) {
                    endGame("Nakalampas ka! 💀");
                }
            }
        }, 16);
    }

    function updateSpawner() {
        clearInterval(spawner);
        spawner = setInterval(createTile, spawnRate);
    }

    function endGame(msg) {
        gameActive = false;
        song.pause();
        song.currentTime = 0;
        alert(msg + "\nFinal Score: " + score);
        location.reload();
    }

    // Miss-click logic (pag napindot ang lane)
    laneContainer.addEventListener('mousedown', (e) => {
        if (gameActive && e.target.classList.contains('lane')) {
            endGame("Maling pindot! ❌");
        }
    });

    // Start Button Click
    startBtn.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameActive = true;
        
        // Wake up audio for mobile
        song.play().then(() => {
            song.pause();
            song.currentTime = 0;
        }).catch(() => {});

        spawner = setInterval(createTile, spawnRate);
    });
};