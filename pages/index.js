import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";
import factory from "../ethereum/factory";
import { Link } from "../routes";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
        style: { overflowWrap: "break-word" }
      };
    });
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>
        <div style={{ marginBottom: "20px" }}>
          <Link route="/campaigns/new">
            <a>
              <Button
                // floated="right"
                content="Create Campaign"
                icon="add circle"
                labelPosition="left"
                primary
              />
            </a>
          </Link>
        </div>
        {this.renderCampaigns()}
      </Layout>
    );
  }
}

export default CampaignIndex;
