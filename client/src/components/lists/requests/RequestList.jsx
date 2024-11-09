import styles from './RequestList.module.css';
import useRequests from '../../../hooks/useRequests';
import Request from './Request';

function RequestList() {
  const { requestsResult, requestsLoading, requestsError, setRefresh } =
    useRequests();

  if (requestsLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (requestsError) {
    return <div className={styles.error}>Server Error</div>;
  }

  return (
    <>
      {requestsResult?.requests.length > 0 ? (
        <div className={styles.RequestList}>
          {requestsResult?.requests.map((request) => (
            <Request
              key={request._id}
              request={request}
              setRefresh={setRefresh}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyList}>No new requests</div>
      )}
    </>
  );
}

export default RequestList;
