# Persistent storage
Status: approved

# Decision
Use local storage for the history.

# Context
Need to pick a way to store the matrix history so that users can see how they got to a certain point in the calculation.  I want to deploy this quickly using technology that I know.  I expect a maximum of 18 to 25 history operations per matrix based on personal experience and the target audience (high school math, maybe 3x3 matrices).

# Solutions Considered
## Session storage
Rejected: too easy to clear.

## Local storage
Pro: synchronous, easy to use, I'm familiar with it.
Con: not super scalable.

## IndexedDB
Pro: survives refreshes and can be used across tabs.
Con: asynchronous, overkill (too much capacity), I'm not very familiar with it.

## Nuxt state
Rejected: too easy to clear (doesn't survive refresh).

# Consequences
## Good
* Fast deployment (familiar technology).
* Survives refreshes and can be used across tabs.

## Bad
* Persists indefinitely (you need to clear it).
* Limited scalability - if I suddenly needed to work on 900x900 matrices, I may need a new storage mechanism.
