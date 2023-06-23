class AnunciosventaController < ApplicationController
  before_action :set_anuncioventa, only: %i[ show update destroy ]

  def obtener_token_autorizacion
    if !request || !request.headers || !request.headers["Authorization"] ||
        request.headers["Authorization"][0..6] != "Bearer "
      render json: {error: 'Falta encabezado con autorización'},
                    status: :unprocessable_entity
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
        {verify_expiration: true, algorithm: 'HS256' }
    rescue JWT::ExpiredSignature
      render json: {error: "Firma vencida, cierre la conexión de la billetera "\
                    "vuelvala a establecer"}, status: :unprocessable_entity
      return nil
    rescue
      render json: {error: "No pudo descifrarse token"}, 
        status: :unprocessable_entity
      return nil
    end
    puts "carga=",carga
    if !carga || !carga.count || carga.count < 1 || !carga[0] || 
        !carga[0]['address']
      render json: {error: "No se encontró dirección en JWT"}, 
        status: :unprocessable_entity
      return nil
    end
    direccion = carga[0]['address']
    puts "direccion=", direccion
    return direccion
  end



  # GET /anunciosventa
  # GET /anunciosventa.json
  def index
    puts "anunciosventa: index"
    direccion = obtener_token_autorizacion
    if direccion.nil?
      return
    end
    ActualizaAnunciosventaJob.perform_later(Time.now())
    @anunciosventa = Anuncioventa.all
    menserr = "".dup
    @anunciosventa.each do |a|
      if !a.actualiza_ultimopesoporton(menserr)
        render json: {error: menserr}, status: :unprocessable_entity
       return
     end
    end

    puts "*index. @anunciosventa.length=", @anunciosventa.length
  end

  # GET /anunciosventa/1
  # GET /anunciosventa/1.json
  def show
    puts "anunciosventa: show"
    return
  end

  # POST /anunciosventa
  # POST /anunciosventa.json
  def create
    puts "anunciosventa: create"
    return
    @anuncioventa = Anuncioventa.new(anuncioventa_params)

    if @anuncioventa.save
      render :show, status: :created, location: @anuncioventa
    else
      render json: {error: @anuncioventa.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /anunciosventa/1
  # PATCH/PUT /anunciosventa/1.json
  def update
    puts "anunciosventa: update"
    return
    if @anuncioventa.update(anuncioventa_params)
      render :show, status: :ok, location: @anuncioventa
    else
      render json: {error: @anuncioventa.errors}, 
        status: :unprocessable_entity
    end
  end

  # DELETE /anunciosventa/1
  # DELETE /anunciosventa/1.json
  def destroy
    puts "anunciosventa: delete"
    return
    @anuncioventa.destroy
  end

  def preparar
    puts "anunciosventa: preparar"
    direccion = obtener_token_autorizacion
    if direccion.nil?
      return
    end
    if Usuario.where(direccion: direccion).count == 0
      mesnerr = "".dup
      t = Usuario.create(
        nusuario: "u" + direccion[2..5]+'..'+direccion[-8..-1],
        rol: Ability::ROLOPERADOR,
        encrypted_password: direccion[0..10],
        fechacreacion: Date.today,
        email: direccion[0..5] + '..' + direccion[-8..-1] + "@ejemplo.com",
        nombre: direccion[0..5] + '..' + direccion[-8..-1],
        direccion: direccion,
        direccion_amigable: TonwebHelper.direccion_a_amigable(
          direccion, menserr, true, true
        )
      )
      if !t.save
        render json: {
          error: "No pudo crearse usuario"
        }, status: :unprocessable_entity 
        return
      end
    end
    cantidad_ton = request.params["cantidadTon"].to_f
    margen_flotante = request.params["porcentaje"].to_f
    limite_inferior = request.params["minTon"].to_f
    maximo_tiempo = request.params["tiempoMaximo"].to_f
    metodos_pago = ActiveRecord::Base.connection.quote(
      request.params["metodosPago"])
    referencia_para_pago = ActiveRecord::Base.connection.quote(
      request.params["referenciaParaPago"])
    nombre_referencia = ActiveRecord::Base.connection.quote(
      request.params["nombreReferencia"])

    usuario = Usuario.where(direccion: direccion).take
    if Anuncioventa.where(usuario_id: usuario.id).count > 0
      render json: {
        error: "El usuario ya tienen un anuncio"
      }, status: 409 # conflict
      return
    end
    # Estilo interactor de punk-city 
    res = `(cd ../scripts; npx ts-node prepare_selling_ad)`
    if res.match(/bocbase64: (.*)/)
      bocbase64 = res.match(/bocbase64: (.*)/)[1]
      puts "bocbase64=", bocbase64
      render json: "{\"bocbase64\": \"#{bocbase64}\"}", status: :ok
      menserr = "".dup
      ppt = ::Pesoporton::masreciente(menserr)
      if ppt.nil?
        render json: {
          error: "No pudo establecerse tasa de cambio TON a Peso"
        }, status: 409 
        return
      end

      anun = Anuncioventa.create(
        usuario_id: usuario.id,
        ton: cantidad_ton,
        margenflotante: margen_flotante,
        limiteinferior: limite_inferior,
        maximotiempo: maximo_tiempo,
        referencia_para_pago: referencia_para_pago,
        nombre_referencia: nombre_referencia,
        ultimopesoporton_id: ppt.id
      )
      if !anun.valid?
        debugger
      end
      anun.save
      metodos_pago.split(",").each do |nm|
        mp = Metododepago.where('LOWER(nombre)=LOWER(?)', nm).take
        if mp
          anun.metododepago_ids << mp.id
          anun.save
        else
          puts "Método de pago desconocido: #{nm}"
        end
      end
      if anun.metododepago_ids == []
        mp = Metododepago.where(nombre: 'NEQUI').take
        if mp
          anun.metododepago_ids << mp.id
          anun.save
        else 
          puts "No se encontró NEQUI como método de pago"
        end
      end

      ActualizaAnunciosventaJob.perform_later(Time.now())
    else
      render json: {
        error: "No pudo prepararse mensaje para crear anuncio"
      }, status: :unprocessable_entity 
      return

    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_anuncioventa
      @anuncioventa = Anuncioventa.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def anuncioventa_params
      params.require(:anuncioventa).permit(:ton, :margenflotante, :limiteinferior, :maximotiempo, :usuario_id)
    end
end
