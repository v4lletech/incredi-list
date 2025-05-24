const WelcomeStrategy = require('./WelcomeStrategy');

class SMSWelcomeStrategy extends WelcomeStrategy {
    async sendWelcome(user) {
        // In a real application, this would send an actual SMS
        console.log(`[SMS] Sending welcome message to user ${user.name} (${user.id})`);
        console.log(`Message: Welcome ${user.name}! We're excited to have you on board. Your user ID is ${user.id}`);
    }
}

module.exports = SMSWelcomeStrategy; 