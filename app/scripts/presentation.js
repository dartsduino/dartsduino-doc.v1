'use strict';

var presentation = "@@presentation";

function main () {
    var markedPresentation = marked(presentation);
    console.log(markedPresentation);

    $('#presentation').html(markedPresentation);
}

$(function () {
    main();
});
