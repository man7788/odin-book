import styles from './RequestsPage.module.css';
import RequestList from './RequestList';

function RequestsPage() {
  return (
    <div className={styles.RequestsPage}>
      <RequestList />
    </div>
  );
}

export default RequestsPage;
