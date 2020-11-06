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
    const input = document.getElementById('taskContent');

    if (input.value == "") {
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
      <section className="hero border-bottom-1">
        <div className="container">
          <form id="createForm" onSubmit={this.addTask} noValidate>
            <div className="field py-6">
              <div className="is-flex">
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="content"
                    id="taskContent"
                    style={{ borderColor: inputBorderColor }}
                    required
                    placeholder="Reply to the e-mail"
                    onChange={this.updateValue}
                  />
                </div>
                <div className="control pl-1">
                  <button type="submit" className="button is-success">
                    Create
                  </button>
                </div>
              </div>
              { this.state.show &&
                <p className="help is-danger">
                  Task content can't be empty
                </p>}
            </div>
          </form>
        </div>
      </section>
    );
  };
};

export default CreateTask;
