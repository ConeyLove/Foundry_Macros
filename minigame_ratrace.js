let minigamename = "Rat Race";
let minigamephoto = "https://assets.forge-vtt.com/61f0a122808acef02350ca8c/Scott%20Photos/minigames/minigame_ratrace2.png";
let minigameprice = "5";

let minigamedesc = 
"<img src='" + minigamephoto + "'><br><br>" +
"Do you have charm? Do you have grace? Do you have what it takes to win the rat race? Yes, right here on our beautiful wheel of fortune, we have a hole right here in the center, and inside that hole - our very own pet rat, Monty! Yes, Monty is going to come out of that hole while the wheel is slowly, slowly, ever so slowly spinning. And Monty is going to come to the end of the wheel in whatever direction Monty wants! But will he come to you? You can call him over, whisper to him, or offer him some treats - if you can win him over, you win a prize! Only " + minigameprice + " silvers to play, and you win a prize - do you want to play?<br><br>";

letwinorlose = "";

let minigamedc = "18";
let minigameprize = "Signal Whistle";


if (canvas.tokens.controlled.length == 0 || canvas.tokens.controlled.length > 1) 
{
ui.notifications.error("Please select one Actor token.");
return;
}

let curractor = canvas.tokens.controlled[0].actor;
let currspkr = ChatMessage.getSpeaker({ actor: curractor });
let charname = curractor.name;

let minigamerollmod = canvas.tokens.controlled[0].actor.system.abilities.cha.mod;

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
        let winorlose = charname + " steps up to the wheel to play " + minigamename + ", handing over the silver and then getting into position on the side of the wheel and gently trying to coax Monty the rat over to them, whispering and making noises, trying to look and act as friendly as possible, laying on the charm! What's this? It appears to be working! Wait, Monty is so close... Yes! " + charname + " has won over this precocious little scamp! WINNER!<br><br>The prize is 1 " + minigameprize;
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
        let winorlose = charname + " steps up to the wheel to play " + minigamename + ", handing over the silver and then getting into position on the side of the wheel and gently trying to coax Monty the rat over to them, whispering and making noises, trying to look and act as friendly as possible, laying on the charm! What's this? It appears to be working! Wait, Monty is so close... Oh no! Someone else has caught Monty's eye! Awww, better luck next time.";
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
