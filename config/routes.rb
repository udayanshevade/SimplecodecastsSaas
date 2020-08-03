Rails.application.routes.draw do
  resources :contacts
  get '/about' => 'pages#about'
  root 'pages#home'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
