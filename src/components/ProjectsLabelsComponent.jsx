import React from 'react';
import { Modal, Header, Card, Form, Button, Icon, Container } from 'semantic-ui-react';
import { SketchPicker } from 'react-color';
const labelArrayFromObject = (labelObj) => {
  const keys = Object.keys(labelObj);
  const newLabels = keys.map((key, index) => {
    const label = labelObj[key];
    return {
      key: index,
      type: label.type,
      description: label.description,
      r: label.r,
      g: label.g,
      b: label.b,
      a: label.a,
      new: false,
      modified: false
    };
  });
  return newLabels;
};
const inverseColor = (color) => {
  const r = 255 - color.r;
  const g = 255 - color.g;
  const b = 255 - color.b;
  return `rgba(${r},${g},${b},1.0)`;
};
class ProjectsLabelsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { labels: labelArrayFromObject(this.props.labels), pickerForIndex: null };
    this.showPickerFor = this.showPickerFor.bind(this);
    this.hidePicker = this.hidePicker.bind(this);
    this.change = this.change.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.deleteLabel = this.deleteLabel.bind(this);
    this.addLabel = this.addLabel.bind(this);
    this.submit = this.submit.bind(this);
  }
  addLabel(evt) {
    evt.preventDefault();
    const { labels } = this.state;
    const sortedLabels = labels.sort((a, b) => {
      if (a.key < b.key) {
        return -1;
      } else if (a.key > b.key) {
        return 1;
      }
      return 0;
    });
    const length = sortedLabels.length;
    sortedLabels.push({
      key: length > 0 ? sortedLabels[length - 1].key + 1 : 0,
      type: 'new_label',
      description: '',
      r: 0, g: 0, b: 0, a: 1.0,
      new: true, modified: true
    });
    this.setState({ labels: sortedLabels });
  }
  showPickerFor(evt, index) {
    evt.preventDefault();
    this.setState({ pickerForIndex: index });
  }
  hidePicker() {
    this.setState({ pickerForIndex: null });
  }

  submit(evt) {
    console.log(this.state);
    this.props.addLabels(this.state.labels);
  }
  change(index, type, value) {
    const { labels } = this.state;
    labels[index][type] = value;
    this.setState({ labels });
  }
  deleteLabel(evt, index) {
    evt.preventDefault();
    const { labels } = this.state;
    console.log('index:', index);
    labels.splice(index, 1);
    this.setState({ labels });
  }
  changeColor(color) {
    const { r, g, b, a } = color.rgb;
    let { labels, pickerForIndex } = this.state;
    labels[pickerForIndex]['r'] = r;
    labels[pickerForIndex]['g'] = g;
    labels[pickerForIndex]['b'] = b;
    labels[pickerForIndex]['a'] = a;
    labels[pickerForIndex]['modified'] = true;
    this.setState({ labels });
  }
  render() {
    const { labels, pickerForIndex } = this.state;
    let color = { r: 0, g: 0, b: 0, a: 1.0 };
    if (pickerForIndex != null) {
      color.r = labels[pickerForIndex].r;
      color.g = labels[pickerForIndex].g;
      color.b = labels[pickerForIndex].b;
      color.a = labels[pickerForIndex].a;
    }
    return (
      <Form onSubmit={this.submit}>
        <Modal open={pickerForIndex != null} closeIcon onClose={this.hidePicker} size="tiny">
          <Modal.Header>Color Picker for {labels[pickerForIndex] != null ? labels[pickerForIndex].type : ''}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <SketchPicker onChangeComplete={this.changeColor} color={color} />
            </Modal.Description>
          </Modal.Content>
        </Modal>
        <Header as="h2">Labels</Header>
        <Button color="green" onClick={this.addLabel} icon="plus" content="add label" />
        <Form.Button content="submit" />
        <br />
        <Card.Group>
          {labels.map((label, index) => {
            return (
              <Card key={`${label.key}`}>
                <Card.Content>
                  <Form.Input label="type" placeholder="type" defaultValue={label.type} onChange={(e, v) => {
                    this.change(index, 'type', v.value);
                  }}
                  />
                  <Form.Input label="description" placeholder="description" defaultValue={label.description} onChange={(e, v) => {
                    this.change(index, 'description', v.value);
                  }}
                  />
                  <Button onClick={(evt) => { this.showPickerFor(evt, index); }} style={{ backgroundColor: `rgba(${label.r},${label.g},${label.b},${label.a})` }}><Icon name="crosshairs" color={inverseColor({ r: label.r, g: label.g, b: label.b, a: label.a })} /><span style={{ color: inverseColor({ r: label.r, g: label.g, b: label.b, a: label.a }) }}>{'Color'}</span></Button>
                  <Button icon="remove circle" onClick={(evt) => { this.deleteLabel(evt, index); }} />
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group><br />
        <Form.Button content="submit" />
      </Form>
    );
  }
}
export default ProjectsLabelsComponent;

