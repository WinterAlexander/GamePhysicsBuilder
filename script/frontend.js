var content = {
    Y1:     'Y1 is the jump height reached when you release jump immediately after pressing it and without any momentum.',
    Y2:     'Y2 is the jump height reached when you hold jump all the way but without any momentum.',
    Y3:     'Y3 is the jump height reached when you hold jump all the way with maximum momentum. (The box becomes magenta.)',
    L:      'L is the duration in seconds for a jump reaching height Y2.',
    Output: 'The following values are the constants used in the velocity formula in order to produce those physics. You can learn more about the formula in the next sections.'
};

$(function () {
    preparePopover();
    setCurrentYear();
});

function setCurrentYear() {
    $('.current-year').append(new Date().getFullYear());
}

function preparePopover(){
    $('#y1Helper').popover({
        content: content.Y1,
        trigger: 'focus'
    });

    $('#y2Helper').popover({
        content: content.Y2,
        trigger: 'focus'
    });

    $('#y3Helper').popover({
        content: content.Y3,
        trigger: 'focus'
    });

    $('#lHelper').popover({
        content: content.L,
        trigger: 'focus'
    });

    $('#OutputHelper').popover({
        content: content.Output,
        trigger: 'focus'
    });
}