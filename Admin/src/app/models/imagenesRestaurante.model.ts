export class Imagenes{
    IRes_Id: number = 0;
    rest_Id: number = 0;
    IRes_ImgURL: string = '';


    constructor(init?: Partial<Imagenes>){
        Object.assign(this,init);
    }
}
