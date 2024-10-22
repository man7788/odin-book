import styles from './RequestList.module.css';
import useRequests from '../../../hooks/useRequests';
import Request from './Request';

function RequestList() {
  const { requestsResult, requestsLoading, requestsError } = useRequests();

  if (requestsLoading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (requestsError) {
    return <div className={styles.App}>Server Error</div>;
  }

  return (
    <div className={styles.RequestList}>
      {requestsResult?.requests.length > 0
        ? requestsResult?.requests.map((request) => (
            <Request key={request._id} {...request} />
          ))
        : 'No new requests'}
    </div>
  );
}

export default RequestList;
