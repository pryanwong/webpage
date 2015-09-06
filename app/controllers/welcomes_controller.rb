class WelcomesController < ApplicationController
  load_and_authorize_resource :class =>WelcomesController
  # GET /welcome
  def index
  end

end
