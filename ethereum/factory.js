import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const factory = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xd2fDF4bf511F360021B284FB3EA12c2108271E32"
);

export default factory;
