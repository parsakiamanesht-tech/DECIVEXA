// Test support only — NOT a production implementation. See
// workload-authentication.ts's header for why real OIDC verification is
// out of scope for this phase.
import { WorkloadAuthenticationFailedError, type AuthenticatedWorkload, type WorkloadAuthenticator } from "./workload-authentication";

// Succeeds for any credential in a configured accept-set, mapping it
// directly to a workloadId; rejects everything else. No real
// cryptographic verification occurs — this exists solely to exercise
// the authentication STAGE of the request pipeline in tests.
export class FakeWorkloadAuthenticator implements WorkloadAuthenticator {
  constructor(private readonly acceptedCredentials: ReadonlyMap<string, string>) {}

  async authenticate(credential: unknown): Promise<AuthenticatedWorkload> {
    if (typeof credential !== "string") {
      throw new WorkloadAuthenticationFailedError("Fake workload credential must be a string in tests");
    }
    const workloadId = this.acceptedCredentials.get(credential);
    if (!workloadId) {
      throw new WorkloadAuthenticationFailedError("Fake workload authentication rejected an unrecognized credential");
    }
    return { workloadId };
  }
}
