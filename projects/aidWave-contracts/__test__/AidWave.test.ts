import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import * as algokit from '@algorandfoundation/algokit-utils';
import algosdk from 'algosdk';
import { AidWaveClient } from '../contracts/clients/AidWaveClient';

const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });

let appClient: AidWaveClient;

describe('AidWave', () => {
  beforeEach(fixture.beforeEach);
  const proposal = 'AidWave is a decentralized platform that connects donors with those in need.';
  let algod: algosdk.Algodv2;
  let sender: algosdk.Account;
  let registeredASA: bigint;

  beforeAll(async () => {
    await fixture.beforeEach();
    const { testAccount, kmd } = fixture.context;
    algod = fixture.context.algod;

    sender = await algokit.getOrCreateKmdWalletAccount(
      {
        name: 'daoSender',
        fundWith: algokit.algos(10),
      },
      algod,
      kmd
    );

    appClient = new AidWaveClient(
      {
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algod
    );

    await appClient.create.createApplication({ proposal });
  }, 15_000);

  test('getProposal', async () => {
    const proposalFromMethod = await appClient.getProposal({});
    expect(proposalFromMethod.return?.valueOf()).toBe(proposal);
  });

  test('bootstrap, (Negative)', async () => {
    await appClient.appClient.fundAppAccount(algokit.microAlgos(200_000));
    // default fee per txn is 0.001 Algos or 1_000 uAlgos
    // bootstrap sends 1 txn, so 2 txns total, thus, fee needs to be 2_000 uAlgos
    await expect(
      appClient.bootstrap(
        {},
        {
          sender,
          sendParams: {
            fee: algokit.microAlgos(2_000),
          },
        }
      )
    ).rejects.toThrow();
  });

  test('bootstrap', async () => {
    const bootstrapResult = await appClient.bootstrap(
      {},
      {
        sendParams: {
          fee: algokit.microAlgos(2_000),
        },
      }
    );

    registeredASA = bootstrapResult.return!.valueOf();
  });

  test('vote (Negatve)', async () => {
    await expect(appClient.vote({ inFavor: true, registeredASA })).rejects.toThrow();
  });

  test('getRegisteredASA', async () => {
    const registeredAsaFromMethod = await appClient.getRegiseredAsa({});
    expect(registeredAsaFromMethod.return?.valueOf()).toBe(registeredASA);
  });

  test('register', async () => {
    const registeredAsaOptInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender.addr,
      to: sender.addr,
      amount: 0,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
      assetIndex: Number(registeredASA),
    });

    await algokit.sendTransaction({ from: sender, transaction: registeredAsaOptInTxn }, algod);

    await appClient.register(
      { registeredASA },
      {
        sender,
        sendParams: {
          fee: algokit.microAlgos(3_000),
        },
      }
    );

    const registeredAsaTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender.addr,
      to: sender.addr,
      amount: 1,
      assetIndex: Number(registeredASA),
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
    });

    await expect(
      algokit.sendTransaction({ from: sender, transaction: registeredAsaTransferTxn }, algod)
    ).rejects.toThrow();
  });

  test('vote & getVote', async () => {
    await appClient.vote({ inFavor: true, registeredASA }, { sender });

    const votesAfter = await appClient.getVotes({});
    expect(votesAfter.return?.valueOf()).toEqual([BigInt(1), BigInt(1)]);

    await appClient.vote({ inFavor: false, registeredASA }, { sender });

    const votesAfter2 = await appClient.getVotes({});
    expect(votesAfter2.return?.valueOf()).toEqual([BigInt(1), BigInt(2)]);
  });
});
