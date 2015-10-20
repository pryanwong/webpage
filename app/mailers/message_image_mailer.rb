class MessageImageMailer < ActionMailer::Base

  default from: "SaleSketch <sferenci@fiveforces.ca>"
  default to: "Sean Ferenci <sferenci@fiveforces.ca>"

  def new_message(message)
    @message = message
    #email_list = [message.email1,message.email2,message.email3,message.email4]

    drawing = Drawing.find(@message.drawing_id)
    png = drawing.png
    justpngdata = png.slice(png.index(",")+1..-1)
    decodedImage = Base64.decode64(justpngdata)
    attachments['image.png'] = decodedImage
    emails = [@message.email1, @message.email2, @message.email3, @message.email4]
    mail to: emails
  end

end
