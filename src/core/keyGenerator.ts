import crypto from 'crypto';

export class KeyGenerator {
    private static readonly KEY_LENGTH = 32;
    private static readonly VALID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    public static generateKey(): string {
        const buffer = crypto.randomBytes(this.KEY_LENGTH);
        let key = '';
        
        for (let i = 0; i < this.KEY_LENGTH; i++) {
            const randomIndex = buffer[i] % this.VALID_CHARS.length;
            key += this.VALID_CHARS[randomIndex];
        }
        
        return key;
    }

    public static validateKey(key: string): boolean {
        if (key.length !== this.KEY_LENGTH) {
            return false;
        }

        // Check if key contains only valid characters
        const validCharsRegex = new RegExp(`^[${this.VALID_CHARS}]+$`);
        return validCharsRegex.test(key);
    }
}
