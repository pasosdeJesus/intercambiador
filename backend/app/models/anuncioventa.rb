class Anuncioventa < ApplicationRecord
  belongs_to :usuario
  belongs_to :ultimopesoporton, class_name: "::Pesoporton",
    foreign_key: "ultimopesoporton_id", validate: true, optional: false
  has_many :anuncioventa_metododepago
  has_many :metododepago,
    through: :anuncioventa_metododepago


  # @return nil si hay error y menserr con el mensaje de error
  def actualiza_ultimopesoporton(menserr)
    ppt = Pesoporton::masreciente(menserr)
    if ppt.nil?
      return nil
    end
    self.ultimopesoporton_id = ppt.id
    return self.save
  end

end
