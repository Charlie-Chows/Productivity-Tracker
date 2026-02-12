

When you click +:
```js
click
  ↓
dispatch(increment())
  ↓
reducer runs
  ↓
state.value++
  ↓
useSelector detects change
  ↓
component re-renders
  ↓
UI updates
```