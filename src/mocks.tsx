export const text = `Boost your React with State Machines
Mixing React and state machines is a great productivity boost for you as a developer. It also improves the usually shaky developers/designers collaboration.

The state machine concept is very simple: a component can be in one state at a time and has a finite number of states.

How is this helpful in UI development you say?

The problem
Let us consider a simple text edition component like the very poorly styled one below:


The possible “states” of the such a component are (from left to right):

Display value
Edit value
Save in progress
Saving error
A straightforward shape for the component model has 5 properties:


The proper combinations of the properties will give us the 4 states we have identified above.

The problem is that there are actually 2⁵ = 32 possible combinations for the state. This means there are 28 wrong ways to use the state properties.

One typical error on the component above is to not reset the error after a successful save. So the end user will save, get a “Something went wrong” error message, correct the error, save again and go to display mode. So far so good. Except when going to edit mode again … the error message is still there. True story. I’ve seen this done several times by inexperienced developers.

Our component is as simple as it gets and yet it evinces a sad truth:

Operating on raw state properties means the component robustness relies solely on the correct use of the properties meaning … for each developer modifying the code … through the whole project lifecycle.

We all know how this ends!

The solution
Consider a different approach using “state machines”. The states would be:


This is more verbose than the first approach but it provides many benefits:

One can see all the states of the component by just looking at the state machine. States have logical names and usage of each raw property is self-documented. New developers in the team will feel at home right away.
The convention on how to extend the component is clear: create a new state and set the raw properties appropriately. No one in their right mind would dare to use raw setState() when there is a state machine implemented in the component.
The last but not the least, the handover process with the UI/UX team becomes as smooth as it can be. You need a visual design for each state of your machine, and maybe some animations for the transitions. That’s it. Clear and easily trackable.
A minimalistic working version of the example above would be:


Usage is:


There is a bit of boilerplate code to write when using state machines:

Create a utility method that sets the state name and content. Keep track of the current state name to ease debugging.
Keep the method that generates your state pure and use it to initialize your state in the constructor
Destructure this.state.machine instead of this.state in your render method
State may need parameters which can be difficult to handle. As a rule of thumb, if your state generation requires more than 3 parameters then your component should not use the state machine pattern
Some libraries aim to solve this boilerplate issue but the overhead is so small that it does not really deserve a new dependency on your project.

Conclusion
The state machine pattern is a good way to improve your UI components readability and development process from visual design to maintenance.

Careful though! Do not go all in and apply this to all the components you have! Your app needs to remain flexible and handle emergent complexities. The number of states can quickly explode for higher level components and state machines are of no benefit in that case.

Do use the pattern on your library of standard/base components though! This is the part of the application that will live the longest. Eventually, each developer in the team will touch it and benefit from the guidance and robustness provided by the state machine.

Thanks for reading!
Source: Jean-Paul Delimat, https://medium.freecodecamp.org/boost-your-react-with-state-machines-1e9641b0aa43
Thanks, Jean-Paul!
`;
