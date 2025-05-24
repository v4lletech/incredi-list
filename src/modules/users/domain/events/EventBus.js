class EventBus {
    constructor() {
        this._handlers = new Map();
    }

    subscribe(eventName, handler) {
        if (!this._handlers.has(eventName)) {
            this._handlers.set(eventName, []);
        }
        this._handlers.get(eventName).push(handler);
    }

    async publish(event) {
        const eventName = event.constructor.name;
        const handlers = this._handlers.get(eventName) || [];
        
        const promises = handlers.map(handler => handler(event));
        await Promise.all(promises);
    }
}

// Singleton instance
const eventBus = new EventBus();
module.exports = eventBus; 