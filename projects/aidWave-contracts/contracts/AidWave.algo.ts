import { Contract } from '@algorandfoundation/tealscript';

// eslint-disable-next-line no-unused-vars
class AidWave extends Contract {
  proposal = GlobalStateKey<string>();

  voteTotal = GlobalStateKey<uint64>();

  // define a proposal
  createApplication(proposal: string): void {
    this.proposal.value = proposal;
  }

  vote(): void {
    this.voteTotal.value = this.voteTotal.value + 1;
  }

  // make it easy for voters to see what the proposal is
  getProposal(): string {
    return this.proposal.value;
  }

  getVotes(): uint64 {
    return this.voteTotal.value;
  }
}
