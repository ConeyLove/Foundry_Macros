let minigamename = "Test Your Strength";
let minigamephoto = "";
let minigamedesc = 
"<img src='" + minigamephoto + "'><br><br>" +
"Step right up! Test your strength! Can you do it? Can you get the bell to ring? Are you strong enough to win a prize? Come on down! One swing of the hammer costs only 5 silver pieces! Would you like to play?<br><br>";

let minigameprice = "5";
let minigamedc = "20";
let minigameprize = "Hammer";


if (canvas.tokens.controlled.length == 0 || canvas.tokens.controlled.length > 1) 
{
ui.notifications.error("Please select one Actor token.");
return;
}

let curractor = canvas.tokens.controlled[0].actor;
let currspkr = ChatMessage.getSpeaker({ actor: curractor });
let charname = curractor.name;

let minigamerollmod = canvas.tokens.controlled[0].actor.system.abilities.str.mod;

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
        let winorlose = charname + " steps up to play " + minigamename + ", picks up the giant wooden mallet, takes a breath and SWINGS! The hammer flies over their head through the air in an arc, and down - the bell RINGS! WINNER!<br><br>You win 1 " + minigameprize;
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
        let winorlose = charname + " steps up to play " + minigamename + ", picks up the giant wooden mallet, takes a breath and SWINGS! The hammer flies over their head through the air in an arc, and down - SO CLOSE! The striker gets almost to the top but does not quite hit the top! So sorry!";
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
