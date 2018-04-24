import React, { Component } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class ContributeForm extends Component {
  state = {
    value: "",
    loading: false,
    error: ""
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onSubmit = async e => {
    e.preventDefault();
    const campaign = Campaign(this.props.address);
    this.setState({ error: "", loading: true });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        value: web3.utils.toWei(this.state.value, "ether"),
        from: accounts[0]
      });
      if (window.location.pathname === `/campaigns/${this.props.address}`) {
        Router.replaceRoute(`/campaigns/${this.props.address}`);
      }
    } catch (e) {
      if (this._isMounted) {
        this.setState({ error: e.message });
      }
    }
    if (this._isMounted) {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Form error={!!this.state.error} onSubmit={this.onSubmit}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            onChange={e => {
              this.setState({ value: e.target.value });
            }}
            label="ether"
            labelPosition="right"
            value={this.state.value}
          />
        </Form.Field>
        <Button loading={this.state.loading} primary>
          Contribute!
        </Button>
        <Message
          error
          header="There was an error"
          content={
            <div style={{ overflowWrap: "break-word" }}>{this.state.error}</div>
          }
        />
      </Form>
    );
  }
}

export default ContributeForm;
