import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { resetAnnotations } from '../../redux-actions/annotations';
import NavComponent from '../../components/NavComponent.jsx';

class NavContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.releaseLabels = this.releaseLabels.bind(this);
    this.logged_in_items_nolabels = { home: '/', projects: '/projects' };
    this.logged_in_items = { home: '/', annotate: '/annotate', projects: '/projects' };
    this.logged_out_items = {
      home: '/',
      login: '/login',
      signup: '/signup',
      projects: '/projects',
    };
  }
  releaseLabels(evt) {
    this.props.dispatch(resetAnnotations());
  }
  render() {
    const {
      loggedIn, email, score, username, labels, location
    } = this.props;

    return (
      <div className="nav">
        <NavComponent
          key={`navLoggedIn-${loggedIn}`}
          email={email}
          score={score}
          username={username}
          location={location}
          items={
            loggedIn
              ? Object.keys(labels).length > 0
                ? this.logged_in_items
                : this.logged_in_items_nolabels
              : this.logged_out_items
          }
          closeMenu={this.props.closeMenu}
          releaseLabels={this.releaseLabels}
        />
        <br />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { auth, labels } = state;
  return {
    labels: labels.labels,
    loggedIn: auth.loggedIn,
    signed_up: auth.signed_up,
    session: auth.session,
    email: auth.email,
    score: auth.score,
    current_project: auth.current_project,
    owned_projects: auth.owned_projects,
    all_projects: auth.all_projects,
    username: auth.username,
    location: state.router.location.pathname
  };
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
NavContainer = connect(mapStateToProps, mapDispatchToProps)(NavContainer);
export default NavContainer;