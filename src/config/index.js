import * as localConfig from "./local";
import { VIEW_MODES } from "../constants";

const defaultStyles = [
  {
    id: "mapbox-streets",
    name: "Mapbox Streets",
    type: "mapbox-gl",
    url: "mapbox://styles/mapbox/streets-v11",
  },
  {
    id: "mapbox-light",
    name: "Mapbox Light",
    type: "mapbox-gl",
    url: "mapbox://styles/mapbox/light-v10",
  },
];

const defaultMapState = {
  bearing: 0,
  center: { lng: -73.92169, lat: 40.83962 },
  pitch: 0,
  showCollisions: false,
  zoom: 13.25,
};

const defaultMaps = defaultStyles.map(
  (style, i) => localConfig?.stylePresets?.[i] ?? style
);

const defaultViewMode = VIEW_MODES[0];

const defaultBranchPattern = {
  pattern: "",
  styles: [],
};

const config = {
  maps: defaultMaps,
  mapState: defaultMapState,
  viewMode: defaultViewMode,
  branchPattern: defaultBranchPattern,
  ...localConfig,
};

export const {
  mapState,
  maps,
  viewMode,
  stylePresets,
  branchPattern,
  mapboxGlAccessToken,
} = config;
