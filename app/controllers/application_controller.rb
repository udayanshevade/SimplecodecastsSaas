class ApplicationController < ActionController::Base
  # Prevent CSRF attacks
  protect_from_forgery with: :exception

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected
    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :stripe_card_token, :email, :password, :password_confirmation])
    end
end
