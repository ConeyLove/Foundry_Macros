if (canvas.tokens.controlled.length == 0 || canvas.tokens.controlled.length > 1) 
{
ui.notifications.error("Please select one Actor token.");
return;
}

let curractor = canvas.tokens.controlled[0].actor;
console.log(curractor);

let goldpieces = curractor.system.currency.gp;
let silverpieces = curractor.system.currency.sp;

console.log(goldpieces);
console.log(silverpieces);

if (goldpieces >= 1)
{
 goldpieces = goldpieces - 1;
 silverpieces = silverpieces + 10;
 await curractor.update({ "system.currency.gp": goldpieces, "system.currency.sp": silverpieces});
}