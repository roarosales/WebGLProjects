class Cube{
    constructor(){
      this.type='cube';
      //this.position=[0.0,0.0,0.0];
      this.color=[1.0,1.0,1.0,1.0];
      //this.size=5.0;
      //this.segments = segments;
      this.matrix = new Matrix4();
      this.textureNum=-2;
      this.repeatVal=1;
    }
    render(){
        //var xy = this.position;
        var rgba = this.color;
        var repVal = this.repeatVal;
        //var size= this.size;
        gl.uniform1i(u_WhichTexture, this.textureNum); 
        
        //console.log("u_WhichTexture is " + u_WhichTexture); //u_WhichTexture stays undefined
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        //pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


        // I got the normals mostly from the video, but solved some

        //Front of cube
        drawTriangle3DUVNormal([0,0,0, 1,1,0, 1,0,0], 
          [0,repVal, repVal,0, repVal, repVal],
          [0,0,-1, 0,0,-1, 0,0,-1]);

        drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0], 
          [0,repVal, 0,0, repVal, 0],
          [0,0,-1, 0,0,-1, 0,0,-1]);
        
        //Top of cube
        drawTriangle3DUVNormal([0,1,0, 1,1,1, 1,1,0], 
          [0,0, repVal,repVal, repVal,0], 
          [0,1,0, 0,1,0, 0,1,0]);

        drawTriangle3DUVNormal([0,1,0, 0,1,1, 1,1,1], 
          [0,0, 0,repVal, repVal,repVal],
          [0,1,0, 0,1,0, 0,1,0]);
        
        // Bottom of cube - AI Helped with these two lines
        drawTriangle3DUVNormal([0,0,0, 0,0,1, 1,0,1], 
          [0,0, repVal,repVal, repVal,0],
          [0,-1,0, 0,-1,0, 0,-1,0]);

        drawTriangle3DUVNormal([0,0,0, 1,0,1, 1,0,0], 
          [0,0, 0,repVal, repVal,repVal],
          [0,-1,0, 0,-1,0, 0,-1,0]);

        // Back of cube - AI Helped with these two lines below
        drawTriangle3DUVNormal([0,0,1, 1,0,1, 1,1,1], 
          [0,repVal, repVal,repVal, repVal,0],
          [0,0,1, 0,0,1, 0,0,1]);

        drawTriangle3DUVNormal([0,0,1, 1,1,1, 0,1,1], 
          [0,repVal, repVal,0, 0,0],
          [0,0,1, 0,0,1, 0,0,1]);

        //Right Side of cube - similar to previous stuff
        drawTriangle3DUVNormal([1,0,0, 1,1,0, 1,1,1], 
          [0,repVal, repVal,repVal, repVal,0],
          [1,0,0, 1,0,0, 1,0,0]);

        drawTriangle3DUVNormal([1,0,0, 1,1,1, 1,0,1], 
          [0,repVal, repVal,0, 0,0],
          [1,0,0, 1,0,0, 1,0,0]);

        //Left Side of cube - similar to previous stuff
        drawTriangle3DUVNormal([0,0,0, 0,1,1, 0,1,0], 
          [0,repVal, repVal,0, repVal,repVal],
          [-1,0,0, -1,0,0, -1,0,0]);

        drawTriangle3DUVNormal([0,0,0, 0,0,1, 0,1,1], 
          [0,repVal, 0,0, repVal,0],
          [-1,0,0, -1,0,0, -1,0,0]);

        //shown in the yt tutorial vids
        //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);


    }
}
