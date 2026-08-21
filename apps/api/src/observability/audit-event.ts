export type AuditEvent = {
  readonly type: string;
  readonly requestId: string;
  readonly actorId?: string;
  readonly operation: string;
  readonly outcome: 'success' | 'failure';
  readonly occurredAt: string;
};
