# Dancing with the SARs

Interactive web app to visualise Earth's surface changes (floods, wildfires, deforestation, glacier flow, earthquakes) for the **NASA Space Apps 2026** challenge *Dancing with the SARs* (NASA-ISRO NISAR).

## What it does
- Pick a surface-change event from the sidebar.
- Two synchronized maps show the **before** and **after** state; pan/zoom moves both.
- Each event explains **how NISAR SAR would detect it** (backscatter change, HV volume scattering, InSAR phase and coherence).

## Data
- **Imagery shown in the demo:** NASA GIBS (MODIS Terra true colour), an optical stand-in, because NISAR science products are still being released.
- **NISAR (target data source):** L-band GCOV (backscatter) and GUNW (interferogram) products from NASA Earthdata / ASF DAAC.

## Planned NISAR pipeline
1. Query ASF DAAC for NISAR GCOV/GUNW over the area of interest.
2. Compute log-ratio of backscatter between two dates (flood/fire/deforestation) and coherence/phase (earthquake/glacier).
3. Serve results as map tiles and replace the optical layers in this app.

## Run
Open `index.html` in a browser (needs internet for map tiles). No build step.

## Tech
Leaflet, NASA GIBS WMTS, plain HTML/JS.
