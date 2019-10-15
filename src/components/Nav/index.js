import React, { Component } from "react";
import { Segment, Image } from "semantic-ui-react";
import { elastic as Menu } from "react-burger-menu";
import logo from "../../assets/logo.png";
import ourlabels from "../../assets/ourlabels.png";
import { Link } from "react-router-dom";
import "./NavComponent.scss";

class NavComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      menuOpen: false
    };
    this.resize = this.resize.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.closeMenuAndReleaseLabels = this.closeMenuAndReleaseLabels.bind(this);
  }
  onMouseOut(evt) {}
  onMouseOver(evt, value) {}
  componentWillMount() {
    this.resize();
  }
  componentDidMount() {
    window.addEventListener("resize", this.resize);
  }
  componentWillReceiveProps(nextProps) {}
  resize() {
    this.setState({ width: window.innerWidth });
  }
  closeMenuAndReleaseLabels() {
    this.props.releaseLabels();
    this.setState({ menuOpen: false });
  }
  render() {
    const { email, username, score, items, location } = this.props;
    let links = Object.keys(items).map(key => {
      return (
        <Link
          key={`${window.location.hash}-${items[key]}`}
          to={`${items[key]}`}
          key={key}
          className={location === items[key] ? "active-link" : "inactive-link"}
        >
          {key}
        </Link>
      );
    });
    if (this.state.width > 700) {
      let new_links = [];
      for (let link of links) {
        new_links.push(link);
        new_links.push(
          <div className="nav-spacer" key={link.props.children + "-div"}>
            {"|"}
          </div>
        );
      }
      new_links.pop();
      return (
        <div className="nav-menu">
          <a href="https://ourlabels.org">
            <div className="nav-logo-holder">
              <Image
                inline
                verticalAlign="bottom"
                src={logo}
                height="50px"
                alt="The ourlabels logo"
                className="nav-logo-image"
              />
              <Image
                inline
                verticalAlign="bottom"
                src={ourlabels}
                height="30px"
                alt="something about ourlabels"
                className="nav-logo-name"
              />
            </div>
          </a>
          {new_links}
        </div>
      );
    } else {
      return (
        <div className="nav-menu-small">
          <a href="https://ourlabels.org" className="a-logo-small">
            <Image
              src={logo}
              className="nav-logo-small"
              id="nav-logo"
              alt="The ourlabels logo"
            />
          </a>
          <Menu right isOpen={this.state.menuOpen}>
            {links}
          </Menu>
        </div>
      );
    }
  }
}
export default NavComponent;
