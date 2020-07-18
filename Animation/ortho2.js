"use strict";

var canvas;
var gl;

var numVertices = 52;
var coord1 = []
var coord2 = []
var pointsArray = [];
var colorsArray = [];
//54--0.77, 30--0.42, 16--0.22, 8--0.11, 10--0.14
var fac = 54;
var vertices = [
    vec4(0, 0, 30 / fac, 1.0),
    vec4(16 / fac, 0, 30 / fac, 1.0),
    vec4(16 / fac, 10 / fac, 30 / fac, 1.0),
    vec4(8 / fac, 16 / fac, 30 / fac, 1.0),
    vec4(0, 10 / fac, 30 / fac, 1.0),
    vec4(0, 0, 54 / fac, 1.0),
    vec4(16 / fac, 0, 54 / fac, 1.0),
    vec4(16 / fac, 10 / fac, 54 / fac, 1.0),
    vec4(8 / fac, 16 / fac, 54 / fac, 1.0),
    vec4(0, 10 / fac, 54 / fac, 1.0),
];

var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),   // cyan
    vec4(1.0, 1.0, 1.0, 1.0),  // white    
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(1.0, 0.0, 0.0, 1.0),
];

var near = 1;
var far = -1;
var radius = 1; //how far camera is from origin
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI / 180.0;

var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;
var animateFlag = false;
var flag = 1;


var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

function quad(a, b, c, d) {
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
}

function penta(a, b, c, d, e) {
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[e]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[e]);
    colorsArray.push(vertexColors[a]);
}


function colorHouse() {
    penta(4, 3, 2, 1, 0);//5 4 3 2 1
    penta(5, 6, 7, 8, 9);//6 7 8 9 10
    quad(9, 4, 0, 5);//10 5 1 6
    quad(3, 4, 9, 8);//4 5 10 9
    quad(6, 5, 0, 1);//7 6 1 2 
    quad(1, 2, 7, 6);//2 3 8 7
    quad(2, 3, 8, 7);//3 4 9 8

    //4983--3872
    //51610--4059
}


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    this.colorHouse();

    var cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    // sliders for viewing parameters

    // document.getElementById("depthSlider").onchange = function (event) {
    //     far = event.target.value / 2;
    //     near = -event.target.value / 2;
    //     console.log(far + " " + near);
    // };

    // document.getElementById("radiusSlider").onchange = function (event) {
    //     radius = event.target.value;
    // };
    // document.getElementById("thetaSlider").onchange = function (event) {
    //     theta = event.target.value * Math.PI / 180.0;
    // };
    // document.getElementById("phiSlider").onchange = function (event) {
    //     phi = event.target.value * Math.PI / 180.0;
    // };
    // document.getElementById("heightSlider").onchange = function (event) {
    //     ytop = event.target.value / 2;
    //     bottom = -event.target.value / 2;
    // };
    // document.getElementById("widthSlider").onchange = function (event) {
    //     right = event.target.value / 2;
    //     left = -event.target.value / 2;
    // };
    var animate = document.getElementById("animate");
    animate.addEventListener('click', function () {
        var txt1 = document.getElementById('start').value;
        var txt2 = document.getElementById('end').value;
        var temp1 = txt1.split(',');
        var temp2 = txt2.split(',');
        for (var i = 0; i < temp1.length; i++) {
            try {
                coord1.push(parseInt(temp1[i]));
            }
            catch (err) {
                alert(err);
            }
        }
        for (var i = 0; i < temp2.length; i++) {
            try {
                coord2.push(parseInt(temp2[i]));
            }
            catch (err) {
                alert(err);
            }
        }
        if (coord1.length == coord2.length) {
            animateFlag = true;
            // console.log("in animate");
        }
        else {
            alert('Enter points of same length');
        }

    });

    render();
}


var render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (animateFlag == true) {
        // console.log('in animate render');
        // theta += 0.1;
        // phi -= 0.1;
        if (flag == 0) {
            if (theta <= 0.5) {
                flag = 1;
            }
            theta -= 0.1;
            phi += 0.1;
        }
        else if (flag == 1) {
            if (theta > 45) {
                flag = 0;
            }
            theta += 0.1;
            phi -= 0.1;
        }
    }
    var thetaRad = theta * Math.PI / 180.0;
    var phiRad = phi * Math.PI / 180.0;
    console.log(theta + " " + phi);
    eye = vec3(radius * Math.sin(phiRad), radius * Math.sin(thetaRad),
        radius * Math.cos(phiRad));
    // eye = vec3(0, 0, 0);


    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    requestAnimationFrame(render)

}
