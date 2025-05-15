class Camera{
    constructor(){
        this.fov = 60;
        this.g_eye = new Vector3([0,0,3]);
        this.g_at = new Vector3([0,0,-100]);
        this.g_up = new Vector3([0,1,0]);

        this.viewMatrix = new Matrix4();
        this.projMatrix = new Matrix4();
    
    }

}