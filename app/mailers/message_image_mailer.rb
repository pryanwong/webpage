class MessageImageMailer < ActionMailer::Base

  default from: "Optecture No-Reply <no-reply@optecture.com>"
  default to: "Support <support@optecture.com>"

  def new_message(message)
    @message = message
    #email_list = [message.email1,message.email2,message.email3,message.email4]
    if (Drawing.exists?(@message.drawing_id))
       drawing = Drawing.find(@message.drawing_id);
       if (drawing.png == "" || drawing.drawing == "")
         attachments['image.svg'] = File.read("#{Rails.root}/app/assets/images/none/No_image_available.svg")
       else
         png = drawing.png
         justpngdata = png.slice(png.index(",")+1..-1)
         decodedImage = Base64.decode64(justpngdata)
         attachments['image.png'] = decodedImage
       end
       emails = [@message.email1, @message.email2, @message.email3, @message.email4]
       mail to: emails
    else
       flash[:error] = "Message Not Sent";
    end
  end

end
