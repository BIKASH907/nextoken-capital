export function enforceSeparation(initiatorId, approverId) {
  if (!initiatorId || !approverId) return { allowed: false, error: 'Both initiator and approver required' };
  if (initiatorId.toString() === approverId.toString()) {
    return { allowed: false, error: 'Same user cannot initiate and approve an action' };
  }
  return { allowed: true };
}
