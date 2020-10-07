export default class Monster{
    constructor(name, hitPoints){
        this.name = name;
        this.hitPoints = hitPoints;
    }

    reduceHP(damage){
        return this.hitPoints - damage;
    }
}