"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { LeafletProvider, createLeafletContext } from "@react-leaflet/core";
import L from "leaflet";

export interface SafeMapContainerProps extends L.MapOptions {
  children?: ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  center?: L.LatLngExpression;
  zoom?: number;
  whenReady?: () => void;
  /** Called with the Leaflet map instance once it has been created. */
  onMapReady?: (map: L.Map | null) => void;
}

/**
 * A drop-in replacement for react-leaflet's <MapContainer> that creates the
 * Leaflet map inside an effect instead of a ref callback.
 *
 * react-leaflet v4 creates the map in a ref callback but only removes it from
 * an effect cleanup that captured the (still null) context of the first
 * commit. React 18 StrictMode remounts effects in development, so the stale map
 * is still attached to the DOM node when React re-attaches the ref and Leaflet
 * throws "Map container is already initialized", which unmounts the whole map.
 *
 * Creating the map in an effect means the cleanup runs before the remount, so
 * Leaflet releases the container and the map can be created again.
 *
 * @see https://github.com/PaulLeCam/react-leaflet/issues/963
 */
export function SafeMapContainer({
  children,
  className,
  id,
  style,
  center,
  zoom,
  whenReady,
  onMapReady,
  ...options
}: SafeMapContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [context, setContext] = useState<ReturnType<typeof createLeafletContext> | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const map = new L.Map(node, options);
    if (center != null && zoom != null) {
      map.setView(center, zoom);
    }
    if (whenReady != null) {
      map.whenReady(whenReady);
    }

    setContext(createLeafletContext(map));
    onMapReady?.(map);

    return () => {
      setContext(null);
      onMapReady?.(null);
      map.remove();
    };
    // The map is created once for the lifetime of the container.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id={id} ref={containerRef} className={className} style={style}>
      {context ? <LeafletProvider value={context}>{children}</LeafletProvider> : null}
    </div>
  );
}

export default SafeMapContainer;
