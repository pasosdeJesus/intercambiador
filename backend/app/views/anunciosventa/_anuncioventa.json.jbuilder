json.extract! anuncioventa, :id, :ton, :margenflotante, :limiteinferior,
:maximotiempo, :usuario_id, :nombrecomercial, :created_at, :updated_at
json.url anuncioventa_url(anuncioventa, format: :json)
json.pesosporton anuncioventa.ultimopesoporton ? anuncioventa.ultimopesoporton.valor * (anuncioventa.margenflotante/100) : 0
json.pesosporton_validez anuncioventa.ultimopesoporton ? Time.now - anuncioventa.ultimopesoporton.hasta : 0
json.metodosdepago anuncioventa.metododepago.map(&:nombre)

