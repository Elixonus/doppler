# doppler

Small realtime web simulation of the doppler effect for sound waves.

## About

Doppler effect simulation particularized in the context of sound waves and where a wave emitting source and wave detecting observer move with a user controllable velocity or acceleration.

## Source

Source is controllable in velocity or acceleration and can be in one of three states which are stationary, constant velocity or constant acceleration. Source emits waves with a constant frequency and amplitude.

## Waves

Waves propagate in time with their amplitude attenuatuating exponentially. Only the crest of the waves are illustrated in the simulation. Currently when multiple waves collide, interference is not accounted for.

## Observer

Observer, similarly, is controllable in velocity or acceleration and can be in one of three states which are stationary, constant velocity or constant acceleration. Observer detects one wave at a time and records their perceived frequency and amplitude and plays the wave's corresponding audible signal.

## Algorithm

Data of each wave is stored in a rolling queue array where it is is overwritten progressively in a repeating fashion. When each wave is emitted, the current time, as well as the position and velocity of the source is stored in an object to be used later. To detect which wave is currently being observed, the program goes through each wave to try to find the closest one. Then, the perceived frequency and amplitude is calculated using a vector position and velocity of the observer as well as a vector position and velocity of the source at the time of wave emission using the wave cache mentioned earlier.

## Functionality

The time button group can be used to pause the simulation, possibly to change the properties of the source and observer.

The buffer button group can be used to save the current simulation time and restore the saved time later on.

The sound button group can be used to interpret the observed signal as a sound wave.

The owave button group can be used to highlight the properties of the wave that is observed at the current time. This includes the position and velocity of the source.

The control button group can be used to toggle between modifying the properties of the source and observer.

The type button group can be used to toggle between modifying the velocity and acceleration of the controlled object.

The vector button group can be used to set the vector of the motion type of the controlled object.

## Limitations

Does not implement the effects of wave interference.

Observer can only detect one frequency and amplitude at a time
