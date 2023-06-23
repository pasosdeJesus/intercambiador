class Anuncioventa < ApplicationRecord
  belongs_to :usuario
  belongs_to :ultimopesoporton, class_name: "::Pesoporton",
    foreign_key: "ultimopesoporton_id", validate: true, optional: false
  validates :nombrecomercial, length: {maximum: 255}
  has_many :anuncioventa_metododepago
  has_many :metododepago,
    through: :anuncioventa_metododepago

  validates :referencia_para_pago, length: {maximum: 64}
  validates :nombre_referencia, length: {maximum: 255}

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
