import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import Layout from "../../components/Layout";
import { Router } from "../../routes";

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    error: "",
    loading: false
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onSubmit = async e => {
    e.preventDefault();
    this.setState({ error: "", loading: true });

    const accounts = await web3.eth.getAccounts();
    try {
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        });
      if (this._isMounted) {
        Router.pushRoute("/");
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
        <h3>Create a Campaign</h3>
        <Form error={!!this.state.error} onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={e => {
                this.setState({ minimumContribution: e.target.value });
              }}
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

export default CampaignNew;
