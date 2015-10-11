class MessageMailer < ActionMailer::Base

  default from: "Your Mailer <adapetersean@gmail.com>"
  default to: "Sean Ferenci <adapetersean@gmail.com>"

  def new_message(message)
    @message = message

    mail subject: "Message from #{message.name}"
  end

end
