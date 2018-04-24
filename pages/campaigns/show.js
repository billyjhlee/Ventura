import React, { Component } from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import { Link } from "../../routes";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();
    return {
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      address: props.query.address
    };
  }

  renderCards() {
    const {
      minimumContribution,
      balance,
      requestsCount,
      approversCount,
      manager
    } = this.props;
    const items = [
      {
        header: manager,
        description:
          "Originator of this campaign who can create requests to withdraw money",
        meta: "Address of the Campaign Manager",
        style: { overflowWrap: "break-word" },
        fluid: true
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (Wei)",
        description:
          "Minimum amount of wei that must be contributed to be an approver",
        fluid: true
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A Request tries to withdraw money from this campaign for a purpose." +
          " Request must be approved by this campaign's approvers",
        fluid: true
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description:
          "Number of people who have already contributed to this campaign",
        fluid: true
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign's Balance (ether)",
        description: "Total amount of contributions to this campaign",
        fluid: true
      }
    ];
    return <Card.Group items={items} itemsPerRow={2} stackable />;
  }
  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Column mobile={16} tablet={10} computer={10}>
            {this.renderCards()}
            <div style={{ marginTop: "20px" }}>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </div>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={6} computer={6}>
            <ContributeForm address={this.props.address} />
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
