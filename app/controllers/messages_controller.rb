class MessagesController < ApplicationController
  layout :pages_layout
  def new
    logger.info "Entering MessagesController#new"
    @message = Message.new
  end

  def create
    logger.info "Entering MessagesController#create"
    @message = Message.new(message_params)

    if @message.valid?
      MessageMailer.new_message(@message).deliver
      logger.info "Leaving MessagesController#create"
      redirect_to contact_path, notice: "Your messages has been sent."
    else
      logger.debug "An error occurred while delivering this message."
      flash[:alert] =  t('flash.messages.email_failed')
      logger.info "Leaving MessagesController#create"
      render :new
    end
  end

private

  def message_params
    params.require(:message).permit(:name, :email, :content, :from)
  end

  private
   def pages_layout
     "singleimageback"
   end
end
