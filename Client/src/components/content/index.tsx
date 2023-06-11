export interface ContentProps {
  children: JSX.Element;
}
export const Content = (props: ContentProps) => {
  return (
    <div className="sy-content">
     { props.children }
    </div>
  );
};
export default Content;
