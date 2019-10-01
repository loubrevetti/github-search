import React, { Component } from "react";
import { connect, MapStateToPropsParam } from "react-redux";
import { IAppState } from "../../state/types";
import { ISearchResultsDispatchProps } from "./ISearchResultsDispatch";
import { ISearchResultsProps } from "./ISearchResultsProps";
import { ISearchResultsStateProps } from "./ISearchResultsState";
import { List, Row, Col, Tag } from "antd";
import { IRepo } from "../../state/search-store/types";
import FeedItem from "../../components/functions/feed-item";
import { feedTypes } from "../../components/functions/feed-item/IFeedItemProps";
import styles from "./SearchResults.module.scss";
type propsType = ISearchResultsStateProps & ISearchResultsDispatchProps & ISearchResultsProps;

class SearchResults extends Component<propsType, IAppState> {
  public static mapStateToProps: MapStateToPropsParam<ISearchResultsStateProps, ISearchResultsProps, IAppState> = (
    state: IAppState,
  ): ISearchResultsStateProps => {
    return { searchStore: state.searchStore };
  };

  constructor(props: propsType) {
    super(props);
  }

  public render() {
    if (!this.props.searchStore && !this.props.searchExecuted) return null;
    return (
      <React.Fragment>
        <h3 className={styles.searchResultTitle}>{process.env.REACT_APP_SEARCH_RESULTS_TITLE}</h3>
        <List
          className={styles.searchResults}
          loading={{ tip: "Loading...", spinning: this.props.searchExecuted && !this.props.searchStore }}
          dataSource={this.props.searchStore ? this.props.searchStore.repos : []}
          renderItem={(repo: IRepo) => (
            <List.Item key={repo.id}>
              <FeedItem components={this.createFeedComponents(repo)} />
            </List.Item>
          )}
        />
      </React.Fragment>
    );
  }

  private createFeedComponents = (repo: IRepo): Map<feedTypes, JSX.Element> => {
    const componentMap: Map<feedTypes, JSX.Element> = new Map<feedTypes, JSX.Element>();
    componentMap.set(feedTypes.primary, this.createPrimary(repo));
    componentMap.set(feedTypes.secondary, this.createSecondary(repo));
    componentMap.set(feedTypes.tertiary, this.createTertiary(repo));
    return componentMap;
  };

  private createTertiary = (repo: IRepo): JSX.Element => (
    <div className={styles.repoLicense}>
      <span>{process.env.REACT_APP_GIT_API_LICENSE_QUALIFIER}</span>
      {this.getLicense(repo)}
    </div>
  );
  private createSecondary = (repo: IRepo): JSX.Element => (
    <div className={styles.repoStars}>
      <span>{process.env.REACT_APP_GIT_API_STARS_QUALIFIER}</span>
      <span>{repo.stargazers_count}</span>
    </div>
  );
  private createPrimary = (repo: IRepo): JSX.Element => (
    <div className={styles.repoMain}>
      <Row type="flex" justify="space-between" align="middle" gutter={64}>
        <Col>
          <a className={styles.repoUrl} href={repo.clone_url} target="_blank">
            {repo.full_name}
          </a>
        </Col>
        {this.renderForkedBadge(repo)}
      </Row>
      <Row type="flex" justify="space-between" align="middle" gutter={64}>
        <Col>
          <span className={styles.repoDesc}>{repo.description}</span>
        </Col>
      </Row>
    </div>
  );
  private renderForkedBadge = (repo: IRepo): JSX.Element | null =>
    repo.fork ? (
      <Col>
        <Tag color="#108ee9">FORKED</Tag>
      </Col>
    ) : null;
  private getLicense = (repo: IRepo): JSX.Element =>
    !repo.license ? <span>{process.env.REACT_APP_NO_FEED_DATA}</span> : <span>{repo.license.name}</span>;
}
export default connect(SearchResults.mapStateToProps)(SearchResults);
