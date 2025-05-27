class RightTriangle3D {
  constructor(){
    this.type='righttriangle';
    //this.position=[0.0,0.0,0.0];
    this.color=[1.0,1.0,1.0,1.0];
    //this.size=5.0;
    //this.segments = segments;
    this.matrix = new Matrix4();
  }
  render(){
      //var xy = this.position;
      var rgba = this.color;
      //var size= this.size;

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      //pass the matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      // Back of triangle - same as my cube
      drawTriangle3D([0,0,1, 1,1,1, 1,0,1]);
      drawTriangle3D([0,0,1, 0,1,1, 1,1,1]);

      // Base of triangle - same as my cube
      drawTriangle3D([0,0,0, 0,0,1, 1,0,1]);
      drawTriangle3D([0,0,0, 1,0,1, 1,0,0]);

      //Right Side of triangle
      drawTriangle3D([1,0,0, 1,1,1, 1,0,1]); //similar to cube but just one side

      //Left Side of triangle
      drawTriangle3D([0,0,0, 0,0,1, 0,1,1]); //similar to cube but just one side

      //top of triangle 
      drawTriangle3D([0,0,0, 0,1,1, 1,1,1]); //claudeai helped with this line
      drawTriangle3D([0,0,0, 1,1,1, 1,0,0]);

      //shown in the yt tutorial vids
      gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
  }
}