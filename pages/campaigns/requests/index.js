import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const requestsCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestsCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    return {
      address: props.query.address,
      requests,
      requestsCount,
      approversCount
    };
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          request={request}
          id={index}
          key={index}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}`}>
          <a>Back</a>
        </Link>
        <h3>Requests List</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary>Create Request!</Button>
          </a>
        </Link>
        <div style={{ overflowX: "auto", margin: "20px 0" }}>
          <Table unstackable>
            <Header>
              <Row>
                <HeaderCell>ID</HeaderCell>
                <HeaderCell>Description</HeaderCell>
                <HeaderCell>Amount</HeaderCell>
                <HeaderCell>Recipient</HeaderCell>
                <HeaderCell>Approvals Count</HeaderCell>
                <HeaderCell>Approve</HeaderCell>
                <HeaderCell>Finalize</HeaderCell>
              </Row>
            </Header>
            <Body>{this.renderRows()}</Body>
          </Table>
        </div>
        <div>Found {this.props.requestsCount} request</div>
      </Layout>
    );
  }
}

export default RequestIndex;
