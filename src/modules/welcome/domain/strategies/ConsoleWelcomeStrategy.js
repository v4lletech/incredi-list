const WelcomeStrategy = require('./WelcomeStrategy');

class ConsoleWelcomeStrategy extends WelcomeStrategy {
    async sendWelcome(user) {
        console.log(`Welcome ${user.name}! We're glad to have you on board.`);
        console.log(`Your user ID is: ${user.id}`);
    }
}

module.exports = ConsoleWelcomeStrategy; 