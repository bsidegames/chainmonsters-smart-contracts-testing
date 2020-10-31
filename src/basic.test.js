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

describe("basic contract", () => {
  console.log(basePath);

  test("add 4 + 38", async () => {
    const code = await getScriptCode({
      name: "addition",
    });

    const args = [[4, 38, types.Int]];

    let scriptResult;

    try {
      scriptResult = await executeScript({
        code,
        args,
      });
    } catch (e) {
      console.log(e);
    }

    expect(scriptResult).toBe(42);
    // expect(scriptResult.errorMessage).toBe("");

    // console.log({scriptResult})
  });
  test("deploy contract", async () => {
    const basicHolder = await getAccountAddress("basic-holder");
    const deployResult = await deployContractByName({
      to: basicHolder,
      name: "Basic",
    });

    expect(deployResult.errorMessage).toBe("");
  });
  test("read contract", async () => {
    const Basic = await getContractAddress("Basic");
    const addressMap = { Basic };
    const code = await getScriptCode({
      name: "read-message",
      addressMap,
    });

    let result;
    try {
      result = await executeScript({ code });
    } catch (e) {
      console.log("e");
    }

    expect(result).toBe("Hello, Cadence");
  });
  test("create Alice and Bob", async () => {
    const alice = await getAccountAddress("alice");
    const bob = await getAccountAddress("bob");

    const Basic = await getContractAddress("Basic");

    const code = await getTransactionCode({
      name: "check-signers",
      addressMap: { Basic },
    });

    const args = [["Sup!", types.String]];

    const signers = [alice, bob];

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
    expect(txResult.events.length).toBe(0);
  });

  test("ensure Alice address", async () => {
    const alice = await getAccountAddress("alice");
    const code = await getTransactionCode({
      name: "getAddress",
    });

    const signers = [alice];

    const txResult = await sendTransaction({
      code,
      signers,
    });

    expect(txResult.errorMessage).toBe("");
  });
});
