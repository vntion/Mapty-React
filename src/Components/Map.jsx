import PropTypes from 'prop-types';
import { useEffect } from 'react';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet';

const MAP_ZOOM_LEVEL = 13;

function ClickEvent({ dispatch, toCoords }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const coords = [lat, lng];
      dispatch({ type: 'showForm', payload: coords });
      map.setView(coords);
    },
  });

  useEffect(() => {
    if (!toCoords) return;

    map.setView(toCoords, MAP_ZOOM_LEVEL, {
      animate: true,
      pan: {
        duration: 0.5,
      },
    });
  }, [toCoords, map]);

  return null;
}

function Map({ dispatch, userPosition, workouts, toCoords }) {
  return (
    <div className="map">
      {userPosition && (
        <MapContainer center={userPosition} zoom={MAP_ZOOM_LEVEL}>
          <TileLayer
            url="https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {workouts.map((workout, i) => (
            <Marker position={workout.coords} key={i}>
              <Popup
                className={
                  workout.type === 'running' ? 'running-popup' : 'cycling-popup'
                }
              >
                {workout.description}
              </Popup>
            </Marker>
          ))}
          <ClickEvent dispatch={dispatch} toCoords={toCoords} />
        </MapContainer>
      )}
    </div>
  );
}

Map.propTypes = {
  dispatch: PropTypes.func,
  userPosition: PropTypes.array,
  workouts: PropTypes.array,
  toCoords: PropTypes.array,
};

ClickEvent.propTypes = {
  dispatch: PropTypes.func,
  toCoords: PropTypes.array,
};

export default Map;
