export interface IFeedItemProps {
  components: Map<feedTypes, JSX.Element>;
}
export enum feedTypes {
  primary = "primary",
  secondary = "secondary",
  tertiary = "tertiary",
}
