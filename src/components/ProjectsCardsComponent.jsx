import React from "react";
import ReactTooltip from "react-tooltip";
import {
  Container,
  Segment,
  Card,
  Header,
  Icon,
  Button,
  Image
} from "semantic-ui-react";
import science from "../assets/types/science.svg";
import civic from "../assets/types/civic.svg";
import "./ProjectsCardsComponent.scss";
const projectTypeImages = {
  1: science,
  2: science,
  3: science,
  4: civic,
  5: civic
};
class ProjectsCardsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modal: null };
  }

  showMoreInfo(index) {
    // Create modal and display
    const project = this.props.items[index];
  }

  getActions(type, current, index) {
    const project = this.props.items[index];
    if (!this.props.loggedIn) {
      return <Container />;
    }
    const actions = (
      <Container>
        {type === "owned" &&
          current && (
          <Icon
            fitted
            size="large"
            data-for={"labels"}
            data-tip="labels"
            data-iscapture="true"
            name="tags"
            onClick={this.props.showLabels}
          />
        )}
        {type === "owned" &&
          current && (
          <Icon
            size="large"
            data-for={"settings"}
            data-tip="settings"
            data-iscapture="true"
            name="setting"
            onClick={this.props.getProjectForUpdate}
          />
        )}
        {current &&
          project.joined && (
          <Icon
            name="unlinkify"
            size="large"
            data-for={"leave"}
            data-tip="leave"
            data-iscapture="true"
            fitted
            onClick={() => {
              this.props.leaveProject(project.id);
            }}
          />
        )}
        {!current &&
          !project.joined &&
          (type === "owned" || type === "allowed" || project.publicType) && (
          <Icon
            name="linkify"
            size="large"
            data-for={"join"}
            data-tip="join project"
            data-iscapture="true"
            fitted
            onClick={() => {
              this.props.joinProject(project.id);
            }}
          />
        )}
        {!current &&
          project.joined &&
          (type === "owned" || type === "allowed" || project.publicType) && (
          <Icon
            name="play"
            size="large"
            data-for={"join"}
            data-tip="change to this project"
            data-iscapture="true"
            fitted
            onClick={() => {
              this.props.changeProject(project.id);
            }}
          />
        )}

        {current &&
          (type === "owned" || project.publicType) && (
          <div
            className="icon-div"
            data-for={"json"}
            data-tip="download annotations as JSON"
            data-iscapture="true"
            onClick={() => {
              this.props.getProjectAnnotations(project.id, "json");
            }}
          >
              J
          </div>
        )}
        {current &&
          (type === "owned" || project.publicType) && (
          <div
            className="icon-div"
            data-for={"XML"}
            data-tip="download annotations as XML"
            data-iscapture="true"
            onClick={() => {
              this.props.getProjectAnnotations(project.id, "xml");
            }}
          >
              X
          </div>
        )}
        <ReactTooltip id="labels" place="bottom" type="dark" />
        <ReactTooltip id="settings" place="bottom" type="dark" />
        <ReactTooltip id="join" place="bottom" type="dark" />
        <ReactTooltip id="json" place="bottom" type="dark" />
        <ReactTooltip id="XML" place="bottom" type="dark" />
        <ReactTooltip id="leave" place="bottom" type="dark" />
      </Container>
    );
    return actions;
  }

  render() {
    const { type, items, filter, projectTypes } = this.props;
    const itemsToDisplay = items.filter(item => {
      const _ = item;
      return (
        item.description.includes(filter) ||
        item.full_description.includes(filter) ||
        item.title.includes(filter)
      );
    });
    let header;
    switch (type) {
    case "owned":
      header = "Your owned projects";
      break;
    case "allowed":
      header = "Projects you are allowed to join";
      break;
    case "requested":
      header = "Private projects you have requested to join";
      break;
    case "refused":
      header = "Private projects you are unable to join";
      break;
    default:
      header = "Other public projects";
      break;
    }
    if (itemsToDisplay.length === 0) {
      return <Container />;
    }
    return (
      <Container>
        {this.state.modal}
        <Segment>
          <Header as="h1">{header}</Header>
          <Card.Group>
            {itemsToDisplay.map((item, index) => {
              const {
                title,
                description,
                currentProject,
                projectType,
                publicType,
                featured
              } = item;
              const imageHeader = (
                <Card.Header>
                  <Image src={projectTypeImages[projectType]} size="small" />
                  <Icon.Group vertical="true" size="large">
                    {featured && (
                      <Container>
                        <Icon
                          name="star"
                          data-for={"featured"}
                          data-tip="a featured project"
                          data-iscapture="true"
                        />
                        <ReactTooltip
                          id="featured"
                          place="bottom"
                          type="dark"
                        />
                      </Container>
                    )}
                    {currentProject && (
                      <Container>
                        <Icon
                          name="bookmark"
                          data-for={"current"}
                          data-tip="current project"
                          data-iscapture="true"
                        />
                        <ReactTooltip id="current" place="bottom" type="dark" />
                      </Container>
                    )}
                    {publicType && (
                      <Container>
                        <Icon
                          name="unlock"
                          data-for={"public"}
                          data-tip="public project"
                          data-iscapture="true"
                        />
                        <ReactTooltip id="public" place="bottom" type="dark" />
                      </Container>
                    )}
                    {!publicType && (
                      <Container>
                        <Icon
                          name="lock"
                          data-for={"private"}
                          data-tip="private project"
                          data-iscapture="true"
                        />
                        <ReactTooltip id="private" place="bottom" type="dark" />
                      </Container>
                    )}
                    {projectTypes[projectType].video && (
                      <Container>
                        <Icon
                          name="film"
                          data-for={"video"}
                          data-tip="video project"
                          data-iscapture="true"
                        />
                        <ReactTooltip id="video" place="bottom" type="dark" />
                      </Container>
                    )}
                  </Icon.Group>
                </Card.Header>
              );
              const titleHeader = (
                <Card.Description>
                  <Button onClick={this.showMoreInfo(index)}>
                    <Header as="h3">{title}</Header>
                  </Button>
                  <br />
                  {description}
                </Card.Description>
              );
              const actions = this.getActions(type, currentProject, index);

              // Card arrangement
              return (
                <Card key={title}>
                  <Card.Content>
                    {imageHeader}
                    {titleHeader}
                  </Card.Content>
                  <Card.Content extra>{actions}</Card.Content>
                </Card>
              );
            })}
          </Card.Group>
        </Segment>
      </Container>
    );
  }
}

export default ProjectsCardsComponent;
