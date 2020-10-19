class Api::V1::TasksController < ApplicationController
  def index
    tasks = Task.all.order(:completed, created_at: :desc)

    render json: tasks
  end

  def create
    task = Task.create!(task_params)

    if task
      render json: task
    else
      render json: task.errors
    end
  end

  def update
    task.update_attributes(task_params)

    render json: { message: 'Task updated!' }
  end

  def destroy
    task&.destroy

    render json: { message: 'Task deleted!' }
  end

  private

  def task_params
    params.permit(:content, :completed)
  end

  def task
    @task ||= Task.find(params[:id])
  end
end
