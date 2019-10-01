import React, { FunctionComponent } from "react";
import { IFeedItemProps, feedTypes } from "./IFeedItemProps";
import styles from "./FeedItem.module.scss";
import { Row, Col } from "antd";

const FeedItem: FunctionComponent<IFeedItemProps> = props => {
  const renderFeedItems = (): JSX.Element[] => {
    return Array.from(props.components.keys())
      .filter(feedItem => props.components.get(feedItem as feedTypes))
      .map(feedType => {
        const item = props.components.get(feedType as feedTypes);
        const size: number = feedType === feedTypes.primary ? 16 : 4;
        return (
          <Col key={feedType} className={styles[feedType]} lg={size}>
            {item}
          </Col>
        );
      });
  };
  return <Row className={styles.feedItem}>{renderFeedItems()}</Row>;
};

export default FeedItem;
