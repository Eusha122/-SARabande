// Sites and acquisition dates verified to have NISAR GCOV coverage in NASA GIBS (same-track, 12-day repeat).
window.SITES = [
  {
    name: "Jamuna River, Bangladesh", type: "Monsoon flood / river morphology",
    center: [24.5, 89.7], zoom: 9,
    dates: ["2026-07-07", "2026-08-12", "2026-08-24", "2026-09-05", "2026-09-17", "2026-09-29"],
    a: "2026-07-07", b: "2026-09-05",
    desc: "The braided Jamuna (Brahmaputra) shifts channels and floods its sandbars every monsoon.",
    signal: "Open water is dark in L-band (specular reflection). Newly flooded land drops in backscatter; exposed sandbars rise.",
    track: "Same-track pairs, 12-day repeat"
  },
  {
    name: "Sundarbans, Bangladesh", type: "Mangrove / tidal inundation",
    center: [22.2, 89.3], zoom: 9,
    dates: ["2026-06-25", "2026-07-07", "2026-07-19", "2026-08-12", "2026-08-24", "2026-09-05", "2026-09-17", "2026-09-29"],
    a: "2026-06-25", b: "2026-08-24",
    desc: "The world's largest mangrove forest, where tide and monsoon water change the surface every few days.",
    signal: "L-band penetrates canopy. Flooded forest gives a bright double-bounce return; drained areas drop.",
    track: "Same-track pairs, 12-day repeat"
  },
  {
    name: "Meghna Estuary, Bangladesh", type: "Delta / coastal change",
    center: [22.7, 90.8], zoom: 9,
    dates: ["2026-06-18", "2026-06-30", "2026-07-12", "2026-07-24", "2026-08-17", "2026-08-29", "2026-09-10", "2026-09-22", "2026-10-04"],
    a: "2026-06-18", b: "2026-08-29",
    desc: "A fast-moving delta where char islands form and erode and river channels migrate.",
    signal: "Sediment bars and water have very different backscatter, so shoreline and channel shifts stand out.",
    track: "Same-track pairs, 12-day repeat"
  }
];
