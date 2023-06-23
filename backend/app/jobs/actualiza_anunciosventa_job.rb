class ActualizaAnunciosventaJob < ApplicationJob
  queue_as :default

  # Espera varios segundos examinando el listado de anuncios de venta
  # revisando si en base de datos debe agregarse uno para la dirección
  # que recibe
  def perform(horainicial)
    # puts "Esperar varios segundos revisando en blockchain si hay nuevo 
    # anuncio para #{direccion} y en tal caso agregarlo a base de datos"

    res = `(cd ../scripts; npx ts-node get_amount_selling_ads)`
    puts "res=#{res}"
    m = res.match(/{ amount: (.*) }/)
    if !m
      return
    end
    total = $1.to_i
    ids = []
    (1..total).each do |i|
      res = `(cd ../scripts; npx ts-node get_nth_selling_ad #{i-1})`
      puts "res=#{res}"
      m2 = res.match(/^{/)
      if m2
        rm = JSON.parse(res)
        if rm['anuncioventa'] && rm['anuncioventa'].class==Hash 
          direccion = rm['anuncioventa']['direccion']
          cantidad = rm['anuncioventa']['cantidad']
          valido_hasta = rm['anuncioventa']['valido_hasta']
          usuario = Usuario.where(direccion_amigable: direccion).take
          if usuario.nil?
            puts "Hay un anuncio no creado con esta plataforma de la dirección #{direccion}. No se presenta"
          elsif (cantidad && valido_hasta)
            debugger
            # Completar en base de datos
            posan = Anuncioventa.where(usuario_id: usuario.id)
            if posan.count != 1
              puts "Usuario #{usuario.id} tiene #{posan.count} anuncios";
            else 
              a = posan.take
              ids << a.id
              a.ton = cantidad
              if !a.save
                puts "Problema, no pudo guardar anuncio";
                puts a.errors.messages
                return
              end
            end
          end
        end
      end
    end
    # Se elminan los que no estén en el blockchain
    if ids.length > 0
      Anuncioventa.where('id NOT in (?)', ids.join(',')).destroy_all
    end
  end

end
