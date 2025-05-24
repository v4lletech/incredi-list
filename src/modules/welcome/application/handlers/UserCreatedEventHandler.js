const eventBus = require('@users/domain/events/EventBus');
const UserCreatedEvent = require('@users/domain/events/UserCreatedEvent');
const WelcomeService = require('@welcome/domain/services/WelcomeService');
const ConsoleWelcomeStrategy = require('@welcome/domain/strategies/ConsoleWelcomeStrategy');
const EmailWelcomeStrategy = require('@welcome/domain/strategies/EmailWelcomeStrategy');
const SMSWelcomeStrategy = require('@welcome/domain/strategies/SMSWelcomeStrategy');
const CommunicationType = require('@users/domain/value-objects/CommunicationType');

class UserCreatedEventHandler {
    constructor() {
        this.welcomeService = new WelcomeService();
        this.subscribe();
    }

    subscribe() {
        eventBus.subscribe('UserCreatedEvent', this.handle.bind(this));
    }

    async handle(event) {
        const strategy = this.getStrategyForCommunicationType(event.user.communicationType);
        this.welcomeService.setStrategy(strategy);
        await this.welcomeService.sendWelcome(event.user);
    }

    getStrategyForCommunicationType(communicationType) {
        switch (communicationType) {
            case CommunicationType.EMAIL:
                return new EmailWelcomeStrategy();
            case CommunicationType.SMS:
                return new SMSWelcomeStrategy();
            case CommunicationType.CONSOLE:
            default:
                return new ConsoleWelcomeStrategy();
        }
    }
}

module.exports = UserCreatedEventHandler; 