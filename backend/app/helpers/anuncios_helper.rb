# frozen_string_literal: true

module AnunciosHelper

  def agrega_metododepago(
    mp, anun, usuario, referencia_para_pago, nombre_referencia)
    anun.metododepago_ids << mp.id
    anun.save
    mu = MetododepagoUsuario.where(
      usuario_id: usuario.id, 
      metododepago_id: mp.id
    ).take
    if mu.nil?
      mu = MetododepagoUsuario.create!(
        usuario_id: usuario.id,
        metododepago_id: mp.id,
        referencia_para_pago: referencia_para_pago,
        nombre_referencia: nombre_referencia
      )
    else
      mu.referencia_para_pago = referencia_para_pago
      mu.nombre_referencia = nombre_referencia
      mu.save
    end
  end
  module_function :agrega_metododepago

end

