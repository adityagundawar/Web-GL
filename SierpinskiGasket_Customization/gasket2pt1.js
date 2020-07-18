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

var vertexShaderSource = ['attribute vec4 vPosition;',
    'uniform float zoom;',
    'void main(){',
    'gl_PointSize = 1.0;',
    'gl_Position.x = zoom*vPosition.x;',
    'gl_Position.y = zoom*vPosition.y;',
    'gl_Position.z = 0.0;',
    'gl_Position.w = 1.0;',
    '}'];

var fragmentShaderSource = ['precision mediump float;',
    'uniform float r;',
    'uniform float g;',
    'uniform float b;',
    'void main(){',
    'gl_FragColor = vec4( r, g, b, 1.0 );',
    '}'];

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    var redtxt = document.getElementById('redtxt');
    var greentxt = document.getElementById('greentxt');
    var bluetxt = document.getElementById('bluetxt');
    var status = document.getElementById('status');
    redtxt.value = 255;
    greentxt.value = 0;
    bluetxt.value = 0;

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    points = generatePoints();

    var program = initShaders(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    zoomLoc = gl.getUniformLocation(program, "zoom");
    redVal = gl.getUniformLocation(program, 'r');
    blueVal = gl.getUniformLocation(program, 'b');
    greenVal = gl.getUniformLocation(program, 'g');

    var clearButton = document.getElementById('clearButton');
    clearButton.addEventListener('click', function () {
        console.log("in clear");
        animate = false;
        gl.clearColor(1.0, 1.0, 1.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        points = []        
        // points = generatePoints();
        status.innerHTML = "Canvas cleared";
    }, false);

    var animateButton = document.getElementById('animateButton');
    animateButton.addEventListener('click', function () {
        console.log("in animate");
        animate = true;
        render();
        status.innerHTML = "The gasket is being animated";
    }, false);

    var displayButton = document.getElementById('displayButton');
    displayButton.addEventListener('click', function () {
        if (animate == false) {
            console.log("in display");
            points = generatePoints();
            render();
            status.innerHTML = "The gasket is being displayed";
        }
    }, false);

    var colorPicker = document.getElementById('colorpicker');
    colorPicker.addEventListener("change", function () {
        console.log(colorPicker.value);
        var rrggbb = colorPicker.value
        red =  parseInt(rrggbb.substr(1,2),16);
        green =  parseInt(rrggbb.substr(3,2),16);
        blue =  parseInt(rrggbb.substr(5,2),16);
        redtxt.value = red;
        greentxt.value = green;
        bluetxt.value = blue;
        status.innerHTML = "Color Changed";
    }, false);

    var setButton = document.getElementById('setColor');
    setButton.addEventListener('click', function () {
        red = parseInt(redtxt.value);
        green = parseInt(greentxt.value);
        blue = parseInt(bluetxt.value);
        var rgbToHex = function (rgb) { 
            var hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                 hex = "0" + hex;
            }
            return hex;
          };
        colorPicker.value = "#"+rgbToHex(red)+rgbToHex(green)+rgbToHex(blue);
        status.innerHTML = "Color Changed";
    }, false);

};

function render() {
    console.log("in render");
    // gl.clear(gl.COLOR_BUFFER_BIT);
    if (animate == true) {
        if (flag == 1) {
            if (zoomFactor < 0.2) {
                flag = 0;
            }
            zoomFactor -= 0.1;
        }
        else if (flag == 0) {
            if (zoomFactor > 1) {
                flag = 1;
            }
            zoomFactor += 0.1;
        }
    }
    else {
        zoomFactor = 1;
    }
    gl.uniform1f(zoomLoc, zoomFactor);
    gl.uniform1f(redVal, red);
    gl.uniform1f(blueVal, blue);
    gl.uniform1f(greenVal, green);
    gl.drawArrays(gl.POINTS, 0, points.length * pointFactor * 0.1);
    if (animate == true) {
        setTimeout(
            function () { requestAnimFrame(render); },
            200
        );
    }
}

function sliderInputChange(value) {
    console.log(value);
    pointFactor = value;
    //render();
}

function generatePoints() {
    console.log("in generate points");
    points = []
    var vertices = [
        vec2(-1, -1),
        vec2(0, 1),
        vec2(1, -1)
    ];

    // Specify a starting point p for our iterations
    // p must lie inside any set of three vertices

    var u = add(vertices[0], vertices[1]);
    var v = add(vertices[0], vertices[2]);
    var p = scale(0.25, add(u, v));

    // And, add our initial point into our array of points

    points = [p];

    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex

    for (var i = 0; points.length < NumPoints; ++i) {
        var j = Math.floor(Math.random() * 3);
        p = add(points[i], vertices[j]);
        p = scale(0.5, p);
        points.push(p);
    }

    return points
}