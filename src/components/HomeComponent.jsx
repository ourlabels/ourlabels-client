import React, { Component } from 'react';
import { Card, Image, Icon, Modal, Header } from 'semantic-ui-react';
import './HomeComponent.scss';
import mouse from '../assets/mouse.svg';
const cards = [
  {
    key: 'welcome',
    image: mouse,
    content: {
      header: 'Welcome to ourlabels',
      meta: 'Friday, May 18, 2018',
      description:
        'We, at ourlabels are trying to find the most convenient way to help you label sequences of images. Either create new projects or join an open one. If you\'re invited to a private project, you\'ll be able to see those projects to join.'
    }
  }
];
let modalContent = null;

class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      modalContent: null
    };
    this.showModal = this.showModal.bind(this);
    this.maximize = this.maximize.bind(this);
  }
  showModal(evt) {
    this.setState({modalContent: null});
  }
  maximize(content) {
    for (let card of cards) {
      if (card.key === content) {
        this.setState({ modalContent: (
          <Modal size="small" closeIcon defaultOpen={true} onClose={this.showModal} key={card.key}>
            <Modal.Header>
              {card.content.header}
              <div className="header-date">{card.content.meta}</div>
            </Modal.Header>
            <Modal.Content image scrolling>
              <Image src={card.image} size="medium" wrapped />
              <Modal.Description>
                <p>{card.content.description}</p>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        )});
      }
    }  
  }
  render() {
    const { activeIndex } = this.state;
    return (
      <div className="home">
        {this.state.modalContent}
        {cards.map(card => {
          return (
            <Card key={card.key}>
              <Image src={card.image} />
              <Card.Content className="home-content">
                <Card.Header>{card.content.header}</Card.Header>
                <Card.Meta>{card.content.meta}</Card.Meta>
                <Card.Description>
                  {card.content.description.substr(0, 90) + '...'}
                </Card.Description>
              </Card.Content>
              {card.content.description.length > 90 && (
                <Card.Content extra>
                  <a
                    onClick={evt => {
                      this.maximize('welcome');
                    }}
                  >
                    <Icon name="window maximize" size="large" /> more...
                  </a>
                </Card.Content>
              )}
            </Card>
          );
        })}
      </div>
    );
  }
}
export default HomeComponent;
