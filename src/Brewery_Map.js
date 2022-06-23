import React, { useState, useEffect } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps';

export function MyMap() {
  const [hue, setHue] = useState(0);
  const color = `hsl(${hue % 360}deg 39% 70%)`;
  const [latLong, setLatLong] = useState({ lat: 30.266666, long: -97.73333 });
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  useEffect(() => {
    fetch(
      `https://api.openbrewerydb.org/breweries?by_dist=${latLong.lat},${latLong.long}&per_page=50&by_type=brewpub`
    )
      .then((response) => response.json())
      .then((data) => {
        // filter only result with lat / long
        const filteredResult = data.filter((v) => v.latitude !== null);
        console.log(filteredResult);
        setMarkers(filteredResult);
      });
  }, [latLong.lat, latLong.long]);

  console.log(markers);

  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    console.log('changed', center);
    setLatLong({ lat: center[0], long: center[1] });
  };

  return (
    <div>
      <ul className='list'>
        {markers.map((m) => {
          return <li>{m.name}</li>;
        })}
      </ul>
      <Map
        height={1000}
        defaultCenter={[latLong.lat, latLong.long]}
        defaultZoom={10}
        onBoundsChanged={onBoundsChanged}
        onClick={() => {
          setSelectedMarker(null);
        }}
      >
        <Marker
          width={50}
          anchor={[50.879, 4.6997]}
          color={color}
          onClick={() => setHue(hue + 20)}
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            width={50}
            anchor={[+marker.latitude, +marker.longitude]}
            color={color}
            onClick={(event) => {
              console.log(event);
              console.log('marker', marker);
              setSelectedMarker(marker);
            }}
          />
        ))}
        {selectedMarker && (
          <Overlay
            anchor={[+selectedMarker.latitude, +selectedMarker.longitude]}
            offset={[120, 79]}
          >
            <div className='info-overlay'>
              <a onClick={() => setSelectedMarker(null)} href='#close'>
                Close
              </a>
              <p>Name: {selectedMarker.name}</p>
              <p>Street: {selectedMarker.street}</p>
              <p>City: {selectedMarker.city}</p>
            </div>
          </Overlay>
        )}
      </Map>
    </div>
  );
}
