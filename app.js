window.onload = function() {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    setCanvasSize();

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let currentColor = [1.0, 1.0, 1.0, 1.0];

    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    const fsSource = `
        precision mediump float;
        uniform vec4 uColor;
        void main() {
            gl_FragColor = uColor;
        }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const colorUniformLocation = gl.getUniformLocation(shaderProgram, 'uColor');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [];
    const numSegments = 100;
    const radius = 0.5;

    for (let i = 0; i <= numSegments; i++) {
        const angle = i * 2 * Math.PI / numSegments;
        positions.push(radius * Math.cos(angle), radius * Math.sin(angle));
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);
    gl.useProgram(shaderProgram);

    function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform4fv(colorUniformLocation, currentColor);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 2);
    }

    draw();

    document.getElementById('putih').onclick = function() {
        currentColor = [1.0, 1.0, 1.0, 1.0];
        draw();
    };
    
    document.getElementById('coklat').onclick = function() {
        currentColor = [0.6, 0.3, 0.0, 1.0];
        draw();
    };
    
    document.getElementById('cyan').onclick = function() {
        currentColor = [0, 1, 1, 1];
        draw();
    };
    
    document.getElementById('resetColor').onclick = function() {
        currentColor = [1.0, 1.0, 1.0, 1.0];
        draw();
    };
    

    window.addEventListener('resize', () => {
        setCanvasSize();
        draw();
    });
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
