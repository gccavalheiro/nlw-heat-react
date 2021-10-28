import styles from "./styles.module.scss";

interface ILoadingProps {
  open: boolean;
  children: JSX.Element;
}

export function Loading(props: ILoadingProps) {
  if (props.open) {
    return (
      <div className={styles.donutContainer}>
        <div className={styles.donut}></div>
      </div>
    );
  }

  return props.children;
}
