/**
 * El import de arriba es equivalente a la sig. linea:
 * const tmi = require('tmi.js');
 */

import tmi from 'tmi.js'
import {MONSTUOS} from './constants'
import Hunters from './hunters'

let mancos = [
    'tetsuo_rafa',
    'krsdonovan',
    'kurama8525',
    'kenrei_bot',
    'kenreisan',
    'skygrinder3070',
    'leserrb267',
]
let seguidores = []
let cazadores = []
let caidos = []
let clave = 'XXXX'
let modoMH = true;

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


var contador = 1;
var nuevoContador = contador;
var monsterIndex;
var activeMonster = false;
var hpMonster = 35;

client.connect().catch(console.error);

client.on('message', (channel, userstate, message, self) => {

    if(self) return;

    var arregloMensaje = message.split(' ')
    var comando = arregloMensaje[0]
    var usr = userstate.username
    var dmg

    nuevoContador -= 1;

	if(comando.toLowerCase() === '!hola') {
        client.action(channel, `Hola ${userstate.username}, bienvenido :D`);
    }

    if(comando.toLowerCase() === '!bot') {
        client.action(channel, `Dime?`);
    }

    if (mancos.includes(userstate.username)) {
        saludarMancos(channel, userstate.username)
        seguidores.push(userstate.username)
    }

    if (comando.toLowerCase() === '!dimelosseguidores') {
        client.action(channel, seguidores.toString())
    }

    if (comando.toLowerCase() === '!modomh') {
        if(modoMH){
            client.action(channel, 'Modo Monster Hunter OFF')
            modoMH = false;
        }else{
            client.action(channel, 'El modo Monster Hunter esta activo!')
            modoMH = false;
        }
    }

    if (comando.toLowerCase() === '!sala') {
        client.action(channel, 'La clave es: !' + clave)
        client.action(channel, 'El Id de la sala preguntaselo a Kenrei ;)')
        modoMH = true;
    }

    if (comando.toLowerCase() === '!clave') {
        client.action(channel, 'La clave es: !' + clave)
        client.action(channel, 'El Id de la sala preguntaselo a Kenrei ;)')
        modoMH = true;
    }


/*********************  MISIONES DE MH *******************/ 

    if (comando.toLowerCase() === '!mision') {
        
         const player = new Hunters(usr, 10);


        if (!activeMonster){

            monsterIndex = rollDice(MONSTUOS.length);
            client.action(channel, usr + ' ha elegido cazar a un '+ MONSTUOS[monsterIndex] + '! Vamos de cacería! Usa el commando: !atacar')
            activeMonster = true;
            cazadores.push(player)
        }else{
            if (!cazadores.includes(player)){
                client.action(channel, usr + ' Se ha unido a la cacería del '+ MONSTUOS[monsterIndex])
                cazadores.push(player)
            }else{
                client.action(channel, usr + ' ya aceptaste la misión')
            }
        }
    }

/************************** OTROS COMANDOS DE INTERES *************/

    if (comando.toLowerCase() === '!aceptar'){
        
        if (!cazadores.includes(usr)){
            cazadores.push(usr)
        }
        client.action(channel, usr + 'Se ha unido a la cacería del '+ MONSTUOS[monsterIndex])
    }

/******************* ATACAR *******************************/

    if (comando.toLowerCase() === '!atacar'){

        usr = userstate.username
        dmg = rollDice(6);

        if (!activeMonster){
            client.action(channel, "Nadie ha elegido una mision... Elige con el comando: !mision")
            return
        }

        if (!cazadores.includes(usr)){
            client.action(channel, usr + ' usa el comando [!mision] para unirte a la caceía del ' + MONSTUOS[monsterIndex])
            return
        }

        if (caidos.includes(usr)){
            client.action(channel, usr + ' haz sido derrotado en batalla... BibleThump Espera a que derroten al ' + MONSTUOS[monsterIndex] + ' para volver a participar.')
            return
        }

        client.say(channel, usr + ' ataca al ' + MONSTUOS[monsterIndex] + ' con ' + dmg + ' de daño!');
        if (attackMonster(dmg,hpMonster) < 0 ){
            activeMonster = false;
            client.action(channel, 'El ' + MONSTUOS[monsterIndex] + 'ha sido derrotado!!!');
            client.action(channel, 'MISIÓN SUPERADA, regresando al campamento');
            caidos.length = 0;
            cazadores.length = 0;
            hpMonster = 35;
            return
        }else{
            hpMonster = attackMonster(dmg,hpMonster)
            //Esta linea debe ser borrada para evitar oportunistas, solo esta para debug:
            console.log('Consola>>' + 'El mounstruo tiene todavía ' + hpMonster + ' HP')
        }

        actionMonster(channel, usr, caidos, MONSTUOS[monsterIndex])

        if(cazadores.length === caidos.length){
            client.action(channel, 'Ya no hay cazadores con vida... la mision ha FALLADO! NotLikeThis')
        }

        console.log('Consola>> CAZADORES: ' + cazadores.toString())
        console.log('Consola>> CAIDOS: ' + caidos.toString())

    }

    if(nuevoContador === 0){
        client.action(channel, 'Hola a todos! soy el bot del canal ;) pueden ver mi lista de comandos con escribiendo en el chat: !help')
        contador = contador + 3;
        nuevoContador = contador;
    }

    if (comando.toLowerCase() === '!cazadores') {
        client.action(channel, 'Cazadores en misión: ' + cazadores.toString())
        client.action(channel, 'Cazadores asesinados: ' + caidos.toString())
    }

    if (comando.toLowerCase() === '!help'){
        client.action(channel, '!mision - Eliges o aceptas una mision')
        client.action(channel, '!atacar - Atacas al monstruo')
        client.action(channel, '!cazadores - Ves la lista de los cazadores en mision')
    }

    console.log('Consola>> comando: ' + comando.toString());
});

function rollDice (rango) {
    const sides = rango - 1;
    return Math.floor(Math.random() * sides) + 1;
}

function saludarMancos (channel, usuario) {
    var i = mancos.indexOf(usuario);
    client.action(channel, `Ya llego el manco del ${mancos[i]}! ;P`);

    if (i != -1){
        mancos.splice(i,1);
    }
    console.log('Consola>> MANCOS: ' + mancos.toString());
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