# store

Global client state (e.g. `authSlice`, `uiSlice`) — zustand or Redux, not
yet decided. Most state should stay local to a feature via its `hooks/`;
put something here only once it's genuinely cross-feature.
