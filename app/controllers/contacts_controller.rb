class ContactsController < ApplicationController
  def new
    @contact = Contact.new
  end

  def create
    @contact = Contact.new(contact_params)

    respond_to do |format|
      if @contact.save
        flash.notice = 'Message sent successfully';
        format.html { redirect_to new_contact_path }
      else
        flash.alert = 'Unable to send message';
        format.html { redirect_to new_contact_path }
      end
    end
  end

  private
    def contact_params
      params.require(:contact).permit(:name, :email, :comments)
    end
end