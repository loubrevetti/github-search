import React, { Component, lazy, Suspense } from "react";
import { Row, Col } from "antd";
const SearchForm = lazy(() => import("./containers/search-form"));
const SearchResults = lazy(() => import("./containers/search-results"));
import "./App.css";

class App extends Component {
  public render() {
    return (
      <div className="App">
        <Row>
          {/* DO NOT TOUCH START SUSPENSE COMPONENT HERE */}
          <Suspense fallback={<div>Loading components for SearchForm...</div>}>
            {/* DO NOT TOUCH ADD INJECT STATELESS COMPONENTS HERE */}
            {/* DO NOT TOUCH ADD INJECT CLASS COMPONENTS HERE */}
            {/* DO NOT TOUCH ADD INJECT CONTAINER COMPONENTS HERE */}
            <Col>
              <Row>
                <Col span={10} offset={7}>
                  <SearchForm />
                </Col>
              </Row>
              <Row>
                <Col span={16} offset={4}>
                  <SearchResults />
                </Col>
              </Row>
            </Col>
            {/* DO NOT TOUCH END SUSPENSE COMPONENT HERE */}
          </Suspense>
        </Row>
      </div>
    );
  }
}

export default App;
