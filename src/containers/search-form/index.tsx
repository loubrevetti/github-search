import React, { Component } from "react";
import { connect, MapDispatchToPropsParam, MapStateToPropsParam } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { searchStoreFetchAction } from "../../state/search-store/actions";
import { IAppState } from "../../state/types";
import { ISearchFormDispatchProps } from "./ISearchFormDispatch";
import { ISearchFormProps } from "./ISearchFormProps";
import { ISearchFormStateProps } from "./ISearchFormState";
import { Row, Col, Input, Checkbox, Button, Form, Select } from "antd";
import styles from "./SearchForm.module.scss";
import { GetFieldDecoratorOptions } from "antd/lib/form/Form";
import { repoLicensesFetchAction } from "../../state/repo-licenses/actions";
import { ILicense } from "../../state/repo-licenses/types";
import { ISearchStoreFetchParams } from "../../state/search-store/types";
type propsType = ISearchFormStateProps & ISearchFormDispatchProps & ISearchFormProps;

class SearchForm extends Component<propsType, IAppState> {
  public static actions = {
    searchStoreFetchAction,
    repoLicensesFetchAction,
  };

  public static mapStateToProps: MapStateToPropsParam<ISearchFormStateProps, ISearchFormProps, IAppState> = (
    state: IAppState,
  ): ISearchFormStateProps => {
    return { repoLicense: state.repoLicense };
  };

  public static mapDispatchToProps: MapDispatchToPropsParam<ISearchFormDispatchProps, ISearchFormProps> = (
    dispatch: Dispatch,
  ): ISearchFormDispatchProps => bindActionCreators<{}, ISearchFormDispatchProps>(SearchForm.actions, dispatch);

  constructor(props: propsType) {
    super(props);
    props.repoLicensesFetchAction();
  }

  public render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <div className={styles.searchForm}>
          <Row>
            <h1>{process.env.REACT_APP_SEARCH_TITLE}</h1>
          </Row>

          <Row gutter={64}>
            <Col lg={12}>
              <h5>{process.env.REACT_APP_SEARCH_LABEL}</h5>
              <Form.Item hasFeedback>
                {this.validateField("text", <Input />, {
                  rules: [{ required: true, message: process.env.REACT_APP_SEARCH_ERR_LABEL }],
                })}
              </Form.Item>
            </Col>
            <Col lg={12}>
              <h5>{process.env.REACT_APP_SEARCH_STARS_LABEL}</h5>
              <Form.Item hasFeedback>
                {this.validateField("stars", <Input addonBefore={this.starComparison()} />, {
                  getValueFromEvent: (e: React.FormEvent<HTMLInputElement>) => {
                    const val = Number(e.currentTarget.value);
                    return isNaN(val) || e.currentTarget.value === "" ? e.currentTarget.value : val;
                  },
                  rules: [{ type: "number", message: process.env.REACT_APP_SEARCH_STARS_ERR_LABEL }],
                })}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={64}>
            <Col lg={12}>
              <h5>{process.env.REACT_APP_SEARCH_LICENSE_LABEL}</h5>
              <Form.Item hasFeedback>
                {this.validateField(
                  "license",
                  <Select allowClear={true} placeholder="Select a license" showSearch>
                    {this.buildLicenses()}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col lg={12} className={styles.forked}>
              <Form.Item>
                {this.validateField(
                  "forked",
                  <Checkbox>
                    <h5>{process.env.REACT_APP_SEARCH_CHKBOX_LABEL}</h5>
                  </Checkbox>,
                  {
                    initialValue: false,
                  },
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row type="flex" justify="center" align="middle">
            <Col>
              <Button htmlType="submit" type="primary">
                {process.env.REACT_APP_SEARCH_BTN_LABEL}
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    );
  }

  private starComparison = (): React.ReactNode => {
    return this.validateField(
      "stars-prefixed",
      <Select>
        <Select.Option value="">total</Select.Option>
        <Select.Option value="<">less than</Select.Option>
        <Select.Option value=">">more than</Select.Option>
        <Select.Option value=">=">at least</Select.Option>
        <Select.Option value="<=">no more than</Select.Option>
      </Select>,
      {
        initialValue: "",
      },
    );
  };
  private buildLicenses = (): JSX.Element[] | null => {
    return this.props.repoLicense
      ? this.props.repoLicense.licenses.map((license: ILicense) => (
          <Select.Option key={license.key} value={license.key}>
            {license.name}
          </Select.Option>
        ))
      : null;
  };
  private validateField = (id: string, el: JSX.Element, opts?: GetFieldDecoratorOptions): React.ReactNode => {
    const { getFieldDecorator } = this.props.form;
    return getFieldDecorator(id, opts)(el);
  };

  public handleSubmit = (e: any): void => {
    e.preventDefault();
    this.props.emitSearchSubmit(true);
    this.props.form.validateFields((err: any) => {
      if (!err) {
        let searchObject: ISearchStoreFetchParams = {
          text: this.props.form.getFieldValue("text"),
          stars: this.props.form.getFieldValue("stars")
            ? `${this.props.form.getFieldValue("stars-prefixed")}${this.props.form.getFieldValue("stars")}`
            : undefined,
          license: this.props.form.getFieldValue("license"),
          forked: this.props.form.getFieldValue("forked"),
        };
        searchObject = Object.keys(searchObject).reduce<ISearchStoreFetchParams>(
          (obj, item) => {
            let searchItem = {};
            searchItem[item] = `${process.env[`REACT_APP_GIT_API_${item.toUpperCase()}_QUALIFIER`]}${
              searchObject[item]
            }`;
            return !searchObject[item] ? obj : { ...obj, ...searchItem };
          },
          {} as ISearchStoreFetchParams,
        );
        this.props.searchStoreFetchAction(searchObject);
      }
    });
  };
}
const searchForm = Form.create<any>()(SearchForm);
export default connect(
  searchForm.mapStateToProps,
  searchForm.mapDispatchToProps,
)(searchForm);
