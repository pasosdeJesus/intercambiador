class Pesoporton < ApplicationRecord
  validates :valor, comparison: { greater_than: 0}
  validates :hasta, comparison: { greater_than: :desde}
  
  validates :desde, presence: true

  has_many :anuncioventa, foreign_key: "ultimopesoporton_id",
    class_name: '::Anuncioventa'

  APIPRECIO = "https://tonapi.io/v2/rates?tokens=ton&currencies=cop"
  INTERVALOAC = 60 # segundos

  # @return nil si hay error y menserr con el mensaje de error
  def self.masreciente(menserr)
    ppt = nil
    hora = Time.now
    if Pesoporton.all.count > 0
      maxhasta = Pesoporton.all.maximum(:hasta)
      ppt = Pesoporton.all.where(hasta: maxhasta).take
      if (ppt.hasta - 5) < hora
        ppt = nil
      end
    end
    if ppt == nil
      conv = Msip::InternetHelper.obtener(
        APIPRECIO, menserr)
      if !conv
        return false
      end
      ppt = ::Pesoporton.create!(
        valor: JSON.parse(conv)["rates"]["TON"]["prices"]["COP"],
        desde: hora,
        hasta: hora + INTERVALOAC
      )
    end
    return ppt
  end


end
