import { Contract } from '@algorandfoundation/tealscript';

// eslint-disable-next-line no-unused-vars
class AidWave extends Contract {
  registeredAsa = GlobalStateKey<AssetID>();

  proposal = GlobalStateKey<string>();

  voteTotal = GlobalStateKey<uint64>();

  votesInFavor = GlobalStateKey<uint64>();

  // define a proposal
  createApplication(proposal: string): void {
    this.proposal.value = proposal;
  }

  // mint DAO tokens
  bootstrap(): AssetID {
    verifyTxn(this.txn, { sender: this.app.creator });
    assert(!this.registeredAsa.exists);
    const registeredAsa = sendAssetCreation({
      configAssetTotal: 1_000,
      configAssetFreeze: this.app.address,
    });

    this.registeredAsa.value = registeredAsa;

    return registeredAsa;
  }

  // change this method to allow users to be in favor of the proposal
  vote(inFavor: boolean): void {
    this.voteTotal.value = this.voteTotal.value + 1;
    if (inFavor) {
      this.votesInFavor.value = this.votesInFavor.value + 1;
    }
  }

  // make it easy for voters to see what the proposal is
  getProposal(): string {
    return this.proposal.value;
  }

  // change this method to allow users to see how many 'in favor of' votes the proposal has
  getVotes(): [uint64, uint64] {
    return [this.votesInFavor.value, this.voteTotal.value];
  }

  getRegiseredAsa(): AssetID {
    return this.registeredAsa.value;
  }
}
