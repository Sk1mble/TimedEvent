A system agnostic module for setting up a reminder about an event to take place on a specific turn. Uses flags to store the data per combat, so will persist between sessions.
There are no user interface elements included so you will need to use a macro to launch this, as per the one included in the directory. The code would be:

var te = new TimedEvent();
te.createTimedEvent();

Keeping the TimedEvent dialog open while messing with the combat tracker and then trying to set a timed event from the TimedEvent dialog will cause errors. 

Don't do that.