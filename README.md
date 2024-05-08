# capability-assessment-tool

Select, prioritise and develop your organisation's capabilities.

Using the [online editor](https://erikvullings.github.io/capability-assessment-tool), you can create and download your capability model locally.

## Installation instructions,

Assuming you have `node.js` (v14 or later) running, and `pnpm` installed (otherwise, install it using `npm i -g pnpm`), you can go to the `packages/gui` folder and run:

```bash
pnpm i
npm start
```

This will open the browser and display the tool.

## TODO

### Functional enhancements

- When setting a scenario during an active incident, perhaps use the morphological box to quickly set the items that are relevant (quicker).
- Decision support enhancement (multi-party decision making): decision support measures that are selected could be enhanced by the relevant stakeholder setting the required capacity, and constraints. E.g., requires 80% of capacity (so you cannot select decisions that, potentially combined, require more than 100% of s/h capacity of a stakeholder, or at least get a warning so you could ask another party like MoD to help out), can only be done after x hours, is no longer an option after y hours, will take z hours to complete.
- Join multiple scenarios, and add a switch to choose the right element, so you can create a multi-toolbox, combining multiple incident scenario types (prepared in the cold phase). E.g., switch between nuclear and flooding.
- When translating an incident to a scenario description (using the box), suggest predefined and previously analyzed scenarios that are similar (so you can take over or at least be inspired by their decisions)?
- Decision support: For each scenario, we could split the decisions per minority/group/locality, e.g., what decisions do we take for nursing homes, hospitals, agricultural areas, urban areas, city X, etc. And create a multi-view (what is best for group A, B or C, and what measures will we take for each group).
- Add a map to show locations like Borsele on the map.
- In case we use a map, show the effect area (circle with specified radius) on the map.
- Integrate with LLM (ChatGPT, requires authentication token and URL in settings) to translate scenario elements to text.

### Vague

- Can we implement more features for multi-party decision making?
- Causality analysis of incident: Add predictions about what can happen in the (near) feature. Could be cause-and-effect relations like Marvel, but also simple domino effects, potentially based on lessons learnt. E.g., during a flooding, the gas pipes may break, so contact Enexis to be aware.
- Causality analysis of decisions: What is the expected effect, when will it occur, how do we measure its progress?

### GUI functionality

- When cloning a scenario multiple times, auto update the title by incrementing the counter
- When a scenario is saved once, do not require the user the save it manually all the time.
- In the morphological box, allow the user to select a specific scenario, instead of always showing all elements.
