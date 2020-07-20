
//When DOM loads, run function
$(document).ready(function () {

    //If Play Btn is pressed
    $('#PlayBtn').click(function () {
        $('#intro').slideUp();
        $('#Game_Container').slideDown();

        //LoadGame after 1 second delay
        setTimeout(LoadGame, 1000);
    });

    $('#PlayAgainBtn').click(function () {
        //Remove PlayAgainBtn
        $('#PlayAgainBtn').slideUp();
        //Reset values
        ResetValues();
        //LoadGame after 1 second delay
        setTimeout(LoadGame, 1000);
    });

});

function ResetValues() {
    WallHit = false;
    PaddleHit = false;
    GameOver = false;
    NewTop = 0;
    NewLeft = 0;
    Score = 0;
    Level = 1;
    Ball_Velocity = 1;

    $('#Score_Container').hide();
    $('#Score_Container').css({
        top: '10vh',
        left: '50%',
        transform: 'translate(-50%)',
        fontSize: '200%',
    }).slideDown();

    $('#Level_Container').hide();
    $('#Level_Container').css({
        top: '15vh',
        left: '50%',
        transform: 'translate(-50%)',
        fontSize: '100%',
    }).slideDown();

    $('#Next_Level_Indicator').slideUp();
    $('#Next_Level_Indicator div').css({
        backgroundColor: '#ecf0f1',
    });
}

//Declare Global Variables
let Ball_Move_Timeout;
let Score_Update_Timeout;
let Level_Indicator_Timeout
let WallHit = false;
let PaddleHit = false;
let GameOver = false;
let NewTop = 0;
let NewLeft = 0;
let Score = 0;
let Level = 1;
let Ball_Velocity = 1;
let p;

//Load the Game
function LoadGame() {

    //Show Paddle
    $('#Paddle').slideDown();

    //Show Ball and choose random location
    $('#Ball').slideDown().css({
        top: Math.floor(Math.random() * 30) + 10 + 'vh',
        left: Math.floor(Math.random() * 80) + 10 + 'vw'
    });

    //Generate Random angle of ball and first velocity
    let Ball_Angle = Math.floor(Math.random() * 360);
    
    //Make sure angle is not too up and down or left and right
    while ((Ball_Angle >= 140 && Ball_Angle <= 220) || (Ball_Angle >= 0 && Ball_Angle <= 40) || (Ball_Angle <= 360 && Ball_Angle >= 320) || (Ball_Angle == 90) || (Ball_Angle == 270)) {
        Ball_Angle = Math.floor(Math.random() * 360);
    } 
    
    Ball_Angle *= Math.PI / 180;

    let Ball_Object = new Ball(Ball_Velocity, Ball_Angle, Score, Level);

    //Start ball movements after 1 second delay
    setTimeout(StartGame, 1000, Ball_Object);

}

function StartGame(Ball_Object) {

    //If mouse moves move  paddle
    $(document).mousemove(function (e) {
        if (!(GameOver)) {
            MovePaddle(e);
        }
    })

    //Move the ball
    MoveBall(Ball_Object);

    //Setup Indicator Constraints
    let Next_Indicator_Array = IndicatorSetup();

    //Start the Score keeping
    UpdateScore(Ball_Object, Next_Indicator_Array);

}

function IndicatorSetup() {

    //Initialize Arrays
    let Ranges_Array = [0, 15, 50, 150, 300, 500];
    let Next_Indicator_Array = [0, 12, 43, 141, 286, 482];

    return Next_Indicator_Array;
}


function UpdateScore(Ball_Object, Next_Indicator_Array) {


    //Check for score and based on level, increase speed and score multiplier
    SpeedIncreaseCheck(Ball_Object, Next_Indicator_Array);

    //Set Score Variable
    Score = Ball_Object.Score;

    //If it doesnt hit something, stop counting score
    if (GameOver) {
        clearTimeout(Score_Update_Timeout);
    } else {

        //Display Score
        $('#Score_Container').text(Score);

        //IncrementScore
        Score = Score + Ball_Object.Level;
        Ball_Object.Score = Score;

        Score_Update_Timeout = setTimeout(UpdateScore, 1000, Ball_Object, Next_Indicator_Array);
    }
}

function SpeedIncreaseCheck(Ball_Object, Next_Indicator_Array) {
    
    //Initialize Arrays
    let Ranges_Array = [0, 15, 50, 150, 300];
    let ScoreCheck = Ball_Object.Score;
    let LevelCheck = Ball_Object.Level;

    for (let i = 0; i < Next_Indicator_Array.length; ++i) {

        //Dont include level 0
        if (i != 0) {
            if (ScoreCheck == Next_Indicator_Array[i]) {
                LevelIndicator(0);
            } else if (ScoreCheck == Next_Indicator_Array[i] + LevelCheck) {
                LevelIndicator(1);
            } else if (ScoreCheck == Next_Indicator_Array[i] + (2 * LevelCheck)) {
                LevelIndicator(2);
            } else if (ScoreCheck == Next_Indicator_Array[i] + (3 * LevelCheck)) {
                LevelIndicator(3);

                setTimeout(() => {
                    $('#Next_Level_Indicator div').css({
                        backgroundColor: '#ecf0f1',
                        border: 'none',
                    });
                }, 2000)
            } else if (ScoreCheck == Next_Indicator_Array[i] - LevelCheck) {
                LevelIndicator(-1);
            } 
        }
    
    }
    
    //Level and Velocity Increaser
    if (Ball_Object.Score >= 15 && Ball_Object.Score < 50) {
        Ball_Object.Level = 2;
        Ball_Object.Ball_Velocity = 3;
    }
    if (Ball_Object.Score >= 50 && Ball_Object.Score < 150) {
        Ball_Object.Level = 3;
        Ball_Object.Ball_Velocity = 6;
    }
    if (Ball_Object.Score >= 150 && Ball_Object.Score < 300) {
        Ball_Object.Level = 4;
        Ball_Object.Ball_Velocity = 9;
    }
    if (Ball_Object.Score >= 300) {
        Ball_Object.Level = 5;
        Ball_Object.Ball_Velocity = 12;
    }
    if (Ball_Object.Score >= 500) {
        Ball_Object.Level = 6;
        Ball_Object.Ball_Velocity = 16;
    }
    

    //Display Level
    $('#Level_Container').text("Level " + Ball_Object.Level);

}

function LevelIndicator(i) {

    switch (i) {
        case -1:
            $('#Next_Level_Indicator').slideDown();
            break;
        case 0:
            $('#Indicator_1').css({
                backgroundColor: '#e74c3c',
                border: 'none',
            });
            break;
        case 1:
            $('#Indicator_2').css({
                backgroundColor: '#f1c40f',
                border: 'none',
            });
            break;
        case 2:
            $('#Indicator_3').css({
                backgroundColor: '#2ecc71',
                border: 'none',
            });
            break;
        case 3:
            //If not in indicator range hide indicator panel
            $('#Next_Level_Indicator div').css({
                backgroundColor: '#2ecc71',
                border: 'none',
            });

            $('#Next_Level_Indicator').delay(1000).slideUp();
            break;
        default:
            break;
    }
}

function GameOverScreen(Ball_Object) {

    $('#Ball').slideUp();
    $('#Paddle').slideUp();
    $('#Score_Container').hide();
    $('#PlayAgainBtn').slideDown();

    $('#Score_Container').css({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '500%',
    }).slideDown();

    $('#Level_Container').css({
        top: '42%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '100%',
    }).slideDown();

}