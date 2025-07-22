import { Map, MapBrowserEvent, Overlay, View } from "ol";
import { useCallback, useEffect, useRef } from "react";
import "./index.css";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { AddProjectButton } from "../project/ui/addProjectButton";
import { ProjectListButton } from "../project/ui/projectListButton";
import { observer } from "mobx-react-lite";
import projectStore from "../project/store";
import { MapPin } from "lucide-react";
import { createRoot } from "react-dom/client";

export const StreetMap = observer(() => {
  const mapRef = useRef<Map | null>(null);
  const overlaysRef = useRef<Overlay[]>([]);
  const lastAddedMarkerRef = useRef<Overlay | null>(null);
  const viewRef = useRef<View | null>(null);
  const { projects } = projectStore;

  useEffect(() => {
    const map = new Map({
      target: "map",
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({ center: [6259905.2, 7969805.2], zoom: 15 }),
    });
    mapRef.current = map;
    viewRef.current = map.getView();

    projectStore.projects.forEach((project) => {
      const markerElement = document.createElement("div");
      const root = createRoot(markerElement);
      root.render(<MapPin size={24} />);

      const markerOverlay = new Overlay({
        element: markerElement,
        position: [project.coordinateX, project.coordinateY],
        positioning: "bottom-center",
      });

      mapRef.current?.addOverlay(markerOverlay);
      overlaysRef.current.push(markerOverlay);
    });

    map.on("click", (e: MapBrowserEvent) => {
      if (projectStore.isOpenForAddingMark) {
        projectStore.setCurrentCoordinates(e.coordinate[0], e.coordinate[1]);
        addTemporaryMarker(e.coordinate);
      }
    });

    return () => {
      map.setTarget(undefined);
      overlaysRef.current.forEach((overlay) =>
        mapRef.current?.removeOverlay(overlay)
      );
      overlaysRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      overlaysRef.current.forEach((overlay) =>
        mapRef.current?.removeOverlay(overlay)
      );
      overlaysRef.current = [];
      projectStore.projects.forEach((project) => {
        const markerElement = document.createElement("div");
        const root = createRoot(markerElement);
        root.render(<MapPin size={24} />);

        const markerOverlay = new Overlay({
          element: markerElement,
          position: [project.coordinateX, project.coordinateY],
          positioning: "bottom-center",
        });

        mapRef.current?.addOverlay(markerOverlay);
        overlaysRef.current.push(markerOverlay);
      });
    }
  }, [projects]);

  const addTemporaryMarker = (coordinate: number[]) => {
    if (!mapRef.current) return;

    

    const markerElement = document.createElement("div");
    const root = createRoot(markerElement);
    root.render(<MapPin size={24} />);

    const markerOverlay = new Overlay({
      element: markerElement,
      position: coordinate,
      positioning: "bottom-left",
    });

    mapRef.current.addOverlay(markerOverlay);
    lastAddedMarkerRef.current = markerOverlay;
  };

  const centerOnMark = useCallback((coordinates: number[]) => {
    const size = mapRef.current?.getSize();
    console.log(coordinates, size, viewRef.current);
    const newView = new View({ center: coordinates, zoom: 15 });
    mapRef.current?.setView(newView);
  }, []);

  return (
    <div className="map-container">
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
      <AddProjectButton />
      <ProjectListButton centerOnMark={centerOnMark} />
    </div>
  );
});
