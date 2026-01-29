export enum EscrowStatus {
  INIT = 'INIT', // Intent was created
  AWAITING_RELEASE = 'AWAITING_RELEASE', // EscrowCreated event
  RELEASED = 'RELEASED', // EscrowReleased event
  REFUNDED = 'REFUNDED', // EscrowRefunded event
  CANCELLED = 'CANCELLED', // Intent expired
}
