class Triangle{
    constructor(varient){
      this.type='triangle';
      this.position=[0.0,0.0,0.0];
      this.color=[1.0,1.0,1.0,1.0];
      this.size=5.0;
      this.varient=varient;
    }
    render(){
      //var xy = g_shapesList[i].position;
      //var rgba = g_shapesList[i].color;
      //var size= g_shapesList[i].size;
  
      var xy = this.position;
      var rgba = this.color;
      var size= this.size;
  

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
      //gl uniform call for size
      gl.uniform1f(u_Size,size); //1f for 1 floating point value
  
      // Draw
      var d=this.size/200.0 //delta

    // Draw the triangle

    //equal triangle
    if(this.varient == 0){
      let height = Math.sqrt(3) * d; // chatgpt helped with this line
      drawTriangle([xy[0] - d, xy[1], xy[0] + d, xy[1], xy[0], xy[1] + height]);//chatgpt helped here
    }
    //right triangle
    else if (this.varient == 1){
      drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0],xy[1]+d]);
    }
    //left triangle
    else if(this.varient==2){
      drawTriangle([xy[0], xy[1], xy[0]-d, xy[1], xy[0],xy[1]+d]);
    }
    //isoceles triangle
    else if (this.varient === 3) {
      drawTriangle([xy[0] - d, xy[1], xy[0] + d, xy[1],  xy[0],     xy[1] + d*2]); // claudeai helped generate this line
    }
    
    }
}

function drawTriangle(vertices) {
    //var vertices = new Float32Array([
    //  0, 0.5,   -0.5, -0.5,   0.5, -0.5
    //]);
    var n = 3; // The number of vertices
  
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
    /*
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }*/


    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  
    //return n;
}
