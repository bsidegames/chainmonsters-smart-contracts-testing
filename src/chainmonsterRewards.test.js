const path = require("path");
import {
  executeScript,
  getTemplate,
  init,
  deployContractByName,
  getAccountAddress,
} from "./";
import { getScriptCode, getTransactionCode } from "./utils/file";
import * as types from "@onflow/types";
import { getContractAddress } from "./utils/contract";
import { sendTransaction } from "./utils/interaction";

const basePath = path.resolve(__dirname, "./cadence");
console.log(basePath);

init(basePath);

describe("deploy chainmonsters rewards contract", () => {
  console.log(basePath);

  test("deploy NFT base contract", async () => {
    const nftHolder = await getAccountAddress("nft-holder");
    const deployResult = await deployContractByName({
      to: nftHolder,
      name: "NonFungibleToken",
    });

    expect(deployResult.errorMessage).toBe("");
  });
  test("deploy ChainmonstersRewards contract", async () => {
    const admin = await getAccountAddress("admin");
    const NonFungibleToken = await getContractAddress("NonFungibleToken");
    const deployResult = await deployContractByName({
      to: admin,
      name: "ChainmonstersRewards",
      addressMap: { NonFungibleToken },
    });

    expect(deployResult.errorMessage).toBe("");
  });

  test("setup basic reward", async () => {
    const admin = await getAccountAddress("admin");

    const ChainmonstersRewards = await getContractAddress(
      "ChainmonstersRewards"
    );

    const code = await getTransactionCode({
      name: "/admin/create_reward",
      addressMap: { ChainmonstersRewards },
    });

    const args = [
      ["Alpha Access", types.String],
      [100, types.UInt32],
    ];

    const signers = [admin];

    let txResult;
    try {
      txResult = await sendTransaction({
        code,
        args,
        signers,
      });
    } catch (e) {
      console.log(e);
    }

    console.log({ txResult });
    expect(txResult.errorMessage).toBe("");
    expect(txResult.events.length).toBe(1);
  });

  test("setup account for nftReceiver", async () => {
    const nftReceiver = await getAccountAddress("nftReceiver");

    const ChainmonstersRewards = await getContractAddress(
      "ChainmonstersRewards"
    );

    const code = await getTransactionCode({
      name: "/user/setup_account",
      addressMap: { ChainmonstersRewards },
    });

    const signers = [nftReceiver];

    let txResult;
    try {
      txResult = await sendTransaction({
        code,
        signers,
      });
    } catch (e) {
      console.log(e);
    }

    console.log({ txResult });
    expect(txResult.errorMessage).toBe("");
    //expect(txResult.events.length).toBe(1);
  });

  test("mint Alpha Access once", async () => {
    const admin = await getAccountAddress("admin");

    const nftReceiver = await getAccountAddress("nftReceiver");

    const ChainmonstersRewards = await getContractAddress(
      "ChainmonstersRewards"
    );

    const code = await getTransactionCode({
      name: "/admin/mint_nft",
      addressMap: { ChainmonstersRewards },
    });

    //mint 100 NFTs based of Alpha Access (ID 1)
    const args = [
      [1, types.UInt32],
      [nftReceiver, types.Address],
    ];

    const signers = [admin];

    let txResult;
    try {
      txResult = await sendTransaction({
        code,
        args,
        signers,
      });
    } catch (e) {
      console.log(e);
    }

    console.log({ txResult });
    expect(txResult.errorMessage).toBe("");
    //expect(txResult.events.length).toBe(1);
  });
  test("batch mint Alpha Access", async () => {
    const admin = await getAccountAddress("admin");

    const nftReceiver = await getAccountAddress("nftReceiver");

    const ChainmonstersRewards = await getContractAddress(
      "ChainmonstersRewards"
    );

    const code = await getTransactionCode({
      name: "/admin/batch_mint_reward",
      addressMap: { ChainmonstersRewards },
    });

    //mint 100 NFTs based of Alpha Access (ID 1)
    const args = [
      [1, types.UInt32],
      [5, types.UInt64],
      [nftReceiver, types.Address],
    ];

    const signers = [admin];

    let txResult;
    try {
      txResult = await sendTransaction({
        code,
        args,
        signers,
      });
    } catch (e) {
      console.log(e);
    }

    console.log({ txResult });
    expect(txResult.errorMessage).toBe("");
    //expect(txResult.events.length).toBe(1);
  });
});
