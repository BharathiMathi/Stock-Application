import style from "./sidebar.module.css";
import { NavLink} from "react-router-dom";
import { MenuItems } from "../../configuration/configuration";
import { TMenuItem } from "../../types/menuItems";
const SideBar: React.FC = () => {
  return (
    <div className={style.sideBar}>
      <div className={style.sidebarWrapper}>
        <ul className={style.sidebarList}>
          {MenuItems.map((menuItem: TMenuItem) => (
            <li className={style.sidebarListItem} key={menuItem.id}>
              <NavLink to={menuItem.path} className={({ isActive }) => (isActive ? style.link_active : style.link)}>
                {menuItem.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
