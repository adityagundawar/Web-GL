"use strict";

var gl;
var points;
var vertices = []
var zoomLoc;
var zoomFactor = 1.0;
var pointFactor = 0;
var flag = 1;
var redVal, red = 255, blueVal, blue = 0, greenVal, green = 0;
var animate = false;
var NumPoints = 5000;
var toDraw;

var vertexShaderSource = ['attribute vec4 vPosition;',
    'void main(){',
    'gl_PointSize = 1.0;',
    'gl_Position = vPosition;',
    '}'];

var fragmentShaderSource = ['precision mediump float;',
    'void main(){',
    'gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );',
    '}'];

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    var canvas2 = document.getElementById('gl-canvas2');

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }


    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    var x1 = document.getElementById('x1');
    var y1 = document.getElementById('y1');
    var x2 = document.getElementById('x2');
    var y2 = document.getElementById('y2');
    var x3 = document.getElementById('x3');
    var y3 = document.getElementById('y3');
    var x4 = document.getElementById('x4');
    var y4 = document.getElementById('y4');
    x1.style.display = 'none';
    x2.style.display = 'none';
    y1.style.display = 'none';
    y2.style.display = 'none';
    x3.style.display = 'none';
    y3.style.display = 'none';
    x4.style.display = 'none';
    y4.style.display = 'none';
    draw.style.display = 'none';

    var bezier = document.getElementById("bezier")
    bezier.addEventListener("click", function () {
        toDraw = 'bezier';
        x1.style.display = 'inline';
        x2.style.display = 'inline';
        y1.style.display = 'inline';
        y2.style.display = 'inline';
        x3.style.display = 'inline';
        y3.style.display = 'inline';
        x4.style.display = 'inline';
        y4.style.display = 'inline';
        draw.style.display = 'inline';
    });

    var hermite = document.getElementById("hermite");
    hermite.addEventListener('click', function () {
        toDraw = 'hermite';
        x1.style.display = 'inline';
        x2.style.display = 'inline';
        y1.style.display = 'inline';
        y2.style.display = 'inline';
        x3.style.display = 'inline';
        y3.style.display = 'inline';
        x4.style.display = 'inline';
        y4.style.display = 'inline';
        draw.style.display = 'inline';
    });
    var bSpline = document.getElementById("bSpline");
    bSpline.addEventListener('click', function () {
        toDraw = 'bSpline';
        x1.style.display = 'inline';
        x2.style.display = 'inline';
        y1.style.display = 'inline';
        y2.style.display = 'inline';
        x3.style.display = 'inline';
        y3.style.display = 'inline';
        x4.style.display = 'inline';
        y4.style.display = 'inline';
        draw.style.display = 'inline';
    });

    draw.addEventListener("click", function () {
        switch (toDraw) {
            case 'hermite':
                var x1txt = (parseFloat(x1.value) - 50.0) / 50.0;
                var y1txt = (parseFloat(y1.value) - 50.0) / 50.0;
                var x2txt = (parseFloat(x2.value) - 50.0) / 50.0;
                var y2txt = (parseFloat(y2.value) - 50.0) / 50.0;
                var x3txt = (parseFloat(x3.value) - 50.0) / 50.0;
                var y3txt = (parseFloat(y3.value) - 50.0) / 50.0;
                var x4txt = (parseFloat(x4.value) - 50.0) / 50.0;
                var y4txt = (parseFloat(y4.value) - 50.0) / 50.0;
                if (x1txt >= -1 && x1txt <= 1 && y1txt >= -1 && y1txt <= 1 &&
                    x2txt >= -1 && x2txt <= 1 && y2txt >= -1 && y2txt <= 1 &&
                    x3txt >= -1 && x3txt <= 1 && y3txt >= -1 && y3txt <= 1 &&
                    x4txt >= -1 && x4txt <= 1 && y4txt >= -1 && y4txt <= 1) {
                    vertices = []
                    var n = 100;
                    var i;
                    var x, y, z;
                    var delta = 1.0 / n;
                    var t;

                    vertices.push(vec4(x1txt, y1txt, 0, 1));
                    vertices.push(vec4(x2txt, y2txt, 0, 1));
                    vertices.push(vec4(x3txt, y3txt, 0, 1));
                    vertices.push(vec4(x4txt, y4txt, 0, 1));

                    x = x1txt;
                    y = y1txt;
                    t = 0.0;
                    for (i = 0; i < n; i++) {
                        t += delta;
                        var t2 = t * t;
                        var t3 = t2 * t;

                        x = ((2 * t3) - (3 * t2) + 0.001) * x1txt + ((-2 * t3) + (3 * t2)) * x2txt + (t3 - (2 * t2) + t) * x3txt + (t3 - t2) * x4txt;
                        y = ((2 * t3) - (3 * t2) + 0.001) * y1txt + ((-2 * t3) + (3 * t2)) * y2txt + (t3 - (2 * t2) + t) * y3txt + (t3 - t2) * y4txt;
                        vertices.push(vec4(x, y, 0, 1));
                    }
                }
                else {
                    alert('enter coordinates ranging from -1 to 1')
                }
                break;
            case 'bezier':
                var x1txt = (parseFloat(x1.value) - 50.0) / 50.0;
                var y1txt = (parseFloat(y1.value) - 50.0) / 50.0;
                var x2txt = (parseFloat(x2.value) - 50.0) / 50.0;
                var y2txt = (parseFloat(y2.value) - 50.0) / 50.0;
                var x3txt = (parseFloat(x3.value) - 50.0) / 50.0;
                var y3txt = (parseFloat(y3.value) - 50.0) / 50.0;
                var x4txt = (parseFloat(x4.value) - 50.0) / 50.0;
                var y4txt = (parseFloat(y4.value) - 50.0) / 50.0;
                if (x1txt >= -1 && x1txt <= 1 && y1txt >= -1 && y1txt <= 1 &&
                    x2txt >= -1 && x2txt <= 1 && y2txt >= -1 && y2txt <= 1 &&
                    x3txt >= -1 && x3txt <= 1 && y3txt >= -1 && y3txt <= 1 &&
                    x4txt >= -1 && x4txt <= 1 && y4txt >= -1 && y4txt <= 1) {
                    vertices = []
                    var n = 100;
                    var i;
                    var x, y, z;
                    var delta = 1.0 / n;
                    var t;
                    vertices.push(vec4(x1txt, y1txt, 0, 1));
                    vertices.push(vec4(x2txt, y2txt, 0, 1));
                    vertices.push(vec4(x3txt, y3txt, 0, 1));
                    vertices.push(vec4(x4txt, y4txt, 0, 1));

                    x = x1txt;
                    y = y1txt;
                    t = 0.0;
                    for (i = 0; i < n; i++) {
                        t += delta;
                        var t2 = t * t;
                        var t3 = t2 * t;

                        var q1 = (1 - t);
                        var q2 = q1 * q1;
                        var q3 = q2 * q1;
                        x = q3 * x1txt + (3 * t * q2) * x2txt + (3 * t2 * q1) * x3txt + t3 * x4txt;
                        y = q3 * y1txt + (3 * t * q2) * y2txt + (3 * t2 * q1) * y3txt + t3 * y4txt;
                        vertices.push(vec4(x, y, 0, 1));
                    }
                }
                else {
                    alert('enter coordinates ranging from 0 to 100')
                }
                if (canvas2.getContext) {
                    var ctx = canvas2.getContext('2d');
                    ctx.moveTo(75, 40);
                    ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
                    ctx.stroke();
                }
                break;
            case 'bSpline':
                var x1txt = (parseFloat(x1.value) - 50.0) / 50.0;
                var y1txt = (parseFloat(y1.value) - 50.0) / 50.0;
                var x2txt = (parseFloat(x2.value) - 50.0) / 50.0;
                var y2txt = (parseFloat(y2.value) - 50.0) / 50.0;
                var x3txt = (parseFloat(x3.value) - 50.0) / 50.0;
                var y3txt = (parseFloat(y3.value) - 50.0) / 50.0;
                var x4txt = (parseFloat(x4.value) - 50.0) / 50.0;
                var y4txt = (parseFloat(y4.value) - 50.0) / 50.0;
                if (x1txt >= -1 && x1txt <= 1 && y1txt >= -1 && y1txt <= 1 &&
                    x2txt >= -1 && x2txt <= 1 && y2txt >= -1 && y2txt <= 1 &&
                    x3txt >= -1 && x3txt <= 1 && y3txt >= -1 && y3txt <= 1 &&
                    x4txt >= -1 && x4txt <= 1 && y4txt >= -1 && y4txt <= 1) {
                    vertices = []
                    var n = 100;
                    var i;
                    var x, y;
                    var delta = 1.0 / n;
                    var t;

                    vertices.push(vec4(x1txt, y1txt, 0, 1));
                    vertices.push(vec4(x2txt, y2txt, 0, 1));
                    vertices.push(vec4(x3txt, y3txt, 0, 1));
                    vertices.push(vec4(x4txt, y4txt, 0, 1));

                    x = x1txt;
                    y = y1txt;
                    t = 0.0;

                    for (i = 0; i < n; i++) {
                        t += delta;
                        var t2 = t * t;
                        var t3 = t2 * t;

                        x = (((0.001 - t3) / 6) * x1txt) + (((3 * t3 - 0.006 * t2 + 0.004) / 6) * x2txt) + (((-3 * t3 + 0.003 * t2 + 0.003 * t + 0.001) / 6) * x3txt) + ((t3 / 6) * x4txt);
                        y = (((0.001 - t3) / 6) * y1txt) + (((3 * t3 - 0.006 * t2 + 0.004) / 6) * y2txt) + (((-3 * t3 + 0.003 * t2 + 0.003 * t + 0.001) / 6) * y3txt) + ((t3 / 6) * y4txt);
                        vertices.push(vec4(x, y, 0, 1));
                    }
                }
                else {
                    alert('enter coordinates ranging from 0 to 100')
                }
                break;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
        render();
    });

    var program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    this.render();

};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, vertices.length);
}


