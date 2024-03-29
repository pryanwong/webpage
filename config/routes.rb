Rails.application.routes.draw do
  devise_for :users, :controllers => { omniauth_callbacks: "users/omniauth_callbacks", sessions: 'users/sessions', registrations:  "users/registrations", passwords: "users/passwords", confirmations: "users/confirmations" }
  devise_scope :user do
     delete 'sign_out', :to => 'devise/sessions#destroy', :as => :end_user_session
  end

  resources :widgets
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
    root 'pages#home'
    #index 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'
  #Removed the next two lines because Devise should be handling them
    #get 'auth/:provider/callback', to: 'sessions#create'
    #get 'signout', to: 'sessions#destroy', as: 'signout'

    #resources :sessions, only: [:create, :destroy]
    resource :home, only: [:show]
    resource :pages

    resources :users do
       get 'showall'
       get 'show'
    end
    resources :companies do
      get 'get_json_icon_gallery'
      resources :prices, param: :product_id do
        member do
          get 'productconfig'
        end
      end

      resources :users do
        get 'switchuser'
        get 'switchback'
        get 'usersettings'
        patch 'usersettingssubmit'
        resources :drawings do
          member do
            get 'create'
            get 'editdrawingdetails'
            get 'show_image'
            get 'send_image_form'
            post 'send_image'
            post 'updatedrawingdetails'
            patch  'updateBackground'
            get 'deleteBackground'
            get 'bom'
            get 'changeversion'
          end
        end

        member do
            get 'newdrawing'
            post 'newdrawingproc'
        end
      end
      resources :divisions  do
        member do
          get 'adduser'
          post 'adduserdiv'
        end
        resources :users do
          member do
            get 'removeuserdiv'
          end
        end
      end
    end

    match '/home' => 'pages#home', via: [:get]
    match '/about' => 'pages#about', via: [:get]
    match '/failed' => 'pages#failed', via: [:get]
    match '/recordnotfound' => 'pages#recordnotfound', via: [:get]
    match '/accessdenied' => 'pages#accessdenied', via: [:get]

    #get 'contact', to: 'messages#new', as: 'contact'
    #post 'contact', to: 'messages#create'

    get 'users/auth/failure', to: 'pages#failed'

    %w( 404 422 500 503 ).each do |code|
       get code, :to => "pages#not_found", :code => code
    end
  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
