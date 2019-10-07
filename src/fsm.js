class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.currentFSMState = config['initial'];
        this.configFSM = config;
        this.historyUndo = [];
        this.historyRedo = [];
        this.historyPointer = -1;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentFSMState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.configFSM['states'][state] !== undefined) {
            this.historyUndo.push(this.currentFSMState);
            this.historyRedo = [];
            this.currentFSMState = state;
        } else {
            throw new Error('State name not found!');
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const currentFSMState = this.currentFSMState;
        const eventState = this.configFSM['states'][currentFSMState].transitions[event];
        if (eventState) {
            this.historyUndo.push(currentFSMState);
            this.historyRedo = [];
            this.currentFSMState = eventState;
        } else {
            throw new Error('State not exist')
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentFSMState = this.configFSM['initial'];
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let states = [];
        if (!event) {
            states = Object.keys(this.configFSM['states']);
        } else {
            states = Object.keys(this.configFSM['states']).filter(state => {
                return this.configFSM['states'][state].transitions[event] !== undefined;
            });
        }

        return states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {

        if (!this.historyUndo.length) {
            return false;
        }

        this.historyRedo.push(this.currentFSMState);
        this.currentFSMState = this.historyUndo.pop();

        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this.historyRedo.length) {
            return false;
        }

        this.historyUndo.push(this.currentFSMState);
        this.currentFSMState = this.historyRedo.pop();

        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.historyUndo = []
        this.historyRedo = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/