// this was taken straight from Lab Activity and is almost identical - Loading OBJ object
class Model {
  constructor(filePath) {
    this.filePath = filePath;
    this.color = [1, 1, 1, 1];
    this.matrix = new Matrix4();

    this.loader = new OBJLoader(this.filePath);
    this.loader.parseModel().then(() => {
      this.modelData = this.loader.getModelData();

      this.vertexBuffer = gl.createBuffer();
      this.normalBuffer = gl.createBuffer();

      console.log(this.modelData);
      if (!this.vertexBuffer || !this.normalBuffer) {
        console.log("Failed to create buffers for", this.filePath);
        return;
      }
    });
  }

  render() {
    if (!this.loader.isFullyLoaded) return;

    //vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.modelData.vertices),
      gl.DYNAMIC_DRAW
    );
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    //normals
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.modelData.normals),
      gl.DYNAMIC_DRAW
    );
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);

    //set uniforms
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniform4fv(u_FragColor, this.color);

    //normal matrix
    let normalMatrix = new Matrix4().setInverseOf(this.matrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, this.modelData.vertices.length / 3);
  }
}
