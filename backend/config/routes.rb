Rails.application.routes.draw do
  devise_scope :usuario do
    get 'sign_out' => 'devise/sessions#destroy'
    get 'salir' => 'devise/sessions#destroy',
      as: :terminar_sesion
    post 'usuarios/iniciar_sesion', to: 'devise/sessions#create'
    get 'usuarios/iniciar_sesion', to: 'devise/sessions#new',
      as: :iniciar_sesion

    # El siguiente para superar mala generación del action en el formulario
    # cuando se autentica mal y esta montado no en / (genera 
    # /puntomontaje/puntomontaje/usuarios/sign_in )
    if (Rails.configuration.relative_url_root != '/') 
      ruta = File.join(Rails.configuration.relative_url_root, 
                       'usuarios/iniciar_sesion')
      post ruta, to: 'devise/sessions#create'
      get  ruta, to: 'devise/sessions#new'
    end
  end
  devise_for :usuarios, :skip => [:registrations], module: :devise

  resources :anunciosventa

  get 'anuncioventa_preparar', to: 'anunciosventa#preparar', 
    as: :anuncioventa_preparar

  get "dapp/getAccountInfo", to: "testigoaut#cuenta",
    as: :testigoaut_cuenta

  #get "v1/testigoaut_generar", to: 'testigoaut#generar', 
  #  as: :testigoaut_generar

  root 'msip/hogar#index'
  mount Msip::Engine, at: "/", as: 'msip'
end
