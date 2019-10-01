import React, { Component, lazy, Suspense } from "react";
import { Row, Col, Layout, Icon } from "antd";
const SearchForm = lazy(() => import("./containers/search-form"));
const SearchResults = lazy(() => import("./containers/search-results"));
import "./App.css";
const { Header, Content, Footer } = Layout;
class App extends Component {
  public state = {
    searchEnabled: false,
  };
  public render() {
    return (
      <Layout>
        <Header>
          <Row type="flex" className="appLogo">
            <Col span={16} offset={4}>
              <img src={`${process.env.PUBLIC_URL}/images/even-logo.png`} />
            </Col>
          </Row>
        </Header>
        <Content>
          <Row>
            {/* DO NOT TOUCH START SUSPENSE COMPONENT HERE */}
            <Suspense fallback={<div>Loading components for SearchForm...</div>}>
              {/* DO NOT TOUCH ADD INJECT STATELESS COMPONENTS HERE */}
              {/* DO NOT TOUCH ADD INJECT CLASS COMPONENTS HERE */}
              {/* DO NOT TOUCH ADD INJECT CONTAINER COMPONENTS HERE */}
              <Col>
                <Row>
                  <Col span={10} offset={7}>
                    <SearchForm emitSearchSubmit={this.handleSearch} />
                  </Col>
                </Row>
                <Row>
                  <Col span={16} offset={4}>
                    <SearchResults searchExecuted={this.state.searchEnabled} />
                  </Col>
                </Row>
              </Col>
              {/* DO NOT TOUCH END SUSPENSE COMPONENT HERE */}
            </Suspense>
          </Row>
        </Content>
        <Footer>
          <Icon type="copyright" /> {process.env.REACT_APP_COMPANY_NAME} - CONFIDENTIAL
        </Footer>
      </Layout>
    );
  }
  private handleSearch = (searchTriggered: boolean) => {
    this.setState({ searchEnabled: searchTriggered });
  };
}

export default App;
