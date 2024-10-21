import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar() {
  return (
    <div className={styles.Sidebar}>
      <Link to="/">Home</Link>
      <Link to="users">Users</Link>
    </div>
  );
}

export default Sidebar;
