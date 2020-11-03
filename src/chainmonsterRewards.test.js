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
    const cmHolder = await getAccountAddress("cm-holder");
    const NonFungibleToken = await getContractAddress("NonFungibleToken");
    const deployResult = await deployContractByName({
      to: cmHolder,
      name: "ChainmonstersRewards",
      addressMap: { NonFungibleToken },
    });

    expect(deployResult.errorMessage).toBe("");
  });
});
