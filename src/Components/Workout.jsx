import PropTypes from 'prop-types';
import { useState } from 'react';

function Workout({
  id,
  selectedId,
  onSelect,
  type,
  description,
  distance,
  duration,
  pace,
  cadence,
  dispatch,
  coords,
}) {
  const [dis, setDis] = useState(distance);
  const [dur, setDur] = useState(duration);
  const [pac, setPac] = useState(pace);
  const [caden, setCaden] = useState(cadence);

  const selected = id === selectedId;

  function handleEdit() {
    if (type === 'running')
      dispatch({
        type: 'editWorkoutRunning',
        payload: {
          id,
          distance: dis,
          duration: dur,
          pace: pac,
          cadence: caden,
        },
      });

    if (type === 'cycling')
      dispatch({
        type: 'editWorkoutCycling',
        payload: {
          id,
          distance: dis,
          duration: dur,
          pace: pac,
          cadence: caden,
        },
      });
  }

  return (
    <li
      className={`workout ${
        type === 'running' ? 'workout--running' : 'workout--cycling'
      }`}
      onClick={() => {
        dispatch({ type: 'selectWorkout', payload: coords });
      }}
    >
      <h2 className="workout__title">{description}</h2>
      <div className="workout__details">
        <span className="workout__icon">
          {type === 'running' ? '🏃‍♂️' : '🚴'}
        </span>
        <input
          type="text"
          className="workout__value"
          value={dis.toFixed(1)}
          onChange={e => {
            setDis(Number(e.target.value));
          }}
          disabled={!selected}
        />
        <span className="workout__unit">km</span>
      </div>
      <div className="workout__details">
        <span className="workout__icon">⏱</span>
        <input
          type="text"
          className="workout__value"
          value={dur.toFixed(1)}
          onChange={e => {
            setDur(Number(e.target.value));
          }}
          disabled={!selected}
        />
        <span className="workout__unit">min</span>
      </div>
      <div className="workout__details">
        <span className="workout__icon">⚡️</span>
        <input
          type="text"
          className="workout__value"
          value={pac.toFixed(1)}
          onChange={e => {
            setPac(Number(e.target.value));
          }}
          disabled={!selected}
        />
        <span className="workout__unit">
          {type === 'running' ? 'min/km' : 'km/h'}
        </span>
      </div>
      <div className="workout__details">
        <span className="workout__icon">{type === 'running' ? '🦶🏼' : '⛰'}</span>
        <input
          type="text"
          className="workout__value"
          value={caden.toFixed(1)}
          onChange={e => {
            setCaden(Number(e.target.value));
          }}
          disabled={!selected}
        />
        <span className="workout__unit">
          {type === 'running' ? 'spm' : 'm'}
        </span>
      </div>

      {selected && (
        <div className="workout__buttons">
          <button
            className="workout__btn workout__btn--cancel"
            onClick={() => {
              onSelect(id);
              setDis(distance);
              setDur(duration);
              setPac(pace);
              setCaden(cadence);
            }}
          >
            Cancel
          </button>
          <button
            className="workout__btn workout__btn--ok"
            onClick={() => {
              onSelect(id);
              handleEdit();
            }}
          >
            OK
          </button>
        </div>
      )}

      <button className="workout__edit" onClick={() => onSelect(id)}>
        Edit
      </button>

      {selected && (
        <button
          className="workout__delete"
          onClick={() => {
            onSelect(id);
            dispatch({ type: 'deleteWorkout', payload: id });
          }}
        >
          ❌
        </button>
      )}
    </li>
  );
}

Workout.propTypes = {
  id: PropTypes.string,
  selectedId: PropTypes.string,
  onSelect: PropTypes.func,
  type: PropTypes.string,
  description: PropTypes.string,
  distance: PropTypes.number,
  duration: PropTypes.number,
  pace: PropTypes.number,
  cadence: PropTypes.number,
  dispatch: PropTypes.func,
  coords: PropTypes.array,
};

export default Workout;
