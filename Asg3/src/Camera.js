class Camera{
    constructor(){
        this.fov = 60;
        this.eye = new Vector3([0,0,3]);
        this.at = new Vector3([0,0,-100]);
        this.up = new Vector3([0,1,0]);

        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();

        this.projectionMatrix.setPerspective(this.fov,canvas.width/canvas.height,0.1,1000);

        this.viewMatrix.setLookAt(
            this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
            this.at.elements[0],this.at.elements[1],this.at.elements[2],
            this.up.elements[0],this.up.elements[1],this.up.elements[2]
        );
    
    }
    moveForward(){
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(5);

        this.eye.add(f);
        this.at.add(f);

        this.viewMatrix.setLookAt(
            this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
            this.at.elements[0],this.at.elements[1],this.at.elements[2],
            this.up.elements[0],this.up.elements[1],this.up.elements[2]
        );
    }

}