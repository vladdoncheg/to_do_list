Rails.application.routes.draw do
  root 'default#index'

  namespace :api do
    namespace :v1 do
      get 'tasks/index'
      post 'tasks/create'
      post 'update/:id', to: 'tasks#update'
      delete '/destroy/:id', to: 'tasks#destroy'
    end
  end

  get '/*path' => 'default#index'
end
