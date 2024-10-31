import styles from './RequestsPage.module.css';
import RequestList from './RequestList';

function RequestsPage() {
  return (
    <div className={styles.RequestsPage}>
      <h1>Requests</h1>
      <RequestList />
    </div>
  );
}

export default RequestsPage;
