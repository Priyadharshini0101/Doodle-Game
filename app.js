const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50, 
    doodlerRightSpace = 50, 
    isGameOver = false,
    platformCount = 10, 
    platforms = [],
    startPoint   = 50 ,
    doodlerBottomSpace = startPoint,
    upTimerId,
    downTimerId,
    isJumping = true,
    score = 0,
    leftTimerId,
    rightTimerId,
    isGoingLeft = false,
    isGoingRight = false
    grid.classList.add('display')
    class Platform{
        constructor(newPlatformBottom){
            this.bottom = newPlatformBottom
            this.left = Math.random() * 600
            this.visual = document.createElement('div')
            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

document.addEventListener('DOMContentLoaded',() => {
   

    function createPlatforms(){
        for(let i=0;i<platformCount;i++){
            let platformGap = 600/ platformCount;
            let newPlatformBottom = 100 + i * platformGap
            let newPlatform = new Platform(newPlatformBottom)
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    function createDoodler(){
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerRightSpace + 'px'
    }

    createPlatforms()
    createDoodler()
    
 })

 function movePlatforms(){
    if(doodlerBottomSpace  > 200){
        platforms.forEach(platform => {
            platform.bottom -= 4;
            let visual = platform.visual
            visual.style.bottom = platform.bottom + 'px'

            if(platform.bottom < 10){
                let firstPlatform = platforms[0].visual
                firstPlatform.classList.remove('platform')
                platforms.shift();
                score++;
                var newPlatform = new Platform(600)
                platforms.push(newPlatform)
            }
        })
    }
}

function jump(){
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval(function(){
        doodlerBottomSpace += 20;
        doodler.style.bottom = doodlerBottomSpace + 'px'
       
        if(doodlerBottomSpace > (startPoint + 200) || doodlerBottomSpace > 600){
            fall()
            isJumping = false
        }
        
       console.log(doodlerBottomSpace)
    },30)
}

function fall(){
    clearInterval(upTimerId)
    isJumping = false
    downTimerId = setInterval(function(){
        doodlerBottomSpace -= 5;
        doodler.style.bottom = doodlerBottomSpace + 'px'
        if(doodlerBottomSpace <= 0){
            gameOver()
        } 
        platforms.forEach(platform => {
            if((doodlerBottomSpace >= platform.bottom) &&
                (doodlerBottomSpace <= (platform.bottom + 15))&& 
                ((doodlerLeftSpace + 60) >= platform.left) &&
                (doodlerLeftSpace <= (platform.left + 85)) &&
                !isJumping){
                console.log('landed')
                
                startPoint = doodlerBottomSpace
                jump()
                isJumping = true
            }
        })         
    },30)
}

function moveLeft(){
    if(isGoingRight){
        clearInterval(rightTimerId)
        isGoingRight = false
    }
    isGoingLeft = true
    leftTimerId = setInterval(function(){
        if(doodlerLeftSpace >= 0){
            doodlerLeftSpace -= 5
            doodler.style.left = doodlerLeftSpace + 'px'
        }else{
            moveRight()
        }
    },30)
}

function moveRight(){
    if(isGoingLeft){
        clearInterval(leftTimerId)
        isGoingLeft = false
    }
    isGoingRight = true
    rightTimerId = setInterval(function(){
        if(doodlerLeftSpace <= 600){
            doodlerLeftSpace += 5;
            doodler.style.left = doodlerLeftSpace + 'px'
        }else{
            moveLeft()
        }
    },30)
}

function moveStraight(){
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
}

function control(e){
    if(e.key === "ArrowLeft"){
        moveLeft()
    }else if(e.key === "ArrowRight"){
        moveRight()
    }else if(e.key === "ArrowUp"){
        moveStraight()
    }
}

function start(){
    if(!isGameOver){
        setInterval(movePlatforms,30)
        jump()
        document.addEventListener('keyup',control)
        document.querySelector(".button").hidden = "true"; 
    }
}

function  gameOver(){
    console.log("Game Over");
    isGameOver = true;
    while(grid.firstChild){
        grid.removeChild(grid.firstChild);
    }
    const div = document.createElement('div')

    const text = document.createElement('div')
    text.innerHTML = "Score : " + score;
   
    const btn = document.createElement('button')
    btn.textContent = "Play Again"
    btn.classList.add('button')

    btn.onclick = function(){
        location.reload();
    };
    

    div.classList.add('result')
    div.appendChild(text)
    div.appendChild(btn)

    grid.appendChild(div)
   
    clearInterval(upTimerId)
    clearInterval(downTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
}
