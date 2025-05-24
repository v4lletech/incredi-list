const WelcomeStrategy = require('./WelcomeStrategy');

class EmailWelcomeStrategy extends WelcomeStrategy {
    async sendWelcome(user) {
        // In a real application, this would send an actual email
        console.log(`[EMAIL] Sending welcome email to user ${user.name} (${user.id})`);
        console.log(`Subject: Welcome to our platform!`);
        console.log(`Body: Dear ${user.name},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team`);
    }
}

module.exports = EmailWelcomeStrategy; 