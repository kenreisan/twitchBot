
export default class Hunter {
    
    constructor(name, hitPoints){
        this.name = name;
        this.hitPoints = hitPoints;
    }

    reduceHP(damage){
        return this.hitPoints - damage;
    }

}