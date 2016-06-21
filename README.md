# webradiograbber
Simple and basic NodeJS powered internet radio service monitor and recorder.
Currently only supports Caster.fm.

## Usage
> node main.js [caster.fm radio url] [filename prefix] [monitor interval (in ms)]

The parameters are optional. If ran with none of it, it will questions all the needed parameters first before the actual monitoring.

The program then will:

1. Monitor the specified Caster.fm web radio
2. If the web radio is on, it will immediately record it and save it with prefix specified before
3. If the program disconnected and/or the web radio is off, it will retry infinitely in interval duration specified before
4. Quitting this program will require some manual intervention (Ctrl+C)

## Planned feature
Mixlr support, Tracklist Capture, Attempt Limit, Binary Distributions, Code Refactoring


## Others
Work as in 22 June 2016. 
There's no guarantee it will continue to work if there's sudden change on the web radio structure.
Will try to update the program if it happened. Also, the code right now may little bit cluttered. 

The author of this program is not affiliated with any internet radio service providers in any way. All rights belong to their respective owners.
