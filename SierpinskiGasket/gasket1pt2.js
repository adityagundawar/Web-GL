"use strict";

var gl;
var points;

var zoomLoc;
var zoomFactor = 0.0;
var flag = 0;
var redVal, red, blueVal, blue, greenVal, green;

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
    var NumPoints = 5000;

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

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
    render();
};


function render() {
    red = Math.floor(Math.random() * 3);
    green = Math.floor(Math.random() * 3);
    blue = Math.floor(Math.random() * 3);

    if(red == blue && blue == green){
        red = 1;
        blue = 1;
        green = 0;
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
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
    
    gl.uniform1f(zoomLoc, zoomFactor);
    gl.uniform1f(redVal, red);
    gl.uniform1f(blueVal, blue);
    gl.uniform1f(greenVal, green);
    gl.drawArrays(gl.POINTS, 0, points.length * zoomFactor);
    setTimeout(
        function () { requestAnimFrame(render); },
        200
    );
}
