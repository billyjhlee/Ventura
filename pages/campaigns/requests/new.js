import React, { Component } from "react";
import { Button, Input, Form, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import { Router, Link } from "../../../routes";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";

class RequestNew extends Component {
  state = {
    value: "",
    description: "",
    recipient: "",
    loading: false,
    error: ""
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static async getInitialProps(props) {
    return { address: props.query.address };
  }

  onSubmit = async e => {
    e.preventDefault();
    const campaign = Campaign(this.props.address);
    this.setState({ error: "", loading: true });
    const { value, description, recipient } = this.state;
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0]
        });
      if (this._isMounted) {
        Router.pushRoute(`/campaigns/${this.props.address}/requests`);
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
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Create a Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.error}>
          <Form.Field>
            <label>Description</label>
            <Input
              onChange={e => {
                this.setState({ description: e.target.value });
              }}
              value={this.state.description}
            />
          </Form.Field>
          <Form.Field>
            <label>Value (Ether)</label>
            <Input
              onChange={e => {
                this.setState({ value: e.target.value });
              }}
              value={this.state.value}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              onChange={e => {
                this.setState({ recipient: e.target.value });
              }}
              value={this.state.recipient}
            />
          </Form.Field>
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
          <Message
            error
            header="There was an error"
            content={
              <div style={{ overflowWrap: "break-word" }}>
                {this.state.error}
              </div>
            }
          />
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
