import React from 'react';
import CreateTask from '../components/CreateTask';
import Task from '../components/Task';

class Tasks extends React.Component {
  constructor(props) {
    super(props);

    this.state ={
      tasks: []
    };
  };

  componentDidMount() {
    this.setInitialTasks();
  };

  setInitialTasks = () => {
    const url = "/api/v1/tasks/index";

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then(response => this.setState({ tasks: response }));
  }

  updateTask = (id, content, completed) => {
    this.setState(prevState => ({ tasks: prevState.tasks.map(prevTask => {
      if (prevTask.id === id) {
        prevTask.content = content;
        prevTask.completed = completed;
      }
      return prevTask;
    })}));
  };

  appendTaskToList = (task) => {
    this.setState(prevState => ({ tasks: [task, ...prevState.tasks] }));
  };

  deleteTaskFromList = (taskId) => {
    this.setState(prevState => ({ tasks: prevState.tasks.filter(task => task.id !== taskId) }));
  };

  sortTasks = (tasks) => {
    const notCompletedTasks = tasks.filter(task => task.completed === false);
    const completedTasks = tasks.filter(task => task.completed === true);

    return [...this.sortByCreatedAt(notCompletedTasks), ...this.sortByCreatedAt(completedTasks)];
  };

  sortByCreatedAt = (items) => {
    const sortedItems = items.sort(function (a, b) {
      if (a.created_at < b.created_at) {
        return 1;
      }
      if (a.created_at > b.created_at) {
        return -1;
      }
      return 0;
    });

    return sortedItems;
  }

  resortTaskList = () => {
    this.setState(prevState => ({ tasks: this.sortTasks(prevState.tasks) }));
  };

  render() {
    const { tasks } = this.state;

    const allTasks = tasks.map((task) => (
      <Task
        key={task.id}
        task={task}
        deleteTaskFromList={this.deleteTaskFromList}
        updateTask={this.updateTask}
        resortTaskList={this.resortTaskList}
      />
    ));

    const noTasks = (
      <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
        <h4>
          No tasks yet. Why not create one?
        </h4>
      </div>
    );

    return (
      <>
        <section className="jumbotron jumbotron-fluid text-center">
          <div className="container">
            <h1 className="display-4">
              The best task manager ever!
            </h1>
            <p className="lead text-muted">
              Just type a goal and track it
            </p>
          </div>
        </section>
        <CreateTask
          appendTaskToList={this.appendTaskToList}
        />
        <hr></hr>
        <div className="py-5">
          <main className="container">
            {tasks.length > 0 ? allTasks : noTasks}
          </main>
        </div>
      </>
    );
  };
};

export default Tasks;
