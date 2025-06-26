import PropTypes from 'prop-types';

import Form from './Form';
import Workout from './Workout';
import { useState } from 'react';

function Workouts({ showForm, dispatch, workouts, selectedCoords }) {
  const [selectedId, setSelectedId] = useState(null);

  function handleSelect(id) {
    setSelectedId(currId => (currId === id ? null : id));
  }

  return (
    <ul className="workouts">
      <Form
        showForm={showForm}
        dispatch={dispatch}
        selectedCoords={selectedCoords}
      />
      {workouts.map((work, i) => (
        <Workout
          id={work.id}
          selectedId={selectedId}
          onSelect={handleSelect}
          type={work.type}
          description={work.description}
          distance={work.distance}
          duration={work.duration}
          pace={work.type === 'running' ? work.pace : work.speed}
          cadence={work.type === 'running' ? work.cadence : work.elevationGain}
          dispatch={dispatch}
          coords={work.coords}
          key={i}
        />
      ))}
    </ul>
  );
}

Workouts.propTypes = {
  showForm: PropTypes.bool,
  dispatch: PropTypes.func,
  workouts: PropTypes.array,
  selectedCoords: PropTypes.array,
};

export default Workouts;
