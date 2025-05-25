export enum CommunicationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  CONSOLE = 'CONSOLE'
}

export class InvalidCommunicationTypeError extends Error {
  constructor(type: string) {
    super(`Invalid communication type: ${type}`);
    this.name = 'InvalidCommunicationTypeError';
  }
}

export function validateCommunicationType(type: string): CommunicationType {
  if (!Object.values(CommunicationType).includes(type as CommunicationType)) {
    throw new InvalidCommunicationTypeError(type);
  }
  return type as CommunicationType;
} 