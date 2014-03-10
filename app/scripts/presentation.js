/* global impress, marked, hljs */

'use strict';

var ImpressMd = function () {
    this.content = "@@presentation";
};

ImpressMd.state = {
    page: 1,
    x: 0,
    y: 0,
    z: 0,
    dx: 1000,
    dy: 0,
    dz: 0,
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

ImpressMd.parse = function (text) {
    // console.log(text);

    var params = {};

    var strings = text.split(',');
    for (var i = 0; i < strings.length; i++) {
        // console.log(strings[i]);

        if (strings[i].match(/\s*(\w+):\s*'*([\w-]+)'*/)) {
            var key = RegExp.$1;
            var value = RegExp.$2;
            // console.log(key + ': ' + value);

            params[key] = value;
        }
    }

    return params;
};

ImpressMd.prototype.renderer = new marked.Renderer();

ImpressMd.prototype.renderer.heading = function (text, level) {
    var state = ImpressMd.state;

    var params = null;

    // console.log(text);
    if (text.match(/<!-- (.+) -->/)) {
        params = ImpressMd.parse(RegExp.$1);
    }
    // console.log(params);

    var id = 'page' + state.page;
    var classes = '';
    var rotate = 0;
    if (params) {
        if (params.x) {
            state.x = Number(params.x);
        }
        if (params.y) {
            state.y = Number(params.y);
        }
        if (params.z) {
            state.z = Number(params.z);
        }
        if (params.dx) {
            state.dx = Number(params.dx);
        }
        if (params.dy) {
            state.dy = Number(params.dy);
        }
        if (params.dz) {
            state.dz = Number(params.dz);
        }
        if (params.scale) {
            state.scale = Number(params.scale);
        }

        if (params.id) {
            id = params.id;
        }
        if (params['class']) {
            classes = params['class'];
        }
        if (params.rotate) {
            rotate = params.rotate;
        }
    }

    var html = '';

    if (state.isOpenBracket) {
        html += '</div>\n';
    }

    html += '<div id="' + id + '"' +
        ' class="step ' + classes + '"' +
        ' data-x="' + state.x + '"' +
        ' data-y="' + state.y + '"' +
        ' data-z="' + state.z + '"' +
        ' data-rotate="' + rotate + '"' +
        ' data-scale="' + state.scale + '">\n';

    html += '<h' + level + '>' + text + '</h' + level + '>\n';

    state.page++;
    state.isOpenBracket = true;

    // console.log(html);

    state.x += state.dx;
    state.y += state.dy;
    state.z += state.dz;

    return html;
};
