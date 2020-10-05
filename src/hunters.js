
class Hunters {
    constructor(name, hitPoints){
        this.name = name;
        this.hitPoints = hitPoints;
    }

    get name(){
        return this.name;
    }

    get hitPoints(){
        return this.hitPoints;
    }

    reduceHP(damage){
        return this.hitPoints - damage;
    }

}