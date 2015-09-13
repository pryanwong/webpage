class DrawingsController < ApplicationController
  before_filter(:only => [:index, :show]) { authorize if can? :read, :drawing }
  # GET /welcome
  def index
    @company = current_user.company
  end

  def show
    @company = current_user.company
  end

end
