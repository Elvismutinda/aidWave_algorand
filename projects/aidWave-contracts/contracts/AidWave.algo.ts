import { Contract } from '@algorandfoundation/tealscript';

// eslint-disable-next-line no-unused-vars
class AidWave extends Contract {
  registeredAsaId = GlobalStateKey<AssetID>();

  proposal = GlobalStateKey<string>();

  votesTotal = GlobalStateKey<uint64>();

  votesInFavor = GlobalStateKey<uint64>();

  // define a proposal
  createApplication(proposal: string): void {
    this.proposal.value = proposal;
  }

  // mint DAO tokens
  bootstrap(): AssetID {
    verifyTxn(this.txn, { sender: this.app.creator });
    assert(!this.registeredAsaId.exists);
    const registeredAsa = sendAssetCreation({
      configAssetTotal: 1_000,
      configAssetFreeze: this.app.address,
    });

    this.registeredAsaId.value = registeredAsa;
    return registeredAsa;
  }

  // register method that gives the person the ASA and then freezes it
  // eslint-disable-next-line no-unused-vars
  register(registeredASA: AssetID): void {
    assert(this.txn.sender.assetBalance(this.registeredAsaId.value) === 0);
    sendAssetTransfer({
      xferAsset: this.registeredAsaId.value,
      assetReceiver: this.txn.sender,
      assetAmount: 1,
    });
    sendAssetFreeze({
      freezeAsset: this.registeredAsaId.value,
      freezeAssetAccount: this.txn.sender,
      freezeAssetFrozen: true,
    });
  }

  // allow users to be in favor of the proposal
  // eslint-disable-next-line no-unused-vars
  vote(inFavor: boolean, registeredASA: AssetID): void {
    assert(this.txn.sender.assetBalance(this.registeredAsaId.value) === 1);
    this.votesTotal.value = this.votesTotal.value + 1;
    if (inFavor) {
      this.votesInFavor.value = this.votesInFavor.value + 1;
    }
  }

  // make it easy for voters to see what the proposal is
  getProposal(): string {
    return this.proposal.value;
  }

  getRegiseredASA(): AssetID {
    return this.registeredAsaId.value;
  }

  // allow users to see how many 'in favor of' votes the proposal has
  getVotes(): [uint64, uint64] {
    return [this.votesInFavor.value, this.votesTotal.value];
  }
}
