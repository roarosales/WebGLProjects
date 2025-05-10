// DrawTriangle.js (c) 2012 matsuda
function main() {  
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the WebGL rendering context
  var gl = canvas.getContext('webgl');
  if (!gl) {
    console.log('WebGL not supported');
    return false;
  }

  // Vertex shader source code
  var vertexShaderSource = `
    attribute vec2 a_Position;
    attribute vec3 a_Color;
    varying vec3 v_Color;
    void main() {
      v_Color = a_Color;
      gl_Position = vec4(a_Position, 0.0, 1.0);
    }
  `;

  // Fragment shader source code
  var fragmentShaderSource = `
    precision mediump float;
    varying vec3 v_Color;
    void main() {
      gl_FragColor = vec4(v_Color, 1.0);
    }
  `;

  // Function to compile shaders
  function compileShader(gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log('Shader error:', gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  // Create shaders
  var vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  var fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

  // Create a shader program and link shaders
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  // Define vertices for an equilateral triangle centered in the canvas
  var vertices = new Float32Array([
    // First triangle (Bottom-left)
    -1.0,  1.0,  0.0, 0, 0.0,  // Top-left
     1.0,  1.0,  0.0, 0, 1.0,  // Top-right
    -1.0, -1.0,  0.0, 0, -0,  // Bottom-left

    // Second triangle (Top-right)
    -1.0, -1.0,  0.0, 00, 0.0,  // Bottom-left
     1.0,  1.0,  0.0, .0, 1.0,  // Top-right
     1.0, -1.0,  0.0, 0, 1.0   // Bottom-right
  ]);
  // Create a buffer and bind data
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Get attribute locations
  var a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
  var a_Color = gl.getAttribLocation(shaderProgram, "a_Color");

  // Enable position attribute
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(a_Position);

  // Enable color attribute
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(a_Color);

  // Set background to black
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the two triangles
  gl.drawArrays(gl.TRIANGLES, 3, 3);  // Dark green upward triangle
  gl.drawArrays(gl.TRIANGLES, 0, 3);  // Bright green downward triangle
  
}

