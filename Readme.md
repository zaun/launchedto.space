# Launches Over Time
This project was designed a nice easy way to see information about rocket launches and their payloads.

## Data 
The main data for the site is located in the `data/data.json` file. When adding data please be spcific and consistent. For example is the launch vehicle was a _Falcon-9 v1.1_ do not list it as a _Falcon-9_.

## Vehicle Images
The images for each vehicle is located in the `media/vehicles/` directory. Image are the vehicle on its side, with width of the image is equal to the height of the rocket in meters times 10.

> A vehicle that is 55.3m high 3.6m wide would have an image with the dimenstions 36 by 553 pixels when displayed on the site.

> Images need to be the correct aspect ratio but not the exact size.

## Local Development
This project uses Vue.js. Once you clone the repository run `npm install` followed by `npm run serve`. This will start a local development server.

After adding images to `media/orig/` run `npm run thumb` before commiting to create thubnails