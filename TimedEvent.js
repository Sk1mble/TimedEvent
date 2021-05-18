class TimedEvent extends Application {

    constructor(){
        super();
    }

    createTimedEvent(){
        var triggerRound=0;
        var triggerText="";
        var currentRound="NoCombat";
        try {
            currentRound = game.combat.round;
        } catch {
            var dp = {
                "title": "Error",
                "content": "There's no current combat for which to set an event.<p>",
                default:"oops",
                "buttons": {
                    oops: {
                        label: "OK",
                    }
                }
            }
            let d = new Dialog(dp);
            d.render(true);
        }
        if (currentRound != "NoCombat"){
            var peText = "No Pending Events<p></p>"
            let pendingEvents = game.combat.getFlag("TimedEvent","timedEvents");
            if (pendingEvents != null || pendingEvents != undefined){
                peText=
                `<tr>
                    <td>Round</td>
                    <td>Pending Event</td>
                </tr>`
                pendingEvents.forEach(event => {
                    //console.log(event);
                    if (event.complete === false){
                        peText+=`<tr><td>${event.round}</td><td>${event.event}</td></tr>`
                    }
                });
            }
            var dp = {
                "title":"Timed Event",
                "content":`<h1>Create a Timed Event</h1>
                            The current round is ${game.combat.round}.<p></p>
                            <table>
                                ${peText}
                            </table>
                            <table>
                                <tr>
                                    <td>What is your event?</td>
                                    <td><input type="text" id="eventToCreate" name="eventToCreate" style="background: white; color: black;" autofocus></input></td>
                                </tr>
                                <tr>
                                    <td>Trigger event on round:</td>
                                    <td><input type="number" value="${game.combat.round+1}" id="eventExchange" name="eventExchange"></input></td>
                                </tr>
                            </table>`,
                    default:"create",
                    "buttons":{
                        create:{label:"Create", callback:async () => {
                            //if no flags currently set, initialise
                            var timedEvents = game.combat.getFlag("TimedEvent","timedEvents");
                            
                            if (timedEvents ==null || timedEvents == undefined){
                                await game.combat.setFlag("TimedEvent","timedEvents",[
                                                                                        {   "round":`${document.getElementById("eventExchange").value}`,
                                                                                            "event":`${document.getElementById("eventToCreate").value}`,
                                                                                            "complete":false
                                                                                        }
                                                                                ])
                                                                                timedEvents=game.combat.getFlag("TimedEvent","timedEvents");
                                                                                //console.log(timedEvents);
                            } else {
                                timedEvents.push({   
                                                    "round":`${document.getElementById("eventExchange").value}`,
                                                    "event":`${document.getElementById("eventToCreate").value}`,
                                                    "complete":false
                                });
                                game.combat.setFlag("TimedEvent","timedEvents",timedEvents);
                                
                                }

                            triggerRound=document.getElementById("eventExchange").value;
                            triggerText=document.getElementById("eventToCreate").value;
                        }}
                    }
                }
            let dO = Dialog.defaultOptions;
            dO.width=400;
            dO.height=250;
            dO.resizable="true"
            let d = new Dialog(dp, dO);
            d.render(true);
        }
    }
}

Hooks.on('renderCombatTracker', () => {
    try {
        var r = game.combat.round;
        let pendingEvents = game.combat.getFlag("TimedEvent","timedEvents");
        for (let i = 0; i<pendingEvents.length;i++){
            var event = pendingEvents[i];
            if (r==event.round && event.complete != true){
                //console.log("Match");
                var dp = {
                    "title": "Timed Event",
                    "content": `<h2>Timed event for round ${event.round}:</h2><p></p>
                                <h3>${event.event}</h3>`,
                    default:"oops",
                    "buttons": {
                        oops: {
                            label: "OK",
                        }
                    }
                }
                event.complete = true;
                let d = new Dialog(dp);
                d.render(true);
            }
        }
    }catch {

    }
})