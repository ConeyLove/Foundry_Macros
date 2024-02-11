let minigamename = "The Hang Bar";
let minigamephoto = "https://assets.forge-vtt.com/61f0a122808acef02350ca8c/Scott%20Photos/minigames/minigame_hangbar.png";
let minigameprice = "8";

let minigamedesc = 
"<img src='" + minigamephoto + "'><br><br>" +
"You may be the biggest and the strongest, but do you have what it takes to defeat the Hangbar? Do you? Can you hang from this bar for a full two minutes without falling? Many have tried! Few have succeeded! This may be the hardest game here, ladies and gentlemen! Step right up! See if you have what it takes! Only " + minigameprice + " silvers to play, and you win the big prize - do you want to play?<br><br>";

letwinorlose = "";

let minigamedc = "22";
let minigameprize = "Potion of Healing";


if (canvas.tokens.controlled.length == 0 || canvas.tokens.controlled.length > 1) 
{
ui.notifications.error("Please select one Actor token.");
return;
}

let curractor = canvas.tokens.controlled[0].actor;
let currspkr = ChatMessage.getSpeaker({ actor: curractor });
let charname = curractor.name;

let minigamerollmod = canvas.tokens.controlled[0].actor.system.abilities.con.mod;

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
        let winorlose = charname + " steps up to try to take on the menacing Hang Bar, handing over the silver and doing some arm-stretchning before getting a good, strong grip on the bar. The attendant removes the stool, and the time is tracked using an two-minute hourglass. The first minute goes by without any effort, but then fatigue starts to set in - supporting your own body weight for that long is no easy task! The seconds count down as the sand in the top of the hourglass shrinks - smaller, smaller, and finally - " + charname + "has done it! Amazing! Stupendous!<br><br>The prize is 1 " + minigameprize;
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
        let winorlose = charname + " steps up to try to take on the menacing Hang Bar, handing over the silver and doing some arm-stretchning before getting a good, strong grip on the bar. The attendant removes the stool, and the time is tracked using an two-minute hourglass. The first minute goes by without any effort, but then fatigue starts to set in - supporting your own body weight for that long is no easy task! The seconds count down as the sand in the top of the hourglass shrinks - smaller, smaller, and right before the time runs out - NO! " + charname + " has fallen! Oh no!";
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
