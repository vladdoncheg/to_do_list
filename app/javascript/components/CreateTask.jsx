import React from 'react';

class CreateTask extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      show: false
    };
  };

  componentDidMount() {
    window.addEventListener('submit', this.validateForm);
  };

  componentWillUnmount () {
    window.removeEventListener('submit', this.validateForm);
  };

  validateForm = (event) => {
    const form = document.getElementById('createForm');

    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();

      this.setState({ show: true });
      setTimeout(() => this.setState({ show: false }), 5000);
    }
  }

  updateValue = (event) => {
    this.setState({
      content: event.target.value,
      show: false
    });
  };

  addTask = (event) => {
    event.preventDefault();

    const url = "/api/v1/tasks/create";
    const { content } = this.state;

    if (content.length === 0) {
      return;
    };

    const token = document.querySelector('meta[name="csrf-token"]').content;
    const body = {
      content
    };

    fetch(url, {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(data => {
        this.props.appendTaskToList(data);
        this.clearInput();
        this.setState({ content: "" });
      })
      .catch(error => console.log(error.message));
  };

  clearInput = () => {
    const input = document.getElementById('taskContent');
    input.value = '';
  };

  render() {
    const inputBorderColor = this.state.show ? 'red' : '#ced4da'

    return (
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-sm-12 offset-md-2 col-md-8 col-lg-6 offset-lg-3">
            <form id="createForm" onSubmit={this.addTask} noValidate>
              <div className="d-flex align-items-center justify-content-center">
                <input
                  type="text"
                  name="content"
                  id="taskContent"
                  className="form-control"
                  required
                  style={{ borderColor: inputBorderColor }}
                  placeholder="Reply to the e-mail"
                  onChange={this.updateValue}
                />
                <button type="submit" className="btn btn-outline-success margin-left-5">
                  Create
                </button>
              </div>
              { this.state.show &&
                <div className="invalid-input">
                  You can't create task with empty name
                </div>
              }
            </form>
          </div>
        </div>
      </div>
    );
  };
};

export default CreateTask;
