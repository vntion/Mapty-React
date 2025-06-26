import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

class Workout {
  date = new Date();
  id = crypto.randomUUID();
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in Km
    this.duration = duration; // in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/Km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // mkm/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

function Form({ showForm, dispatch, selectedCoords }) {
  const [type, setType] = useState('running');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [cadence, setCadence] = useState('');
  const [elevation, setElevation] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    function validInput(...inputs) {
      return inputs.every(inp => Number.isFinite(inp));
    }
    function allPositive(...inputs) {
      return inputs.every(inp => inp > 0);
    }

    const distanceTrimmed = +distance.trimStart();
    const durationTrimmed = +duration.trimStart();
    const cadenceTrimmed = +cadence.trimStart();
    const elevationTrimmed = +elevation.trimStart();

    if (type === 'running') {
      if (
        !validInput(distanceTrimmed, durationTrimmed, cadenceTrimmed) ||
        !allPositive(distanceTrimmed, durationTrimmed, cadenceTrimmed)
      )
        return console.error('error');

      dispatch({
        type: 'newWorkout',
        payload: new Running(
          [...selectedCoords],
          distanceTrimmed,
          durationTrimmed,
          cadenceTrimmed
        ),
      });
    }

    if (type === 'cycling') {
      if (
        !validInput(distanceTrimmed, durationTrimmed, elevationTrimmed) ||
        !allPositive(distanceTrimmed, durationTrimmed, elevationTrimmed)
      )
        return console.error('error');

      dispatch({
        type: 'newWorkout',
        payload: new Cycling(
          [...selectedCoords],
          distanceTrimmed,
          durationTrimmed,
          elevationTrimmed
        ),
      });
    }

    setType('running');
    setDistance('');
    setDuration('');
    setCadence('');
    setElevation('');

    dispatch({ type: 'hideForm' });
  }

  useEffect(() => {
    setType('running');
    setDistance('');
    setDuration('');
    setCadence('');
    setElevation('');
  }, [selectedCoords]);

  return (
    <form className={`form ${!showForm && `hidden`}`} onSubmit={handleSubmit}>
      <div className="form__row">
        <label className="form__label">Type</label>
        <select
          className="form__input form__input--type"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="running">Running</option>
          <option value="cycling">Cycling</option>
        </select>
      </div>

      <div className="form__row">
        <label className="form__label">Distance</label>
        <input
          className="form__input form__input--distance"
          placeholder="km"
          value={distance}
          onChange={e => {
            setDistance(e.target.value);
          }}
        />
      </div>

      <div className="form__row">
        <label className="form__label">Duration</label>
        <input
          className="form__input form__input--duration"
          placeholder="min"
          value={duration}
          onChange={e => {
            setDuration(e.target.value);
          }}
        />
      </div>

      {type === 'running' && (
        <div className="form__row">
          <label className="form__label">Cadence</label>
          <input
            className="form__input form__input--cadence"
            placeholder="step/min"
            value={cadence}
            onChange={e => {
              setCadence(e.target.value);
            }}
          />
        </div>
      )}

      {type === 'cycling' && (
        <div className="form__row">
          <label className="form__label">Elev Gain</label>
          <input
            className="form__input form__input--elevation"
            placeholder="meters"
            value={elevation}
            onChange={e => {
              setElevation(e.target.value);
            }}
          />
        </div>
      )}
      <button className="form__btn">OK</button>
    </form>
  );
}

Form.propTypes = {
  showForm: PropTypes.bool,
  dispatch: PropTypes.func,
  selectedCoords: PropTypes.array,
};

export default Form;
