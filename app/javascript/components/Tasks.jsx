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

    const allTasks = (
      <div className='list'>
        <ul>
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              deleteTaskFromList={this.deleteTaskFromList}
              updateTask={this.updateTask}
              resortTaskList={this.resortTaskList}
            />
          ))}
        </ul>
      </div>
    );

    const noTasks = (
      <div className="container has-text-centered">
        <h2 className="subtitle">
          No tasks yet. Why not create one?
        </h2>
      </div>
    );

    return (
      <>
        <section className="hero is-light">
          <div className="hero-body">
            <div className="container has-text-centered">
              <h1 className="title">
                The best task manager ever!
              </h1>
              <h2 className="subtitle">
                Just type a goal and track it
              </h2>
            </div>
          </div>
        </section>
        <CreateTask appendTaskToList={this.appendTaskToList} />
        <section>
          <div className="hero-body">
            <div className="container">
              <div className="columns is-centered">
                <div className='column is-two-thirds'>
                  {tasks.length > 0 ? allTasks : noTasks}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };
};

export default Tasks;
