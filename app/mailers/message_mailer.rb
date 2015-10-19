class MessageMailer < ActionMailer::Base

  default from: "Your Mailer <sferenci@fiveforces.ca>"
  default to: "Sean Ferenci <sferenci@fiveforces.ca>"

  def new_message(message)
    @message = message

    mail subject: "Message from #{message.name}"
  end

end
