const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampagin = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

const web3 = new Web3(ganache.provider());

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampagin.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and campagin", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("caller is the manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows user to contribute and marks the user as approver", async () => {
    await campaign.methods
      .contribute()
      .send({ value: "200", from: accounts[1], gas: "1000000" });

    const isApprover = await campaign.methods.approvers(accounts[1]).call();
    assert.ok(isApprover);
  });

  it("it requires a minimum contribution", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ value: "99", from: accounts[0], gas: "1000000" });
      assert(false);
    } catch (e) {
      assert(e);
    }
  });

  it("allows manager to make request", async () => {
    await campaign.methods
      .createRequest("Sample Request", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000"
      });
    const request = await campaign.methods.requests(0).call();
    assert.ok("Sample Request", request.description);
  });

  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether")
    });

    await campaign.methods
      .createRequest(
        "Sample Request",
        web3.utils.toWei("5", "ether"),
        accounts[1]
      )
      .send({
        from: accounts[0],
        gas: "1000000"
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000"
    });

    const initialBalance = await web3.eth.getBalance(accounts[1]);

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000"
    });

    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const difference = finalBalance - initialBalance;

    assert(web3.utils.toWei("5", "ether"), difference);
  });
});
