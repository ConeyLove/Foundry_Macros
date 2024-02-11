let minigamename = "Three-Card Monte";
let minigamephoto = "https://assets.forge-vtt.com/61f0a122808acef02350ca8c/Scott%20Photos/minigames/minigame_threecardmonte2.png";
let minigameprice = "3";

let minigamedesc = 
"<img src='" + minigamephoto + "'><br><br>" +
"Find the lady, folks! Find the lady! Three cards, two eyes, and only one lady - find the lady, folks. I show you the Queen, then mix up these three cards and you've got to follow the lady. She's very good at what she does, so don't blink! Find the lady! Only " + minigameprice + " silvers to play, and you win a prize - do you want to play?<br><br>";

letwinorlose = "";

let minigamedc = "20";
let minigameprize = "Playing Cards Set";


if (canvas.tokens.controlled.length == 0 || canvas.tokens.controlled.length > 1) 
{
ui.notifications.error("Please select one Actor token.");
return;
}

let curractor = canvas.tokens.controlled[0].actor;
let currspkr = ChatMessage.getSpeaker({ actor: curractor });
let charname = curractor.name;

let minigamerollmod = canvas.tokens.controlled[0].actor.system.abilities.wis.mod;

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
  title: minigamename,
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
        let winorlose = charname + " steps up to play " + minigamename + ", paying to play and then intently following the Queen of Hearts when it's shown to everyone. The cards are quickly turned over and mixed up - mixed, mixed, mixed - and finally they come to a halt." + charname + "looks over the three cards and points to the one they chose... Everyone holds their breath as the card is turned over - SUCCESS! The Queen has been caught!<br><br>You win 1 " + minigameprize;
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
        let winorlose = charname + " steps up to play " + minigamename + ", paying to play and then intently following the Queen of Hearts when it's shown to everyone. The cards are quickly turned over and mixed up - mixed, mixed, mixed - and finally they come to a halt." + charname + "looks over the three cards and points to the one they chose... Everyone holds their breath as the card is turned over - OH NO! The Queen has escaped once again!";
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
