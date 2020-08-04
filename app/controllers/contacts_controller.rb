class ContactsController < ApplicationController
  def new
    @contact = Contact.new
  end

  def create
    @contact = Contact.new(contact_params)

    respond_to do |format|
      if @contact.save
        format.html { redirect_to new_contact_path, notice: 'Message sent successfully' }
      else
        format.html { redirect_to new_contact_path, notice: 'Unable to send message' }
      end
    end
  end

  private
    def contact_params
      params.require(:contact).permit(:name, :email, :comments)
    end
end