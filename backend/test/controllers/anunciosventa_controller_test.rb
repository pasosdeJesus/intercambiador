require "test_helper"

class AnunciosventaControllerTest < ActionDispatch::IntegrationTest
  def crear_token_autorizacion_prueba
    secreto = ENV.fetch('HS256_SECRET')
    carga = { address: 'test' }
    token = JWT.encode carga, secreto, 'HS256'
    return token
  end

  setup do
    #debugger
    #@anuncioventa = anuncioventa()
  end

  test "deberia obtener listado" do
    token = crear_token_autorizacion_prueba
    get anunciosventa_url, as: :json,
      headers: { 
        HTTP_AUTHORIZATION: "Bearer #{token}",
        "Content-Type": "application/json"
      }
    # No está haciendolo
    assert_response :success
  end

  test "debería obtener mensaje por enviar" do
    token = crear_token_autorizacion_prueba
    get anuncioventa_preparar_url, as: :json,
      headers: { 
        HTTP_AUTHORIZATION: "Bearer #{token}",
        "Content-Type": "application/json"
      }
    # No está haciendolo
    assert_response :success
  end

  test "should create anuncioventa" do
    skip
    debugger
    assert_difference("Anuncioventa.count") do
      post anunciosventa_url, params: { 
        anuncioventa: { 
          limiteinferior: @anuncioventa.limiteinferior, 
          margenflotante: @anuncioventa.margenflotante, 
          maximotiempo: @anuncioventa.maximotiempo, 
          ton: @anuncioventa.ton, 
          usuario_id: @anuncioventa.usuario_id 
        } 
      }, format: :json
    end

    assert_response :created
  end

  test "should show anuncioventa" do
    skip
    debugger
    get anuncioventa_url(@anuncioventa), format: :json
    assert_response :success
  end

  test "should update anuncioventa" do
    skip
    debugger
    patch anuncioventa_url(@anuncioventa), params: { 
      anuncioventa: { 
        limiteinferior: @anuncioventa.limiteinferior, 
        margenflotante: @anuncioventa.margenflotante, 
        maximotiempo: @anuncioventa.maximotiempo, 
        ton: @anuncioventa.ton, 
        usuario_id: @anuncioventa.usuario_id 
      } 
    }, format: :json
    assert_response :success
  end

  test "should destroy anuncioventa" do
    skip
    debugger
    assert_difference("Anuncioventa.count", -1) do
      delete anuncioventa_url(@anuncioventa), format: :json
    end

    assert_response :no_content
  end
end
