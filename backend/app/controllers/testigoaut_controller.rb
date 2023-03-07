# frozen_string_literal: true

class TestigoautController < ApplicationController
  def generar()
      render json: {payload: "por generar automaticamente y mantener en base"}, 
        status: :ok
  end

  def cuenta()
    if !request || !request.headers || !request.headers["Authorization"] ||
        request.headers["Authorization"][0..6] != "Bearer "
      render json: '{}', status: :unprocessable_entity
    end
    token = request.headers["Authorization"][7..-1]
    hmac_secret = ENV.fetch('HS256_SECRET')
    # Aquí ruby tiene bien Time.now.to_i igual al tiempo UTC presentado por
    # https://www.epochconverter.com/
    # Pero el intercambiador mantiene en el token que guarda
    # en localStorage la hora a la que fue generado más uno, así que
    # si se dejá abierto por más de una hora no pasa.
    # Tocaría que en cliente se desconecte la billetera y se vuelva
    # a conectar -que es jarto para el usuario sería más simple 
    # recalcular token periódicamente.
    begin
      carga = JWT.decode token, hmac_secret, true, 
        {verify_expiration: false, algorithm: 'HS256' }
    rescue JWT::ExpiredSignature
      render json: ["Firma vencida, cierre la conexión de la billetera y " +
              "vuelvala a establecer"], status: :unprocessable_entity
      return
    end
    puts carga
    if !carga || !carga.count || carga.count < 1 || !carga[0] || 
        !carga[0]['address']
      render json: ["No se encontró dirección en JWT"], 
        status: :unprocessable_entity
      return
    end
    direccion = carga[0]['address']
    red = request.params['network'].to_i
    case red 
    when -3
      red = "https://testnet.tonapi.io"
    when -239
      red = "https://tonapi.io"
    else
      render json: ["Red indefinida"], 
        status: :unprocessable_entity
      return
    end
    prob = ""
    datoscuenta = TonapiHelper.getAccountInfo(direccion, red, prob)
    if prob != ""
      render json: [prob.to_s], status: :unprocessable_entity
      return
    end

    render json: datoscuenta, status: :ok
  end

end
