import React from 'react';

class Task extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  };

  stripHtmlEntities = (str) => {
    return String(str)
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  handleClickOutside = (event) => {
    const node = this.inputRef.current;

    if (!node.contains(event.target)) {
      this.editContent();
    }
  };

  editContent = () => {
    const { task } = this.props;
    const input = document.getElementById(`input-${task.id}`);
    const content = input.value;
    const url = `/api/v1/update/${task.id}`;
    const completed = task.completed;

    const token = document.querySelector('meta[name="csrf-token"]').content;
    const body = {
      content,
      completed
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
      .then(() => {
        this.finishContentEditing(content);
        this.props.updateTask(task.id, content, completed);
      })
      .catch(error => console.log(error.message));
  };

  finishContentEditing = (content) => {
    const contentElement = document.getElementById(`content-${this.props.task.id}`);

    contentElement.innerHTML = this.stripHtmlEntities(content);

    window.removeEventListener('mousedown', this.handleClickOutside);
    window.removeEventListener('keypress', this.handleEnterButtonClick);
  }

  deleteTask = () => {
    const { task } = this.props;
    const url = `/api/v1/destroy/${task.id}`;
    const token = document.querySelector('meta[name="csrf-token"]').content;

    fetch(url, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(() => {
        this.props.deleteTaskFromList(task.id);
      })
      .catch(error => console.log(error.message));
  };

  editCompleted = () => {
    const { task } = this.props;
    const url = `/api/v1/update/${task.id}`;
    const content = task.content;
    const completed = !task.completed;

    const token = document.querySelector('meta[name="csrf-token"]').content;
    const body = {
      content,
      completed
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
      .then(() => {
        this.props.updateTask(task.id, content, completed);
        this.props.resortTaskList();
      })
      .catch(error => console.log(error.message));
  };

  startContentEditing = () => {
    const { task } = this.props;
    const contentElement = document.getElementById(`content-${task.id}`);

    contentElement.innerHTML = `
      <input type="text" class="form-control" value="${task.content}" id="input-${task.id}"/>
    `;

    window.addEventListener('mousedown', this.handleClickOutside);
    window.addEventListener('keypress', this.handleEnterButtonClick);
  }

  handleEnterButtonClick = (event) => {
    if (event.key === 'Enter') {
      this.editContent();
    }
  }

  render() {
    const { task } = this.props;
    const contentId = `content-${task.id}`;

    const date = new Date(task.created_at);
    const dateWithLocale = date.toLocaleString('ru-RU');

    let inputClass = "card mb-4";
    inputClass += task.completed ? " border-width-1px" : " border-width-3px";

    return (
      <div className="row d-flex align-items-center justify-content-center">
        <div className="col-md-10 col-sm-12 col-lg-8">
          <div className={inputClass}>
            <div className="task">
              <div className="task-start">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={this.editCompleted}
                />
                <div id={contentId} className="task-content" ref={this.inputRef}>
                  {task.content}
                </div>
              </div>
              <div className="task-end">
                <div className="task-date">
                  {dateWithLocale}
                </div>
                <div className="btn-group-vertical padding-left-10">
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={this.startContentEditing}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={this.deleteTask}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default Task;
