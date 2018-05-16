export default class Role {
    constructor(name, priorityLevel) {
        this.name = name;
        this.level = priorityLevel;
    }

    getLevel() {
        return this.level;
    }

    getName() {
        return this.name;
    }
}
