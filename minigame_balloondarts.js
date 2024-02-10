let minigamename = "Balloon Darts";
let minigamephoto = "https://assets.forge-vtt.com/61f0a122808acef02350ca8c/Scott%20Photos/minigames/minigame_balloons.png";
let minigamedesc = 
"<img src='" + minigamephoto + "'><br><br>" +
"Welcome to a game of both skill AND luck! You throw one of these little darts at this wall of balloons, and if you manage to pop one, you get a prize! The cost is 2 silver pieces. Would you like to play?<br><br>";

letwinorlose = "";

let minigameprice = "2";
let minigamedc = "16";
let minigameprize = "Candy";


if (canvas.tokens.controlled.length == 0 || canvas.tokens.controlled.length > 1) 
{
ui.notifications.error("Please select one Actor token.");
return;
}

let curractor = canvas.tokens.controlled[0].actor;
let currspkr = ChatMessage.getSpeaker({ actor: curractor });
let charname = curractor.name;

let minigamerollmod = canvas.tokens.controlled[0].actor.system.abilities.dex.mod;

//------------------------------------------------------------------
//Open a dialog box

let goldpieces = curractor.system.currency.gp;
let silverpieces = curractor.system.currency.sp;

if ((silverpieces < 1) && (goldpieces > 0))
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
      condition: silverpieces >= 2,
      callback: async function() {
 silverpieces = silverpieces - minigameprice;
 await curractor.update({ "system.currency.sp": silverpieces});

        const roll = await new Roll("1d20 + @mod", {mod: minigamerollmod}).evaluate();
        roll.toMessage({speaker: ChatMessage.implementation.getSpeaker({actor})});

if (roll.total >= minigamedc)
       {
        //Winner
        let winorlose = charname + " steps up to play " + minigamename + ", takes a breath and throws - the dart flies through the air, and pops a balloon! WINNER!<br><br>You win 1 " + minigameprize;
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
        let winorlose = charname + " steps up to play " + minigamename + ", takes a breath and throws - the dart flies through the air, and just barely misses a balloon! SO SORRY!";
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