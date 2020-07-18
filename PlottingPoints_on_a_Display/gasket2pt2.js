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
    var r = document.getElementById('r');
    var draw = document.getElementById('draw');
    x1.style.display = 'none';
    x2.style.display = 'none';
    y1.style.display = 'none';
    y2.style.display = 'none';
    r.style.display = 'none';
    draw.style.display = 'none';

    var ddaLine = document.getElementById("ddaline")
    ddaLine.addEventListener("click", function () {
        toDraw = 'ddaline';
        x1.style.display = 'inline';
        x2.style.display = 'inline';
        y1.style.display = 'inline';
        y2.style.display = 'inline';
        r.style.display = 'none';
        draw.style.display = 'inline';
    });

    var midptLine = document.getElementById("midptline");
    midptLine.addEventListener('click', function () {
        toDraw = 'midptline';
        x1.style.display = 'inline';
        x2.style.display = 'inline';
        y1.style.display = 'inline';
        y2.style.display = 'inline';
        r.style.display = 'none';
        draw.style.display = 'inline';
    });
    var circle = document.getElementById("circle");
    circle.addEventListener('click', function () {
        toDraw = 'circle';
        x1.style.display = 'inline';
        x2.style.display = 'none';
        y1.style.display = 'inline';
        y2.style.display = 'none';
        r.style.display = 'inline';
        draw.style.display = 'inline';
    });

    var ellipse = document.getElementById("ellipse");
    ellipse.addEventListener('click', function () {
        toDraw = 'ellipse';
        x1.style.display = 'inline';
        x2.style.display = 'none';
        y1.style.display = 'inline';
        y2.style.display = 'none';
        r.style.display = 'none';
        draw.style.display = 'inline';

    });

    draw.addEventListener("click", function () {
        switch (toDraw) {
            case 'ddaline':
                var x1txt = (parseFloat(x1.value)-50)/50;
                var y1txt = (parseFloat(y1.value)-50)/50;
                var x2txt = (parseFloat(x2.value)-50)/50;
                var y2txt = (parseFloat(y2.value)-50)/50;
                if (x1txt >= -1 && x1txt <= 1 && y1txt >= -1 && y1txt <= 1 && x2txt >= -1 && x2txt <= 1 && y2txt >= -1 && y2txt <= 1) {
                    vertices = []
                    var dy = y2txt - y1txt;
                    var dx = x2txt - x1txt;
                    var y0 = y1txt;
                    if (dx == 0) {
                        for (var y = y1txt; y <= x2txt; y = y + 0.01) {
                            vertices.push(vec4(x1txt, y, 0, 1));
                        }
                    }
                    else {
                        var m = dy / dx;
                        for (var x = x1txt; x <= x2txt; x = x + 0.01) {
                            vertices.push(vec4(x, y0, 0, 1))
                            y0 = y0 + m * 0.01;
                        }
                    }
                    if (canvas2.getContext('2d') != null) {
                        var ctx = canvas2.getContext('2d');
                        ctx.beginPath();
                        // ctx.moveTo(125, 125);
                        ctx.lineTo(125, 45);
                        ctx.lineTo(45, 125);
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
                else {
                    alert('enter coordinates ranging from -1 to 1')
                }
                break;
            case 'midptline':
                var x1txt = (parseFloat(x1.value)-50)/50;
                var y1txt = (parseFloat(y1.value)-50)/50;
                var x2txt = (parseFloat(x2.value)-50)/50;
                var y2txt = (parseFloat(y2.value)-50)/50;
                if (x1txt >= -1 && x1txt <= 1 && y1txt >= -1 && y1txt <= 1 && x2txt >= -1 && x2txt <= 1 && y2txt >= -1 && y2txt <= 1) {
                    vertices = []
                    var dx = x2txt - x1txt;
                    var dy = y2txt - y1txt;
                    var d = 2 * (dy - dx);
                    var incrE = 2 * dy;
                    var incrNE = 2 * dy - dx;
                    var x = x1txt;
                    var y = y1txt;
                    while (x < x2txt) {
                        vertices.push(vec4(x, y, 0, 1));
                        if (d <= 0) {
                            d = d + incrE;
                            x = x + 0.01;
                        }
                        else {
                            d = d + incrNE;
                            x = x + 0.01;
                            y = y + 0.01;
                        }
                    }
                    if (canvas2.getContext('2d') != null) {
                        var ctx = canvas2.getContext('2d');
                        ctx.beginPath();
                        // ctx.moveTo(125, 125);
                        ctx.lineTo(125, 45);
                        ctx.lineTo(45, 125);
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
                else {
                    alert('enter coordinates ranging from-1 to 1')
                }
                break;
            case 'circle':
                var x1txt = (parseFloat(x1.value)-50.0)/50.0;
                var y1txt = (parseFloat(y1.value)-50.0)/50.0;
                var rtxt = (parseFloat(r.value))/100.0;
                if (x1txt >= -1 && x1txt <= 1 && y1txt >= -1 && y1txt <= 1 && rtxt >= -1 && rtxt <= 1) {
                    vertices = []
                    var x = 0;
                    var y = rtxt;
                    var d = 1 - rtxt;

                    CirclePoints(x, y, x1txt, y1txt);

                    while (y - x > -1) {
                        if (d < 0) {
                            d = d + 2 * x + 0.001;
                        }
                        else {
                            d = d + 2 * (x - y) + 0.001;
                            y = y - 0.001;
                        }
                        x = x + 0.001;
                        CirclePoints(x, y, x1txt, y1txt);
                    }
                    if (canvas2.getContext) {
                        var ctx = canvas2.getContext('2d');
                        ctx.beginPath();
                        ctx.arc(100, 100, 50, 0, Math.PI * 2, true); // Outer circle
                        ctx.stroke();
                    }
                }
                else {
                    alert('enter coordinates ranging from 0 to 100')
                }
                break;
            case 'ellipse':
                var x1txt = (parseFloat(x1.value)-50.0)/50.0;
                var y1txt = (parseFloat(y1.value)-50.0)/50.0;
                if (x1txt >= -1 && x1txt <= 1 && y1txt >= -1 && y1txt <= 1) {
                    vertices = [];
                    var b = 0.5;
                    var a = 0.6;
                    var d2;
                    var x = 0;
                    var y = b;
                    var d1 = (b * b) - (a * a * b) + (0.25 * a * a);

                    EllipsePoints(x, y, x1txt, y1txt);

                    // test gradient if still in region 1
                    while (((a * a) * (y - 0.0005)) > ((b * b) * (x + 0.001))) {
                        if (d1 < 0) {
                            d1 = d1 + ((b * b) * (2 * x + 0.003));
                        }
                        else {
                            d1 = d1 + ((b * b) * (2 * x + 0.003)) + ((a * a) * (-2 * y + 0.002));
                            y = y - 0.001;
                        }
                        x = x + 0.001;
                        EllipsePoints(x, y, x1txt, y1txt);
                    }   // Region 1

                    d2 = ((b * b) * (x + 0.0005) * (x + 0.0005)) + ((a * a) * (y - 0.001) * (y - 0.001)) - (a * a * b * b);
                    while (y > -1) {
                        if (d2 < 0) {
                            d2 = d2 + ((b * b) * (2 * x + 0.002)) + ((a * a) * (-2 * y + 0.003));
                            x = x + 0.001;
                        }
                        else {
                            d2 = d2 + ((a * a) * (-2 * y + 0.003));
                        }
                        y = y - 0.001;
                        EllipsePoints(x, y, x1txt, y1txt);
                    }   // Region 2   
                    if (canvas2.getContext) {
                        var ctx = canvas2.getContext('2d');
                        ctx.beginPath();
                        ctx.ellipse(100, 100, 50, 75, Math.PI / 4, 0, 2 * Math.PI);
                        ctx.stroke();
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

function CirclePoints(x, y, xShift, yShift) {
    vertices.push(vec4(x + xShift, y + yShift, 0, 1));
    vertices.push(vec4(x + xShift, -y + yShift, 0, 1));
    vertices.push(vec4(-x + xShift, y + yShift, 0, 1));
    vertices.push(vec4(-x + xShift, -y + yShift, 0, 1));
    vertices.push(vec4(y + xShift, x + yShift, 0, 1));
    vertices.push(vec4(-y + xShift, x + yShift, 0, 1));
    vertices.push(vec4(y + xShift, -x + yShift, 0, 1));
    vertices.push(vec4(-y + xShift, -x + yShift, 0, 1));
}

function EllipsePoints(x, y, xShift, yShift) {
    vertices.push(vec4(x + xShift, y + yShift, 0, 1));
    vertices.push(vec4(-x + xShift, y + yShift, 0, 1));
    vertices.push(vec4(x + xShift, -y + yShift, 0, 1));
    vertices.push(vec4(-x + xShift, -y + yShift, 0, 1));
}


