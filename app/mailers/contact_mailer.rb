class ContactMailer < ActionMailer::Base

  def contact_email(name, email, comments)
    @name = name
    @email = email
    @comments = comments
    mail(from: email, subject: "Message")
  end
end