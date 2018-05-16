export default class Debug {

    constructor() {
        this.timestamp = Date.now();
    }

    get _latency() {
        return +this.latency.match(/[0-9]+/g);
    }

    set _latency(latency) {
        this.latency = `+${latency}ms`;
    }

    addLatency(latency) {
        this._latency += latency;
    }

}
