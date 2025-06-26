import PropTypes from 'prop-types';

function SideBar({ children }) {
  return <div className="sidebar">{children}</div>;
}

SideBar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SideBar;
