function MovePaddle(e) {

    let MouseX = e.pageX;
    //Make sure MouseX is constrained to page
    if (MouseX <= 0.5 * $('#Paddle').outerWidth()) {
        MouseX = 0.5 * $('#Paddle').outerWidth();
    } else if (MouseX >= $(document).width() - (0.5 * $('#Paddle').outerWidth())) {
        MouseX = $(document).width() - (0.5 * $('#Paddle').outerWidth());
    }

    //Change properties of the Paddle
    $('#Paddle').css({
        left: MouseX,
    });

}