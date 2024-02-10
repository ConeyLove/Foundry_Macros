let minigamename = "Goblin Launch";
let minigamephoto = "https://assets.forge-vtt.com/61f0a122808acef02350ca8c/Scott%20Photos/minigames/minigame_goblinlaunch3.png";
let minigameprice = "4";

let minigamedesc = 
"<img src='" + minigamephoto + "'><br><br>" +
"Oooh, this is a fun one, ladies and gentlemen! Yes, can you figure out the trick? You have to place the little wooden goblin on the catapult correctly, then aim it just right and hit it with just the right amount of force - no more, no less - and launch that little toy goblin into the bucket over there! Get it in and win a prize! But you'll have to be pretty clever to get it just right! Only " + minigameprice + " silvers to play, and you win a prize - do you want to play?<br><br>";

letwinorlose = "";

let minigamedc = "20";
let minigameprize = "Fishing Tackle";


if (canvas.tokens.controlled.length == 0 || canvas.tokens.controlled.length > 1) 
{
ui.notifications.error("Please select one Actor token.");
return;
}

let curractor = canvas.tokens.controlled[0].actor;
let currspkr = ChatMessage.getSpeaker({ actor: curractor });
let charname = curractor.name;

let minigamerollmod = canvas.tokens.controlled[0].actor.system.abilities.int.mod;

//------------------------------------------------------------------
//Open a dialog box

let goldpieces = curractor.system.currency.gp;
let silverpieces = curractor.system.currency.sp;

if ((silverpieces < minigameprice) && (goldpieces > 0))
{
 goldpieces = goldpieces - 1;
 silverpieces = silverpieces + 10;
 await curractor.update({ "system.currency.gp": goldpieces, "system.currency.sp": silverpieces});
}

new Dialog({
  content: minigamedesc,
  buttons: {
    roll: {
      label: "Play",
      condition: silverpieces >= minigameprice,
      callback: async function() {
 silverpieces = silverpieces - minigameprice;
 await curractor.update({ "system.currency.sp": silverpieces});

        const roll = await new Roll("1d20 + @mod", {mod: minigamerollmod}).evaluate();
        roll.toMessage({speaker: ChatMessage.implementation.getSpeaker({actor})});

if (roll.total >= minigamedc)
       {
        //Winner
        let winorlose = charname + " steps up to play " + minigamename + ", paying the silver to play and then eyeing up the toy goblins, and selecting one, then placing it on the small catapult and positioning it just so. Then " + charname + " turns the catapult to get just the right angle... There! It's dialed in. Now, finally, the small wooden mallet that the operator provided goes high into the air, but not too high - just high enough... 1... 2... 3! The mallet comes down, and the toy goblin sails through the air! It's going - going - going - YES! SUCCESS! The toy goblin lands in the bucket! WINNER!<br><br>The prize is 1 " + minigameprize;
        await ChatMessage.create({content: winorlose});

//---Give prize----------------------------------------------------

const item = curractor.items.getName(minigameprize);
if(!item) {
    await curractor.createEmbeddedDocuments("Item", [game.items.getName(minigameprize).toObject()]);
}
else {
    const {quantity} = item.system;
    await item.update({"system.quantity": quantity + 1});
}
//-----------------------------------------------------------------
       }
       else
       {
        //Loser
        let winorlose = charname + " steps up to play " + minigamename + ", paying the silver to play and then eyeing up the toy goblins, and selecting one, then placing it on the small catapult and positioning it just so. Then " + charname + " turns the catapult to get just the right angle... There! It's dialed in. Now, finally, the small wooden mallet that the operator provided goes high into the air, but not too high - just high enough... 1... 2... 3! The mallet comes down, and the toy goblin sails through the air! It's going - going - going - oh no! It just misses the bucket! Aww, better luck next time.";
        await ChatMessage.create({content: winorlose});
       }
      }
    },
    goodbye: {
      label: "No thanks",
      callback: async function() {}
    },
  }
}).render(true);

//------------------------------------------------------------------