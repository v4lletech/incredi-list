class WelcomeService {
    constructor() {
        this._strategy = null;
    }

    setStrategy(strategy) {
        this._strategy = strategy;
    }

    async sendWelcome(user) {
        if (!this._strategy) {
            throw new Error('No welcome strategy set');
        }
        await this._strategy.sendWelcome(user);
    }
}

module.exports = WelcomeService; 