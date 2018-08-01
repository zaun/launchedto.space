# Launches Over Time
This project was designed a nice easy way to see information about rocket launches and their payloads.

## Data 
The data for the website is split in across the json files in the data directory. Try not to edit these files by hand, there is an editor that can be run from `npm run editor`

## Rockets
Each rocket listed should be a specific launch configuration. For example a "Falcon-9 v1.2 B5 F" and a "Falcon-9 v1.2 B5 Fx" are basicaly the same, one is just expendable.

## Media
Add as much media as you like through the editor `npm run editor`, it'll automatically create the thumbnail and update the data files.

## Local Development
This project uses Vue.js. Once you clone the repository run `npm install` followed by `npm run serve`. This will start a local development server.
