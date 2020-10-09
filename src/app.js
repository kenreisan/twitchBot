/**
 * El import de arriba es equivalente a la sig. linea:
 * const tmi = require('tmi.js');
 */

import tmi from 'tmi.js'
import {MONSTERLIST} from './constants'
import Hunter from './hunter.js'
import Monster from './monster.js'

let sign = '!'

var coolDown = 0;
var coolDownCounter = 3;


/*
El siguiente codigo es la coneccion cliente de nuestro
chatbot a twitch
*/

const client = new tmi.Client({
	options: { debug: true },
	connection: {
		reconnect: true,
		secure: true
    },
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.OAUTH_TOKEN
	},
	channels: [ process.env.NOMBRE_CANAL ]
});


client.connect().catch(console.error);

client.on('message', (channel, userstate, message, self) => {

    if(self) return;

    var arregloMensaje = message.split(' ');
    var command = arregloMensaje[0];
    var userName = userstate.username;

    command = command.toLowerCase();

    if (command[0] != sign)
        return;

    switch(command){
        case sign + 'hola':
            client.action(channel, ':) Hola ' + userName + ' Como te va?');
            break;

        case sign + 'dado':
            client.action(channel, ':) ' + userName + ' lanzas un dado! y cae en ' + rollDice(6));
            break;
        case sign + 'saludame':
            if (!newGreetings.includes(userName)){
                client.action(channel, ';) Ya vas ' + userName + ' la próxima vez te saludo cuando llegues!');
                newGreetings.push(userName);
            }else{
                client.action(channel, 'O_o Ya estas anotado en la lista ' + userName);
            }
            console.log(newGreetings.toString());
            break;
    }

    if (command.substring(0,3) === sign +'1d'){
        var diceSide = command.substring(3,5);
        if (!isNaN(diceSide))
            client.action(channel,':) ' +  userName + ' lanza un dado de '+ diceSide + ' caras y obtiene un ' + rollDice(diceSide));
    }

    if (command.substring(0,3) === sign + '2d'){
        client.action(channel, rollTwoDice(command.substring(3,5), userName));
    }

    if (coolDown === 0){
        client.action(channel, ':D Hola bienvenidos!')
         coolDownCounter += 2;
         coolDown = coolDownCounter;
    }else{
         coolDown -= 1;
    }

});



function rollDice (size) {
    const sides = size - 1;
    return Math.floor(Math.random() * sides) + 1;
}

function rollTwoDice(sides, name){
    var diceSide = sides;
    console.log('LOG>> rollTwoDice('+ sides + ') isNaN = ' + isNaN(diceSide));
    if (!isNaN(diceSide)){
        var diceOne = rollDice(diceSide);
        var diceTwo = rollDice(diceSide);
        var total = diceOne + diceTwo;
        if (total === (diceSide * 2))
            return (':O ' + name + ' lanzamiento perfecto!!! obtuviste ' + diceOne + ' en los 2 dados~! para un total de ' + total);
        else
            return (':) ' + name + ' lanza dos dados de '+ diceSide + ' caras y obtiene un ' + diceOne + ' y  un ' + diceTwo + ' para un total de ' + total);
    }
    return (':/ Perdón ' + name + ' no entendí que dado me pediste lanzar...')
}


class Mission{
    constructor(monster){
        this.missionList = [];
        this.deadList = [];
        this.monster = monster;
    }

    actionMonster(hunterName){
        switch(rollDice(3)){
            case 0:
                return this.attackMonster(hunterName);
            case 1:
                return monster.name + ' ataca a ' + hunterName + ' pero falla!';
            case 2:
                return this.attackMonster(hunterName);
        }
    }

    attackMonster(hunterName){
        var damage = rollDice(6);
        var indexHunter = this.huntersMissionList[0].indexOf(hunterName);

        this.huntersMissionList[indexHunter][1] -= damage;
        console.log('BOT>> El mounstruo te ha hecho ' + damage + ' de daño');

        if (this.missionList[indexHunter][1] <= 0){
            this.deadList.push(hunterName);
            console.log('BOT>> Te ha asesinado el monstruo...');
            return monster.name + ' ataca a ' + hunterName + ' y lo asesina...';
        }

        return (monster.name + ' ataca a ' + hunterName + ' y le hace ' + damage + ' de daño');
    }

    hunterIsDead(hunterName){
        if (this.deadList[0].includes(hunterName))  
            return true;
        return false;
    }

    hunterIsInMission(hunterName){
        if (this.missionList[0].includes(hunterName))
            return true;
        return false;   
    }

    monsterWin(){
        if (this.huntersMissionList.length === this.deadList.length)
            return true;
        return false;
    }
}

