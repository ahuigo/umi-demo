import { Link, Outlet } from 'umi';
import styles from './index.less';

const uris = [
  '/x6/node/node-group-markup',
  '/x6/node/node-custom-text',
  '/x6/node/node-custom-dag',
  '/x6/plugin/dnd',
  '/x6/edge/edge-port-connect',
];
export default function Layout() {
  return (
    <div className={styles.navs}>
      <ul>
        {uris.map(uri => {
          return <li key={uri}>
            <Link to={uri}>{uri}</Link>
        </li>
        })}
      </ul>
      <Outlet />
    </div>
  );
}
