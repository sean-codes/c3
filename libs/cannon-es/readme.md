This is a fork of https://github.com/schteppe/cannon.js made by Stefan Hedman [@schteppe](https://github.com/schteppe). It's a type-safe flatbundle (esm and cjs) for easier handling in module environments and tree shaking. Visit the original project for [full documentation](http://schteppe.github.io/cannon.js/docs/) and examples ([1](http://schteppe.github.io/cannon.js/), [2](http://github.com/schteppe/cannon.js/tree/master/examples), [3](http://github.com/schteppe/cannon.js/tree/master/demos)).

    yarn add cannon-es

```jsx
import { World } from 'cannon-es'

// ...
```

#### TO DO:

- Check for any removed `@todo` or `@deprecated` JSDoc comments in merged PR file changes
- Check for variables that were previously intentionally uninitialized in the constructor, but were updated in the TS conversion
- Fix Octree `as any` assertions
- Convert to static methods where possible? (memory savings)
- Convert to abstract classes where possible (Equation, Solver, etc.?)
- Move prototypal method assignments to be within their class definitions
- Ensure no prototypal methods were overwritten due to error:
  - `Property xxxxx has no initializer and is not definitely assigned in the constructor`
- Resolve `as any` type assertions where possible
- Remove use of defined assertion (!) where possible (profile performance to ensure no degradation)
- Correct & standardize JSDoc comments
- Test possible performance improvements by converting matrices to Maps (instead of Arrays)
- V-HACD support (https://github.com/react-spring/use-cannon/issues/35#issuecomment-600188994)
