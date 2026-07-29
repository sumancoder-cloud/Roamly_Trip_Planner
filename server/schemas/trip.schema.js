export function validateGenerateRequest(payload) {
  if (!payload || typeof payload !== 'object') {
    return { success: false, error: { issues: [{ message: 'Request body must be an object.' }] } };
  }

  if (typeof payload.prompt !== 'string' || payload.prompt.trim().length < 10) {
    return { success: false, error: { issues: [{ message: 'Trip description must be at least 10 characters.' }] } };
  }

  return { success: true, data: payload };
}

export function validateRefineRequest(payload) {
  if (!payload || typeof payload !== 'object') {
    return { success: false, error: { issues: [{ message: 'Request body must be an object.' }] } };
  }

  if (!payload.trip || typeof payload.trip !== 'object') {
    return { success: false, error: { issues: [{ message: 'Trip data is required.' }] } };
  }

  if (typeof payload.instruction !== 'string' || payload.instruction.trim().length < 5) {
    return { success: false, error: { issues: [{ message: 'Instruction must be at least 5 characters.' }] } };
  }

  return { success: true, data: payload };
}
