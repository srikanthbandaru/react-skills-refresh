import React, { Component } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';

class NoteToSelf extends Component {
  render() {
    return(
      <div>
        <h2>Note to Self</h2>
        <Form>
          <FormControl />
          <Button>Submit</Button>
        </Form>
      </div>
    )
  }
}

export default NoteToSelf;
