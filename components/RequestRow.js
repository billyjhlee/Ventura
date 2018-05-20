import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import { Router } from "../routes";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

class RequestRow extends Component {
  state = {
    approveLoading: false,
    finalizeLoading: false
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onApprove = async () => {
    const campaign = Campaign(this.props.address);
    this.setState({ approveLoading: true });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .approveRequest(this.props.id)
        .send({ from: accounts[0] });
    } catch (e) {}
    if (this._isMounted) {
      this.setState({ approveLoading: false });
    }
    if (
      window.location.pathname === `/campaigns/${this.props.address}/requests`
    ) {
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    }
  };

  onFinalize = async () => {
    const campaign = Campaign(this.props.address);
    this.setState({ finalizeLoading: true });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .finalizeRequest(this.props.id)
        .send({ from: accounts[0] });
    } catch (e) {}

    if (this._isMounted) {
      this.setState({ finalizeLoading: false });
    }
    if (
      window.location.pathname === `/campaigns/${this.props.address}/requests`
    ) {
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    }
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;
    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.complete
            ? null
            : `${request.approvalCount} / ${approversCount}`}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              loading={this.state.approveLoading}
              color="green"
              basic
              onClick={this.onApprove}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              loading={this.state.finalizeLoading}
              color="red"
              basic
              onClick={this.onFinalize}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
