/* global impress, marked */

'use strict';

var ImpressMd = function () {
    this.content = "@@presentation";
};

ImpressMd.state = {
    page: 0,
    x: -1000,
    y: -1500,
    z: 0,
    scale: 1,
    isOpenBracket: false
};

ImpressMd.prototype.init = function(elementId) {
    var markedContent = marked(this.content, {renderer: this.renderer}) + '</div>';
    // console.log(markedContent);

    $('#impress').prepend($(markedContent));

    impress().init(elementId);
};

ImpressMd.prototype.renderer = new marked.Renderer();

ImpressMd.prototype.renderer.hr = function () {
    var state = ImpressMd.state;

    var html = '';

    if (state.isOpenBracket) {
        html += '</div>\n';
    }

    html += '<div id="page' + state.page + '"' +
        ' class="step slide"' +
        ' data-x="' + state.x + '"' +
        ' data-y="' + state.y + '"' +
        ' data-z="' + state.z + '"' +
        ' data-scale="' + state.scale + '">\n';
    state.page++;
    state.isOpenBracket = true;

    // console.log(html);

    state.x += 1000;

    return html;
};
