class Camera{
    constructor(){
        this.fov = 60;
        this.eye = new Vector3([0,.25,3]);
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
        console.log(this.eye.elements, this.at.elements)
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(.25);
        this.eye.add(f);
        this.at.add(f);
        //console.log(this.eye.elements, this.at.elements)
        console.log(f)

        this.viewMatrix.setLookAt(
            this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
            this.at.elements[0],this.at.elements[1],this.at.elements[2],
            this.up.elements[0],this.up.elements[1],this.up.elements[2]
        );
    }
    moveBackward(){
        console.log(this.eye.elements, this.at.elements)
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(.1);
        this.eye.sub(f); // sub instead to go backwards
        this.at.sub(f);
        //console.log(this.eye.elements, this.at.elements)
        console.log(f)

        this.viewMatrix.setLookAt(
            this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
            this.at.elements[0],this.at.elements[1],this.at.elements[2],
            this.up.elements[0],this.up.elements[1],this.up.elements[2]
        );
    }
    moveLeft(){
        console.log(this.eye.elements, this.at.elements)
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        f = Vector3.cross(f,this.up); //claude ai generated this line of code and explained the concept 
        f.normalize();
        f.mul(.1);

        this.eye.sub(f); // sub instead to go backwards
        this.at.sub(f);
        //console.log(this.eye.elements, this.at.elements)
        console.log(f)

        this.viewMatrix.setLookAt(
            this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
            this.at.elements[0],this.at.elements[1],this.at.elements[2],
            this.up.elements[0],this.up.elements[1],this.up.elements[2]
        );
    }
    moveRight(){
        console.log(this.eye.elements, this.at.elements)
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        f = Vector3.cross(f,this.up); //claude ai generated this line of code and explained the concept 
        f.normalize();
        f.mul(.1);

        this.eye.add(f); // sub instead to go backwards
        this.at.add(f);
        //console.log(this.eye.elements, this.at.elements)
        console.log(f)

        this.viewMatrix.setLookAt(
            this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
            this.at.elements[0],this.at.elements[1],this.at.elements[2],
            this.up.elements[0],this.up.elements[1],this.up.elements[2]
        );
    }
    
}