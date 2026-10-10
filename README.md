# SARabande: NISAR surface change explorer

Entry for NASA Space Apps 2026, *Dancing with the SARs*.

An interactive map that compares two NISAR L-band radar acquisitions and shows where Earth's surface changed (monsoon flooding, river and delta morphology, mangrove inundation).

## Data source
- **NISAR L2 GCOV** (Geocoded Polarimetric Covariance), L-band backscatter, served via **NASA GIBS** (layer `NISAR_L2_Geocoded_Polarimetric_Covariance`, Oct 2025 to Oct 2026).
- Source granules are archived at the **ASF DAAC** (NASA Earthdata).

## Features
- Swipe, change-map, and single-date views of any two same-track acquisitions (12-day repeat).
- Change layer computed in the browser per pixel from the two NISAR tiles (blue = decrease, orange = increase, adjustable threshold).
- Sites: Jamuna River, Sundarbans, Meghna Estuary (Bangladesh).

## Limits and next steps
- Change is computed on the GIBS false-colour composite (HH/HV/VV), not raw dB values.
- Next: pull GCOV HDF5 from ASF, compute a calibrated dB log-ratio, list granules from the Earthdata CMR API, add global sites.

## Run
Open `index.html` via a local server (e.g. VS Code Live Server). Needs internet.

Tech: Leaflet, NASA GIBS WMTS, vanilla JS.
