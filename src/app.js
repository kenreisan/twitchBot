/**
 * El import de arriba es equivalente a la sig. linea:
 * const tmi = require('tmi.js');
 */

import tmi from 'tmi.js'
import {MONSTUOS} from './constants'
import Hunter from './hunter.js'
import Monster from './monster.js'

const status = {
    NAME: 0,
    HP: 1
}

let closeFriends = [
    'tetsuo_rafa',
    'krsdonovan',
    'kurama8525',
    'kenrei_bot',
    'kenreisan',
    'skygrinder3070',
    'leserrb267',
]

let followers = []
let hunters = []
let fainted = []

var monsterIndex;
var activeMonster = false;
var hpMonster = 35;

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

    var arregloMensaje = message.split(' ')
    var comando = arregloMensaje[0]
    var userName = userstate.username

	if(comando.toLowerCase() === '!hola') {
        client.action(channel, 'Hola ' + usr + ' como te va?');
    }

    if(comando.toLowerCase() === '!bot') {
        client.action(channel, 'Dime?');
    }

    if (closeFriends.includes(userName)) {
        greetFriend(channel, userName, closeFriends)
    }

    console.log('Consola>> comando: ' + comando.toString());
});

function rollDice (size) {
    const sides = size - 1;
    return Math.floor(Math.random() * sides) + 1;
}

function greetFriend (channel, friend, friendList) {
    var index = friendList.indexOf(friend);
    
    switch(rollDice(3)){
        case 0:
            client.action(channel,'Ya llego el manco del ' + friend);
            break;
        case 1:
            client.action(channel,'Hola ' + friend + ' como te ha ido?');
            break;
        case 2:
            client.action(channel,'Vaya! hasta que vienes a ver un stream ' + friend);
            break;
    }

    if (index >= 0)
        friendList.splice(index,1);

    console.log('>> friendList: ' + friendList.toString());
}

function attackMonster (damage, hpMonster){
    hpMonster = hpMonster - damage;
    return hpMonster;
}

function actionMonster(channel, hunter, caidos, monster){
    var dice = rollDice(6)
    //var dice = 5

    console.log('Consola>> El mounstruo tira: ' + dice)

    if (dice === 1){
        client.action(channel, monster + ' ataca!, pero ' + hunter + ' lo esquiva! CoolCat')
    }

    if (dice === 5){
        caidos.push(hunter)
        client.action(channel, monster + ' ataca a ' + hunter + ' y lo ASESINA... BibleThump')
    }
}

class Mission{
    constructor(monster){
        this.missionActive = true;
        this.huntersAlive = [];
        this.huntersDead = [];
        this.monster = monster;
    }    
}

