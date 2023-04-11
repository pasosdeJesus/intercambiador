class AnunciosController < ApplicationController
  before_action :set_anuncio, only: %i[ show update destroy ]

  # GET /anuncios
  # GET /anuncios.json
  def index
    if !request || !request.headers || !request.headers["Authorization"] ||
        request.headers["Authorization"][0..6] != "Bearer "
      render json: '{}', status: :unprocessable_entity
      return
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
    puts "carga=",carga
    if !carga || !carga.count || carga.count < 1 || !carga[0] || 
        !carga[0]['address']
      render json: ["No se encontró dirección en JWT"], 
        status: :unprocessable_entity
      return
    end
    direccion = carga[0]['address']
    puts "direccion=", direccion
    @anuncios = Anuncio.all
    puts "@anuncios.length=", @anuncios.length
  end

  # GET /anuncios/1
  # GET /anuncios/1.json
  def show
    return
  end

  # POST /anuncios
  # POST /anuncios.json
  def create
    return
    @anuncio = Anuncio.new(anuncio_params)

    if @anuncio.save
      render :show, status: :created, location: @anuncio
    else
      render json: @anuncio.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /anuncios/1
  # PATCH/PUT /anuncios/1.json
  def update
    return
    if @anuncio.update(anuncio_params)
      render :show, status: :ok, location: @anuncio
    else
      render json: @anuncio.errors, status: :unprocessable_entity
    end
  end

  # DELETE /anuncios/1
  # DELETE /anuncios/1.json
  def destroy
    return
    @anuncio.destroy
  end

  def obtener_token_autorizacion
    if !request || !request.headers || !request.headers["Authorization"] ||
        request.headers["Authorization"][0..6] != "Bearer "
      render json: '{}', status: :unprocessable_entity
      return nil
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
      return nil
    end
    puts "carga=",carga
    if !carga || !carga.count || carga.count < 1 || !carga[0] || 
        !carga[0]['address']
      render json: ["No se encontró dirección en JWT"], 
        status: :unprocessable_entity
      return nil
    end
    direccion = carga[0]['address']
    puts "direccion=", direccion
    return direccion
  end

  def preparar
    direccion = obtener_token_autorizacion
    if direccion.nil?
      return
    end
    # Estilo interactor de punk-city 
    res = `(cd ../scripts; npx ts-node prepare_selling_ad)`
    bocbase64 = res.match(/bocbase64: (.*)/)[1]
    puts "bocbase64=", bocbase64
    render json: "{\"bocbase64\": \"#{bocbase64}\"}", status: :ok
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_anuncio
      @anuncio = Anuncio.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def anuncio_params
      params.require(:anuncio).permit(:ton, :margenflotante, :limiteinferior, :maximotiempo, :usuario_id)
    end
end
