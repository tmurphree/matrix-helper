# Matrix data type
Status: approved

# Decision
Use a Map for the matrix.

# Context
Need to pick a way to store the matrix.

# Solutions Considered
## Array of arrays
[[1, 2], [3, 4]]

Tripling a row looks like:
matrix[0].map((el) => el * 3);

Adding two rows looks like:
matrix[0].map((el, index) => el + matrix[1][index]);

### Conclusion
Discarded: I'll always be fighting the zero-based index (e.g. 'row 2' is matrix[1]).

## Object
{
    1: [1,2],
    2: [3,4]
}

Tripling a row looks like:
matrix[1].map((el) => el * 3);

Adding two rows looks like:
matrix[1].map((el, index) => el + matrix[2][index]);

### Conclusion
Discarded: The Map syntax looks cleanest.


## Map
Map([
    [1, [1, 2]],
    [2, [3, 4]],
])

Tripling a row looks like:
matrix.get(1).map((el) => el * 3);

Adding two rows looks like:
matrix.get(1).map((el, index) => el + matrix.get(2)[index]);

# Consequences
## Good
* Uses explicit get and set wording.

## Bad
* Need to covert to and from arrays to do some operations.  I may store the history data in multidimensional arrays becuase I'll just be reading and displaying it at that point.
