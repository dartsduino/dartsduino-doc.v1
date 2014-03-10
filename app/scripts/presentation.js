/* global impress, marked, hljs */

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
    var state = ImpressMd.state;

    marked.setOptions({
        highlight: function (code, lang) {
            if (lang) {
                return hljs.highlight(lang, code).value;
            } else {
                return hljs.highlightAuto(code).value;
            }
        }
    });

    var markedContent = marked(this.content, {renderer: this.renderer}) +
        (state.isOpenBracket ? '</div>' : '');
    // console.log(markedContent);

    $('#impress').prepend($(markedContent));

    impress().init(elementId);
};

ImpressMd.prototype.renderer = new marked.Renderer();

ImpressMd.prototype.renderer.heading = function (text, level) {
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

    html += '<h' + level + '>' + text + '</h' + level + '>\n';

    state.page++;
    state.isOpenBracket = true;

    // console.log(html);

    state.x += 1000;

    return html;
};
