# doppler 🔊

## About

Doppler effect simulation particularized in the context of sound waves and where the wave emitting source and wave detecting observer move with user controllable velocity or acceleration.

## Source

Source is controllable in velocity and acceleration and is in one of three states, stationary, constant velocity or constant acceleration.

Source emits waves with a constant frequency and amplitude.

## Waves

Waves propagate in time with their amplitude attenuatuating exponentially.

Only crests are illustrated in the rendering of waves.

Currently when multiple waves collide, interference is not accounted for.

## Observer

Observer, similarly, is controllable in velocity and acceleration and is in one of three states, stationary, constant velocity or constant acceleration.

Observer detects a wave at a time and records its perceived frequency and amplitude.

## Algorithm

Data of each wave is stored in a rolling queue array where the array is overwritten progressively in a repeating fashion.

When each wave is emitted, the current time, as well as the position and velocity of the source is stored in an object to be used later.

To detect which wave is currently being observed, the program goes through each wave to try to find the closest one.

Then, the perceived frequency and amplitude is calculated using a vector position and velocity of the observer as well as a vector position and velocity of the source at the time of wave emission using the wave cache mentioned earlier.

## Functionality

`TIME` button group (P) can be used to pause the simulation, possibly to change the properties of the source and observer.

`BUFFER` button group (S/R) can be used to save the current simulation time and restore the saved time later on.

`SOUND` button group (M) can be used to interpret the observed signal as a sound wave.

`OWAVE` button group (O) can be used to highlight the properties of the wave that is observed at the current time. This includes the position and velocity of the source.

`CONTROL` button group (C) can be used to toggle between modifying the properties of the source and observer.

`TYPE` button group (T) can be used to toggle between modifying the velocity and acceleration of the controlled object.

`DIRECTION` button group (ArrowLeft/ArrowRight/ArrowUp/0) can be used to set the direction of the vector (including origin) of the motion type of the controlled object.

`MAGNITUDE` button group (1/2/3) can be used to set the magnitude of the vector (excluding origin) of the motion type of the controlled object.

## Limitations

Does not implement the effects of wave interference.

Observer can only detect one frequency and amplitude at a time.
