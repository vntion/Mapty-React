import { useEffect, useReducer } from 'react';

import Map from './Components/Map';
import SideBar from './Components/SideBar';
import Logo from './Components/Logo';
import Copyright from './Components/Coypright';
import Workouts from './Components/Workouts';

const initialState = {
  showForm: false,
  userPosition: null,
  workouts: JSON.parse(localStorage.getItem('workouts')),
  selectedCoords: null,
  toCoords: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'getPosition':
      return { ...state, userPosition: action.payload };
    case 'showForm':
      return { ...state, showForm: true, selectedCoords: action.payload };
    case 'hideForm':
      return { ...state, showForm: false };
    case 'newWorkout':
      return { ...state, workouts: [...state.workouts, action.payload] };
    case 'deleteWorkout':
      return {
        ...state,
        workouts: state.workouts.filter(work => work.id !== action.payload),
      };
    case 'editWorkoutRunning':
      return {
        ...state,
        workouts: state.workouts.map(workout =>
          workout.id === action.payload.id
            ? {
                ...workout,
                distance: action.payload.distance,
                duration: action.payload.duration,
                pace: action.payload.pace,
                cadence: action.payload.cadence,
              }
            : workout
        ),
      };
    case 'editWorkoutCycling':
      return {
        ...state,
        workouts: state.workouts.map(workout =>
          workout.id === action.payload.id
            ? {
                ...workout,
                distance: action.payload.distance,
                duration: action.payload.duration,
                speed: action.payload.pace,
                elevationGain: action.payload.cadence,
              }
            : workout
        ),
      };
    case 'deleteAllWorkouts':
      return { ...state, workouts: [] };
    case 'selectWorkout':
      return { ...state, toCoords: action.payload };
    default:
      throw new Error('Unknown action :(');
  }
}

function App() {
  const [
    { showForm, userPosition, workouts, selectedCoords, toCoords },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    function getLocation(position) {
      const { latitude, longitude } = position.coords;
      const coords = [latitude, longitude];

      dispatch({ type: 'getPosition', payload: coords });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getLocation, () => {
        alert('Please turn on the GPS');
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  return (
    <>
      <SideBar>
        <Logo />
        <Workouts
          showForm={showForm}
          dispatch={dispatch}
          workouts={workouts}
          selectedCoords={selectedCoords}
        />
        {workouts.length > 0 && (
          <div className="button-btm">
            <button
              className="btnDelete"
              onClick={() => {
                dispatch({ type: 'deleteAllWorkouts' });
              }}
            >
              Delete all
            </button>
            {workouts.length > 1 && <button>Sort</button>}
          </div>
        )}

        <Copyright />
      </SideBar>
      <Map
        userPosition={userPosition}
        dispatch={dispatch}
        workouts={workouts}
        toCoords={toCoords}
      />
    </>
  );
}

export default App;
