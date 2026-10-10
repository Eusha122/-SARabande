// Surface-change events shown in the app. before/after dates are real NASA GIBS imagery dates.
const EVENTS = [
  {
    icon: "🌊", name: "Sylhet Floods, Bangladesh", type: "Flooding / wetland change",
    center: [24.9, 91.9], zoom: 8, before: "2022-05-10", after: "2022-06-20",
    desc: "June 2022 floods inundated most of Sylhet and Sunamganj districts.",
    nisar: "Open water is dark in SAR (specular reflection), and flooded vegetation shows a bright double-bounce return. A backscatter drop/rise between passes maps flood extent through clouds."
  },
  {
    icon: "🔥", name: "Maui Wildfire, Hawaii", type: "Forest / vegetation fire",
    center: [20.88, -156.6], zoom: 9, before: "2023-08-01", after: "2023-08-12",
    desc: "August 2023 wildfires burned Lahaina and upcountry Maui.",
    nisar: "L-band penetrates canopy, so loss of vegetation structure appears as a change in cross-polarised (HV) backscatter, giving burn severity even under smoke."
  },
  {
    icon: "🌳", name: "Rondonia Deforestation, Brazil", type: "Deforestation / farming",
    center: [-10.5, -62.5], zoom: 8, before: "2019-06-01", after: "2022-06-01",
    desc: "Forest cleared for farmland along the 'arc of deforestation'.",
    nisar: "Forest has strong HV volume scattering; cleared land drops sharply. L-band's 12-day repeat cycle gives a time-series of clearing."
  },
  {
    icon: "🏔️", name: "Jakobshavn Glacier, Greenland", type: "Glacier movement",
    center: [69.2, -49.8], zoom: 8, before: "2016-07-15", after: "2023-07-15",
    desc: "One of the fastest-flowing, fastest-retreating glaciers on Earth.",
    nisar: "InSAR phase differences between passes measure ice velocity down to cm/day, which is how glacier flow is tracked."
  },
  {
    icon: "🏚️", name: "Turkey-Syria Earthquake", type: "Earthquake deformation",
    center: [37.2, 37.0], zoom: 8, before: "2023-01-25", after: "2023-02-15",
    desc: "M7.8 earthquake on 6 Feb 2023 ruptured the East Anatolian Fault.",
    nisar: "Interferograms before and after the quake show fringes of ground displacement, and coherence loss highlights damaged areas."
  }
];
