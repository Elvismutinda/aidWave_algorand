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
  let sender: algosdk.Account;
  let registeredAsa: bigint;

  beforeAll(async () => {
    await fixture.beforeEach();
    const { algod, testAccount, kmd } = fixture.context;

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
  });

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

    registeredAsa = bootstrapResult.return!.valueOf();
  });

  test('getRegisteredAsa', async () => {
    const proposalFromMethod = await appClient.getRegiseredAsa({});
    expect(proposalFromMethod.return?.valueOf()).toBe(registeredAsa);
  });

  test('vote & getVote', async () => {
    await appClient.vote({ inFavor: true });

    const votesAfter = await appClient.getVotes({});

    expect(votesAfter.return?.valueOf()).toEqual([BigInt(1), BigInt(1)]);

    await appClient.vote({ inFavor: false });

    const votesAfter2 = await appClient.getVotes({});

    expect(votesAfter2.return?.valueOf()).toEqual([BigInt(1), BigInt(2)]);
  });
});
