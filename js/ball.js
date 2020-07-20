

class Ball {
    constructor(Ball_Velocity, Ball_Angle, Score, Level) {
        this._Ball_Velocity = Ball_Velocity;
        this._Ball_Angle = Ball_Angle;
        this._Score = Score;
        this._Level = Level;
    }

    set Ball_Velocity(New_Ball_Velocity) {
        this._Ball_Velocity = New_Ball_Velocity;
    }
    set Ball_Angle(New_Ball_Angle) {
        this._Ball_Angle = New_Ball_Angle;
    }
    set Score(New_Score) {
        this._Score = New_Score;
    }
    set Level(New_Level) {
        this._Level = New_Level;
    }

    get Ball_Velocity() {
        return this._Ball_Velocity;
    }
    get Ball_Angle() {
        return this._Ball_Angle;
    }
    get Score() {
        return this._Score;
    }
    get Level() {
        return this._Level;
    }
}

function MoveBall(Ball_Object) {

    //Get velocity and angle of ball
    Ball_Velocity = Ball_Object.Ball_Velocity;
    Ball_Angle = Ball_Object.Ball_Angle;

    //Moving ball logic --------------------------------------------------------------------
    NewTop = (Ball_Velocity * (Math.sin(Ball_Angle))) + $('#Ball').position().top;
    NewLeft = (Ball_Velocity * Math.cos(Ball_Angle)) + $('#Ball').position().left;
    let Normal_Angle = 0;

    //Convert Ball Angle to degrees
    Ball_Angle = (Ball_Angle * 180) / Math.PI;

    while (Ball_Angle < 0) {
        Ball_Angle += 360;
    }

    while (Ball_Angle > 360) {
        Ball_Angle -= 360;
    }

    //Make sure Position cant extend boundaries
    if (NewTop < 0) {
        NewTop = 0;
    }
    if (NewLeft < 0) {
        NewLeft = 0;
    } else if (NewLeft > ($(document).width() - $('#Ball').outerWidth())) {
        NewLeft = $(document).width() - $('#Ball').outerWidth();
    }

    //Change properties of the Ball
    $('#Ball').css({
        left: NewLeft,
        top: NewTop,
    });

    //Detecting Hits logic --------------------------------------------------------------------

    //Detect Left Wall hits
    if (($('#Ball').position().left <= 0)) {

        WallHit = true;

        if (Ball_Angle > 90 && Ball_Angle < 180) {
            //Quadrant 2
            Normal_Angle = 180;
        } else if (Ball_Angle > 180 && Ball_Angle < 270) {
            //Quadrant 3
            Normal_Angle = 180;
        }

    }

    //Detect Right Wall Hits
    if ($('#Ball').position().left >= ($(document).width() - $('#Ball').outerWidth())) {

        WallHit = true;

        if (Ball_Angle > 0 && Ball_Angle < 90) {
            //Quadrant 1
            Normal_Angle = 0;
        } else if (Ball_Angle > 270 && Ball_Angle < 360) {
            //Quadrant 4
            Normal_Angle = 0;
        }
    }

    //Detect Top Wall Hit
    if ($('#Ball').position().top <= 0) {

        WallHit = true;
        Normal_Angle = 270;
    }

    //Detect if Ball hit paddle
    //Detect in Y direction
    if (Math.abs((($('#Ball').position().top + (0.95 * $('#Ball').outerHeight()))) - ($('#Paddle').position().top)) <= 5) {
        //Detect in X direction
        if ($('#Ball').position().left + (0.95 * $('#Ball').outerWidth()) >= ($('#Paddle').position().left)) {
            if (($('#Ball').position().left + $('#Ball').outerWidth() - (0.95 * $('#Ball').outerWidth())) <= ($('#Paddle').position().left + $('#Paddle').outerWidth())) {
                
                PaddleHit = true;

                //Move ball up if its a little under paddle
                if ($('#Ball').position().top > $('#Paddle').position().top) {
                    $('#Ball').css({
                        top: $('#Paddle').position().top - $('#Ball').outerHeight() - 55,
                    });
                }

                
                //Check for section of paddle hit
                //If ball hits left 25% Normal Angle is 80
                if ($('#Ball').position().left <= $('#Paddle').position().left + 0.10 * ($('#Paddle').outerWidth())) {
                    
                    if (Ball_Angle > 90 && Ball_Angle < 180) {
                        //Quadrant 2
                        //console.log('Quad2');
                        Normal_Angle = 110;
                    } else {
                        //console.log('Quad not 2');
                        Normal_Angle = 70;
                    }

                    //Normal_Angle = 80;
                } else if ($('#Ball').position().left >= $('#Paddle').position().left + 0.75 * ($('#Paddle').outerWidth())) {
                    //If Ball Hits right 25% Normal Angle is 100
                    if (Ball_Angle > 0 && Ball_Angle < 90) {
                        //Quadrant 1
                        Normal_Angle = 110;
                    } else if (Ball_Angle > 90 && Ball_Angle < 180) {
                        //Quadrant 2
                        Normal_Angle = 290;
                    } else {
                        Normal_Angle = 100;
                    }

                } else {
                    //If Ball Hits in middle Normal Angle is 90
                    Normal_Angle = 90;
                }

            }
        }
    }

    //Outgoing = 2 * normal - 180 - incoming
    if ((WallHit) || (PaddleHit)) {
        WallHit = false;
        PaddleHit = false;

        Ball_Angle = 2 * Normal_Angle - 180 - Ball_Angle;
    }

    //Detect if ball is below the paddle
    if ($('#Ball').position().top > $('#Paddle').position().top + 5) {
        GameOver = true;
    }

    //If it doesnt hit something, stop moving ball
    if (GameOver) {
        $('#Next_Level_Indicator').hide();
        clearTimeout(Ball_Move_Timeout);
        GameOverScreen(Ball_Object);
    } else {
        //If nothing has been hit call the move again

        //Convert Ball Angle to Radians
        Ball_Angle = Ball_Angle * Math.PI / 180;
        Ball_Object.Ball_Angle = Ball_Angle;

        Ball_Move_Timeout = setTimeout(MoveBall, 1, Ball_Object);
    }
}