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
});
